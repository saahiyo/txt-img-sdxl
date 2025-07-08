import fetch from 'node-fetch';

const EXTERNAL_AI_API_URL = 'https://aiart-zroo.onrender.com/api/generate';

export default async function handler(req, res) {
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      res.status(response.status).json({
        error: errorData.detail || `External API error: ${response.status}`,
        status: response.status
      });
      return;
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
} 