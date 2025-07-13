import fetch from 'node-fetch';
import { Redis } from '@upstash/redis';

const EXTERNAL_AI_API_URL = 'https://aiart-zroo.onrender.com/api/generate';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Helper function to get user IP address
function getUserIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         'unknown';
}

// Helper function to detect device type from user agent
function getDeviceType(userAgent) {
  if (!userAgent) return 'unknown';
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    return 'mobile';
  } else if (ua.includes('tablet')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

export default async function handler(req, res) {
  // --- GENERATE ENDPOINT ---
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { video_description, negative_prompt, style_preset, aspect_ratio, output_format, seed } = req.body;

    if (!video_description) {
      res.status(400).json({ error: 'Missing required field: video_description' });
      return;
    }

    // Capture user information
    const userIP = getUserIP(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    const deviceType = getDeviceType(userAgent);

    const payload = {
      video_description,
      negative_prompt: negative_prompt || "blurry, low quality, distorted faces, poor lighting, extra limbs, deformed, ugly, bad anatomy",
      style_preset: style_preset || "neon-punk",
      aspect_ratio: aspect_ratio || "16:9",
      output_format: output_format || "png",
      seed: seed || 0
    };

    const response = await fetch(EXTERNAL_AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Log error to Upstash Redis
      await redis.lpush('generation_errors', JSON.stringify({
        timestamp,
        status: response.status,
        error: errorData.detail || `External API error: ${response.status}`,
        payload,
        userIP,
        userAgent,
        deviceType
      }));
      res.status(response.status).json({
        error: errorData.detail || `External API error: ${response.status}`,
        status: response.status
      });
      return;
    }

    const result = await response.json();
    // Log generation to Upstash Redis
    await redis.lpush('generations', JSON.stringify({
      timestamp,
      prompt: video_description,
      negative_prompt: payload.negative_prompt,
      style_preset: payload.style_preset,
      aspect_ratio: payload.aspect_ratio,
      output_format: payload.output_format,
      seed: payload.seed,
      image_url: result.direct_url || result.image_url || null,
      success: result.success || false,
      userIP,
      userAgent,
      deviceType
    }));
    res.status(200).json(result);
  } catch (error) {
    // Log error to Upstash Redis
    await redis.lpush('generation_errors', JSON.stringify({
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 500,
      error: error.message,
      payload: req.body,
      userIP: getUserIP(req),
      userAgent: req.headers['user-agent'] || 'unknown',
      deviceType: getDeviceType(req.headers['user-agent'])
    }));
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
} 