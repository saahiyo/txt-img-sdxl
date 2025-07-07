// Configuration for the application
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // External AI API URL (used by the Express server)
  EXTERNAL_AI_API_URL: 'https://aiart-zroo.onrender.com/api/generate',
  
  // Default generation parameters
  DEFAULT_PARAMS: {
    negative_prompt: "blurry, low quality, distorted faces, poor lighting, extra limbs, deformed, ugly, bad anatomy",
    style_preset: "neon-punk",
    aspect_ratio: "16:9",
    output_format: "png",
    seed: 0
  }
}; 