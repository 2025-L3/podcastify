const { extractTextFromAudio, generatePodcastScript } = require("../utils/gemini");
const fs = require("fs");

const processAudio = async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("File uploaded successfully:", filePath);

    // Extract text from audio (mock function for now)
    const extractedText = await extractTextFromAudio(filePath);
    console.log("Text extracted from audio:", extractedText);

    // Generate podcast script using Gemini
    const script = await generatePodcastScript(extractedText);
    console.log("Podcast script generated:", script);

    // Save the script to a file (optional)
    fs.writeFileSync("generated_script.txt", script);

    res.json({ script });
  } catch (error) {
    console.error("Error processing audio:", error);
    res.status(500).json({ error: "Failed to process audio", details: error.message });
  }
};

module.exports = { processAudio };