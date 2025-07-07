# AI Image Generator

A modern React application for generating AI images using Stable Diffusion XL (SDXL 3.5 Ultra) via an Express.js backend proxy. The backend securely relays requests to an external AI image generation API.

## Features

- Text-to-image generation using Stable Diffusion XL (SDXL 3.5 Ultra)
- Choose from multiple style presets and aspect ratios
- Negative prompt support for better image control
- Modern, responsive UI with Tailwind CSS
- Real-time image generation with loading and error states
- Download and fullscreen view for generated images
- Express.js backend handles CORS and proxies requests to the external API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure environment variables:
   - Copy `env.example` to `.env` in the root directory
   - Modify the API URL if needed (default: `http://localhost:3001`)

## Running the Application

### Option 1: Run Frontend and Backend Together (Recommended)
```bash
npm run dev:full
```
This will start both the Express server (port 3001) and the Vite development server (port 5173) concurrently.

### Option 2: Run Separately

**Start the Express server:**
```bash
npm run server
```
**In another terminal, start the frontend:**
```bash
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter a description of the image you want to generate (Prompt)
3. (Optional) Adjust the Negative Prompt, Style Preset, and Aspect Ratio
4. Click "Generate Image" and wait for the AI to create your image
5. View, download, or fullscreen the generated image

### Prompt Options
- **Prompt:** Main description for the image (required)
- **Negative Prompt:** What you want to avoid (default: `blurry, low quality, distorted, poor lighting, bad anatomy`)
- **Style Preset:** Choose from:
  - cinematic, photographic, anime, digital-art, comic-book, fantasy-art, analog-film, neon-punk, isometric, low-poly, origami, line-art, modeling-compound, pixel-art, tile-texture
- **Aspect Ratio:** Choose from:
  - 16:9, 1:1, 21:9, 2:3, 3:2, 4:5, 5:4, 9:16

## API Endpoints (Backend)

- `GET /api/health` - Health check endpoint
- `POST /api/generate` - Image generation endpoint

### `/api/generate` Payload
```
{
  "video_description": "A futuristic cityscape at sunset, neon lights reflecting on wet streets", // required
  "negative_prompt": "blurry, low quality, distorted, poor lighting, bad anatomy", // optional
  "style_preset": "cinematic", // optional
  "aspect_ratio": "16:9", // optional
  "output_format": "png", // optional
  "seed": 0 // optional
}
```

### Response
- On success: `{ success: true, direct_url: "..." }` (or `image_url`)
- On error: `{ error: "..." }`

## How It Works

- The React frontend collects user input and sends a POST request to `/api/generate` on the Express backend.
- The backend validates the input, applies defaults, and proxies the request to the external AI API (`https://aiart-zroo.onrender.com/api/generate`).
- The backend relays the image URL or error message back to the frontend.
- The frontend displays the image, handles errors, and provides download/fullscreen options.

## Error Handling

- If required fields are missing, the backend returns a 400 error.
- If the external API fails, the backend relays the error and status code.
- The frontend displays user-friendly error messages and loading states.

## Project Structure

```
txt-img-sdxl/
├── src/
│   ├── App.jsx          # Main React component (UI, API calls)
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── server/
│   └── index.js         # Express server (API proxy)
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Express.js, CORS, node-fetch
- **API:** External AI image generation service (proxied)

## Troubleshooting

- If you encounter CORS issues, make sure the Express server is running on port 3001
- Check the browser console for any error messages
- Ensure both frontend and backend are running simultaneously
- If the external AI API is down, check the server logs for error details

## Configuration

The application uses configuration files to manage API endpoints and default parameters:

- `src/config.js` - Frontend configuration
- `server/index.js` - Server configuration
- `env.example` - Example environment variables

You can customize the API URL, port, and default generation parameters by modifying these files.
