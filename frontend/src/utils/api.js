import axios from "axios";

const API_BASE_URL = "http://localhost:8888/api";

// Upload audio file and generate podcast
export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);

  try {
    const response = await axios.post(`${API_BASE_URL}/audio/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw error;
  }
};

// Process transcript and generate podcast
export const processTranscript = async (transcript) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/transcript/process`, {
      transcript,
    });
    return response.data;
  } catch (error) {
    console.error("Error processing transcript:", error);
    throw error;
  }
};