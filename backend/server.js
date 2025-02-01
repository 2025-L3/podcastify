const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const audioRoutes = require("./routes/audioRoutes");
const transcriptRoutes = require("./routes/transcriptRoutes");

app.use("/api/audio", audioRoutes);
app.use("/api/transcript", transcriptRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});