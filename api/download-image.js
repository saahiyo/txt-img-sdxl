export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    res.status(400).send('Missing url');
    return;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(500).send('Failed to fetch image');
      return;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.setHeader('Content-Disposition', 'attachment; filename="downloaded-image"');
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Error fetching image');
  }
} 