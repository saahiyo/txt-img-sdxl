import fs from 'fs';
import path from 'path';

const ERRORS_PATH = path.resolve(process.cwd(), 'api/errors.json');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const data = fs.existsSync(ERRORS_PATH) ? JSON.parse(fs.readFileSync(ERRORS_PATH, 'utf8')) : [];
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to read errors log' });
  }
} 