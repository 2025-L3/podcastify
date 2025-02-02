import React, { useState } from "react";
import { uploadAudio } from "../utils/api";

const AudioUpload = ({ setScript, setLoading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setFile(file);
    setError("");
  };

  const handleGenerate = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await uploadAudio(file);
      setScript(response.script);
    } catch (error) {
      setError("Failed to generate podcast. Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-primary mb-4">Upload Audio File</h2>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleGenerate}
        className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        Generate Podcast
      </button>
    </div>
  );
};

export default AudioUpload;