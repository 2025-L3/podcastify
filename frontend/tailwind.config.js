module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // A professional blue
        secondary: "#F59E0B", // A complementary orange
        background: "#F3F4F6", // Light gray for backgrounds
        text: "#1F2937", // Dark gray for text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Use Inter font
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      },
    },
  },
  plugins: [],
};

{/* <button
            onClick={handlePlayPause}
            className={`px-4 py-3 rounded-md transition-all ${
              isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-teal-600 hover:bg-teal-500"
            } text-white flex items-center justify-center shadow-md`}
          >
            {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
          </button>
          <button
            onClick={handleStop}
            className="px-4 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all flex items-center justify-center shadow-md"
          >
            <FaStop className="w-6 h-6" />
          </button> */}

  // ElevenLabs API Key and Voice ID
  // const ELEVEN_LABS_API_KEY = "sk_527b0749ee90a7242ae5b496c356947234e2c0ce50eb0272"; // Replace with your API key
  // const VOICE_ID = "FGY2WhTYpPnrIDTdsKH5"; // Example voice ID (replace with your preferred voice)
