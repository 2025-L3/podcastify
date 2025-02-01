const { extractTextFromAudio } = require("../utils/gemini");

const processAudio = async (req, res) => {
  try {
    const filePath = req.file.path;
    const extractedText = await extractTextFromAudio(filePath); // Extract text from audio
    const script = await generatePodcastScript(extractedText); // Generate script using Gemini
    res.json({ script });
  } catch (error) {
    res.status(500).json({ error: "Failed to process audio" });
  }
};

module.exports = { processAudio };