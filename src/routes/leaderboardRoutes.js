import express from 'express';
import {
  getGlobalLeaderboard,
  submitScore,
} from '../controllers/leaderboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/scores', authenticate, submitScore);
router.get('/', getGlobalLeaderboard);

export default router;
