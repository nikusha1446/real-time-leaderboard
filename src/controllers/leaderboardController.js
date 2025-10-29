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
