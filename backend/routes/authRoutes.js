import authController from '../controllers/authController.js'
import { Router } from 'express'

const authRoutes = Router()

authRoutes.post('/api/auth/register', authController.register)
authRoutes.post('/api/auth/login', authController.login)
authRoutes.post('/api/auth/logout', authController.logout)

export default authRoutes