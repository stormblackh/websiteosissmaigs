/* GET /api/events — semua event, urut sesuai papan.
   ----------------------------------------------------------------------------
   Strategi 2 lapis (situs gak pernah mati):
   1. Coba database (MongoDB Atlas). Kalau ada isinya → source: "db".
   2. Kalau DB belum diset / belum di-seed / lagi down → source: "fallback",
      datanya dari data/events.js (salinan konten HTML).

   Cek status: buka /api/events di browser — liat field "source".
   "db"      = udah nyambung database ✅
   "fallback"= masih pake data file (wajar kalau MONGODB_URI belum di-set). */

const dbConnect = require('../lib/db');
const Event = require('../models/Event');
const fallback = require('../data/events');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Cuma GET yang didukung' });
  }

  try {
    await dbConnect();
    const events = await Event.find({}).sort({ urutan: 1 }).lean();
    if (events.length) {
      // edge cache 60 dtk: pengunjung berikutnya di-serve dari CDN terdekat,
      // gak nunggu function jalan + query DB lagi (data event jarang berubah)
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res.status(200).json({ source: 'db', jumlah: events.length, events });
    }
    // DB konek tapi kosong (belum di-seed) → fallback dulu
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({
      source: 'fallback', jumlah: fallback.length, events: fallback,
      catatan: 'Database konek tapi masih kosong — jalanin `npm run seed` sekali.'
    });
  } catch (err) {
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({
      source: 'fallback', jumlah: fallback.length, events: fallback,
      catatan: 'Database belum konek — tampilin data file. Set MONGODB_URI + `npm run seed` biar pindah ke database.',
      debug: String(err.message || err).slice(0, 200)
    });
  }
};
