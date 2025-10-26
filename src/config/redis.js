import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          reconnectStrategy: false,
        },
        password: process.env.REDIS_PASSWORD || undefined,
      });

      this.client.on('ready', () => {
        console.log('Redis connected');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        console.error('Redis error:', err.message);
        this.isConnected = false;
      });

      await this.client.connect();
      await this.client.ping();

      return this.client;
    } catch (error) {
      console.error('Failed to connect to Redis:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  getClient() {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }
    return this.client;
  }

  isReady() {
    return this.isConnected;
  }
}

const redisClient = new RedisClient();

export default redisClient;
