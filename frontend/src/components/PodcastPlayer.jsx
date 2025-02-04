import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";

const PodcastPlayer = ({ script }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false); // Track if audio is ready
  const audioRef = useRef(null);

  // Web Speech API Synthesis
  const speakScript = (text) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate;
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  // Generate audio using Web Speech API
  const generateAudio = async (text) => {
    try {
      // Remove speaker identification (e.g., "commentator1:", "commentator2:")
      const cleanedText = text.replace(/commentator\d+:/g, "");

      // Generate podcast audio using Web Speech API
      await speakScript(cleanedText);

      // Load intro and outro music
      const [introAudio, outroAudio] = await Promise.all([
        fetch("/audio/intro.mp3").then((res) => res.arrayBuffer()),
        fetch("/audio/intro.mp3").then((res) => res.arrayBuffer()),
      ]);

      // Decode audio files
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const introBuffer = await audioContext.decodeAudioData(introAudio);
      const outroBuffer = await audioContext.decodeAudioData(outroAudio);

      // Create a buffer for the mixed audio
      const mixedBuffer = audioContext.createBuffer(
        1, // Number of channels
        introBuffer.length + outroBuffer.length + (cleanedText.length * 0.1 * audioContext.sampleRate), // Approximate duration
        audioContext.sampleRate
      );

      // Copy intro, podcast, and outro into the mixed buffer
      const channelData = mixedBuffer.getChannelData(0);
      let offset = 0;

      // Add intro
      channelData.set(introBuffer.getChannelData(0), offset);
      offset += introBuffer.length;

      // Add podcast (Web Speech API audio)
      const podcastBuffer = await new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.rate = playbackRate;
        const recorder = new MediaRecorder(new MediaStream());
        recorder.ondataavailable = (e) => {
          const reader = new FileReader();
          reader.onload = () => {
            audioContext.decodeAudioData(reader.result).then(resolve);
          };
          reader.readAsArrayBuffer(e.data);
        };
        recorder.start();
        window.speechSynthesis.speak(utterance);
        utterance.onend = () => recorder.stop();
      });
      channelData.set(podcastBuffer.getChannelData(0), offset);
      offset += podcastBuffer.length;

      // Add outro
      channelData.set(outroBuffer.getChannelData(0), offset);

      // Export mixed audio as a Blob
      const mixedBlob = await exportBufferToBlob(mixedBuffer);
      const mixedUrl = URL.createObjectURL(mixedBlob);

      // Load the mixed audio into an HTMLAudioElement
      audioRef.current = new Audio(mixedUrl);

      // Set duration once the audio is loaded
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
        setIsAudioReady(true); // Mark audio as ready
      };

      // Update current time as the audio plays
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };

      // Handle end of playback
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(duration); // Ensure progress bar reaches 100%
      };
    } catch (error) {
      console.error("Error generating audio:", error);
      setIsAudioReady(false); // Mark audio as not ready if there's an error
    }
  };

  // Export AudioBuffer to Blob
  const exportBufferToBlob = async (buffer) => {
    return new Promise((resolve) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const offlineContext = new OfflineAudioContext(
        buffer.numberOfChannels,
        buffer.length,
        buffer.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = buffer;
      source.connect(offlineContext.destination);
      source.start();

      offlineContext.startRendering().then((renderedBuffer) => {
        const blob = new Blob([renderedBuffer.getChannelData(0)], { type: "audio/wav" });
        resolve(blob);
      });
    });
  };

  // Initialize audio
  useEffect(() => {
    if (!script) return;

    // Generate audio from script using Web Speech API
    generateAudio(script);

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ""; // Clear the audio source
      }
      setIsAudioReady(false); // Reset audio ready state
    };
  }, [script]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (!audioRef.current || !isAudioReady) {
      console.error("Audio is not ready yet.");
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle stop
  const handleStop = () => {
    if (!audioRef.current || !isAudioReady) {
      console.error("Audio is not ready yet.");
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Handle speed change
  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackRate(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
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
            disabled={!isAudioReady} // Disable button if audio is not ready
            className={`px-6 py-3 rounded-lg transition-all ${
              isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } text-white flex items-center justify-center hover:scale-105 transform transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
          </button>
          <button
            onClick={handleStop}
            disabled={!isAudioReady} // Disable button if audio is not ready
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center hover:scale-105 transform transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={!isAudioReady} // Disable slider if audio is not ready
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