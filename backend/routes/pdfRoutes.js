const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  mergePDFs,
  splitPDF,
  compressPDF,
} = require("../controllers/pdfController");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDFs are allowed"));
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Merge PDFs
router.post("/merge", upload.array("pdfs"), mergePDFs);

// Split PDF
router.post("/split", upload.single("pdf"), splitPDF);

// Compress PDF
router.post("/compress", upload.single("pdf"), compressPDF);

module.exports = router;
