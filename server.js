import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('🔍 Environment Variables Check:');
console.log('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? '✅ Loaded' : '❌ Missing');
console.log('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? '✅ Loaded' : '❌ Missing');

// Now import API handlers after env vars are loaded
import generateHandler from './api/generate.js';
import healthHandler from './api/health.js';
import userHistoryHandler from './api/user-history.js';
import proxyImageHandler from './api/proxy-image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Convert Vercel handlers to Express middleware
const wrapHandler = (handler) => (req, res) => {
  handler(req, res);
};

// Routes
app.get('/api/health', wrapHandler(healthHandler));
app.post('/api/generate', wrapHandler(generateHandler));
app.get('/api/user-history', wrapHandler(userHistoryHandler));
app.get('/api/proxy-image', wrapHandler(proxyImageHandler));

app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
  console.log(`📍 Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/generate`);
  console.log(`   GET  /api/user-history`);
  console.log(`   GET  /api/proxy-image`);
});
