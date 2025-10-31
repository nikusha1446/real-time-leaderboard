import express from 'express';
import {
  getGameLeaderboard,
  getGlobalLeaderboard,
  getUserGameRank,
  getUserRank,
  getUserScoreHistory,
  submitScore,
} from '../controllers/leaderboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/scores', authenticate, submitScore);
router.get('/', getGlobalLeaderboard);
router.get('/game/:game', getGameLeaderboard);
router.get('/rank', authenticate, getUserRank);
router.get('/rank/game/:game', authenticate, getUserGameRank);
router.get('/history', authenticate, getUserScoreHistory);

export default router;
