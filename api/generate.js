import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const EXTERNAL_AI_API_URL = 'https://aiart-zroo.onrender.com/api/generate';
const GENERATIONS_PATH = path.resolve(process.cwd(), 'api/generations.json');
const ERRORS_PATH = path.resolve(process.cwd(), 'api/errors.json');

function logToFile(filePath, entry) {
  let arr = [];
  try {
    if (fs.existsSync(filePath)) {
      arr = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) { arr = []; }
  arr.unshift(entry);
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

    const timestamp = new Date().toISOString();

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Log error
      logToFile(ERRORS_PATH, {
        timestamp,
        status: response.status,
        error: errorData.detail || `External API error: ${response.status}`,
        payload
      });
      res.status(response.status).json({
        error: errorData.detail || `External API error: ${response.status}`,
        status: response.status
      });
      return;
    }

    const result = await response.json();
    // Log generation
    logToFile(GENERATIONS_PATH, {
      timestamp,
      prompt: video_description,
      negative_prompt: payload.negative_prompt,
      style_preset: payload.style_preset,
      aspect_ratio: payload.aspect_ratio,
      output_format: payload.output_format,
      seed: payload.seed,
      image_url: result.direct_url || result.image_url || null,
      success: result.success || false
    });
    res.status(200).json(result);
  } catch (error) {
    // Log error
    logToFile(ERRORS_PATH, {
      timestamp: new Date().toISOString(),
      status: 500,
      error: error.message,
      payload: req.body
    });
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
} 