import express from 'express'
import path from 'path'
import envs from './utils/dotenv.js'
import client from './utils/mongo.js'
import RedisClient from './utils/redis.js'
import logger from './utils/logger.js'
import __dirname from './utils/path.js'
import upload, { uploadRoot } from './utils/upload.js'
import authRoutes from './routes/authRoutes.js'
import welcomeRoutes from './routes/welcome.js'
import error404 from './routes/404Route.js'
import Portfolio from './models/protfolioModels.js'
import helmet from 'helmet'

envs
const app = express()
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json())
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }))

app.use('/uploads', express.static(uploadRoot))
app.use(express.static(path.join(__dirname, '../frontend')))
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

app.post('/api/submit-form', upload.single('profilePicture'), async (req, res) => {
  try {
    const toArray = v => Array.isArray(v) ? v : (v ? [v] : []);
    const splitCsv = v => (typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : toArray(v));

    const portfolio = new Portfolio({
      name: req.body.name,
      profession: req.body.profession,
      specialization: req.body.specialization,
      location: req.body.location,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      about: req.body.about,
      profilePicture: req.file ? `/uploads/profile-photos/${req.file.filename}` : undefined,
      skills: splitCsv(req.body.skills || req.body['skills[]']),
      education: toArray(req.body['educationInstitution[]']).map((institution, i) => ({
        institution,
        course: toArray(req.body['educationCourse[]'])[i],
        startYear: toArray(req.body['educationStartYear[]'])[i],
        endYear: toArray(req.body['educationEndYear[]'])[i]
      })),
      experience: toArray(req.body['experienceInstitution[]']).map((institution, i) => ({
        institution,
        location: toArray(req.body['experienceLocation[]'])[i],
        role: toArray(req.body['experienceRole[]'])[i]
      })),
      courses: toArray(req.body['courseName[]']).map((name, i) => ({
        name,
        institution: toArray(req.body['courseInstitution[]'])[i],
        year: toArray(req.body['courseYear[]'])[i]
      }))
    });

    await portfolio.save();
    res.status(201).json({ message: 'Portfolio submitted', id: portfolio._id });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
});

// 404 route for the server to handle invalid routes
app.use(error404)

app.listen(port, () => {
  logger.info(`${type} Server is running on port ${port}`)
})