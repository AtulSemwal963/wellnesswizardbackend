const express = require('express');
const cors = require('cors');

// Import the route files
const chatWellnessAI = require('./routes/chatWellnessAI');
const quickCheckup = require('./routes/quickCheckup');
const summariseText= require('./routes/summariseText');

const app = express();
const port = 3000;

// Use middleware
app.use(express.json());
app.use(cors());

// Use the routes
app.use('/chatwellnessAI', chatWellnessAI); // All wellness-related routes will start with /wellness
app.use('/quickcheckup',quickCheckup ); // All health query-related routes will start with /health
app.use('/summarisetext',summariseText);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
