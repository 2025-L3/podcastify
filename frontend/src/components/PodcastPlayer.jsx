import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import axios from "axios";

const PodcastPlayer = ({ script }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  // ElevenLabs API Key and Voice ID
  const ELEVEN_LABS_API_KEY = "sk_527b0749ee90a7242ae5b496c356947234e2c0ce50eb0272"; // Replace with your API key
  const VOICE_ID = "FGY2WhTYpPnrIDTdsKH5"; // Example voice ID (replace with your preferred voice)

  // Generate audio using ElevenLabs TTS
  const generateAudio = async (text) => {
    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          text: text,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVEN_LABS_API_KEY,
          },
          responseType: "arraybuffer", // Get audio as a binary stream
        }
      );

      // Convert the response to a Blob
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Load the audio into WaveSurfer
      wavesurferRef.current.load(audioUrl);

      // Set duration once the audio is loaded
      wavesurferRef.current.on("ready", () => {
        setDuration(wavesurferRef.current.getDuration());
      });
    } catch (error) {
      console.error("Error generating audio with ElevenLabs:", error);
    }
  };

  // Initialize WaveSurfer and generate audio
  useEffect(() => {
    if (!script) return;

    // Create a new WaveSurfer instance
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#4F46E5",
      progressColor: "#7C3AED",
      cursorColor: "#7C3AED",
      height: 100,
      responsive: true,
      backend: "MediaElement", // Use MediaElement backend for better compatibility
    });

    // Generate audio from script using ElevenLabs
    generateAudio(script);

    // Update current time as the audio plays
    wavesurferRef.current.on("audioprocess", () => {
      setCurrentTime(wavesurferRef.current.getCurrentTime());
    });

    // Handle end of playback
    wavesurferRef.current.on("finish", () => {
      setIsPlaying(false);
      setCurrentTime(duration); // Ensure progress bar reaches 100%
    });

    // Cleanup
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [script]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle stop
  const handleStop = () => {
    wavesurferRef.current.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Handle speed change
  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackRate(newSpeed);
    wavesurferRef.current.setPlaybackRate(newSpeed);
  };

  // Format time (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg shadow-glass border border-white/10">
      <h2 className="text-2xl font-semibold text-primary mb-4">Podcast Player</h2>

      {/* Waveform Visualizer */}
      <div ref={waveformRef} className="mb-6"></div>

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
            } text-white flex items-center justify-center hover:scale-105 transform transition-transform`}
          >
            {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
          </button>
          <button
            onClick={handleStop}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center hover:scale-105 transform transition-transform"
          >
            <FaStop className="w-6 h-6" />
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