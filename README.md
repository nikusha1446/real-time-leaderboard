# Real-Time Leaderboard API

A high-performance real-time leaderboard system built with Node.js, Express, and Redis. This API allows users to submit scores, view rankings, and track their performance across multiple games.

## Features

- 🔐 **User Authentication** - JWT-based authentication system
- 🏆 **Global Leaderboard** - Track top players across all games
- 🎮 **Game-Specific Leaderboards** - Individual rankings for each game
- 📊 **Real-Time Rankings** - Instant rank updates using Redis sorted sets
- 📈 **Score History** - Track user performance over time

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Redis** - In-memory data store for leaderboards
- **JWT** - Authentication tokens
- **Zod** - Schema validation
- **bcryptjs** - Password hashing
- **nanoid** - Unique ID generation

## Prerequisites

- Node.js (v18 or higher)
- Redis (v6 or higher)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/nikusha1446/real-time-leaderboard.git
cd real-time-leaderboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 4. Start Redis

### 5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

---

## Authentication Endpoints

### Register a New User

**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "username": "player1",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "V1StGXR8_Z5jdHi6B-myT",
    "username": "player1",
    "createdAt": "2025-10-28T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login

**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "username": "player1",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "V1StGXR8_Z5jdHi6B-myT",
    "username": "player1",
    "createdAt": "2025-10-28T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Leaderboard Endpoints

### Submit a Score

**POST** `/leaderboard/scores` 🔒

Submit a score for a specific game. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "game": "snake",
  "score": 5000
}
```

**Response (201):**
```json
{
  "message": "Score submitted successfully",
  "game": "snake",
  "score": 5000,
  "username": "player1"
}
```

---

### Get Global Leaderboard

**GET** `/leaderboard/`

Retrieve the top players across all games.

**Query Parameters:**
- `limit` (optional): Number of results (1-100, default: 10)

**Example:**
```bash
GET /leaderboard/?limit=5
```

**Response (200):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "V1StGXR8_Z5jdHi6B-myT",
      "score": 5000
    },
    {
      "rank": 2,
      "userId": "abc123def456",
      "score": 4500
    },
    {
      "rank": 3,
      "userId": "xyz789uvw012",
      "score": 3000
    }
  ],
  "total": 3
}
```

---

### Get Game-Specific Leaderboard

**GET** `/leaderboard/game/:game`

Retrieve the top players for a specific game.

**Path Parameters:**
- `game`: Game name (e.g., "snake", "tetris")

**Query Parameters:**
- `limit` (optional): Number of results (1-100, default: 10)

**Example:**
```bash
GET /leaderboard/game/snake?limit=10
```

**Response (200):**
```json
{
  "game": "snake",
  "leaderboard": [
    {
      "rank": 1,
      "userId": "V1StGXR8_Z5jdHi6B-myT",
      "score": 5000
    },
    {
      "rank": 2,
      "userId": "abc123def456",
      "score": 3500
    }
  ],
  "total": 2
}
```

---

### Get User's Global Rank

**GET** `/leaderboard/rank` 🔒

Get the authenticated user's rank in the global leaderboard. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "userId": "V1StGXR8_Z5jdHi6B-myT",
  "username": "player1",
  "rank": 1,
  "score": 5000
}
```

---

### Get User's Game Rank

**GET** `/leaderboard/rank/game/:game` 🔒

Get the authenticated user's rank for a specific game. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `game`: Game name

**Example:**
```bash
GET /leaderboard/rank/game/snake
```

**Response (200):**
```json
{
  "userId": "V1StGXR8_Z5jdHi6B-myT",
  "username": "player1",
  "rank": 1,
  "score": 5000,
  "game": "snake"
}
```

---

### Get User's Score History

**GET** `/leaderboard/history` 🔒

Get the authenticated user's score submission history. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of results (1-100, default: 10)

**Example:**
```bash
GET /leaderboard/history?limit=5
```

**Response (200):**
```json
{
  "userId": "V1StGXR8_Z5jdHi6B-myT",
  "username": "player1",
  "history": [
    {
      "game": "snake",
      "score": 5000,
      "username": "player1",
      "timestamp": "2025-10-28T14:35:20.123Z"
    },
    {
      "game": "tetris",
      "score": 3500,
      "username": "player1",
      "timestamp": "2025-10-28T14:30:15.456Z"
    }
  ],
  "total": 2
}
```

**Note:** History is returned in chronological order (most recent first).

---

## Health Check Endpoints

### API Health Check

**GET** `/health`

Check if the API is running and Redis connection status.

**Response (200):**
```json
{
  "status": "OK",
  "message": "Real-time Leaderboard API is running",
  "timestamp": "2025-10-28T12:00:00.000Z",
  "redis": "connected"
}
```

---

### Redis Health Check

**GET** `/health/redis`

Redis connection health check.

**Response (200):**
```json
{
  "status": "OK"
}
```

---

## License

ISC

---

**Built with ❤️ using Node.js, Express, and Redis**
