/* Layout shell — <head> + header nav + footer + <script>.
   ----------------------------------------------------------------------------
   Semua halaman dirender lewat sini. Markup 1:1 dengan halaman lama
   (stylesheet/behavior script.js gak berubah). Bedanya cuma:
   · aset ditulis absolut (/style.css, /script.js) — aman di URL berapa pun
   · nav "active" di-render server-side dari parameter `active`
   · halaman detail kasih data-nav="event" lewat parameter `dataNav` */

const { LOGO } = require('./cdn');

/* escape teks → aman dimasukin HTML (& < > " ') */
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

/* nav header — `active`: 'home' | 'event' | 'aboutus' */
const nav = (active) => `
        <nav class="link">
            <a href="/"${active === 'home' ? ' class="active"' : ''}>Home</a>
            <a href="/event"${active === 'event' ? ' class="active"' : ''}>Event</a>
            <a href="/aboutus"${active === 'aboutus' ? ' class="active"' : ''}>About Us</a>
        </nav>`;

const footer = `
    <footer>
        <div class="inner">
            <div class="ls">
                <div class="logo">
                    <img src="${LOGO(96)}" alt="Logo Orvèlion">
                    <div class="brand">
                        <strong>Orvèlion</strong>
                        <p class="slogan">Rise Together, Thrive forever</p>
                    </div>
                </div>
            </div>
            <div class="alamat">
                <h3>Address</h3>
                <p>SMA Ignatius Global School<br>
                Jl. Mayor Ruslan No. 118, 20 Ilir I,<br>
                Kec. Ilir Timur I, Palembang</p>
            </div>
            <div class="media">
                <h3>Social Media</h3>
                <a href="#">Instagram</a>
                <a href="#">TikTok</a>
                <a href="#">YouTube</a>
            </div>
        </div>
        <div class="bottom">
            <span>© 2026 Orvèlion — OSIS SMA Ignatius Global School</span>
            <span>Cabinet 2026/2027</span>
        </div>
    </footer>`;

/**
 * layout({ title, active, lang, dataNav, body })
 *  title   — isi <title>
 *  active  — nav yang tersorot ('home' | 'event' | 'aboutus')
 *  lang    — 'id' | 'en' (halaman detail & papan = 'id')
 *  dataNav — opsional, mis. 'event' → <body data-nav="event"> (halaman detail:
 *            saat dibuka langsung, script.js menyorot nav lewat atribut ini)
 *  body    — HTML isi <main class="bodys">...</main>
 */
module.exports = function layout({ title, active, lang = 'id', dataNav = '', body }) {
  const navAttr = dataNav ? ` data-nav="${esc(dataNav)}"` : '';
  return `<!DOCTYPE html>
<html lang="${esc(lang)}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <link rel="icon" href="${LOGO(64)}">
    <link rel="preconnect" href="https://res.cloudinary.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
</head>
<body${navAttr}>
    <header>
        <a class="logo" href="/">
            <img src="${LOGO(96)}" alt="Logo Orvèlion">
            <span>
                <strong>Orvèlion</strong>
                <small>OSIS SMA Ignatius Global School</small>
            </span>
        </a>
${nav(active)}
    </header>

    <main class="bodys">
${body}
    </main>

${footer}

    <script src="/script.js"></script>
</body>
</html>`;
};

module.exports.esc = esc;
