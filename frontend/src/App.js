import React, { useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import "./App.css";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [transformedText, setTransformedText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState("audio"); // "audio" or "transcript"

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await axios.post("http://localhost:8888/upload-audio", formData);
      console.log("File uploaded:", response.data.filePath);
      setAudioFile(file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Handle text transformation
  const handleTransformText = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8888/transform-text", {
        text: transcript,
      });
      setTransformedText(response.data.transformedText);
    } catch (error) {
      console.error("Error transforming text:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle text-to-audio conversion
  const handleTextToAudio = () => {
    const utterance = new SpeechSynthesisUtterance(transformedText);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="App">
      <h1 className="text-sm text-purple-600 font-medium dark:text-white">Podcast AI Generator</h1>

      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          onClick={() => setInputMode("audio")}
          className={inputMode === "audio" ? "active" : ""}
        >
          Upload Audio
        </button>
        <button
          onClick={() => setInputMode("transcript")}
          className={inputMode === "transcript" ? "active" : ""}
        >
          Enter Transcript
        </button>
      </div>

      {/* Audio File Upload */}
      {inputMode === "audio" && (
        <div>
          <h2>Upload Audio File</h2>
          <input type="file" accept="audio/*" onChange={handleFileUpload} />
        </div>
      )}

      {/* Transcript Input */}
      {inputMode === "transcript" && (
        <div>
          <h2>Enter Transcript</h2>
          <textarea
            placeholder="Paste or type your transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </div>
      )}

      {/* Generate Podcast Button */}
      <button onClick={handleTransformText} disabled={loading}>
        {loading ? "Generating..." : "Generate Podcast"}
      </button>

      {/* Transformed Text Output */}
      {transformedText && (
        <div>
          <h2>Generated Podcast Script</h2>
          <p>{transformedText}</p>
          <button onClick={handleTextToAudio}>Listen to Podcast</button>
        </div>
      )}

      {/* Podcast Player */}
      {audioUrl && (
        <div>
          <h2>Podcast Player</h2>
          <ReactPlayer url={audioUrl} controls />
        </div>
      )}
    </div>
  );
}

export default App;