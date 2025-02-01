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
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Upload Audio File</h2>
      <input type="file" accept="audio/*" onChange={handleFileUpload} className="mb-4" />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button onClick={handleGenerate} className="px-4 py-2 bg-blue-500 text-white rounded">
        Generate Podcast
      </button>
    </div>
  );
};

export default AudioUpload;