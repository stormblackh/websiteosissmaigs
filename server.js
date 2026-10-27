/* ============================================================
   Orvèlion — server.js (Node.js + Express)
   ----------------------------------------------------------------------------
   SEMUA halaman & API dirender/ditangani dari sini — gak ada file .html
   statis lagi. Arsitektur:

     browser → Vercel edge
                 ├─ aset (style.css, script.js, Img/*) → CDN statis
                 └─ sisanya (rewrite vercel.json) → /api/index → Express ini
                                                          │
                     GET /            → views/home.js    ─┐
                     GET /event       → views/board.js    │ dirender dari
                     GET /event/<slug>→ views/detail.js   │ data/events.js
                     GET /aboutus    → views/about.js    ─┘ (DB dulu, file fallback)
                     GET /api/events[/<slug>] → JSON (DB dulu, file fallback)

   Strategi 2 lapis (situs gak pernah mati) — SAMA buat halaman & API:
     1. coba MongoDB Atlas (kalau MONGODB_URI diset + udah di-seed)
     2. gagal/empty → data/events.js (file) — jadi halaman & API gak pernah
        selisih konten, dan situs tetap jalan walau database mati.

   Jalanin lokal : npm start  →  http://localhost:3000
   Deploy Vercel : entry point = api/index.js (nge-require file ini).
   ============================================================ */

const express = require('express');
const path = require('path');

const dbConnect = require('./lib/db');
const Event = require('./models/Event');
const fallbackData = require('./data/events');

const layout = require('./views/layout');
const renderHome = require('./views/home');
const renderBoard = require('./views/board');
const renderAbout = require('./views/about');
const renderDetail = require('./views/detail');

const app = express();
app.disable('x-powered-by');
/* rute legacy ( /Event, /AboutUs ) HARUS beda dari rute asli ( /event,
   /aboutus ) — default Express case-insensitive bikin /Event nyangkut ke
   redirect-nya sendiri. Semua rute internal memang lowercase konsisten. */
app.set('case sensitive routing', true);

/* header cache — sama persis dengan kebijakan lama (vercel.json):
   halaman harus segar, aset boleh nempel di cache */
const PAGE_CACHE = 'public, max-age=0, must-revalidate';
const API_CACHE = 'public, s-maxage=60, stale-while-revalidate=300';

/* ---------------- data: DB dulu → fallback file ---------------- */

const fallbackSorted = () =>
  [...fallbackData].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));

/* semua event, urut papan — dipakai render /event & API /api/events */
async function loadEvents() {
  try {
    await dbConnect();
    const events = await Event.find({}).sort({ urutan: 1 }).lean();
    if (events.length) return { source: 'db', events };
    return {
      source: 'fallback', events: fallbackSorted(),
      catatan: 'Database konek tapi masih kosong — jalanin `npm run seed` sekali.'
    };
  } catch (err) {
    return {
      source: 'fallback', events: fallbackSorted(),
      catatan: 'Database belum konek — tampilin data file. Set MONGODB_URI + `npm run seed` biar pindah ke database.',
      debug: String(err.message || err).slice(0, 200)
    };
  }
}

/* satu event by slug — dipakai render /event/<slug> & API /api/events/<slug> */
async function loadEvent(slug) {
  try {
    await dbConnect();
    const ev = await Event.findOne({ slug }).lean();
    if (ev) return { source: 'db', event: ev };
  } catch { /* DB gak ada / belum diset → fallback file di bawah */ }
  const fb = fallbackData.find((e) => e.slug === String(slug));
  return fb ? { source: 'fallback', event: fb } : null;
}

/* ---------------- aset statis (hanya buat dev lokal —
   di Vercel file-file ini di-serve CDN sebelum rewrite ke function) ------- */

app.get('/style.css', (req, res) =>
  res.sendFile(path.join(__dirname, 'style.css'), { maxAge: '10m' }));
app.get('/script.js', (req, res) =>
  res.sendFile(path.join(__dirname, 'script.js'), { maxAge: '10m' }));
app.use('/Img', express.static(path.join(__dirname, 'Img'), { maxAge: '1d' }));

/* ---------------- API (perilaku 1:1 dengan fungsi lama) ---------------- */

/* cuma GET — selain itu 405 (persis handler lama) */
app.use(['/api/events', '/api/events/:slug'], (req, res, next) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Cuma GET yang didukung' });
  }
  next();
});

app.get('/api/events', async (req, res) => {
  const r = await loadEvents();
  res.setHeader('Cache-Control', API_CACHE);
  const body = { source: r.source, jumlah: r.events.length, events: r.events };
  if (r.catatan) body.catatan = r.catatan;
  if (r.debug) body.debug = r.debug;
  res.status(200).json(body);
});

app.get('/api/events/:slug', async (req, res) => {
  const r = await loadEvent(req.params.slug);
  if (!r) {
    return res.status(404).json({ ok: false, error: `Event "${req.params.slug}" gak ketemu` });
  }
  res.setHeader('Cache-Control', API_CACHE);
  res.status(200).json({ source: r.source, event: r.event });
});

/* ---------------- redirect URL lama (308 permanen) ----------------
   Link lama yang kebagi orang / terindex Google tetap nyambung. */

[
  ['/Event.html', '/event'],
  ['/event.html', '/event'],
  ['/Event', '/event'],
  ['/AboutUs.html', '/aboutus'],
  ['/aboutus.html', '/aboutus'],
  ['/AboutUs', '/aboutus'],
  ['/index.html', '/'],
  ['/index', '/']
].forEach(([from, to]) => app.get(from, (req, res) => res.redirect(308, to)));

/* ---------------- halaman ---------------- */

app.get('/', (req, res) => {
  res.setHeader('Cache-Control', PAGE_CACHE);
  res.send(layout({
    title: 'Orvèlion — OSIS SMA Ignatius Global School',
    active: 'home', lang: 'en',
    body: renderHome()
  }));
});

app.get('/event', async (req, res) => {
  const { events } = await loadEvents();
  res.setHeader('Cache-Control', PAGE_CACHE);
  res.send(layout({
    title: 'Event — Orvèlion',
    active: 'event', lang: 'en',
    body: renderBoard(events)
  }));
});

app.get('/aboutus', (req, res) => {
  res.setHeader('Cache-Control', PAGE_CACHE);
  res.send(layout({
    title: 'About Us — Orvèlion',
    active: 'aboutus', lang: 'en',
    body: renderAbout()
  }));
});

/* detail event — /event/talent, dst. (bentuk lama /event/talent.html → 308) */
app.get('/event/:slug', async (req, res) => {
  let { slug } = req.params;
  if (slug.toLowerCase().endsWith('.html')) {
    return res.redirect(308, '/event/' + slug.replace(/\.html$/i, ''));
  }
  const found = await loadEvent(slug);
  if (!found) return notFound(req, res);
  const ev = found.event;
  res.setHeader('Cache-Control', PAGE_CACHE);
  res.send(layout({
    title: `${ev.judul} — Orvèlion`,
    active: 'event', lang: 'en', dataNav: 'event',
    body: renderDetail(ev)
  }));
});

/* ---------------- 404 (dengan shell situs, bukan teks polos) ---------------- */

function notFound(req, res) {
  res.status(404);
  res.setHeader('Cache-Control', PAGE_CACHE);
  res.send(layout({
    title: '404 — Page Not Found · Orvèlion',
    active: '', lang: 'en',
    body: `
        <section class="section s1">
            <div class="page-head">
                <p class="eyebrow">404</p>
                <h1>Page Not Found</h1>
                <p>The page you're looking for has moved or never existed.
                   Head back to the homepage or browse our events.</p>
                <div class="hero-cta">
                    <a class="btn-solid" href="/">Go to Homepage →</a>
                    <a class="btn-ghost" href="/event">See Events</a>
                </div>
            </div>
        </section>`
  }));
}
app.use(notFound); // catch-all: semua path yang gak cocok rute mana pun

/* ---------------- start (khusus dev lokal; di Vercel lewat api/index.js) -- */

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Orvèlion jalan di http://localhost:${PORT}`);
    console.log('  (di Vercel: file ini dimuat lewat api/index.js, gak perlu listen)');
  });
}

module.exports = app;
