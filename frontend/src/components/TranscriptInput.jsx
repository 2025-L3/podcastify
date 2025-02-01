import React, { useState } from "react";
import { processTranscript } from "../utils/api";

const TranscriptInput = ({ setScript, setLoading }) => {
  const [transcript, setTranscript] = useState("");

  const handleGenerate = async () => {
    if (!transcript) return;
    setLoading(true);

    try {
      const response = await processTranscript(transcript);
      setScript(response.script);
    } catch (error) {
      console.error("Error processing transcript:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Enter Transcript</h2>
      <textarea
        placeholder="Paste or type your transcript here..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button onClick={handleGenerate} className="px-4 py-2 bg-blue-500 text-white rounded">
        Generate Podcast
      </button>
    </div>
  );
};

export default TranscriptInput;