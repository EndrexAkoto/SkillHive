import express from 'express';
import dotenv from 'dotenv';
import client from './utils/mongo.js';
import RedisClient from './utils/redis.js';
import logger from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';
import welcomeRoutes from './routes/welcome.js';
import error404 from './routes/404Route.js';
import helmet from 'helmet';

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(helmet());

const port = process.env.SERVER_PORT;
const type = process.env.CONTEXT;

if (!app || !port || !type) {
  logger.warn('Please provide the server port and the server type in order to run the server');
  process.exit(1);
}

client();
RedisClient.connect();

// Routes for server
app.use(welcomeRoutes);
app.use(authRoutes);
app.use(error404);

// Define a route to handle form submissions
app.post('/submit-form', async (req, res) => {
  try {
    const formData = req.body;
    // Process and save the form data to MongoDB
    // Example: const savedData = await saveFormDataToDatabase(formData);
    res.status(200).json({ message: 'Form submitted successfully!', data: formData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  logger.info(`${type} Server is running on port ${port}`);
});
