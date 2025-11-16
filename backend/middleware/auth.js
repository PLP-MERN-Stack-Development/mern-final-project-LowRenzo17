import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

import User from '../models/User.js';

export const adminMiddleware = async (req, res, next) => {
  try {
    // authMiddleware should have already set req.userId
    if (!req.userId) return res.status(401).json({ error: 'No token provided' });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role !== 'admin') return res.status(403).json({ error: 'Forbidden: admin only' });
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
