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
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Podcast Player</h2>
      <div className="flex gap-4 mb-4">
        <button
          onClick={isPlaying ? handleStop : handlePlay}
          className={`px-4 py-2 ${isPlaying ? "bg-red-500" : "bg-green-500"} text-white rounded`}
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
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold">Script:</h3>
        <p>{script}</p>
      </div>
    </div>
  );
};

export default PodcastPlayer;