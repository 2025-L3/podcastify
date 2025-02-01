const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const extractTextFromAudio = async (filePath) => {
  // Implement audio-to-text extraction (e.g., using a library like ffmpeg or an API)
  return "Extracted text from audio";
};

// const generatePodcastScript = async (text) => {
  
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//   const result = await model.generateContent(text);
//   const response = await result.response;
//   return response.text();
// };
const generatePodcastScript = async (text) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Add a prompt to generate a two-person dialogue
  const prompt = `Convert the following text into a one or two-person according to the case dialogue format. Use "Speaker 1:" and "Speaker 2:" to identify each speaker.\n\n${text}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

module.exports = { extractTextFromAudio, generatePodcastScript };