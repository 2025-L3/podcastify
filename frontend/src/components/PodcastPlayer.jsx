import React, { useState } from "react";

const PodcastPlayer = ({ script }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const handlePlay = () => {
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = playbackRate; // Set playback speed
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-primary mb-4">Podcast Player</h2>
      <div className="flex gap-4 mb-4">
        <button
          onClick={isPlaying ? handleStop : handlePlay}
          className={`px-6 py-3 rounded-lg transition-all ${
            isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {isPlaying ? "Stop" : "Play"}
        </button>
        <div className="flex items-center gap-2">
          <label htmlFor="speed" className="text-gray-700">Speed:</label>
          <input
            type="range"
            id="speed"
            min="0.5"
            max="2.0"
            step="0.1"
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="text-gray-700">{playbackRate}x</span>
        </div>
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold text-primary">Script:</h3>
        <pre className="whitespace-pre-wrap text-text">{script}</pre>
      </div>
    </div>
  );
};

export default PodcastPlayer;