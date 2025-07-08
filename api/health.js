export default function handler(req, res) {
  const port = process.env.PORT || 3000;
  res.status(200).json({ status: 'OK', message: `Server is running on port ${port}` });
}