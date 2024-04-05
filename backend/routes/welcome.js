import { Router } from 'express'
import logger from '../utils/logger.js'

const welcomeRoutes = Router()

welcomeRoutes.get('/api', (req, res) => {
  if (req.session) {
    logger.info('Session is active')
  }
  res.status(200).json({ message: 'Welcome to the server' })
})

export default welcomeRoutes