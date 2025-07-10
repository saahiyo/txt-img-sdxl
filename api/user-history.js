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
    // Debug: log env and Redis connection (do not log secrets)
    console.log('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL);
    // Get the last 20 generations from Redis
    const items = await redis.lrange('generations', 0, 19);
    console.log('Raw Redis generations:', items);
    // Parse each item from JSON string to object
    const history = items;
    res.status(200).json({ history });
  } catch (e) {
    console.error('Error in user-history:', e);
    res.status(200).json({ history: [] });
  }
} 