/* Model Event — schema Mongoose, mapping 1:1 dengan markup HTML detail & papan.
   Dipake oleh api/events* (baca) dan seed.js (tulis). */

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  slug:      { type: String, required: true, unique: true, index: true }, // "talent" → /event/talent & /api/events/talent
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
  ringkas: {            // versi pendek — kartu/baris di papan /event
    tanggal: { type: String, default: '' },
    lokasi:  { type: String, default: '' },
    jam:     { type: String, default: '' }
  },
  lead:      { type: String, default: '' },
  deskripsi: { type: [String], default: [] }, // 2 paragraf "Tentang Event"
  poin:      { type: [String], default: [] }, // bullet <ul> di detail
  lomba: {               // NULL kalau event gak punya lomba (aturan: hanya event live yang punya).
                         // Kotak 3-keadaan di detail dirender dari sini: items[] = "Pilih Lomba" + panel pendaftaran.
    deadline:       { type: String, default: '' },
    deadlinePendek: { type: String, default: '' },
    judulPapan:   { type: String, default: '' }, // judul baris "Pendaftaran Lomba" di papan /event
    bidangPapan:  { type: String, default: '' }, // ringkasan bidang buat baris papan /event
    catatan:      { type: String, default: '' }, // teks keadaan "Detail" di kotak lomba
    cp:           { type: String, default: '' }, // narahubung keadaan "Detail" (per-lomba: items[].cp)
    items: {               // 1 item = 1 lomba (id bebas — dipakai data-godaftar/data-lomba)
      type: [{
        id:      { type: String, default: '' },   // 'solo', 'dance', ...
        nama:    { type: String, default: '' },   // judul baris lomba
        ringkasBaris: { type: String, default: '' }, // teks kecil baris "Pilih Lomba"
        ringkas: { type: String, default: '' },   // tag kecil di panel pendaftaran ("3–7 peserta · durasi maks. 6 menit")
        syarat:  { type: [String], default: [] }, // isi bebas — apa aja syaratnya
        link:    { type: String, default: '' },   // Google Form per lomba (Fase 3: form internal)
        cp:      { type: String, default: '' }
      }],
      default: []
    }
  },
  galeri: { type: [{ id: String, alt: String }], default: [] }, // HANYA diisi kalau status done
  urutan: { type: Number, default: 0 } // urutan tampil di board
}, { versionKey: false });

/* Pattern serverless: kalau module ini ke-require ulang di invocation yang
   sama (warm start), mongoose.models.Event udah ada — jangan di-overwrite. */
module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);
