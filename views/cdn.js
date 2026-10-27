/* Konstanta URL gambar Cloudinary — satu tempat buat ganti cloud name.
   ----------------------------------------------------------------------------
   Semua foto situs di-host di Cloudinary (f_auto = otomatis WebP/AVIF sesuai
   browser). Kalau pindah akun/cloud: cukup ganti CLOUD di bawah. */

const CLOUD = 'sqrnkq7x';
const BASE = `https://res.cloudinary.com/${CLOUD}/image/upload/`;

/* banner & logo — transformasi tanpa lebar (dipakai <img> besar, eager).
   data menyimpan public_id TANPA format (mis. 'talent-b') → sambung .jpg */
const RAW = (id) => `${BASE}f_auto,q_auto/${id}.jpg`;
/* foto galeri — versi lebar 480px (hemat kuota, tetap tajam di grid) */
const THUMB = (id) => `${BASE}f_auto,q_auto,w_480/${id}.jpg`;
/* logo — sesuai kebutuhan tiap tempat (favicon 64, header/footer 96, hero 512) */
const LOGO = (w) => `${BASE}f_auto,q_auto,w_${w}/Logo.jpeg`;

module.exports = { CLOUD, BASE, RAW, THUMB, LOGO };
