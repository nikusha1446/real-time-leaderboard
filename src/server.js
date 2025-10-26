import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Real-time Leaderboard API is running',
    timestamp: new Date().toISOString(),
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
