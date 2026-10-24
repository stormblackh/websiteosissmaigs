/* ============================================================================
   DATA EVENT ORVÈLION — single source of truth
   ----------------------------------------------------------------------------
   File ini salinan 1:1 dari konten HTML yang sekarang (semua yang bertanda
   GANTI-SAMPLE di HTML, di sini juga masih sample — tandanya kebawa).

   Dipake di 2 tempat:
   1. seed.js     → nyalin data ini ke MongoDB Atlas (sekali jalanin).
   2. api/events* → FALLBACK: kalau database belum diset / belum konek, API
                    tetap ngirim data dari sini. Jadi situs gak pernah mati.

   Ganti konten event? Edit di sini sekali, terus `npm run seed`.
   Saat frontend masih HTML statis: ganti juga di HTML-nya (dua-duanya sampai
   renderEvents() aktif — lihat docs/ROADMAP-ARSITEKTUR.md §3).
   ========================================================================== */

module.exports = [

  /* ------------------------------------------------------------------ */
  {
    slug: 'literasi',
    judul: 'Pekan Literasi Ignatius 2026',
    eyebrow: 'Bahasa & Sastra · Bidang 1',
    status: 'live', // live = tampil di papan "Sedang Berlangsung"
    accent: '#D9530D',
    banner: {
      id: 'literasi-b',
      alt: 'Siswa membaca buku di pojok baca pameran Pekan Literasi'
    },
    meta: { // versi panjang — dipake di halaman detail
      tanggal: '19–23 Oktober 2026',
      jam: '07.30–15.00 WIB',
      lokasi: 'Perpustakaan & Aula SMA IGS',
      htm: 'Gratis — terbuka untuk semua siswa'
    },
    ringkas: { // versi pendek — dipake di kartu papan Event.html
      tanggal: '19–23 Okt 2026',
      lokasi: 'Perpustakaan & Aula IGS',
      jam: '07.30–15.00'
    },
    lead: 'Sepekan penuh merayakan kegembiraan membaca — pameran buku, pojok baca yang nyaman, dan lomba resensi seru, hadir untuk semua siswa.',
    deskripsi: [
      'Pekan Literasi Ignatius adalah perayaan tahunan dunia baca yang digagas supaya budaya membaca tidak berhenti di ruang kelas. Sepanjang lima hari, perpustakaan dan aula sekolah berubah menjadi ruang literasi terbuka: ada pameran buku dari koleksi sekolah dan sumbangan siswa, swap corner untuk menukar bacaan, sampai pojok baca yang bikin betah sampai jam pelajaran terakhir. Kegiatan ini sekaligus jadi ajang bagi siswa yang suka menulis — resensi terbaik akan dipajang di majalah dinding dan akun Instagram OSIS.',
      'Sekarang kita sedang di hari keempat: pameran buku dan lomba resensi masih berjalan, dan besok seluruh rangkaian ditutup dengan book talk santai bersama guru pembina. Bagi yang belum sempat mampir, kamu masih bisa datang jam istirahat atau sepulang les — pintu pojok baca tetap terbuka sampai pukul 15.00.'
    ],
    poin: [
      'Pameran buku & swap corner — koleksi sekolah plus sumbangan siswa',
      'Lomba resensi & book review, hadiah untuk tiga terbaik',
      'Book talk penutupan bersama guru pembina, Jumat 23 Oktober'
    ],
    lomba: null, // event ini gak punya blok "Pendaftaran Lomba"
    galeri: [],  // galeri dokumentasi HANYA untuk event yang selesai
    urutan: 1
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'talent',
    judul: 'Ignatius Got Talent 2026',
    eyebrow: 'Seni & Panggung · Bidang 4',
    status: 'live',
    accent: '#9C381C',
    banner: {
      id: 'talent-b',
      alt: 'Panggung pentas seni dengan penampilan siswa'
    },
    meta: {
      tanggal: 'Audisi 20 Okt – 8 Nov 2026',
      jam: '15.30–21.00 WIB',
      lokasi: 'Aula SMA IGS',
      htm: 'Final: Rp 15.000 — lewat bendahara kelas'
    },
    ringkas: {
      tanggal: 'Audisi: 20 Okt–8 Nov 2026',
      lokasi: 'Aula IGS',
      jam: '15.30–21.00'
    },
    lead: 'Panggung terbesar tahun ini untuk seluruh bakat Ignatians — sekarang masuk babak audisi, dan gelombang pendaftaran terakhir masih dibuka.',
    deskripsi: [
      'Ignatius Got Talent 2026 sudah masuk babak audisi! Formatnya sederhana tapi menegangkan: siapa pun boleh mendaftar — solo, grup, atau band — lalu tampil di depan kurator yang memilih finalis terbaik untuk grand final malam puncak, Sabtu 14 November. Kurasi dibuat hangat karena penonton ikut menentukan lewat applause meter, jadi dukungan kelas kamu beneran berpengaruh pada hasil.',
      'Audisi digelar tiap sore sepulang KBM di aula, jadi masih ada waktu buat latihan. Peserta yang lolos mendapat jadwal latihan teknis dan cek panggung dua hari sebelum acara supaya setiap penampil tampil dalam kondisi paling siap dan paling tenang.'
    ],
    poin: [
      'Audisi kategori solo, grup, dan band — tiap sore di aula',
      'Applause meter penonton — dukungan kelas dihitung',
      'Grand final malam puncak, Sabtu 14 November 2026'
    ],
    // GANTI-SAMPLE: link form + narahubung masih contoh — ganti dua nilai ini.
    lomba: {
      deadline: 'Kamis, 5 November 2026',
      deadlinePendek: '5 Nov 2026',
      bidang: [
        'Solo — vokal atau instrumen',
        'Grup dance',
        'Band lengkap',
        'Talent bebas (magic, MC, stand-up, dan lainnya)'
      ],
      bidangPapan: 'Solo vokal / instrumen · Grup dance · Band · Talent bebas',
      link: 'https://docs.google.com/forms/GANTI-LINK',
      cp: 'Rafi — Bidang 4 · WA: 08xx-xxxx-xxxx (GANTI-SAMPLE)'
    },
    galeri: [],
    urutan: 2
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'baksos',
    judul: 'Bakti Sosial “Sepenuh Hati”',
    eyebrow: 'Sosial & Kemanusiaan · Bidang 8',
    status: 'done', // done = masuk list "Dokumentasi" + galeri
    accent: '#E6B1B5',
    banner: {
      id: 'baksos-b',
      alt: 'Relawan siswa membagikan donasi bakti sosial'
    },
    meta: {
      tanggal: 'Sabtu, 3 Oktober 2026',
      jam: '07.00–12.00 WIB',
      lokasi: 'Halaman Depan SMA IGS → titip donasi',
      htm: 'Gratis — cukup bawa sumbangan'
    },
    ringkas: {
      tanggal: '3 Okt 2026', // tanggal pendek buat baris Dokumentasi
      lokasi: '',
      jam: ''
    },
    lead: 'Kebahagiaan gak harus menunggu besar — dari sumbangan kecil yang dikumpulkan bersama, kita bagi semangat kepada mereka yang lebih membutuhkan.',
    deskripsi: [
      'Bakti Sosial “Sepenuh Hati” mengumpulkan kepedulian seluruh siswa SMA IGS dan menyalurkannya ke panti asuhan serta keluarga prasejahtera di sekitar sekolah. Sepanjang September, setiap kelas mengumpulkan sumbangan barang layak pakai, buku, dan makanan kering, lalu panitia bersama wali kelas menyusun daftar penerima supaya bantuan benar-benar tepat sasaran.',
      'Di hari-H, Sabtu 3 Oktober, kegiatan dibuka dengan pengepakan bersama pagi hari di halaman sekolah, lalu dilanjutkan pengantaran rombongan ke titik-titik penerima. Terima kasih untuk semua relawan dan donatur — kebaikan kalian beneran sampai, Ignatians!'
    ],
    poin: [
      'Pengumpulan sumbangan antar kelas sepanjang September',
      'Pengepakan bersama pagi hari di halaman sekolah',
      'Pengantaran ke panti asuhan dan keluarga penerima manfaat'
    ],
    lomba: null,
    galeri: [
      { id: 'baksos-g1', alt: 'Pengepakan donasi oleh siswa' },
      { id: 'baksos-g2', alt: 'Serah terima sumbangan' },
      { id: 'baksos-g3', alt: 'Dokumentasi rombongan relawan' }
    ],
    urutan: 3
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'classmeet',
    judul: 'Class Meeting Akhir Semester',
    eyebrow: 'Olahraga & Kebersamaan · Bidang 6',
    status: 'done',
    accent: '#C79A5B',
    banner: {
      id: 'classmeet-b',
      alt: 'Pertandingan futsal antar kelas dengan suporter'
    },
    meta: {
      tanggal: 'Sabtu–Minggu, 19–20 September 2026',
      jam: '07.00–16.00 WIB',
      lokasi: 'Lapangan Utama & Indoor SMA IGS',
      htm: 'Gratis — peserta lomba per kelas'
    },
    ringkas: { tanggal: '19–20 Sep 2026', lokasi: '', jam: '' },
    lead: 'Dua hari penuh kompetisi antar kelas — gengsi kelas dipertaruhkan di lapangan: futsal, basket, e-sports, sampai lomba kreatif.',
    deskripsi: [
      'Class Meeting Akhir Semester menutup semester dengan dua hari kompetisi antar kelas yang sehat dan seru. Jenis lomba dirancang supaya semua siswa punya tempat — atlet lapangan bertanding di futsal dan basket, para gamer menguji nyali di turnamen e-sports, dan yang suka hal kreatif bisa unjuk karya lewat lomba poster serta yel-yel kelas.',
      'Seluruh poin dirangkum untuk menentukan juara umum yang namanya tercatat di piala bergilir sekolah. Suasana tepi lapangan beneran bak pep rally — cek cuplikan pertandingan terbaik di Instagram OSIS untuk melihat highlight kelas kamu.'
    ],
    poin: [
      'Futsal dan basket antar kelas',
      'Turnamen e-sports antar kelas',
      'Lomba kreatif: poster kelas dan yel-yel terbaik'
    ],
    lomba: null,
    galeri: [
      { id: 'classmeet-g1', alt: 'Suporter kelas di tepi lapangan' },
      { id: 'classmeet-g2', alt: 'Aksi pemain futsal' },
      { id: 'classmeet-g3', alt: 'Penyerahan piala juara umum' }
    ],
    urutan: 4
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'poi',
    judul: 'Pekan Olahraga Ignatians VII',
    eyebrow: 'Olahraga · Bidang 6',
    status: 'done',
    accent: '#B4552D',
    banner: {
      id: 'poi-b',
      alt: 'Pelari estafet di lapangan sekolah'
    },
    meta: {
      tanggal: '7–9 September 2026',
      jam: '07.00–16.00 WIB',
      lokasi: 'Lapangan Utama SMA IGS',
      htm: 'Gratis — peserta lomba lintas kelas'
    },
    ringkas: { tanggal: '7–9 Sep 2026', lokasi: '', jam: '' },
    lead: 'Tiga hari bakar semangat olahraga Ignatians — lomba lintas kelas dan angkatan, persaudaraan, dan piala bergilir yang paling dibanggakan.',
    deskripsi: [
      'Pekan Olahraga Ignatians (POI) VII menghidupkan lapangan sekolah selama tiga hari penuh. Ada lari estafet, futsal, basket, voli, sampai tarik tambang yang selalu jadi klimaks — semuanya diikuti tim lintas kelas dan angkatan. POI memang bukan sekadar soal medali: tradisi yel-yel dan dukungan dari tepi lapangan adalah separuh kemeriahan, dan tahun ini kelas-kelas benar-benar menyiapkan orasi bak pep rally akbar.',
      // GANTI-SAMPLE: juara umum masih contoh — ganti sesuai hasil asli.
      'Juara umum tahun ini diraih tim gabungan angkatan 2025 (SAMPLE — ganti sesuai hasil asli). Sampai jumpa di POI VIII tahun depan — mulai latihan dari sekarang, Ignatians!'
    ],
    poin: [
      'Lintasan: estafet, voli, dan tarik tambang',
      'Lapangan: futsal dan basket antar angkatan',
      'Penentuan juara umum dan penyerahan piala bergilir'
    ],
    lomba: null,
    galeri: [
      { id: 'poi-g1', alt: 'Start lomba estafet' },
      { id: 'poi-g2', alt: 'Duel voli antar angkatan' },
      { id: 'poi-g3', alt: 'Penyerahan piala juara umum' }
    ],
    urutan: 5
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'mpo',
    judul: 'Masa Pengenalan OSIS (MPO) 2026',
    eyebrow: 'Internal OSIS · Bidang 2',
    status: 'done',
    accent: '#FD8C5A',
    banner: {
      id: 'mpo-b',
      alt: 'Suasana orientasi siswa baru di kelas'
    },
    meta: {
      tanggal: '14–15 Agustus 2026',
      jam: '07.00–15.30 WIB',
      lokasi: 'Aula & Lapangan SMA IGS',
      htm: 'Gratis — seluruh siswa kelas X'
    },
    ringkas: { tanggal: '14–15 Agu 2026', lokasi: '', jam: '' },
    lead: 'Dua hari penuh pengenalan OSIS untuk adik-adik kelas X — kenalan, ketawa bareng, dan langsung jatuh cinta ke keluarga besar Ignatians.',
    deskripsi: [
      'Masa Pengenalan OSIS (MPO) adalah gerbang pertama para adik kelas X untuk mengenal kabinet Orvèlion. Selama dua hari, panitia menghadirkan ice-breaking, talkshow pengenalan divisi, dan games arena yang dirancang supaya calon anggota baru cepat akrab satu sama lain sekaligus paham cara kerja OSIS. Lebih dari sekadar orientasi, MPO menjadi panggung kecil untuk membuktikan bahwa bergabung ke organisasi itu seru dan terasa seperti pulang ke keluarga besar.',
      'Acara ditutup dengan pembukaan pendaftaran anggota baru — antusiasmenya luar biasa hingga antrean pendaftar memenuhi aula. Terima kasih adik-adik, sampai jumpa di divisi kalian masing-masing!'
    ],
    poin: [
      'Ice-breaking dan talkshow pengenalan divisi',
      'Games arena antar kelompok',
      'Pembukaan pendaftaran anggota baru OSIS'
    ],
    lomba: null,
    galeri: [
      { id: 'mpo-g1', alt: 'Materi pengenalan oleh panitia' },
      { id: 'mpo-g2', alt: 'Games lapangan MPO' },
      { id: 'mpo-g3', alt: 'Kelompok baru bersatu' }
    ],
    urutan: 6
  }

];
