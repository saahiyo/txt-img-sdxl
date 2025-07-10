import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    // Get the last 20 generations from Redis
    const items = await redis.lrange('generations', 0, 19);
    // Parse each item from JSON string to object
    const history = items.map(item => {
      try { return JSON.parse(item); } catch { return null; }
    }).filter(Boolean);
    res.status(200).json({ history });
  } catch (e) {
    res.status(200).json({ history: [] });
  }
} 