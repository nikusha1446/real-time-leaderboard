import express from 'express';
import redisClient from './config/redis.js';
import authRoutes from './routes/authRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// health check
app.get('/health', (req, res) => {
  const redisStatus = redisClient.isReady() ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'OK',
    message: 'Real-time Leaderboard API is running',
    timestamp: new Date().toISOString(),
    redis: redisStatus,
  });
});

// redis health check
app.get('/health/redis', async (req, res) => {
  try {
    if (!redisClient.isReady()) {
      return res.status(503).json({
        error: 'Redis not connected',
      });
    }

    const client = redisClient.getClient();
    await client.ping();

    res.json({
      status: 'OK',
    });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);

// initialize server
async function startServer() {
  try {
    await redisClient.connect();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// graceful shutdown
process.on('SIGINT', async () => {
  await redisClient.disconnect();
  process.exit(0);
});

// Start the server
startServer();
