import { Redis } from '@upstash/redis';

// Initialize Redis lazily to ensure environment variables are loaded
let redis = null;
function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    // Get the last 20 generations from Redis
    const items = await getRedis().lrange('generations', 0, 19);
    // Format: ensure each item is a well-structured object with user information
    const history = items.map(item => {
      if (typeof item === 'string') {
        try {
          const parsed = JSON.parse(item);
          // Ensure all user information fields are present (for backward compatibility)
          return {
            ...parsed,
            userIP: parsed.userIP || 'unknown',
            userAgent: parsed.userAgent || 'unknown',
            deviceType: parsed.deviceType || 'unknown'
          };
        } catch {
          return null;
        }
      }
      if (typeof item === 'object' && item !== null) {
        // Ensure all user information fields are present (for backward compatibility)
        return {
          ...item,
          userIP: item.userIP || 'unknown',
          userAgent: item.userAgent || 'unknown',
          deviceType: item.deviceType || 'unknown'
        };
      }
      return null;
    }).filter(Boolean);
    res.status(200).json({ history });
  } catch (e) {
    res.status(200).json({ history: [] });
  }
} 