# AI Image Generator

A modern React application for generating AI images using Stable Diffusion XL (SDXL 3.5 Ultra) via Vercel serverless functions. The backend securely relays requests to an external AI image generation API.

> **API powered by [aiart-zroo.onrender.com](https://aiart-zroo.onrender.com/api-docs)**

## Features

- Text-to-image generation using Stable Diffusion XL (SDXL 3.5 Ultra)
- Choose from multiple style presets and aspect ratios
- Negative prompt support for better image control
- Modern, responsive UI with Tailwind CSS
- Real-time image generation with loading and error states
- Download and fullscreen view for generated images
- **Vercel serverless backend** handles CORS and proxies requests to the external API
- **Image generation API powered by [aiart-zroo.onrender.com](https://aiart-zroo.onrender.com/api-docs)**

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- (For local API dev) [Vercel CLI](https://vercel.com/docs/cli)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure environment variables:
   - Copy `env.example` to `.env` in the root directory
   - Modify the API URL if needed (default: `/api/generate`)

## Running the Application

### Option 1: Run Frontend and API Locally (Recommended)

**Start the frontend (Vite):**
```bash
npm run dev
```

**Start the API (Vercel serverless functions):**
```bash
vercel dev
```
- This will serve your `api/` endpoints at `/api/health` and `/api/generate`.

### Option 2: Deploy to Vercel
- Push your code to a GitHub/GitLab/Bitbucket repo and import it into [Vercel](https://vercel.com/).
- Vercel will automatically detect the `api/` directory and deploy your serverless functions.

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter a description of the image you want to generate (Prompt)
3. (Optional) Adjust the Negative Prompt, Style Preset, and Aspect Ratio
4. Click "Generate Image" and wait for the AI to create your image
5. View, download, or fullscreen the generated image

### Prompt Options
- **Prompt:** Main description for the image (required)
- **Negative Prompt:** What you want to avoid (default: see `src/config.js`)
- **Style Preset:** Choose from the presets listed in the UI (default: see `src/config.js`)
- **Aspect Ratio:** Choose from the aspect ratios listed in the UI (default: see `src/config.js`)

## API Endpoints (Serverless Functions)

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

- The React frontend collects user input and sends a POST request to `/api/generate` (handled by Vercel serverless function).
- The serverless function validates the input, applies defaults, and proxies the request to the external AI API (`https://aiart-zroo.onrender.com/api/generate`).
- **All image generation is powered by [aiart-zroo.onrender.com](https://aiart-zroo.onrender.com/api-docs).**
- The function relays the image URL or error message back to the frontend.
- The frontend displays the image, handles errors, and provides download/fullscreen options.

## Error Handling

- If required fields are missing, the function returns a 400 error.
- If the external API fails, the function relays the error and status code.
- The frontend displays user-friendly error messages and loading states.

## Project Structure

```
txt-img-sdxl/
├── src/                # React frontend
│   ├── App.jsx         # Main React component (UI, API calls)
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles
├── api/                # Vercel serverless functions (backend)
│   ├── health.js       # Health check endpoint
│   └── generate.js     # Image generation endpoint
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Vercel serverless functions, node-fetch
- **API:** External AI image generation service (proxied)

## Troubleshooting

- If you encounter CORS issues, make sure you are using the Vercel serverless API endpoints
- Check the browser console for any error messages
- Ensure both frontend and API are running simultaneously (with `npm run dev` and `vercel dev`)
- If the external AI API is down, check the function logs for error details

## Configuration

### Centralized Frontend Configuration

All frontend API endpoints and default generation parameters are now sourced from [`src/config.js`](src/config.js). This file is the single source of truth for:

- The API base URL (`API_BASE_URL`)
- Default generation parameters (`DEFAULT_PARAMS`)

If you want to change the default negative prompt, style preset, aspect ratio, output format, or seed, simply edit the values in `src/config.js`. To point the frontend to a different backend API, update `API_BASE_URL` in the same file.

**Note:** There are no longer any hardcoded API URLs or default generation values in `App.jsx`—all such settings are imported from `config.js`.

### Backend and Environment Variables
- `api/generate.js` - Serverless function configuration
- `env.example` - Example environment variables

You can customize the backend API URL and other environment variables by modifying these files as needed.
