/* Struktur pengurus OSIS — sumber data halaman /aboutus.
   ----------------------------------------------------------------------------
   Cara isi konten asli: ganti nama lorem di bawah dengan nama asli anggota.
   Bentuknya bebas — jumlah board, jumlah divisi, dan jumlah anggota per
   divisi boleh ditambah/dikurang, halaman About Us ikut otomatis.
   Nama divisi pakai English (konsisten dengan bahasa UI situs); nama resmi
   Indonesian-nya kutulis di komentar tiap divisi (Sekbid 1–8 sesuai
   struktur OSIS).

   FOTO (pola osissmaigs.com — 3 foto per orang, 3 foto group per sekbid):
   - foto: []            → slot kosong, tampil LOGO sebagai placeholder
   - foto: ['id-1', ...]  → public_id Cloudinary TANPA format (.jpg
                            otomatis; lebar 480px biar hemat), atau URL
                            lengkap 'https://...' kalau bukan Cloudinary.
   - Jumlah bebas (usul: 3) → muncul slider + titik indikator. */

/* GANTI-ANGGOTA: semua nama masih lorem placeholder.
   GANTI-FOTO: semua foto masih kosong (placeholder logo). */

module.exports = {
  /* pengurus inti (di luar sekbid) — foto: 3 foto per orang (slider) */
  board: [
    { role: 'Chairperson', nama: 'Lorem Ipsum Dolor 01', foto: [] },      // Ketua Umum
    { role: 'Vice Chairperson', nama: 'Lorem Ipsum Dolor 02', foto: [] },  // Wakil Ketua
    { role: 'Secretary', nama: 'Lorem Ipsum Dolor 03', foto: [] },        // Sekretaris
    { role: 'Treasurer', nama: 'Lorem Ipsum Dolor 04', foto: [] },        // Bendahara
  ],

  /* 8 sekbid — urutan resmi Sekbid 1–8 */
  divisi: [
    {
      no: '01',
      nama: 'Planning, Administration & Finance',
      // Sekbid 1: Perencanaan, administrasi, dan keuangan
      anggota: ['Lorem Ipsum Dolor 01', 'Lorem Ipsum Dolor 02', 'Lorem Ipsum Dolor 03'],
      foto: [], // 3 foto rame-rame satu sekbid (slider)
    },
    {
      no: '02',
      nama: 'Internal Affairs & Correspondence',
      // Sekbid 2: Rumah tangga dan korespondensi
      anggota: ['Lorem Ipsum Dolor 01', 'Lorem Ipsum Dolor 02', 'Lorem Ipsum Dolor 03'],
      foto: [], // 3 foto rame-rame satu sekbid (slider)
    },
    {
      no: '03',
      nama: 'Science & Technology',
      // Sekbid 3: Ilmu pengetahuan dan teknologi
      anggota: ['Lorem Ipsum Dolor 01', 'Lorem Ipsum Dolor 02', 'Lorem Ipsum Dolor 03'],
      foto: [], // 3 foto rame-rame satu sekbid (slider)
    },
    {
      no: '04',
      nama: 'Religion, Character & Social Affairs',
      // Sekbid 4: Agama, budi pekerti luhur, dan sosial
      anggota: ['Lorem Ipsum Dolor 01', 'Lorem Ipsum Dolor 02', 'Lorem Ipsum Dolor 03'],
      foto: [], // 3 foto rame-rame satu sekbid (slider)
    },
    {
      no: '05',
      nama: 'Creative Works & Entrepreneurship',
      // Sekbid 5: Karya kreatif dan kewirausahaan
      anggota: ['Lorem Ipsum Dolor 01', 'Lorem Ipsum Dolor 02', 'Lorem Ipsum Dolor 03'],
      foto: [], // 3 foto rame-rame satu sekbid (slider)
    },
    {
      no: '06',
      nama: 'Language, Arts & Culture',
      // Sekbid 6: Bahasa, seni, dan budaya
      anggota: ['Lorem Ipsum Dolor 01', 'Lorem Ipsum Dolor 02', 'Lorem Ipsum Dolor 03'],
      foto: [], // 3 foto rame-rame satu sekbid (slider)
    },
    {
      no: '07',
      nama: 'Sports & Health',
      // Sekbid 7: Olahraga dan kesehatan
      anggota: ['Lorem Ipsum Dolor 01', 'Lorem Ipsum Dolor 02', 'Lorem Ipsum Dolor 03'],
      foto: [], // 3 foto rame-rame satu sekbid (slider)
    },
    {
      no: '08',
      nama: 'Environment & Nature Conservation',
      // Sekbid 8: Lingkungan hidup dan kelestarian alam
      anggota: ['Lorem Ipsum Dolor 01', 'Lorem Ipsum Dolor 02', 'Lorem Ipsum Dolor 03'],
      foto: [], // 3 foto rame-rame satu sekbid (slider)
    },
  ],
};
