# Roadmap Arsitektur — Website OSIS Orvèlion (SMA IGS)

> Peta jalan dari **prototype statis sekarang** → **Express + MongoDB + Cloudinary (Option A)**.
> Intinya: **frontend sekarang = frontend final**. Yang berubah cuma "belakang panggung"-nya.
> Dokumen ini panduan, bukan kode — situs gak berubah sama sekeksi apa pun karena file ini ada.

---

## 1. Gambaran Besar

```
SEKARANG (prototype — gratis, tanpa server):
  Browser ──> GitHub Pages ──> HTML/CSS/JS statis + 24 foto (2.1 MB) di repo

TARGET (Option A):
  Browser ──> Express (server lu) ──> MongoDB (data event: judul, tanggal, lomba, dst)
       └────> Cloudinary CDN ──> semua foto (format auto WebP/AVIF, serving global)
```

Kenapa urutannya penting: **Cloudinary bisa dipake duluan tanpa server** (Fase 1), baru Express + MongoDB menyusul pas server siap (Fase 2). Jadi lu gak perlu nunggu semuanya siap buat merasain efek CDN.

---

## 2. Fase 1 — GitHub Pages + Cloudinary (TANPA server, bisa sekarang)

Ini langkah paling murah-ampuh: situs tetap gratis di GitHub Pages, cuma foto yang pindah rumah.

**Kenapa ganti:**
- `f_auto` = Cloudinary otomatis ngirim WebP/AVIF → ukuran turun 40–60% dari JPG sekarang.
- Serving dari server terdekat (edge Singapura — deket Palembang) → foto buka instan, ini jawab permanen untuk keluhan "foto besarnya lama banget bukanya".
- Repo GitHub jadi ringan: folder `Img/` (2.1 MB) bisa dihapus belakangan (SETELAH Cloudinary terbukti jalan) — jadi repo < 100 KB, lepas dari batas 1 GB repo & bandwidth GitHub Pages.
- Free tier Cloudinary: 25 kredit/bulan (± 25 GB bandwidth) — untuk 24 foto OSIS itu LUAR BIASA lebih dari cukup, tanpa kartu kredit.

> **STATUS (23 Okt 2026): FASE 1 SELESAI & TERVERIFIKASI LIVE.**
> Aset lu upload **flat di ROOT Media Library** (gak pakai folder — dan itu gak masalah,
> gue yang sesuaikan URL-nya). Semua 61 referensi di HTML + CSS udah nunjuk ke:
> `https://res.cloudinary.com/sqrnkq7x/image/upload/f_auto,q_auto/<nama-file>`
> (TANPA nomor versi — versi di-generate Cloudinary otomatis, jangan tulis `/v1/` manual).
> Verifikasi 23 Okt 2026: 25/25 aset HTTP 200 · board 14/14 gambar tampil ·
> 0 console error · ukuran turun 11–43% per foto.

**Nambah / ganti foto di masa depan (cara gampang):**
1. Upload file barunya ke ROOT Media Library (drag & drop, **nama file sama** dengan yang mau diganti, misal `talent-b.jpg`).
2. Beres — karena URL gak pakai nomor versi, Cloudinary otomatis ngirim versi terbaru. HTML gak perlu disentuh lagi.
3. Foto baru = nama file baru → tinggal ganti nama file di HTML-nya (satu tempat, cari nama lamanya).

<details><summary>Catatan teknis: kenapa nama file harus sama & tanpa versi</summary>

- Public_id di Cloudinary = path folder + nama file TANPA ekstensi. Aset lu semua flat di root: `talent-b.jpg` → public_id `talent-b`. URL delivery menambahkan ekstensi lagi sebagai petunjuk format asal, dan `f_auto` yang bikin WebP/AVIF otomatis.
- Nomor versi (`v17300xxxxx`) di-generate otomatis per upload. Kalau URL tidak mencantumkan versi, Cloudinary selalu ngirim versi terbaru — itu yang kita pakai biar gampang ganti foto tanpa edit HTML lagi.

</details>

**Yang gak perlu diubah sama sekali:**
- `script.js` SUDAH CDN-ready: sistem `data-lz` (watermark napas → `decode()` → fade-in) jalan normal untuk URL Cloudinary, dan `rebaseURLs()` otomatis lewatin URL absolut (gak diutak-atik).
- Komentar `GANTI-SAMPLE` tetap ketutuh ganti (nama/judul gak ikut ke-replace).

> Tips hemat: kalau males upload, Cloudinary punya mode *fetch* (`/image/fetch/f_auto,q_auto/<URL GitHub raw>`) yang bisa optimalkan foto tanpa upload — tapi upload tetap lebih bersih & permanen. Rekomendasi: upload.

---

## 3. Fase 2 — Express + MongoDB (pas server udah ada)

Server Express itu cuma 2 tugas: **ngeserve folder frontend apa adanya** + **nyediain data event via JSON API**. Gak ada yang di-rewrite dari sisi tampilan.

### Struktur folder app

```
orvelion-app/
├── public/            ← SELURUH isi situs sekarang masuk sini, APA ADANYA
│   ├── index.html  Event.html  AboutUs.html
│   ├── script.js   style.css
│   └── event/            (6 halaman detail — nanti jadi template, lihat §3.3)
├── server.js          ← express.static('public') + API + mongoose.connect
├── models/Event.js    ← schema Mongoose (data model di bawah)
├── routes/api.js      ← GET /api/events, GET /api/events/:slug
├── seed.js            ← isi data awal ke MongoDB (dari komentar GANTI-SAMPLE)
├── .env               ← MONGODB_URI=... , PORT=3000
└── package.json       ← dependencies: express, mongoose, dotenv
```

### server.js (inti — cuma segini)

```js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const api = require('./routes/api');

const app = express();
app.use(express.static(path.join(__dirname, 'public'))); // frontend lama jalan apa adanya
app.use('/api', api);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 3000, () => console.log('Orvèlion jalan')))
  .catch(e => { console.error(e); process.exit(1); });
```

### Data model Event (mapping persis dari struktur HTML sekarang)

```js
// models/Event.js
const eventSchema = new mongoose.Schema({
  slug:      { type: String, unique: true, index: true }, // "talent" → URL /event/talent
  judul:     String,
  status:    { type: String, enum: ['live', 'done'] },   // aturan Ardraxis: gak pernah "segera"
  meta:      { tanggal: String, lokasi: String, jam: String },
  accent:    { type: String, default: '#9C381C' },      // --ev-accent per event
  banner:    String,   // public_id Cloudinary: "talent-b" (flat di root)
  deskripsi: [String], // 2 paragraf
  agenda:    [String],
  lomba: {              // NULL kalau event gak punya lomba
    deadline: String, bidang: [String],
    link: String,       // Google Form dulu (Fase 3 opsional: form internal)
    cp: String
  },
  galeri:    [String],  // 3 public_id — HANYA diisi kalau status done (dokumentasi)
  urutan:    Number     // urutan tampil di board
});
```

Kolomnya emang sengaja ngikutin markup HTML yang udah ada — jadi mindahin data `GANTI-SAMPLE` ke database cuma nyalin, bukan redesign.

### API + render

- `GET /api/events` → JSON semua event (board pakai ini)
- `GET /api/events/talent` → JSON satu event (overlay/detail pakai ini)
- `script.js` tinggal NAMBAH ±60–80 baris `renderEvents(events)` yang bikin markup kartu/baris/tile persis kayak sekarang (template literal), lalu `Event.html` tinggal `<div id="board"></div>`. PJAX, overlay FLIP, lazy-load, galeri — **semua tetap jalan apa adanya**.

---

## 4. Server: sewa VPS atau gratisan?

| Opsi | Biaya | Cocok kalau |
|---|---|---|
| **Render.com / Railway free** + **MongoDB Atlas M0** (512 MB) + Cloudinary free | **Rp 0/bulan** | Mau coba Fase 2 tanpa keluar duit. Catatan: free tier *tidur* setelah idle (~30–60 detik bangun lagi saat dikunjung) — untuk situs OSIS masih oke |
| **VPS 1 vCPU / 1 GB RAM** | ± Rp 50–100 rb/bln | Mau gak pernah sleep + full kontrol. MongoDB + Express sekecil ini muat banget di 1 GB |

Checklist setup VPS (kalau nyewa):
1. Node 20 LTS (via nvm), `npm i express mongoose dotenv`, `pm2 start server.js --name orvelion && pm2 save && pm2 startup`
2. nginx reverse proxy `:80/:443` → `localhost:3000`
3. SSL gratis: `certbot --nginx`
4. DNS: A record domain → IP VPS (kalau mau osissmaigs.com, koordinasi dulu sama pengelola domain kabinet sebelumnya)
5. Backup mingguan: `mongodump` (cron) — jaga-jaga kalau ada apes.

---

## 5. Tabel summary: TETAP vs GANTI

| Bagian | Nasib | Kapan |
|---|---|---|
| index/Event/AboutUs.html, style.css, desain | **TETAP 100%** | — |
| script.js: PJAX, overlay FLIP, lazy-load `decode()`, rebaseURLs | **TETAP 100%** | — |
| script.js: renderEvents() dari API | NAMBAH ±60–80 baris | Fase 2 |
| Foto `Img/` → Cloudinary | GANTI `src` (find & replace) | **Fase 1** |
| Data event `GANTI-SAMPLE` → MongoDB | seed dari HTML yang ada | Fase 2 |
| Google Form pendaftaran lomba → API internal | opsional | Fase 3 |
| Hosting GitHub Pages → Express server | pindah rumah, file sama | Fase 2 |

## 6. Urutan kerja yang disaranin

1. **[SEKARANG]** Prototype statis → isi konten asli (ganti semua `GANTI-SAMPLE`, link Google Form, narahubung).
2. **[Bebas, tanpa server]** Daftar Cloudinary → upload foto → find & replace src → foto instan di semua jaringan.
3. **[Pas server siap]** Scaffold Express + Atlas M0 / MongoDB VPS → seed data → `renderEvents()`.
4. **[Opsional]** Admin mini buat OSIS (login + CRUD event) — baru di fase ini butuh session/auth.

> Filosofi: **sedikit-sedikit, tiap fase langsung bisa dipake & dilihat orang**. Gak ada fase "bongkar semua".
