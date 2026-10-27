/* Entry point Vercel — semuanya (halaman + API) lewat Express di server.js.
   ----------------------------------------------------------------------------
   vercel.json nulis ulang (rewrite) SEMUA request yang gak cocok file statis
   (style.css, script.js, Img/*) ke sini. Express app di-ekspor apa adanya —
   @vercel/node nyambungin request/response HTTP langsung ke app-nya. */

module.exports = require('../server');
