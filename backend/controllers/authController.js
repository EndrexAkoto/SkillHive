import User from '../models/userModels.js';
import jwt from 'jsonwebtoken';
import envs from '../utils/dotenv.js';
import RedisClient from '../utils/redis.js';
import logger from '../utils/logger.js';
import encryption from '../utils/encryption.js';

envs;

class authController {
  static async register (req, res) {
    try {
      const bodys = JSON.stringify(req.body);
      logger.info(`Registering user: ${bodys}`);
      const data = req.body;
      data.dateCreated = new Date();
      if (!data.firstName || !data.lastName || !data.email || !data.password) {
        logger.warn('All fields are required');
        return res.status(400).json({ message: 'All fields are required' });
      }
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        logger.warn('User already exists');
        return res.status(400).json({ message: 'Email already exists' });
      }
      const user = new User(data);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
      user.verifyToken = token;
      await user.save();
      res.status(201).json({ message: 'User created', token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async login (req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      if (!user.comparePassword(req.body.password)) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });
      await RedisClient.set(user._id.toString(), token);
      res.status(200).json({ message: 'User logged in', token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async logout (req, res) {
    try {
      if (!req.headers.authorization) {
        logger.warn('No token provided');
        return res.status(400).json({ message: 'No token provided' });
      }
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        logger.warn('No token provided');
        return res.status(400).json({ message: 'No token provided' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await RedisClient.del(decoded.id.toString());
      if (result === 0) {
        logger.warn('No active session found for the user with the provided token');
        return res.status(200).json({ message: 'No active session found for the user with the provided token' });
      }
      res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid token');
        return res.status(400).json({ message: 'Invalid token' });
      } else if (error instanceof jwt.TokenExpiredError) {
        logger.warn('Token expired');
        return res.status(400).json({ message: 'Token expired' });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

export default authController;