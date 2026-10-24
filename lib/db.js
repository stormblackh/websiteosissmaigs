/* Koneksi MongoDB untuk serverless (Vercel) — pattern cached-global.
   ----------------------------------------------------------------------------
   Function Vercel "mati" tiap kali gak dipanggil. Kalau tiap invocation bikin
   koneksi baru, tiap request bayar biaya connect (cold start dobel).
   Solusinya: simpan promise koneksi di globalThis — selama instance masih
   hangat, semua request make koneksi yang sama.

   serverSelectionTimeoutMS 3500: kalau DB gak kejangkau (URI salah / network
   down / belum di-set), API gak nunggu 30 detik default — cepet jatuh ke
   fallback data/events.js biar situs tetap jalan. */

const mongoose = require('mongoose');

let cached = globalThis.__orvelionDb;
if (!cached) cached = globalThis.__orvelionDb = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI belum diset (isi di Vercel → Settings → Environment Variables, atau file .env buat jalanin seed lokal)');

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500,
      bufferCommands: false
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // janji koneksi gagal — buang, biar invocation berikutnya mulai bersih
    throw err;
  }
  return cached.conn;
}

module.exports = dbConnect;
