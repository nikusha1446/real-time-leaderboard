import { z } from 'zod';

export const submitScoreSchema = z.object({
  game: z
    .string()
    .min(1, 'Game name is required')
    .max(50, 'Game name must be at most 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Game name can only contain letters, numbers, hyphens, and underscores'
    ),
  score: z
    .number()
    .int('Score must be an integer')
    .min(0, 'Score must be positive'),
});
