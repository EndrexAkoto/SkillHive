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

// 404 route for the server to handle invalid routes
app.use(error404)

app.listen(port, () => {
  logger.info(`${type} Server is running on port ${port}`)
})