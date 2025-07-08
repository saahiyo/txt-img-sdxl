export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  res.status(200).json({
    API_BASE_URL: process.env.VITE_API_URL || 'http://localhost:3000',
    DEFAULT_PARAMS: {
      negative_prompt: "blurry, low quality, distorted faces, poor lighting, extra limbs, deformed, ugly, bad anatomy",
      style_preset: "neon-punk",
      aspect_ratio: "16:9",
      output_format: "png",
      seed: 0
    }
  });
} 