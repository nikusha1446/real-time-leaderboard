import redisClient from '../config/redis.js';

class LeaderboardService {
  constructor() {
    this.globalLeaderboardKey = 'leaderboard:global';
    this.gameLeaderboardPrefix = 'leaderboard:game:';
    this.userScoresPrefix = 'user:scores:';
  }

  async submitScore(userId, username, game, score) {
    const client = redisClient.getClient();

    await client.zAdd(this.globalLeaderboardKey, {
      score: score,
      value: userId,
    });

    const gameKey = `${this.gameLeaderboardPrefix}${game}`;
    await client.zAdd(gameKey, {
      score: score,
      value: userId,
    });

    const userScoresKey = `${this.userScoresPrefix}${userId}`;
    const scoreData = {
      game,
      score,
      username,
      timestamp: new Date().toISOString(),
    };

    await client.lPush(userScoresKey, JSON.stringify(scoreData));

    return {
      message: 'Score submitted successfully',
      game,
      score,
      username,
    };
  }

  async getGlobalLeaderboard(limit = 10) {
    const client = redisClient.getClient();

    const results = await client.zRangeWithScores(
      this.globalLeaderboardKey,
      0,
      limit - 1,
      { REV: true }
    );

    return results.map((result, index) => ({
      rank: index + 1,
      userId: result.value,
      score: result.score,
    }));
  }
}

const leaderboardService = new LeaderboardService();
export default leaderboardService;
