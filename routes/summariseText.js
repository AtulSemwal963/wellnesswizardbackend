const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express.Router();
const cors = require('cors');
app.use(cors());

// Your Google Gemini API key (replace with your actual key)
const API_KEY = 'AIzaSyBQvXfNiuyXS4KmP8tJNrVlkVHK97OjMKw';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to handle text summarization requests
app.post('/', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    // Concatenate all content sections and create a prompt for summarization
    const prompt = `Summarize the following detailed information: ${content}`;
    const result = await model.generateContent(prompt);

    // Return the summarized text
    res.json({ summary: result.response.text() });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
});

module.exports = app;
