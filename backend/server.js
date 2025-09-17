const express = require("express");
const cors = require("cors");
const path = require("path");
const pdfRoutes = require("./routes/pdfRoutes");

// Load auto-clean cron job
require("./cron/cleanup");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Explicit CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://pdf-soxu.vercel.app", // your frontend on Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

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
