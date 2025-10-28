import { verifyToken } from '../utils/jwt.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided. Please login',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (error) {
    if (error.message === 'Invalid token') {
      return res.status(401).json({
        error: 'Invalid or expired token. Please login again',
      });
    }

    console.error('Authentication error:', error);
    res.status(401).json({
      error: 'Authentication failed',
    });
  }
};
