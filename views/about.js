/* Halaman About Us (/aboutus) — isi <main>.
   Konten: direktori SEMUA anggota OSIS, dikelompokkan persekbid
   (Sekbid 1–8, ditampilkan sebagai Division 01–08) + pengurus inti
   di atasnya. Sumber data = data/struktur.js (ganti nama cukup di
   file itu, jumlah board/divisi/anggota bebas — view ikut otomatis).
   Semua kelas CSS (page-head, eyebrow) + blok baru .board-grid /
   .mem-card / .div-grid / .div-block / .div-members di style.css
   (seksi ABOUT: STRUKTUR ANGGOTA) pakai variabel tema yang sama. */

const { esc } = require('./layout');
const struktur = require('../data/struktur');

module.exports = function about() {
  const boardCards = struktur.board.map((m) => `
                    <div class="mem-card">
                        <p class="mem-name">${esc(m.nama)}</p>
                        <p class="mem-role">${esc(m.role)}</p>
                    </div>`).join('');

  const divBlocks = struktur.divisi.map((d) => `
                    <div class="div-block">
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
