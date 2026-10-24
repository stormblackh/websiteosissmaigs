/* Model Event — schema Mongoose, mapping 1:1 dengan markup HTML detail & papan.
   Dipake oleh api/events* (baca) dan seed.js (tulis). */

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  slug:      { type: String, required: true, unique: true, index: true }, // "talent" → /event/talent.html & /api/events/talent
  judul:     { type: String, required: true },
  eyebrow:   { type: String, default: '' },   // mis. "Seni & Panggung · Bidang 4"
  status:    { type: String, enum: ['live', 'done'], default: 'live', index: true },
  accent:    { type: String, default: '#9C381C' }, // --ev-accent per event
  banner: {
    id:  { type: String, default: '' },  // public_id Cloudinary (flat root), mis. "talent-b"
    alt: { type: String, default: '' }
  },
  meta: {               // versi panjang — halaman detail
    tanggal: { type: String, default: '' },
    jam:     { type: String, default: '' },
    lokasi:  { type: String, default: '' },
    htm:     { type: String, default: '' }
  },
  ringkas: {            // versi pendek — kartu/baris di papan Event.html
    tanggal: { type: String, default: '' },
    lokasi:  { type: String, default: '' },
    jam:     { type: String, default: '' }
  },
  lead:      { type: String, default: '' },
  deskripsi: { type: [String], default: [] }, // 2 paragraf "Tentang Event"
  poin:      { type: [String], default: [] }, // bullet <ul> di detail
  lomba: {               // NULL kalau event gak punya lomba (aturan Ardraxis: hanya event live yang punya)
    deadline:       { type: String, default: '' },
    deadlinePendek: { type: String, default: '' },
    bidang:      { type: [String], default: [] },
    bidangPapan: { type: String, default: '' }, // ringkasan bidang buat papan lomba
    link:        { type: String, default: '' }, // Google Form dulu (Fase 3: form internal)
    cp:          { type: String, default: '' }
  },
  galeri: { type: [{ id: String, alt: String }], default: [] }, // HANYA diisi kalau status done
  urutan: { type: Number, default: 0 } // urutan tampil di board
}, { versionKey: false });

/* Pattern serverless: kalau module ini ke-require ulang di invocation yang
   sama (warm start), mongoose.models.Event udah ada — jangan di-overwrite. */
module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);
