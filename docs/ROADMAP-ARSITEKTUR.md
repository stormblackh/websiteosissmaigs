# Roadmap Arsitektur — Website OSIS Orvèlion (SMA IGS)

> Peta jalan dari **prototype statis** → **dynamic tanpa drama**: Vercel (serverless) + MongoDB Atlas + Cloudinary.
> Intinya: **frontend sekarang = frontend final**. Yang berubah cuma "belakang panggung"-nya.
> Dokumen ini panduan, bukan kode — situs gak berubah sama sekecil apa pun karena file ini ada.

---

## 1. Gambaran Besar

```
SEKARANG (Fase 1 — LIVE):
  Browser ──> GitHub Pages ──> HTML/CSS/JS statis
                    └────> Cloudinary CDN ──> 24 foto (f_auto WebP/AVIF, edge Singapura)

TARGET (Fase 2 — Vercel, semua tetap gratis):
  Browser ──> Vercel
                ├─ file statis (index.html, Event.html, dst.) — apa adanya
                └─ /api/events & /api/events/<slug> (serverless functions)
                        └────> MongoDB Atlas M0 (data event: judul, tanggal, lomba, dst.)
  Cloudinary tetap pegang semua foto — gak berubah dari Fase 1.
```

Kenapa urutannya penting: Cloudinary udah jalan duluan tanpa server (Fase 1 ✅), Express+MongoDB menyusul pas server-nya siap. Di jalur Vercel, bahkan **Express gak perlu** — tiap file di folder `api/` otomatis jadi endpoint serverless.

---

## 2. Fase 1 — GitHub Pages + Cloudinary (SELESAI & TERVERIFIKASI)

**Kenapa ganti:**
- `f_auto` = Cloudinary otomatis ngirim WebP/AVIF → ukuran turun 11–43% per foto (terukur).
- Serving dari server terdekat (edge Singapura — deket Palembang) → foto buka instan.
- Repo GitHub jadi ringan: folder `Img/` (2.1 MB) tinggal momen mau dihapus (aset udah aman di Cloudinary).
- Free tier Cloudinary: 25 kredit/bulan — untuk 24 foto OSIS itu LUAR BIASA lebih dari cukup, tanpa kartu kredit.

> **STATUS (23 Okt 2026): FASE 1 SELESAI & TERVERIFIKASI LIVE.**
> Aset flat di ROOT Media Library. Semua 61 referensi di HTML + CSS nunjuk ke:
> `https://res.cloudinary.com/sqrnkq7x/image/upload/f_auto,q_auto/<nama-file>`
> (TANPA nomor versi — Cloudinary otomatis ngirim versi terbaru).
> Verifikasi: 25/25 aset HTTP 200 · board 14/14 gambar tampil · 0 console error.

**Nambah / ganti foto di masa depan (cara gampang):**
1. Upload file barunya ke ROOT Media Library (drag & drop, **nama file sama** dengan yang mau diganti, misal `talent-b.jpg`).
2. Beres — URL gak pakai nomor versi, Cloudinary otomatis ngirim versi terbaru. HTML gak perlu disentuh lagi.
3. Foto baru = nama file baru → tinggal ganti nama file di HTML-nya (satu tempat, cari nama lamanya).

---

## 3. Fase 2 — Vercel Serverless + MongoDB Atlas (resep final, file-nya UDAH ADA di repo)

> **Update 23 Okt 2026:** jalur Fase 2 dipilih = **Vercel** (bukan Express di VPS).
> Semua file infra sudah tersedia di repo — tinggal deploy. Resep lama Express
> tetap valid kalau suatu hari sewa VPS (server.js-nya cuma ±15 baris, struktur
> model/seed/data SAMA PERSIS — cuma cara nyerveinnya yang beda).

### Yang udah siapa aja (semua file BARU, frontend gak disentuh)

```
websiteosissmaigs/            ← repo sekarang, tinggal import ke Vercel
├── index.html  Event.html  AboutUs.html   ← statis, diserve Vercel apa adanya
├── event/  script.js  style.css  Img/     ← idem
├── api/
│   ├── events.js             ← GET /api/events        (JSON semua event)
│   └── events/[slug].js      ← GET /api/events/talent (JSON satu event)
├── lib/db.js                 ← koneksi Atlas anti-cold-start (cached-global)
├── models/Event.js           ← schema Mongoose, mapping 1:1 sama markup HTML
├── data/events.js            ← single source of truth data event (salinan HTML)
├── seed.js                   ← `npm run seed` → upsert data ke Atlas (sekali)
├── package.json              ← deps: mongoose + dotenv (di-install otomatis Vercel)
├── vercel.json               ← framework: null + region sin1 (Singapura)
├── .env.example              ← template MONGODB_URI (salin jadi .env lokal)
└── .gitignore                ← ngeblok .env & node_modules ke GitHub
```

### Kunci desain: situs GAK PERNAH MATI (fallback 2 lapis)

1. **Database konek & ada isinya** → `/api/events` ngirim `{ source: "db", events: [...] }`.
2. **DB belum diset / belum di-seed / lagi down** → API tetap 200, ngirim data dari `data/events.js` (`source: "fallback"`). Timeout cuma 3,5 detik — gak nunggu 30 detik kayak default.

Artinya: **deploy duluan, database belakangan** — aman. Cek status di field `source` tiap kali buka `/api/events`.

### Lapisan optimasi (23 Okt 2026 — semua invisible, desain gak berubah)

- **Foto Cloudinary di-resize per konteks** (transform di URL, public_id tetap):
  favicon `w_64` (104 KB → 2,4 KB) · logo nav/footer `w_96` (→ 4 KB) · logo
  hero `w_512` · watermark loading di CSS `w_64` · foto galeri `w_480`
  (→ hemat ±56%/foto). Banner **sengaja tetap 1200px** — URL-nya dipake
  bareng kartu papan + overlay biar sekali download, FLIP tetap instan.
  Ganti foto dengan nama sama → otomatis dapat resize yang sama, gak ada yang perlu diutak-atik.
- **Preconnect** `res.cloudinary.com` di 9 halaman → koneksi TLS ke CDN
  dibuka duluan sebelum HTML selesai diparse.
- **vercel.json**: HTML `must-revalidate` (update push langsung keliatan),
  CSS/JS cache 10 menit + stale-while-revalidate, folder Img/ 1 hari, plus
  security headers (nosniff, Referrer-Policy, Permissions-Policy).
- **API edge cache**: `s-maxage=60, stale-while-revalidate=300` → respon JSON
  di-serve dari CDN terdekat, bukan nunggu function + query DB tiap visitor.
- Font Google tetap 5 ketebalan (400 dipake body default — udah diaudit, bukan boros).

### Langkah deploy (±15 menit, semuanya gratis)

1. **MongoDB Atlas** (atlas.mongodb.com → free M0, tanpa kartu kredit):
   bikin cluster → Database Access: bikin user + password → Network Access: **ALLOW ACCESS FROM ANYWHERE (0.0.0.0/0)** — wajib, karena IP serverless Vercel gak tetap → Connect → Drivers → salin connection string `mongodb+srv://...`.
2. **Vercel** (vercel.com → lanjut pakai akun GitHub):
   Add New Project → import repo `stormblackh/websiteosissmaigs` → Deploy (gak usah ubah setting apa pun — `vercel.json` udah ngatur). Situs langsung hidup di `<nama>.vercel.app`, tiap `git push` auto-deploy.
3. **Sambungin database** (barusanini bikin API pindah dari fallback ke db):
   Vercel → Project → Settings → Environment Variables → tambah `MONGODB_URI` (nilainya = connection string tadi) → **Redeploy** biar kebaca.
4. **Seed data** (sekali aja, dari laptop): salin `.env.example` jadi `.env`, isi `MONGODB_URI` → `npm install` → `npm run seed`. Bukti berhasil: `/api/events` sekarang `"source": "db"`.
5. (Opsional) Domain kabinet: Vercel → Settings → Domains → tambah domain → ikutin instruksi DNS.

### Data model Event (models/Event.js — mapping persis dari markup HTML)

`slug · judul · eyebrow · status (live/done) · accent · banner {id, alt} ·
meta {tanggal, jam, lokasi, htm} · ringkas {tanggal, lokasi, jam} ·
lead · deskripsi[2] · poin[3] · lomba {deadline, deadlinePendek, bidang[], bidangPapan, link, cp} | null ·
galeri[{id, alt}] (hanya kalau done) · urutan`

Semua nilai awal udah terisi di `data/events.js` — salinan 1:1 konten HTML sekarang (tanda GANTI-SAMPLE ikut kebawa, jadi ganti di file itu sekali + `npm run seed`).

### API + render (satu-satunya ubahan frontend di masa depan)

- `GET /api/events` → JSON semua event, urut papan.
- `GET /api/events/<slug>` → JSON satu event.
- `script.js` tinggal NAMBAH ±60–80 baris `renderEvents(events)` yang bikin markup kartu/baris/tile persis kayak sekarang (template literal), lalu `Event.html` tinggal `<div id="board"></div>`. PJAX, overlay FLIP, lazy-load, galeri — **semua tetap jalan apa adanya**. HTML statis tetap jadi fallback kalau JS/API bermasalah.

---

## 4. Biaya: gratis vs sewa

| Opsi | Biaya | Cocok kalau |
|---|---|---|
| **Vercel Hobby + Atlas M0 + Cloudinary** (RESEP INI) | **Rp 0/bulan** | Dynamic penuh tanpa keluar duit. Serverless = gak ada server idle; "bangun" pas dipanggil (ratusan ms) — jauh lebih enak dari Render/Railway free yang tidur 30–60 detik. Catatan: Hobby = 1 region (udah diset sin1/Singapura), domain gratis `*.vercel.app` |
| **VPS 1 vCPU / 1 GB RAM** + MongoDB lokal | ± Rp 50–100 rb/bln | Mau full kontrol + gak pernah sleep. Resep lama Express masih berlaku (pm2/nginx/certbot/mongodump), model/seed/data SAMA PERSIS |

Catatan Vercel Hobby: buat situs OSIS jauh dari mentok — bandwidth 100 GB/bulan, serverless 100k GB-jam/bulan.

---

## 5. Tabel summary: TETAP vs GANTI

| Bagian | Nasib | Status |
|---|---|---|
| index/Event/AboutUs.html, style.css, desain | **TETAP 100%** | ✅ |
| script.js: PJAX, overlay FLIP, lazy-load `decode()`, rebaseURLs | **TETAP 100%** | ✅ |
| Foto → Cloudinary | GANTI `src` (61 ref) | ✅ **SELESAI & LIVE** |
| API `/api/events` + koneksi Atlas | **BARU** (api/, lib/, models/, data/, seed.js) | ✅ file siap, nunggu deploy |
| Data event GANTI-SAMPLE → MongoDB | seed dari data/events.js | ⏳ pas deploy (Fase 2 langkah 4) |
| script.js: renderEvents() dari API | NAMBAH ±60–80 baris | ⏳ opsional, setelah deploy jalan |
| Hosting GitHub Pages → Vercel | pindah rumah, file sama, auto-deploy dari git push | ⏳ Fase 2 langkah 2 |
| Google Form pendaftaran lomba → API internal | opsional | Fase 3 (baru butuh auth) |

## 6. Urutan kerja yang disaranin

1. ~~Daftar Cloudinary → upload foto → ganti src~~ ✅ **BERES, LIVE.**
2. **[SEKARANG]** Deploy Vercel (§3 langkah 1–5) — situs pindah rumah, URL `.vercel.app`, auto-deploy.
3. Ganti GANTI-SAMPLE: konten asli (nama event, tanggal, link Google Form, narahubung) — sekali di `data/events.js` + `npm run seed`, sekali di HTML statis (sampai renderEvents() aktif).
4. Opsional: aktifin `renderEvents()` → papan Event.html hidup dari database.
5. Opsional: admin mini (login + CRUD event) — fase ini baru butuh session/auth.

> Filosofi: **sedikit-sedikit, tiap fase langsung bisa dipake & dilihat orang**. Gak ada fase "bongkar semua". GitHub Pages tetep ada sebagai cadangan gratis — kalau Vercel bermasalah, tinggal share lagi URL Pages-nya, file-nya sama persis.
