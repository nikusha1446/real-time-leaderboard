import express from 'express';
import { submitScore } from '../controllers/leaderboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/scores', authenticate, submitScore);

export default router;
