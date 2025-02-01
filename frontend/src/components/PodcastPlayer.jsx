import React from "react";

const PodcastPlayer = ({ script }) => {
  const handlePlay = () => {
    const utterance = new SpeechSynthesisUtterance(script);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Podcast Player</h2>
      <button onClick={handlePlay} className="px-4 py-2 bg-green-500 text-white rounded">
        Play Podcast
      </button>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold">Script:</h3>
        <p>{script}</p>
      </div>
    </div>
  );
};

export default PodcastPlayer;