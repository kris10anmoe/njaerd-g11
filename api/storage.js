import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { key, prefix } = req.query;

    if (req.method === 'GET' && prefix) {
      const keys = await kv.keys(prefix + '*');
      const clean = keys.map(k => k.startsWith(prefix) ? k.slice(prefix.length) : k);
      return res.status(200).json({ keys: clean });
    }

    if (req.method === 'GET') {
      if (!key) return res.status(400).json({ error: 'key required' });
      const value = await kv.get(key);
      return res.status(200).json({ value: value ?? null });
    }

    if (req.method === 'PUT') {
      if (!key) return res.status(400).json({ error: 'key required' });
      const { value } = req.body;
      await kv.set(key, value);
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      if (!key) return res.status(400).json({ error: 'key required' });
      await kv.del(key);
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
