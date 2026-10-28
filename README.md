# websiteosissmaigs — Website OSIS SMA Ignatius Global School (Orvèlion)

**Full Node.js** — semua halaman dirender server-side oleh Express (`server.js`),
gak ada file `.html` statis. Data event dari `data/events.js` (fallback) atau
MongoDB Atlas. Foto di Cloudinary. Deploy di Vercel.

## Struktur

```
server.js            ← app Express: SEMUA rute (halaman + API)
api/index.js         ← entry Vercel (nge-require server.js)
views/               ← template halaman (dirender oleh server.js)
  ├─ layout.js       ← shell: <head>, header nav, footer
  ├─ home.js about.js board.js detail.js   ← isi tiap halaman
  └─ cdn.js          ← konstanta URL Cloudinary
script.js style.css                        ← aset statis (di-serve langsung oleh Express)
data/events.js       ← SEMUA konten event (single source of truth)
data/struktur.js     ← daftar pengurus OSIS + foto anggota — isi halaman About Us
                       (foto: [] = placeholder logo; isi public_id Cloudinary / URL)
lib/db.js models/Event.js seed.js           ← lapisan MongoDB (opsional)
```

## URL

| URL | Dirender oleh | Sumber data |
|---|---|---|
| `/` | `views/home.js` | — (konten di file itu) |
| `/event` | `views/board.js` | `data/events.js` / DB |
| `/aboutus` | `views/about.js` | — |
| `/event/talent` · `/event/literasi` · dst. | `views/detail.js` | `data/events.js` / DB |
| `/api/events` · `/api/events/<slug>` | handler JSON di `server.js` | `data/events.js` / DB |

URL lama (`.html`) otomatis dialihkan permanen (308) — link yang udah kebagi
orang tetap nyambung. Jalanin lokal: `npm install` sekali, lalu `npm start`
→ `http://localhost:3000`.

## Ganti konten event

Edit **`data/events.js`** — papan `/event`, halaman detail, dan API ikut
otomatis (semua dirender dari situ). Kalau udah nyambung MongoDB: jalanin
`npm run seed` setelah edit. Semua tanda `GANTI-SAMPLE` = konten masih contoh.

## Catatan penting

- Halaman detail event dipakai dua mode: halaman penuh (bisa diindex Google)
  dan overlay FLIP di papan `/event` — server merender satu HTML untuk dua-duanya.
- Papan hanya menampilkan SATU event live dalam satu waktu (aturan Ardraxis);
  event selesai pindah ke bagian Dokumentasi (`status: 'done'` di data).
- Lapisan data 2 tingkat: MongoDB dulu (kalau `MONGODB_URI` diset + di-seed),
  gagal/kosong → `data/events.js`. Halaman & API jalan di jalur yang sama,
  jadi gak pernah selisih konten dan situs tetap hidup walau DB mati.
  Cek status di field `source` respons `/api/events`.
- Foto semua di Cloudinary (`f_auto` WebP/AVIF). Ganti foto = upload nama sama
  di Media Library. Ganti akun Cloudinary = edit `CLOUD` di `views/cdn.js`.

## Deploy

Migrasi full Node.js sudah selesai di repo ini. Alur pembaruan:
`git add -A && git commit && git push` — Vercel auto-deploy.
