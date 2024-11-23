// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express.Router();
const cors= require('cors');
app.use(cors());


// Your Google Gemini API key (replace with your actual key)
const API_KEY = 'AIzaSyABd73vQj7YV3ob7CThufrbMnMoRqhIoqI';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to handle text summarization requests
app.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Call Gemini API to summarize text (you can modify the prompt to suit summarization)
    const prompt = `Summarize the following text: ${text}`;
    const result = await model.generateContent(prompt);
    
    // Return the summarized text
    res.json({ summary: result.response.text() });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
});

module.exports= app;
 
