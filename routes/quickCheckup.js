
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express.Router();
app.use(cors());
const port = 3000;

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyABd73vQj7YV3ob7CThufrbMnMoRqhIoqI'); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: 'gemini-exp-1114' });

// Middleware to parse JSON requests
app.use(express.json());

// Route for starting the wellness wizard process
app.post('/start', async (req, res) => {
    try {
        // Define the initial prompt that guides the AI's behavior
        const prompt = `
            You are Wellness Wizard, an AI assistant helping identify possible health conditions based on the user's symptoms. 
            Always respond strictly in plain JSON format without any additional characters, backticks, or markdown formatting. 
            Format your response like this: {"question":"", "options":["", ""]}.
        `;

        // Send the initial prompt to the model
        const result = await model.generateContent(prompt);

        // Log the raw AI response
        const rawResponse = result.response.text();
        console.log('Raw AI Response:', rawResponse);

        // Clean and parse the response
        const cleanedResponse = rawResponse
            .replace(/```json/g, '') // Remove markdown-style code block markers
            .replace(/```/g, '')     // Remove any stray backticks
            .trim();

        // Parse the cleaned response
        const firstResponse = JSON.parse(cleanedResponse);

        // Log the cleaned and parsed response
        console.log('Sending to frontend:', firstResponse);

        // Send the first question as a response to the user
        res.json(firstResponse);
    } catch (error) {
        console.error("Error generating initial response:", error);
        res.status(500).json({ error: "Error generating response from AI" });
    }
});

// Route for processing user responses
app.post('/response', async (req, res) => {
    try {
        const userResponse = req.body.response; // Get user response from the request body

        if (!userResponse) {
            return res.status(400).json({ error: 'User response is required' });
        }

        // Generate follow-up questions based on the user's input
        const followUpPrompt = `
            The user responded with: ${userResponse}. Based on this response, you should ask the next relevant question. 
            The question should be focused on narrowing down the possible health conditions related to this symptom.
            Provide the next question in JSON format: {"question": "<question>", "options": ["option 1", "option 2", "I don't know"]}.
        `;

        const followUpResponse = await model.generateContent(followUpPrompt);

        // Log the raw AI response
        const rawResponse = followUpResponse.response.text();
        console.log('Raw AI Response:', rawResponse);

        // Clean and parse the response
        const cleanedResponse = rawResponse
            .replace(/```json/g, '') // Remove markdown-style code block markers
            .replace(/```/g, '')     // Remove any stray backticks
            .trim();

        // Parse the cleaned response
        const followUpText = JSON.parse(cleanedResponse);

        // Log the cleaned and parsed response
        console.log('Sending to frontend:', followUpText);

        // Send the follow-up question as a response to the user
        res.json(followUpText);
    } catch (error) {
        console.error("Error processing user response:", error);
        res.status(500).json({ error: "Error generating follow-up response from AI" });
    }
});

// Start the server
// app.listen(port, () => {
//     console.log(`Wellness Wizard API listening at http://localhost:${port}`);
// });

module.exports = app;