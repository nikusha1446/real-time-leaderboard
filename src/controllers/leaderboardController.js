import { ZodError } from 'zod';
import leaderboardService from '../services/leaderboardService.js';
import { submitScoreSchema } from '../validators/scoreValidator.js';

export const submitScore = async (req, res) => {
  try {
    const { game, score } = submitScoreSchema.parse(req.body);

    const result = await leaderboardService.submitScore(
      req.user.userId,
      req.user.username,
      game,
      score
    );

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    console.error('Submit score error:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
};

export const getGlobalLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Limit must be between 1 and 100',
      });
    }

    const leaderboard = await leaderboardService.getGlobalLeaderboard(limit);

    res.json({
      leaderboard,
      total: leaderboard.length,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};

export const getGameLeaderboard = async (req, res) => {
  try {
    const { game } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Limit must be between 1 and 100',
      });
    }

    const leaderboard = await leaderboardService.getGameLeaderboard(
      game,
      limit
    );

    res.json({
      game,
      leaderboard,
      total: leaderboard.length,
    });
  } catch (error) {
    console.error('Get game leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get game leaderboard' });
  }
};

export const getUserRank = async (req, res) => {
  try {
    const userId = req.user.userId;

    const rankData = await leaderboardService.getUserRank(userId);

    if (!rankData) {
      return res.status(404).json({
        error: 'User has no scores yet',
      });
    }

    res.json({
      userId,
      username: req.user.username,
      ...rankData,
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({ error: 'Failed to get user rank' });
  }
};

export const getUserGameRank = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { game } = req.params;

    const rankData = await leaderboardService.getUserGameRank(userId, game);

    if (!rankData) {
      return res.status(404).json({
        error: 'User has no scores for this game',
      });
    }

    res.json({
      userId,
      username: req.user.username,
      ...rankData,
    });
  } catch (error) {
    console.error('Get user game rank error:', error);
    res.status(500).json({ error: 'Failed to get user game rank' });
  }
};
