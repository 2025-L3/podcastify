import React, { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import AudioUpload from "./components/AudioUpload";
import TranscriptInput from "./components/TranscriptInput";
import PodcastPlayer from "./components/PodcastPlayer";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [script, setScript] = useState("");
    const [loading, setLoading] = useState(false);
    const [inputMode, setInputMode] = useState("audio");

    useEffect(() => {
        // Simulating loading process
        setTimeout(() => {
          setIsLoading(false);
        }, 2000); // Delay for 2 seconds
      }, []);

    return (
        <div>
            {isLoading && <SplashScreen />}
            {!isLoading && (
                // Your main app content
                <div className="min-h-screen bg-background p-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold text-primary text-center mb-8">Podcast AI Generator</h1>
                        
                        
                        {/* Toggle Buttons */}
                        <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setInputMode("audio")}
                            className={`px-6 py-3 rounded-lg transition-all ${
                            inputMode === "audio"
                                ? "bg-primary text-white hover:bg-blue-700"
                                : "bg-white text-primary border border-primary hover:bg-gray-50"
                            }`}
                        >
                            Upload Audio
                        </button>
                        <button
                            onClick={() => setInputMode("transcript")}
                            className={`px-6 py-3 rounded-lg transition-all ${
                            inputMode === "transcript"
                                ? "bg-primary text-white hover:bg-blue-700"
                                : "bg-white text-primary border border-primary hover:bg-gray-50"
                            }`}
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
                </div>
            )}
        </div>
    );
}

export default App;