const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Gemini API setup
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Endpoint to handle text transformation
app.post("/transform-text", async (req, res) => {
  const { text } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(text);
    const response = await result.response;
    res.json({ transformedText: response.text() });
  } catch (error) {
    res.status(500).json({ error: "Failed to transform text" });
  }
});

// Endpoint to handle audio file uploads
app.post("/upload-audio", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ filePath: req.file.path });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});