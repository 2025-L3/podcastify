const { generatePodcastScript } = require("../utils/gemini");

const processTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;
    const script = await generatePodcastScript(transcript); // Generate script using Gemini
    res.json({ script });
  } catch (error) {
    res.status(500).json({ error: "Failed to process transcript" });
  }
};

module.exports = { processTranscript };