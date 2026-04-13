import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { key, prefix } = req.query;

    if (req.method === 'GET' && prefix) {
      const keys = await kv.keys(prefix + '*');
      return res.status(200).json({ keys });
    }

    if (req.method === 'GET') {
      if (!key) return res.status(400).json({ error: 'key required' });
      const raw = await kv.get(key);
      // @vercel/kv auto-parses JSON — always return as string so client can JSON.parse consistently
      const value = raw == null ? null : (typeof raw === 'string' ? raw : JSON.stringify(raw));
      return res.status(200).json({ value });
    }

    if (req.method === 'PUT') {
      if (!key) return res.status(400).json({ error: 'key required' });
      const { value } = req.body;
      // Store as string to prevent @vercel/kv from double-parsing on retrieval
      const toStore = typeof value === 'string' ? value : JSON.stringify(value);
      await kv.set(key, toStore);
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
