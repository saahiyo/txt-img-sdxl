import fs from 'fs';
import path from 'path';

const GENERATIONS_PATH = path.resolve(process.cwd(), 'api/generations.json');
const ERRORS_PATH = path.resolve(process.cwd(), 'api/errors.json');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const generations = fs.existsSync(GENERATIONS_PATH) ? JSON.parse(fs.readFileSync(GENERATIONS_PATH, 'utf8')) : [];
  const errors = fs.existsSync(ERRORS_PATH) ? JSON.parse(fs.readFileSync(ERRORS_PATH, 'utf8')) : [];
  res.status(200).json({
    totalGenerations: generations.length,
    totalErrors: errors.length,
    lastGeneration: generations[0] || null,
    lastError: errors[0] || null
  });
} 