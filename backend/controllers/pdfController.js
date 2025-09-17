const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

// Helper: check if file exists
const fileExists = (filePath) => fs.existsSync(filePath);

// Merge PDFs
const mergePDFs = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded for merging" });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      if (!fileExists(file.path)) continue;

      const pdfBytes = fs.readFileSync(file.path);
      try {
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (err) {
        return res
          .status(400)
          .json({ message: `Invalid PDF: ${file.originalname}` });
      }
    }

    const outputPath = `uploads/merged-${Date.now()}.pdf`;
    const mergedBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedBytes);

    // Return file path for frontend
    res.json({ files: [`/uploads/${path.basename(outputPath)}`] });
  } catch (err) {
    console.error("Error merging PDFs:", err);
    res.status(500).json({ message: "Error merging PDFs", error: err.message });
  }
};

// Split PDF
const splitPDF = async (req, res) => {
  try {
    if (!req.file || !fileExists(req.file.path)) {
      return res
        .status(400)
        .json({ message: "No file uploaded for splitting" });
    }

    const pdfBytes = fs.readFileSync(req.file.path);
    let pdf;
    try {
      pdf = await PDFDocument.load(pdfBytes);
    } catch (err) {
      return res.status(400).json({ message: "Invalid PDF file" });
    }

    const splitFiles = [];
    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(copiedPage);

      const outputPath = `uploads/split-${i + 1}-${Date.now()}.pdf`;
      const splitBytes = await newPdf.save();
      fs.writeFileSync(outputPath, splitBytes);
      splitFiles.push(`/uploads/${path.basename(outputPath)}`);
    }

    res.json({ message: "PDF split successfully", files: splitFiles });
  } catch (err) {
    console.error("Error splitting PDF:", err);
    res
      .status(500)
      .json({ message: "Error splitting PDF", error: err.message });
  }
};

// Compress PDF
const compressPDF = async (req, res) => {
  try {
    if (!req.file || !fileExists(req.file.path)) {
      return res
        .status(400)
        .json({ message: "No file uploaded for compression" });
    }

    const { path: filePath, originalname } = req.file;
    const pdfBytes = fs.readFileSync(filePath);
    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.load(pdfBytes);
    } catch (err) {
      return res.status(400).json({ message: "Invalid PDF file" });
    }

    // Basic compression
    const compressedBytes = await pdfDoc.save({ useObjectStreams: false });
    const outputPath = `uploads/compressed-${Date.now()}-${originalname}`;
    fs.writeFileSync(outputPath, compressedBytes);

    res.json({ files: [`/uploads/${path.basename(outputPath)}`] });
  } catch (err) {
    console.error("Error compressing PDF:", err);
    res
      .status(500)
      .json({ message: "Error compressing PDF", error: err.message });
  }
};

module.exports = { mergePDFs, splitPDF, compressPDF };
