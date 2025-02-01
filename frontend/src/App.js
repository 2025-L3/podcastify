import React, { useState } from "react";
import AudioUpload from "./components/AudioUpload";
import TranscriptInput from "./components/TranscriptInput";
import PodcastPlayer from "./components/PodcastPlayer";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState("audio");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Podcast AI Generator</h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setInputMode("audio")}
        //   className={px-4 py-2 rounded ${inputMode === "audio" ? "bg-blue-500 text-white" : "bg-gray-200"}}
        >
          Upload Audio
        </button>
        <button
          onClick={() => setInputMode("transcript")}
        //   className={px-4 py-2 rounded ${inputMode === "transcript" ? "bg-blue-500 text-white" : "bg-gray-200"}}
        >
          Enter Transcript
        </button>
      </div>

      {/* Input Mode */}
      {inputMode === "audio" ? (
        <AudioUpload setScript={setScript} setLoading={setLoading} />
      ) : (
        <TranscriptInput setScript={setScript} setLoading={setLoading} />
      )}

      {/* Loading Spinner */}
      {loading && <LoadingSpinner />}

      {/* Podcast Player */}
      {script && <PodcastPlayer script={script} />}
    </div>
  );
}

export default App;