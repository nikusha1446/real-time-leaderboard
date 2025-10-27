import redisClient from '../config/redis.js';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

class UserService {
  constructor() {
    this.userKeyPrefix = 'user:';
    this.usernameIndexPrefix = 'username:';
  }

  async createUser(username, password) {
    const client = redisClient.getClient();

    const usernameKey = `${this.usernameIndexPrefix}${username.toLowerCase()}`;
    const existingUserId = await client.get(usernameKey);

    if (existingUserId) {
      throw new Error('Username already exists');
    }

    const userId = nanoid();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: userId,
      username: username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const userKey = `${this.userKeyPrefix}${userId}`;

    await client.hSet(userKey, user);
    await client.set(usernameKey, userId);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByUsername(username) {
    const client = redisClient.getClient();
    const usernameKey = `${this.usernameIndexPrefix}${username.toLowerCase()}`;
    const userId = await client.get(usernameKey);

    if (!userId) {
      return null;
    }

    const userKey = `${this.userKeyPrefix}${userId}`;
    const user = await client.hGetAll(userKey);

    if (!user || Object.keys(user).length === 0) {
      return null;
    }

    return user;
  }

  async getUserById(userId) {
    const client = redisClient.getClient();
    const userKey = `${this.userKeyPrefix}${userId}`;
    const user = await client.hGetAll(userKey);

    if (!user || Object.keys(user).length === 0) {
      return null;
    }

    return user;
  }

  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

const userService = new UserService();
export default userService;
