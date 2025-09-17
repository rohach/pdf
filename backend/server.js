const express = require("express");
const cors = require("cors");
const path = require("path");
const pdfRoutes = require("./routes/pdfRoutes");

// Load auto-clean cron job
require("./cron/cleanup");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder for downloads (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/pdf", pdfRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Simple PDF Tool Backend Running");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
