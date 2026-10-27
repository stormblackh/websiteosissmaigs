/* Seed / update data event Orvèlion ke MongoDB Atlas.
   ----------------------------------------------------------------------------
   Cara pakai (sekali aja, setelah MONGODB_URI ada):
     1. Salin .env.example jadi .env, isi MONGODB_URI dari MongoDB Atlas
        (Connect → Drivers → connection string mongodb+srv://...)
     2. `npm install`
     3. `npm run seed`

   Sifatnya UPSERT per slug — jalanin berulang kali aman: data lama di-update,
   bukan dobel. Ganti konten di data/events.js → jalanin lagi → database ikut. */

require('dotenv').config();
const mongoose = require('mongoose');
const dbConnect = require('./lib/db');
const Event = require('./models/Event');
const data = require('./data/events');

(async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI belum ada.');
    console.error('Isi dulu di file .env — connection string-nya ambil dari');
    console.error('MongoDB Atlas (Cluster → Connect → Drivers), lalu jalankan lagi.');
    process.exit(1);
  }

  console.log('Nyambungin ke MongoDB Atlas...');
  await dbConnect();

  for (const ev of data) {
    const { slug, ...fields } = ev;
    const hasil = await Event.findOneAndUpdate(
      { slug },
      { ...fields, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  OK  ${slug.padEnd(12)} → ${hasil.judul}`);
  }

  console.log(`Selesai: ${data.length} event aman di database.`);
  await mongoose.disconnect();
  process.exit(0);
})().catch(err => {
  console.error('SEED GAGAL:', err.message);
  process.exit(1);
});
