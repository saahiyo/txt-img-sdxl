// Configuration for the application
export const config = {
  // API Configuration
  API_BASE_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : import.meta.env.API_URL,

  // Default generation parameters
  DEFAULT_PARAMS: {
    negative_prompt: "blurry, low quality, distorted, poor lighting, bad anatomy",
    style_preset: "cinematic",
    aspect_ratio: "16:9",
    output_format: "png",
    seed: 0
  }
};