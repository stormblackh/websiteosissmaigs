/* GET /api/events/<slug> — satu event.
   Contoh: /api/events/talent → JSON event talent.
   Sama kayak api/events.js: DB dulu, fallback data/events.js kalau DB belum ada. */

const dbConnect = require('../../lib/db');
const Event = require('../../models/Event');
const fallback = require('../../data/events');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Cuma GET yang didukung' });
  }

  const { slug } = req.query;
  if (!slug) {
    return res.status(400).json({ ok: false, error: 'Slug wajib — contoh: /api/events/talent' });
  }

  try {
    await dbConnect();
    const ev = await Event.findOne({ slug }).lean();
    if (ev) {
      // edge cache 60 dtk — sama kayak /api/events
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res.status(200).json({ source: 'db', event: ev });
    }
  } catch (err) {
    // DB gak ada / belum diset → lanjut ke fallback di bawah (gak usah crash)
  }

  const fb = fallback.find(e => e.slug === String(slug));
  if (fb) {
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ source: 'fallback', event: fb });
  }

  return res.status(404).json({ ok: false, error: `Event "${slug}" gak ketemu` });
};
