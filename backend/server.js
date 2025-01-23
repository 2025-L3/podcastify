//import dotenv from 'dotenv'; 

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
//dotenv.config(); // Load environment variables from .env file

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Example API endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

const port = 8888 || 3333;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});