# AI Image Generator

A modern React application for generating AI images using Stable Diffusion XL (SDXL 3.5 Ultra) via Vercel serverless functions. The backend securely relays requests to an external AI image generation API.

> **API powered by [aiart-zroo.onrender.com](https://aiart-zroo.onrender.com/api-docs)**

## Preview 

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8521741e-5ef3-4020-9d8e-7ee4a7638cff" />

## Features.

- Text-to-image generation using Stable Diffusion XL (SDXL 3.5 Ultra)
- Choose from multiple style presets and aspect ratios
- Negative prompt support for better image control
- Modern, responsive UI with Tailwind CSS
- Real-time image generation with loading and error states
- Download and fullscreen view for generated images
- **Vercel serverless backend** handles CORS and proxies requests to the external API
- **Image generation API powered by [aiart-zroo.onrender.com](https://aiart-zroo.onrender.com/api-docs)**
- **Images are stored in Vercel Blob storage for secure, scalable hosting**

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

### Option 1: Local Development with Custom Express Server (Recommended for Development)

**Start both frontend and API locally:**
```bash
npm run dev:local
```

This will start:
- Frontend (Vite) on `http://localhost:5173/`
- API (Express server) on `http://localhost:3000/`

**Or start them separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - API
npm run dev:api
```

### Option 2: Local Development with Vercel CLI (Deployment Testing)

**Start both frontend and API with Vercel:**
```bash
npm run dev:vercel
```

This requires Vercel CLI authentication but tests the exact deployment environment.

### Option 3: Deploy to Vercel

**For Production Deployment:**
1. Push your code to GitHub/GitLab/Bitbucket
2. Import the repository into [Vercel](https://vercel.com/)
3. Add your environment variables in Vercel dashboard:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Vercel will automatically detect the `api/` directory and deploy serverless functions

**The serverless functions will work on Vercel because:**
- We use lazy initialization for Redis (environment variables load properly)
- The `vercel.json` is configured for proper routing
- API functions are in the correct `/api` directory structure

## Usage

1. Open your browser and navigate to `http://localhost:5173/` (frontend)
2. Enter a description of the image you want to generate (Prompt)
3. (Optional) Adjust the Negative Prompt, Style Preset, and Aspect Ratio
4. Click "Generate Image" and wait for the AI to create your image
5. View, download, or fullscreen the generated image

**Note:** The API runs on `http://localhost:3000/` but you interact with the frontend at `http://localhost:5173/`

### Prompt Options
- **Prompt:** Main description for the image (required)
- **Negative Prompt:** What you want to avoid (default: see `src/config.js`)
- **Style Preset:** Choose from the presets listed in the UI (default: see `src/config.js`)
- **Aspect Ratio:** Choose from the aspect ratios listed in the UI (default: see `src/config.js`)

## API Endpoints (Serverless Functions)

- `GET /api/health` - Health check endpoint
- `POST /api/generate` - Image generation endpoint
- `GET /api/user-history` - Returns the last 20 image generations (from Upstash Redis)

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

### `/api/user-history` Response
Returns the last 20 generations as an array of objects:
```json
{
  "history": [
    {
      "timestamp": "2025-07-10T18:12:19.351Z",
      "prompt": "a magic box",
      "negative_prompt": "blurry, low quality, ...",
      "style_preset": "isometric",
      "aspect_ratio": "1:1",
      "output_format": "png",
      "seed": 0,
      "image_url": "https://...", // Now a Vercel Blob URL
      "success": true
    },
    ...
  ]
}
```

## User History & Upstash Redis

This project uses [Upstash Redis](https://upstash.com/) to store and retrieve image generation history and errors. This allows the backend to work on Vercel (which does not support file writes).

### Environment Variables
Add these to your Vercel project or `.env` file:

```
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
BLOB_STORE_ID=your-vercel-blob-store-id
BLOB_READ_WRITE_TOKEN=your-vercel-blob-read-write-token
```

### How History Works
- Every time an image is generated, the details are pushed to a Redis list (`generations`).
- The `/api/user-history` endpoint fetches the last 20 generations for display in the frontend or for API use.
- Errors are also logged to Redis (`generation_errors` list).

### Using History in the Frontend
Fetch `/api/user-history` and use the `history` array to display recent generations.

Example fetch:
```js
const res = await fetch('/api/user-history');
const data = await res.json();
console.log(data.history); // Array of generation objects
```

## Vercel Blob Storage for Generated Images

This project uses [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) to store all generated images securely and scalably. When an image is generated:

- The backend downloads the image from the external API.
- It uploads the image to your Vercel Blob store using the credentials in your `.env`.
- The image is saved with a filename like `diffusion-gen-TIMESTAMP.png`.
- The resulting Blob URL is stored in Redis and returned to the frontend as `image_url` and `direct_url`.
- You can view and manage your blobs in the [Vercel dashboard](https://vercel.com/storage/blob).

**Required Environment Variables:**
- `BLOB_STORE_ID` — Your Vercel Blob store ID (see Vercel dashboard)
- `BLOB_READ_WRITE_TOKEN` — Your Vercel Blob read/write token

**You do NOT need to reference these variables in your frontend code.** The backend/serverless function will use them automatically via the `@vercel/blob` SDK.

**Example Blob URL:**
```
https://<your-store-id>.public.blob.vercel-storage.com/diffusion-gen-1718031234567.png
```

## How It Works

- The React frontend collects user input and sends a POST request to `/api/generate` (handled by Vercel serverless function).
- The serverless function validates the input, applies defaults, and proxies the request to the external AI API (`https://aiart-zroo.onrender.com/api/generate`).
- The backend downloads the generated image, uploads it to Vercel Blob, and returns the Blob URL.
- The function relays the image URL or error message back to the frontend.
- The frontend displays the image, handles errors, and provides download/fullscreen options.

## Error Handling

- If required fields are missing, the function returns a 400 error.
- If the external API fails, the function relays the error and status code.
- If the Blob upload fails, the function returns a 500 error.
- The frontend displays user-friendly error messages and loading states.

## Development Setup

This project supports two development approaches:

### 1. Express Server (Local Development)
- **File:** `server.js` - Custom Express server that wraps Vercel functions
- **Benefits:** Faster startup, easier debugging, works without Vercel CLI
- **Use:** `npm run dev:local`

### 2. Vercel CLI (Deployment Testing)
- **File:** `vercel.json` - Vercel configuration for serverless functions
- **Benefits:** Tests exact production environment
- **Use:** `npm run dev:vercel` (requires `vercel login`)

### Why Both?
- **Development:** Use Express server for speed and convenience
- **Pre-deployment:** Use Vercel CLI to test production environment
- **Production:** Deploy to Vercel using the serverless functions

## Project Structure

```
txt-img-sdxl/
├── src/                # React frontend
│   ├── App.jsx         # Main React component (UI, API calls)
│   ├── config.js       # API URLs and default parameters
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles
├── api/                # Vercel serverless functions (backend)
│   ├── health.js       # Health check endpoint
│   ├── generate.js     # Image generation endpoint
│   ├── user-history.js # User generation history
│   └── proxy-image.js  # Image proxy endpoint
├── public/             # Static assets
├── server.js           # Local Express server (development)
├── vercel.json         # Vercel deployment configuration
└── package.json        # Dependencies and scripts
```

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Vercel serverless functions, node-fetch, Upstash Redis (serverless data storage), Vercel Blob
- **API:** External AI image generation service (proxied)

## Troubleshooting

- If you encounter CORS issues, make sure you are using the Vercel serverless API endpoints
- Check the browser console for any error messages
- Ensure both frontend and API are running simultaneously (with `npm run dev` and `vercel dev`)
- If the external AI API is down, check the function logs for error details
- If image uploads fail, check your Blob credentials and Vercel dashboard

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
