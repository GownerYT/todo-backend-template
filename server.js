require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const tasksRoute = require('./routes/tasks')


const app = express()
const port = process.env.PORT // Modify the por value in the .env file.
const corsOrigin = process.env.CORS_ORIGIN; // Replace the example URL with your frontend's origin in the .env file.

// CORS CONFIGURATION
// Configure the URL of your frontend application here.
const corsOptions = {
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
};

// Apply CORS globally so the frontend can access all API routes.
app.use(cors(corsOptions));

app.disable('x-powered-by');
app.use(helmet());

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.status(200).json({message: "main page loaded!"})

})

app.use("/tasks", tasksRoute)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})