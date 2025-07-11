import { Readable } from 'node:stream';

export default async function handler(req, res) {
  // 1) Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  // 2) Only allow GET from here onward
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET,OPTIONS');
    return res.status(405).end('Method Not Allowed');
  }

  // 3) Validate query
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    // 4) Fetch the image server‑side
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Failed to fetch image' });
    }

    // 5) Set CORS & content headers on the image response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'image/png'
    );
    res.setHeader('Cache-Control', 'public, max-age=3600');

    // 6) Convert web ReadableStream to Node stream
    const nodeStream = Readable.fromWeb(response.body);
    nodeStream.pipe(res);
  } catch (e) {
    console.error('Proxy error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
}
