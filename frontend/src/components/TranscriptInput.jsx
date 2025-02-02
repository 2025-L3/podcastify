import React, { useState } from "react";
import { processTranscript } from "../utils/api";

const TranscriptInput = ({ setScript, setLoading }) => {
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!transcript) {
      setError("Please enter a transcript.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await processTranscript(transcript);
      setScript(response.script);
    } catch (error) {
      setError("Failed to generate podcast. Please try again.");
      console.error("Error processing transcript:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-primary mb-4">Enter Transcript</h2>
      <textarea
        placeholder="Paste or type your transcript here..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
        rows={6}
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

export default TranscriptInput;