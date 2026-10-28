/* Halaman About Us (/aboutus) — isi <main>.
   Konten: direktori SEMUA anggota OSIS, dikelompokkan persekbid
   (Sekbid 1–8, ditampilkan sebagai Division 01–08) + pengurus inti
   di atasnya. Sumber data = data/struktur.js (ganti nama/foto cukup
   di file itu, jumlah board/divisi/anggota/foto bebas — view ikut
   otomatis).

   FOTO (pola osissmaigs.com): tiap orang 3 foto (slider), tiap
   sekbid 3 foto group rame-rame (slider). Foto asli dibungkus
   [data-lz] (logo muncul dulu → fade-in begitu foto siap, sistem
   sama dengan banner event). Slot kosong → slide placeholder logo
   statis. Slider = scroll-snap CSS (swipe jalan tanpa JS) + titik
   indikator via script.js (initPhotoSliders).

   Kelas CSS baru (.ph-slider / .ph-track / .ph-slide / .ph-empty /
   .ph-logo / .ph-dots / .ph-dot / .mem-info) di style.css seksi
   ABOUT: STRUKTUR ANGGOTA, pakai variabel tema yang sama. */

const { esc } = require('./layout');
const { LOGO, THUMB } = require('./cdn');
const struktur = require('../data/struktur');

/* jumlah slide kosong saat foto belum tersedia — sama seperti pola
   osissmaigs.com (3 foto per orang & per sekbid) */
const SLOTS = 3;

/* foto di data/struktur.js boleh public_id Cloudinary (tanpa format,
   otomatis .jpg + w_480 hemat kuota) ATAU URL lengkap */
function slideSrc(f) {
  return /^https?:/i.test(f) ? f : THUMB(f);
}

/* Bangun 1 slider foto:
   fotos = array URL/public_id (bisa kosong → SLOTS slide placeholder)
   cls   = 'ph-person' (potret 4:5) | 'ph-group' (group 16:10)
   alt   = deskripsi utk alt text foto asli */
function photoSlider(fotos, cls, alt) {
  const list = (Array.isArray(fotos) && fotos.length) ? fotos.slice(0, 12)
              : Array(SLOTS).fill(null);
  const slides = list.map((f, i) => (f
    ? `<div class="ph-slide" data-lz>
                            <img src="${esc(slideSrc(f))}" alt="${esc(alt)} ${i + 1}" loading="lazy">
                        </div>`
    : `<div class="ph-slide ph-empty">
                            <img class="ph-logo" src="${LOGO(96)}" alt="" loading="lazy">
                        </div>`
  )).join('\n                    ');

  /* 1 foto doang → gak perlu titik indikator */
  const dots = list.length > 1
    ? `<div class="ph-dots">
                            ${list.map((_, i) => `<button type="button" class="ph-dot${i === 0 ? ' on' : ''}" aria-label="Photo ${i + 1}"></button>`).join('')}
                        </div>`
    : '';

  return `<div class="ph-slider ${cls}" data-ph>
                    <div class="ph-track">
                        ${slides.trim()}
                    </div>
                    ${dots}
                </div>`;
}

module.exports = function about() {
  const boardCards = struktur.board.map((m) => `
                    <div class="mem-card">
                        ${photoSlider(m.foto, 'ph-person', `Photo of ${m.nama}`)}
                        <div class="mem-info">
                            <p class="mem-name">${esc(m.nama)}</p>
                            <p class="mem-role">${esc(m.role)}</p>
                        </div>
                    </div>`).join('');

  const divBlocks = struktur.divisi.map((d) => `
                    <div class="div-block">
                        ${photoSlider(d.foto, 'ph-group', `${d.nama} division group photo`)}
                        <p class="eyebrow">Division ${esc(d.no)}</p>
                        <h3 class="div-name">${esc(d.nama)}</h3>
                        <ul class="div-members">
                            ${d.anggota.map((a) => `<li>${esc(a)}</li>`).join('\n                            ')}
                        </ul>
                    </div>`).join('\n                ');

  return `
        <section class="section s1">
            <div class="page-head">
                <p class="eyebrow">OSIS SMA IGS · 2026/2027</p>
                <h1>About Us</h1>
                <p class="page-lead">
                    Every member of the Orv&egrave;lion cabinet — the board
                    and all eight divisions behind OSIS SMA Ignatius Global
                    School this year.
                </p>
            </div>
        </section>
        <div class="section s2">
            <p class="eyebrow">01 · The Board</p>
            <h2>Leadership &amp; Secretariat</h2>
            <div class="board-grid">
                ${boardCards.trim()}
            </div>
        </div>
        <div class="section s3">
            <p class="eyebrow">02 · The Divisions</p>
            <h2>Eight Divisions, One Cabinet</h2>
            <div class="div-grid">
                ${divBlocks.trim()}
            </div>
        </div>`;
};
