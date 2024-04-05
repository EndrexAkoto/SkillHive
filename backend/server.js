import express from 'express'
// import bodyParser from 'body-parser';
import envs from './utils/dotenv.js'
import client from './utils/mongo.js'
import RedisClient from './utils/redis.js'
import logger from './utils/logger.js'
import authRoutes from './routes/authRoutes.js'
import welcomeRoutes from './routes/welcome.js'
import error404 from './routes/404Route.js'
import helmet from 'helmet'

envs
const app = express()
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json())
app.use(helmet())
const port = process.env.SERVER_PORT
const type = process.env.CONTEXT
if (!app || !port || !type) {
  logger.warn('Please provide the server port and the server type in order to run the server')
  process.exit(1)
}
client()
RedisClient.connect()

// Routes for server

// Default route for the server to check if the server is running
app.use(welcomeRoutes)

// Auth routes
app.use(authRoutes)

// Handle form submission
app.post('/api/submit-form', async (req, res) => {
  try {
      // Create a new user instance with data from the form
      const newUser = new User({
          name: req.body.name,
          profession: req.body.profession,
          specialization: req.body.specialization,
          location: req.body.location,
          address: req.body.address,
          email: req.body.email,
          phone: req.body.phone,
          about: req.body.about,
          skills: req.body.skills.split(',').map(skill => skill.trim()), // Assuming skills are comma-separated
          education: req.body.education.split(',').map(edu => edu.trim()),
          experience: req.body.experience.split(',').map(exp => exp.trim()),
          courses: req.body.courses.split(',').map(course => course.trim())
      });

      // Save the user data to the database
      await newUser.save();

      res.status(201).send('Form submitted successfully');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
});

// 404 route for the server to handle invalid routes
app.use(error404)

app.listen(port, () => {
  logger.info(`${type} Server is running on port ${port}`)
})