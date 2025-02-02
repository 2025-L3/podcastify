import React, { useState, useEffect, useRef } from "react";

const PodcastPlayer = ({ script }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const utteranceRef = useRef(null);

  // Initialize the SpeechSynthesisUtterance
  useEffect(() => {
    utteranceRef.current = new SpeechSynthesisUtterance(script);
    utteranceRef.current.rate = playbackRate;

    // Update current time as the audio plays
    utteranceRef.current.onboundary = () => {
      setCurrentTime((prevTime) => prevTime + 0.1);
    };

    // Reset when audio ends
    utteranceRef.current.onend = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Set initial duration
    utteranceRef.current.onstart = () => {
      setDuration(utteranceRef.current.text.length / 10); // Approximate duration
    };

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [script]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.speak(utteranceRef.current);
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Handle stop
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Handle speed change
  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackRate(newSpeed);
    utteranceRef.current.rate = newSpeed;
  };

  // Format time (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-primary mb-4">Podcast Player</h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Player Controls and Speed Bar */}
      <div className="flex flex-col gap-4">
        {/* Play/Pause/Stop Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePlayPause}
            className={`px-6 py-3 rounded-lg transition-all ${
              isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={handleStop}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            Stop
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center justify-center gap-4">
          <label htmlFor="speed" className="text-gray-700">Speed:</label>
          <input
            type="range"
            id="speed"
            min="0.5"
            max="2.0"
            step="0.1"
            value={playbackRate}
            onChange={handleSpeedChange}
            className="w-32"
          />
          <span className="text-gray-700">{playbackRate}x</span>
        </div>
      </div>

      {/* Script Display */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold text-primary">Script:</h3>
        <pre className="whitespace-pre-wrap text-text">{script}</pre>
      </div>
    </div>
  );
};

export default PodcastPlayer;