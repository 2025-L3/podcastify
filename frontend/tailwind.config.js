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
    },
  },
  plugins: [],
};