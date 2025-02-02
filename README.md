# podcastify

A React-based webapp that generates podcasts from uploaded audio files or pasted transcripts. It uses the Gemini API for text transformation and the Web Speech API for text-to-audio conversion.

## Features

- **Audio Upload**: Upload an audio file to generate a podcast.
- **Transcript Input**: Paste or type a transcript to generate a podcast.
- **Podcast Player**: Play, stop, and adjust playback speed (0.5x - 2.0x).
- **Speaker Identification**: Supports one or two-person dialogue structures.

## Technologies

- **Frontend**: ReactJS, Tailwind CSS
- **Backend**: ExpressJS
- **AI Integration**: Google Gemini API
- **Audio Processing**: Web Speech API

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Gemini API Key (from Google Cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/podcast-ai-generator.git
   cd podcast-ai-generator
   ```
