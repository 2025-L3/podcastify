const express = require("express");
const router = express.Router();
const transcriptController = require("../controllers/transcriptController");

// Process transcript and generate podcast
router.post("/process", transcriptController.processTranscript);

module.exports = router;