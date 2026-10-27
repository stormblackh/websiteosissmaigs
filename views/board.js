/* Papan Event (/event) — isi <main>, dirender dari data/events.js.
   ----------------------------------------------------------------------------
   Aturan papan (kebiasaan situs lama Ardraxis) — dijaga di sini:
   · "Happening Now" HANYA berisi SATU event pada satu waktu (status
     'live'). Event berikutnya naik BEGITU event sebelumnya selesai (status
     diganti jadi 'done' → otomatis pindah ke "Documentation" + galeri).
   · Event SEGERA/upcoming TIDAK pernah naik ke papan.
   · Lomba itu BAGIAN dari event (gak semua event punya) — pintu masuknya
     baris "Competition Registration" (hanya muncul kalau event live punya
     lomba); kotak lomba lengkapnya ada di halaman detail.
   Cara ganti isi papan: edit data/events.js (bukan file ini). */

const { esc } = require('./layout');
const { RAW, THUMB } = require('./cdn');

/* meta baris live: tanggal · lokasi · jam — kosong otomatis dilompati */
function metaLive(ringkas) {
  const parts = [
    ringkas.tanggal ? `<span class="ev-date">${esc(ringkas.tanggal)}</span>` : '',
    ringkas.lokasi ? `<span>${esc(ringkas.lokasi)}</span>` : '',
    ringkas.jam ? `<span>${esc(ringkas.jam)}</span>` : ''
  ].filter(Boolean);
  return parts.join(`\n                        <span class="ev-dot" aria-hidden="true">·</span>\n                        `);
}

module.exports = function board(events) {
  /* urut papan (urutan asc) → pisah live vs selesai */
  const list = [...events].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
  const live = list.find((e) => e.status === 'live') || null;
  const done = list.filter((e) => e !== live);

  /* foto banner opsional — event tanpa banner (mis. mode dummy) → gak ada
     <img> sama sekali, placeholder krem + logo samar dari CSS tetap tampil */
  const liveBannerImg = live && live.banner && live.banner.id ? `
                        <img src="${RAW(live.banner.id)}"
                             alt="${esc(live.banner.alt)}"
                             width="1200" height="675" loading="eager"
                             fetchpriority="high" decoding="async">` : '';

  /* ---- keadaan 1: kartu live ---- */
  const liveBlock = live ? `
        <p class="ev-label">Happening Now</p>
            <div class="ev-grid">
                <!-- SATU event live dalam satu waktu — begitu selesai, ubah
                     statusnya jadi 'done' di data/events.js (otomatis pindah
                     ke "Documentation" + galeri) -->
                <a class="ev-card is-live is-feature" href="/event/${esc(live.slug)}" style="--ev-accent:${esc(live.accent)}">
                    <div class="ev-thumb" data-lz>${liveBannerImg}
                        <span class="badge is-live"><span class="dot"></span>Live</span>
                    </div>
                    <div class="ev-card-body">
                        <h2 class="ev-name">${esc(live.judul)}</h2>
                        <p class="ev-meta">
                        ${metaLive(live.ringkas || {})}
                        </p>
                    </div>
                </a>
            </div>` : '';

  /* ---- keadaan 2: baris pendaftaran lomba (kalau event live punya) ---- */
  const reg = live && live.lomba && live.lomba.items && live.lomba.items.length ? live.lomba : null;
  const regBlock = reg ? `
            <p class="ev-label">Competition Registration</p>
            <div class="ev-regboard">
                <!-- baris ini nyambung ke blok "Competition Registration"
                     di halaman detail. Kalau link form tiap lomba udah siap,
                     tinggal ganti field 'link' di data/events.js (tombol
                     "Register Now" di halaman detail bakal langsung bener).
                     Nambah lomba = tambah item di lomba.items[]. -->
                <a class="ev-regitem" href="/event/${esc(live.slug)}" style="--ev-accent:${esc(live.accent)}">
                    <span class="ev-reg-idx">01</span>
                    <span class="ev-reg-main">
                        <span class="ev-reg-name">${esc(reg.judulPapan || live.judul)}</span>
                        <span class="ev-reg-meta">${esc(reg.bidangPapan)}</span>
                    </span>
                    <span class="ev-reg-side">
                        <span class="ev-reg-deadline">Deadline: <strong>${esc(reg.deadlinePendek)}</strong></span>
                        <span class="ev-reg-btn">Details &amp; Register<span class="ev-reg-arrow" aria-hidden="true">→</span></span>
                    </span>
                </a>
            </div>` : '';

  /* ---- keadaan 3: baris dokumentasi (event selesai) ---- */
  const rows = done.map((e, i) => `
                <a class="ev-row" href="/event/${esc(e.slug)}" style="--ev-accent:${esc(e.accent)}">
                    <span class="ev-row-idx">${String(i + 1).padStart(2, '0')}</span>
                    <span class="ev-row-name">${esc(e.judul)}</span>
                    <span class="ev-row-date">${esc(e.ringkas && e.ringkas.tanggal)}</span>
                    <span class="ev-row-arrow" aria-hidden="true">→</span>
                </a>`).join('\n');
  const doneBlock = done.length ? `
            <p class="ev-label">Documentation</p>
            <div class="ev-arch">${rows}
            </div>` : '';

  /* ---- keadaan 4: galeri (tile per foto event selesai, terbaru duluan) ---- */
  const tiles = done.flatMap((e) => (e.galeri || []).map((g) => `
                <a class="ev-gcard" href="/event/${esc(e.slug)}" style="--ev-accent:${esc(e.accent)}">
                    <div class="ev-gthumb" data-lz>
                        <img src="${THUMB(g.id)}" alt="${esc(g.alt)}"
                             width="800" height="600" loading="lazy" decoding="async">
                    </div>
                    <span class="ev-gcap">${esc(e.judul)}</span>
                </a>`)).join('');
  const galBlock = tiles ? `
            <p class="ev-label">Event Gallery</p>
            <div class="ev-gal">${tiles}
            </div>
            <p class="ev-footnote">The gallery is updated after each event ends — tap a photo to open its full documentation.</p>` : '';

  return `
        <section class="section s1">
            <div class="page-head">
                <p class="eyebrow">Agenda · Academic Year 2026/2027</p>
                <h1>Event</h1>
            </div>
        </section>

        <section class="section ev-board">${liveBlock}${regBlock}${doneBlock}${galBlock}
        </section>`;
};
