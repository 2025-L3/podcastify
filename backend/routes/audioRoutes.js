const express = require("express");
const router = express.Router();
const audioController = require("../controllers/audioController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// Upload audio and generate podcast
router.post("/upload", upload.single("audio"), audioController.processAudio);

module.exports = router;