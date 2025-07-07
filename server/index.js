import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

// Configuration
const EXTERNAL_AI_API_URL = 'https://aiart-zroo.onrender.com/api/generate';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite dev server URLs
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Proxy endpoint for image generation
app.post('/api/generate', async (req, res) => {
  try {
    const { video_description, negative_prompt, style_preset, aspect_ratio, output_format, seed } = req.body;

    // Validate required fields
    if (!video_description) {
      return res.status(400).json({ 
        error: 'Missing required field: video_description' 
      });
    }

    // Prepare the payload for the external API
    const payload = {
      video_description,
      negative_prompt: negative_prompt || "blurry, low quality, distorted faces, poor lighting, extra limbs, deformed, ugly, bad anatomy",
      style_preset: style_preset || "neon-punk",
      aspect_ratio: aspect_ratio || "16:9",
      output_format: output_format || "png",
      seed: seed || 0
    };

    console.log('Proxying request to external API with payload:', payload);

    // Make request to the external AI API
    const response = await fetch(EXTERNAL_AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('External API error:', response.status, errorData);
      return res.status(response.status).json({
        error: errorData.detail || `External API error: ${response.status}`,
        status: response.status
      });
    }

    const result = await response.json();
    console.log('Successfully received response from external API');
    
    // Return the result to the frontend
    res.json(result);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/generate`);
}); 