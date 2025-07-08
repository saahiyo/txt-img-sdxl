import fs from 'fs';
import path from 'path';

const GENERATIONS_PATH = path.resolve(process.cwd(), 'api/generations.json');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const data = fs.existsSync(GENERATIONS_PATH) ? JSON.parse(fs.readFileSync(GENERATIONS_PATH, 'utf8')) : [];
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to read generations log' });
  }
} 