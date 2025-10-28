import userService from '../services/userService.js';
import { registerSchema } from '../validators/authValidator.js';
import { generateToken } from '../utils/jwt.js';
import { ZodError } from 'zod';

export const register = async (req, res) => {
  try {
    const { username, password } = registerSchema.parse(req.body);

    const user = await userService.createUser(username, password);

    const token = generateToken({ userId: user.id, username: user.username });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
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

    if (error.message === 'Username already exists') {
      return res.status(409).json({ error: error.message });
    }

    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
