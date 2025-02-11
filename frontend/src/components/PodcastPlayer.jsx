import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";

const PodcastPlayer = ({ script }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [utterances, setUtterances] = useState([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const audioRef = useRef(null);
  const introAudioRef = useRef(null);
  const outroAudioRef = useRef(null);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log('Voices loaded:', voices.map(v => ({
          name: v.name,
          lang: v.lang,
          default: v.default
        })));
      }
    };

    // Try to load voices immediately
    loadVoices();

    // Also set up the event listener for voices changed
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Some browsers need a little push to load voices
    setTimeout(loadVoices, 500);

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Generate utterances for Web Speech API
  const generateUtterances = (text) => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      console.log('No voices available yet, retrying in 500ms');
      setTimeout(() => generateUtterances(text), 500);
      return;
    }

    // Filter for Google voices
    const googleVoices = voices.filter(v => 
      v.name.includes('Google') && v.lang.startsWith('en')
    );

    // Select voices
    const voice1 = googleVoices.find(v => v.name === 'Google US English') || googleVoices[0];
    const voice2 = googleVoices.find(v => v.name === 'Google UK English Female') || googleVoices[1];

    console.log('Processing script format...');
    
    // Extract topic from first few lines of conversation
    const lines = text.split('\n').map(line => line.replace(/\*\*/g, '').trim());
    const firstLine = lines[0] || '';
    const topicMatch = firstLine.match(/about\s+(.+?)[?.!]/i) || // Try to match "about [topic]"
                      firstLine.match(/discussing\s+(.+?)[?.!]/i) || // Try to match "discussing [topic]"
                      firstLine.match(/Speaker \d+:\s*(.+?)[?.!]/i); // Fallback to first sentence
    
    const topic = topicMatch ? 
      topicMatch[1].toLowerCase().trim() : 
      'this important topic';

    console.log('Detected topic:', topic);

    // Create dynamic introduction and conclusion
    const introduction = [
      `Speaker1: Welcome to today's conversation where we'll be discussing ${topic}. 
      I'm your host, and I'm joined by a guest who will share their experiences and insights. 
      We hope you'll find our discussion helpful and informative.`
    ];

    const conclusion = [
      `Speaker1: We've covered a lot of ground in our discussion about ${topic}. 
      I hope you've found this conversation valuable and picked up some useful insights.`,
      
      `Speaker1: Thank you for joining us today. 
      Remember to apply these ideas in your own journey, and feel free to revisit this discussion anytime. 
      Until next time, take care and goodbye!`
    ];

    // Process the main script
    const processedLines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const cleanLine = line.replace(/\*\*/g, '').trim();
        
        if (cleanLine.startsWith('Speaker 1:')) {
          return cleanLine.replace('Speaker 1:', 'Speaker1:');
        } else if (cleanLine.startsWith('Speaker 2:')) {
          return cleanLine.replace('Speaker 2:', 'Speaker2:');
        } else {
          console.log('Found line without valid speaker identifier:', line);
          return `Speaker1: ${cleanLine}`;
        }
      });

    // Combine introduction, main content, and conclusion
    const fullScript = [...introduction, ...processedLines, ...conclusion];

    const newUtterances = fullScript.map((line) => {
      const cleanText = line.replace(/Speaker[12]:\s*/, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // More distinctive voice characteristics
      if (line.startsWith("Speaker1:")) {
        utterance.voice = voice1;
        utterance.pitch = 0.85;  // Deeper voice
        utterance.rate = playbackRate * 0.95;  // Slightly slower
        utterance.volume = 1.0;
        
        // Add extra professionalism for intro/outro sections
        if (introduction.includes(line) || conclusion.includes(line)) {
          utterance.pitch = 0.9;  // Slightly more formal tone
          utterance.rate = playbackRate * 0.9;  // Slower for clarity
        }
        
        // Add pauses for more natural speech
        if (cleanText.includes(',')) {
          utterance.text = cleanText.replace(/,/g, ', ');
        }
        console.log('Using voice1:', voice1.name, 'for:', cleanText);
      } else if (line.startsWith("Speaker2:")) {
        utterance.voice = voice2;
        utterance.pitch = 1.25;  // Higher pitch
        utterance.rate = playbackRate * 1.05;  // Slightly faster
        utterance.volume = 0.95;  // Slightly softer
        
        // Add pauses for more natural speech
        if (cleanText.includes(',')) {
          utterance.text = cleanText.replace(/,/g, ', ');
        }
        console.log('Using voice2:', voice2.name, 'for:', cleanText);
      }

      // Add expression based on punctuation
      if (cleanText.includes('?')) {
        utterance.pitch *= 1.1;  // Raise pitch for questions
      }
      if (cleanText.includes('!')) {
        utterance.volume *= 1.15;  // Increase volume for exclamations
      }
      if (cleanText.endsWith('.')) {
        utterance.pitch *= 0.95;  // Lower pitch at end of sentences
      }

      // Add slight pause between speakers
      if (line.startsWith("Speaker2:")) {
        utterance.text = ' ' + utterance.text;  // Add small pause before second speaker
      }

      utterance.onend = () => {
        if (line === fullScript[fullScript.length - 1]) {
          playOutro();
          setIsPlaying(false);
        }
      };
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
      };
      return utterance;
    });

    console.log(`Created ${newUtterances.length} utterances with distinct voices`);
    setUtterances(newUtterances);
  };

  // Play intro music
  const playIntro = () => {
    try {
      if (!introAudioRef.current) {
        // Update the audio path to be relative to the public folder
        introAudioRef.current = new Audio("/assets/audio/intro.mp3");
        
        introAudioRef.current.onended = () => {
          console.log('Intro ended, starting speech');
          utterances.forEach((utterance) => window.speechSynthesis.speak(utterance));
        };
        
        introAudioRef.current.onerror = (e) => {
          console.error('Intro audio error:', {
            error: e.error,
            message: e.message,
            src: introAudioRef.current.src
          });
          // Continue with speech even if intro fails
          utterances.forEach((utterance) => window.speechSynthesis.speak(utterance));
        };
      }

      // Reset the audio to the beginning if it was played before
      introAudioRef.current.currentTime = 0;
      
      const playPromise = introAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Intro audio started successfully');
          })
          .catch(error => {
            console.error('Error playing intro:', error);
            // Continue with speech even if intro fails
            utterances.forEach((utterance) => window.speechSynthesis.speak(utterance));
          });
      }
    } catch (error) {
      console.error('Error in playIntro:', error);
      // Continue with speech even if intro fails
      utterances.forEach((utterance) => window.speechSynthesis.speak(utterance));
    }
  };

  // Play outro music
  const playOutro = () => {
    try {
      if (!outroAudioRef.current) {
        // Update the audio path to be relative to the public folder
        outroAudioRef.current = new Audio("/assets/audio/outro.mp3");
        
        outroAudioRef.current.onerror = (e) => {
          console.error('Outro audio error:', {
            error: e.error,
            message: e.message,
            src: outroAudioRef.current.src
          });
        };
      }

      // Reset the audio to the beginning if it was played before
      outroAudioRef.current.currentTime = 0;
      
      const playPromise = outroAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Outro audio started successfully');
          })
          .catch(error => {
            console.error('Error playing outro:', error);
          });
      }
    } catch (error) {
      console.error('Error in playOutro:', error);
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
    } else {
      if (!window.speechSynthesis.speaking) {
        playIntro(); // Play intro first
      } else {
        window.speechSynthesis.resume();
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
    utterances.forEach((utterance) => (utterance.rate = newSpeed));
  };

  // Initialize audio when voices are loaded
  useEffect(() => {
    if (!script || !voicesLoaded) {
      console.log('Waiting for voices to load...');
      return;
    }
    console.log('Voices loaded, generating utterances');
    generateUtterances(script);

    return () => {
      window.speechSynthesis.cancel();
      if (introAudioRef.current) introAudioRef.current.pause();
      if (outroAudioRef.current) outroAudioRef.current.pause();
    };
  }, [script, voicesLoaded, playbackRate]);

  return (
    <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg shadow-glass border border-white/10">
      <h2 className="text-2xl font-semibold text-primary mb-4">Podcast Player</h2>

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
        <pre className="whitespace-pre-wrap text-text">
          {script.replace(/Speaker \d+:/g, "")}
        </pre>
      </div>
    </div>
  );
};

export default PodcastPlayer;