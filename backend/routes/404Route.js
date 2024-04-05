import { Router } from 'express';

const error404 = Router();

error404.get('*', (req, res) => {
  res.status(404).json({ message: 'Invalid route page not found' });
});

export default error404;