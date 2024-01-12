const { PDFDocument, degrees } = PDFLib;

async function embedPdfPages() {
  // Fetch American flag PDF
  const flagUrl = "https://pdf-lib.js.org/assets/american_flag.pdf";

  const tempPDF = await PDFDocument.create();
  //create temp pdf that rotate the flag PDF
  let flagPdfBytes = await fetch(flagUrl).then((res) => res.arrayBuffer());
  const pdf = await PDFDocument.load(flagPdfBytes);
  const copiedPages = await tempPDF.copyPages(pdf, pdf.getPageIndices());
  copiedPages[0].setRotation(degrees(90));
  tempPDF.addPage(copiedPages[0]);

  const rotatedFlagPdf = await tempPDF.save();

  const blob = new Blob([rotatedFlagPdf], { type: "application/pdf" });
  download(blob, "pdf-lib_pdf_page_embedding_example.pdf", "application/pdf");

  // // Create a data URL from the Blob
  const dataUrl = URL.createObjectURL(blob);

  // // Now, `dataUrl` contains the data URL for the rotated PDF
  // console.log(dataUrl);

  // rotatedFlagPdf = await fetch(dataUrl).then((res) => res.arrayBuffer());
  // console.log(rotatedFlagPdf);

  // Fetch U.S. constitution PDF
  const constitutionUrl = "https://pdf-lib.js.org/assets/us_constitution.pdf";
  const constitutionPdfBytes = await fetch(constitutionUrl).then((res) =>
    res.arrayBuffer()
  );

  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();

  // Load the rotated Flag PDF into a PDFDocument
  const rotatedFlagPdfData = await PDFDocument.load(rotatedFlagPdf);

  // Embed the second page of the constitution and clip the preamble
  copiedPages[0].setRotation(degrees(270));
  const americanFlag = await pdfDoc.embedPage(copiedPages[0]);

  // Load the constitution PDF into a PDFDocument
  const usConstitutionPdf = await PDFDocument.load(constitutionPdfBytes);

  // Embed the second page of the constitution and clip the preamble
  const preamble = await pdfDoc.embedPage(usConstitutionPdf.getPages()[1], {
    left: 55,
    bottom: 485,
    right: 300,
    top: 575,
  });

  // Get the width/height of the American flag PDF scaled down to 30% of its original size
  const americanFlagDims = americanFlag.scale(0.3);

  // Get the width/height of the preamble clipping scaled up to 225% of its original size
  const preambleDims = preamble.scale(2.25);

  // Add a blank page to the document
  const page = pdfDoc.addPage();

  // Draw the American flag image in the center top of the page
  page.drawPage(americanFlag, {
    ...americanFlagDims,
    x: page.getWidth() / 2 - americanFlagDims.width / 2,
    y: page.getHeight() - americanFlagDims.height - 150,
  });

  // Draw the preamble clipping in the center bottom of the page
  page.drawPage(preamble, {
    ...preambleDims,
    x: page.getWidth() / 2 - preambleDims.width / 2,
    y: page.getHeight() / 2 - preambleDims.height / 2 - 50,
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Trigger the browser to download the PDF document
  download(
    pdfBytes,
    "pdf-lib_pdf_page_embedding_example.pdf",
    "application/pdf"
  );
}

// async function processPDF(pdfPath) {
//   const pdfDoc = await pdfjsLib.getDocument(pdfPath).promise;
//   const pageNum = 1;

//   const page = await pdfDoc.getPage(pageNum);
//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");
//   const viewport = page.getViewport({ scale: 1.5 });

//   canvas.width = viewport.width;
//   canvas.height = viewport.height;

//   const renderContext = {
//     canvasContext: context,
//     viewport: viewport,
//   };

//   await page.render(renderContext).promise;

//   document.getElementById("pdfViewer").innerHTML = "";
//   document.getElementById("pdfViewer").appendChild(canvas);

//   const selectedCanvas = document.getElementById("selectedCanvas");
//   const selectedContext = selectedCanvas.getContext("2d");

//   //Set selecet Area
//   const selectedArea = {
//     x: 0,
//     y: 0,
//     width: 580,
//     height: 420,
//   }; // Initial area

//   const rotatedWidth = selectedArea.height; // Swap width and height after rotation
//   const rotatedHeight = selectedArea.width;

//   selectedCanvas.width = rotatedWidth;
//   selectedCanvas.height = rotatedHeight;

//   selectedContext.clearRect(0, 0, selectedCanvas.width, selectedCanvas.height);

//   selectedContext.translate(rotatedWidth / 2, rotatedHeight / 2);
//   selectedContext.rotate((90 * Math.PI) / 180); // Rotate by 90 degrees
//   selectedContext.translate(-rotatedWidth / 2, -rotatedHeight / 2);

//   // Redraw the rotated selected area
//   selectedContext.drawImage(
//     canvas,
//     selectedArea.x,
//     selectedArea.y,
//     selectedArea.width,
//     selectedArea.height,
//     (rotatedWidth - selectedArea.width) / 2,
//     (rotatedHeight - selectedArea.height) / 2,
//     selectedArea.width,
//     selectedArea.height
//   );

//   const dataURL = selectedCanvas.toDataURL("image/png");

//   return dataURL;
// }
