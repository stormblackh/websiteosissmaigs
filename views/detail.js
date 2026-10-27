/* Halaman detail event (/event/<slug>) — isi <main>, dirender dari
   data/events.js. Dipakai 2 mode (markup sama, gak dobel file lagi):
   · halaman penuh saat dibuka langsung (bisa diindex Google), dan
   · overlay FLIP di papan /event (script.js nge-fetch URL ini, ambil
     article.ev-detail, injeksi ke panel).
   Konten = event dari data/events.js (status 'live' → badge Live + kotak
   lomba; 'done' → badge Selesai + galeri). Ganti isi = edit data, bukan sini. */

const { esc } = require('./layout');
const { RAW, THUMB } = require('./cdn');

const SVG = {
  tanggal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  jam:     '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  lokasi:  '<svg viewBox="0 0 24 24"><path d="M12 21s-7-5.1-7-11a7 7 0 1 1 14 0c0 5.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  htm:     '<svg viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 11v2M13 17v2"/></svg>',
  jamkecil: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>'
};

const tile = (label, svgKey, val) => `
                    <div class="evd-tile">
                        <p class="evd-th">${SVG[svgKey]}${label}</p>
                        <p>${esc(val)}</p>
                    </div>`;

/* ============ KOTAK LOMBA 3-KEADAAN ============
   Detail → Pilih Lomba → Pendaftaran (per lomba). Tanpa JS semua keadaan
   tampil berurutan (tetap kebaca, tombol navigasi hilang otomatis via CSS). */
function lombaBox(lomba) {
  const items = lomba.items || [];

  const rows = items.map((it, i) => `
                            <div class="evd-lomba">
                                <span class="evd-lomba-idx">${String(i + 1).padStart(2, '0')}</span>
                                <span class="evd-lomba-main">
                                    <strong>${esc(it.nama)}</strong>
                                    <small>${esc(it.ringkasBaris || it.ringkas)}</small>
                                </span>
                                <button class="evd-lomba-btn" type="button" data-godaftar="${esc(it.id)}">Daftar <span aria-hidden="true">→</span></button>
                            </div>`).join('\n');

  const panels = items.map((it) => `
                    <div class="evd-lp evd-lp-daftar" data-lomba="${esc(it.id)}">
                        <button class="evd-lbox-back" type="button" data-gback="list">← Pilih bidang lomba</button>
                        <h3 class="evd-lomba-h" tabindex="-1">${esc(it.nama)}</h3>
                        <p class="evd-lomba-tag">${esc(it.ringkas)}</p>
                        <p class="evd-h">Syarat &amp; Ketentuan</p>
                        <!-- syarat bebas diisi apa aja — edit di data/events.js -->
                        <ul class="evd-syarat">
${(it.syarat || []).map((s) => `                            <li>${esc(s)}</li>`).join('\n')}
                        </ul>
                        <a class="evd-cta" href="${esc(it.link)}" target="_blank" rel="noopener">Daftar Sekarang &#8599;</a>
                        <p class="evd-cp"><strong>Narahubung:</strong> ${esc(it.cp)}</p>
                    </div>`).join('\n');

  return `
                <!-- ============ KOTAK LOMBA 3-KEADAAN ============
                     Detail → Pilih Lomba → Pendaftaran (per lomba).
                     Tanpa JS: semua keadaan tampil berurutan (tetap kebaca,
                     tombol-tombol navigasinya hilang otomatis). -->
                <div class="evd-lbox" data-state="detail">
                    <div class="evd-lbox-head">
                        <h2 class="evd-lbox-title">Pendaftaran Lomba</h2>
                        <span class="evd-lbox-dl">
                            ${SVG.jamkecil}
                            Batas: <strong>${esc(lomba.deadline)}</strong>
                        </span>
                        <div class="evd-lbox-steps" aria-hidden="true">
                            <span data-step="detail">Detail</span><i></i>
                            <span data-step="list">Lomba</span><i></i>
                            <span data-step="daftar">Daftar</span>
                        </div>
                    </div>

                    <!-- keadaan 1: detail singkat + tombol lihat lomba -->
                    <div class="evd-lp evd-lp-detail is-on">
                        <p class="evd-lbox-note">${esc(lomba.catatan)}</p>
                        <button class="evd-lbox-btn" type="button" data-golomba>Lihat Lomba <span aria-hidden="true">→</span></button>
                        <p class="evd-cp"><strong>Narahubung:</strong> ${esc(lomba.cp)}</p>
                    </div>

                    <!-- keadaan 2: daftar bidang lomba + tombol daftar per lomba -->
                    <div class="evd-lp evd-lp-list">
                        <button class="evd-lbox-back" type="button" data-gback="detail">← Detail pendaftaran</button>
                        <div class="evd-lomba-list">${rows}
                        </div>
                    </div>

                    <!-- keadaan 3: pendaftaran per lomba — data-lomba nyambung ke
                         data-godaftar di atas (keduanya dari item.id). -->
${panels}
                </div>`;
}

/* galeri dokumentasi — hanya event selesai (status done) */
function galeriBlock(galeri) {
  if (!galeri || !galeri.length) return '';
  const tiles = galeri.map((g) => `
                        <div data-lz>
                            <img src="${THUMB(g.id)}" alt="${esc(g.alt)}"
                                 width="800" height="600" loading="lazy" decoding="async">
                        </div>`).join('\n');
  return `
                <div class="evd-gal">
                    <h2 class="evd-h">Dokumentasi</h2>
                    <div class="evd-gal-grid">
${tiles}
                    </div>
                </div>`;
}

module.exports = function detail(ev) {
  const isLive = ev.status === 'live';
  const lomba = isLive && ev.lomba && (ev.lomba.items || []).length ? ev.lomba : null;

  /* foto banner opsional — event tanpa banner (mis. mode dummy) → gak ada
     <img> sama sekali, placeholder krem + logo samar dari CSS tetap tampil,
     badge Live/Selesai tetap ada */
  const bannerImg = ev.banner && ev.banner.id ? `
                    <img src="${RAW(ev.banner.id)}"
                         alt="${esc(ev.banner.alt)}" width="1200" height="675"
                         loading="eager" fetchpriority="high" decoding="async">` : '';

  return `
        <div class="section evd-page">
            <article class="ev-detail" style="--ev-accent:${esc(ev.accent)}">
                <div class="evd-banner" data-lz>${bannerImg}
                    ${isLive
                      ? '<span class="badge is-live"><span class="dot"></span>Live</span>'
                      : '<span class="badge is-done">Selesai</span>'}
                </div>
                <div class="evd-content">
                    <p class="evd-eyebrow">${esc(ev.eyebrow)}</p>
                    <h1 class="evd-title">${esc(ev.judul)}</h1>
                    <p class="evd-lead">${esc(ev.lead)}</p>

                    <div class="evd-info">
${tile('Tanggal', 'tanggal', ev.meta.tanggal)}${tile('Jam', 'jam', ev.meta.jam)}${tile('Lokasi', 'lokasi', ev.meta.lokasi)}${tile('HTM', 'htm', ev.meta.htm)}
                    </div>

                    <div class="evd-desc">
                        <h2 class="evd-h">Tentang Event</h2>
${(ev.deskripsi || []).map((p) => `                        <p>${esc(p)}</p>`).join('\n')}
                        <ul>
${(ev.poin || []).map((p) => `                        <li>${esc(p)}</li>`).join('\n')}
                        </ul>
                    </div>

${lomba ? lombaBox(lomba) : ''}${galeriBlock(ev.galeri)}

                    <a class="evd-back" href="/event">← Kembali ke daftar event</a>
                </div>
            </article>
        </div>`;
};
