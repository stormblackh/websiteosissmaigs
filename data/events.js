/* ============================================================================
   DATA EVENT ORVÈLION — single source of truth
   ----------------------------------------------------------------------------
   Dirender jadi halaman oleh server Node.js (server.js → views/) — ganti
   konten cukup EDIT DI SINI, semua halaman ikut. Semua yang bertanda
   GANTI-SAMPLE masih contoh.

   Dipake di 3 tempat:
   1. server.js    → render halaman /event + /event/<slug> (DB dulu, file ini
                     fallbacknya — jalur sama kayak API, gak pernah selisih).
   2. seed.js      → nyalin data ini ke MongoDB Atlas (sekali jalanin).
   3. api/events*  → FALLBACK: kalau database belum diset / belum konek, API
                     tetap ngirim data dari sini. Jadi situs gak pernah mati.

   Ganti konten event? Edit di sini sekali, terus `npm run seed` kalau udah
   nyambung database (lihat docs/ROADMAP-ARSITEKTUR.md §3).
   ========================================================================== */

module.exports = [

/* ------------------------------------------------------------------ */
  {
    slug: 'talent',
    judul: 'Ignatius Got Talent 2026',
    eyebrow: 'Seni & Panggung · Bidang 4',
    status: 'live', // SATU-satunya event live di papan (aturan: satu event per waktu)
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
    // GANTI-SAMPLE: link form + narahubung tiap lomba masih contoh.
    // Kotak lomba 3-keadaan di detail dirender dari shape ini:
    //   judulPapan = judul baris "Pendaftaran Lomba" di papan /event
    //   catatan   = teks keadaan "Detail" di kotak lomba
    //   cp        = narahubung keadaan "Detail" (per-lomba ada di items[].cp)
    //   items[]   = baris "Pilih Lomba" + panel pendaftarannya (id bebas,
    //               syarat bebas diisi apa aja — jangan dobel id antar item;
    //               ringkasBaris = teks kecil baris "Pilih Lomba",
    //               ringkas = tag kecil di panel pendaftarannya)
    lomba: {
      deadline: 'Kamis, 5 November 2026',
      deadlinePendek: '5 Nov 2026',
      judulPapan: 'Ignatius Got Talent 2026 — Audisi',
      catatan: 'Gelombang terakhir pendaftaran masih dibuka — kuota terbatas, jadi buruan amankan slot-nya. Pilih bidang lombamu dulu di bawah; tiap bidang punya syarat & ketentuan dan formulir pendaftarannya sendiri.',
      cp: 'Rafi — Bidang 4 · WA: 08xx-xxxx-xxxx (GANTI-SAMPLE)',
      bidangPapan: 'Solo vokal / instrumen · Grup dance · Band · Talent bebas',
      items: [
        {
          id: 'solo',
          nama: 'Solo — Vokal atau Instrumen',
          ringkasBaris: '1 peserta · durasi maks. 5 menit',
          ringkas: '1 peserta · durasi maks. 5 menit',
          syarat: [
            'Peserta siswa aktif SMA IGS — satu orang per pendaftaran.',
            'Isi formulir dan tempel link video perkenalan/bakat maksimal 2 menit (YouTube/Google Drive, pastikan bisa dilihat publik).',
            'Siapkan satu lagu atau karya bebas, bebas bahasa, lirik bersih dari SARA dan kata kasar.',
            'Durasi penampilan audisi maksimal 5 menit (vokal) / 7 menit (instrumen).',
            'Backing track atau kebutuhan khusus dikumpulkan maksimal H-2 hari audisi ke panitia.'
          ],
          link: 'https://docs.google.com/forms/GANTI-LINK',
          cp: 'Rafi — Bidang 4 · WA: 08xx-xxxx-xxxx (GANTI-SAMPLE)'
        },
        {
          id: 'dance',
          nama: 'Grup Dance',
          ringkasBaris: '3–7 peserta · durasi maks. 6 menit',
          ringkas: '3–7 peserta · durasi maks. 6 menit',
          syarat: [
            'Anggota 3–7 siswa aktif SMA IGS — boleh campur angkatan.',
            'Satu pendaftaran per grup: tulis nama grup dan seluruh anggotanya di formulir.',
            'Tempel link video latihan maksimal 2 menit (YouTube/Google Drive publik).',
            'Koreografi dan kostum sopan; lagu bebas tanpa kata kasar.',
            'Tanpa properti berbahaya (api, pecah belah, cairan).',
            'Musik dikumpulkan maksimal H-2 audisi dalam format MP3/WAV.'
          ],
          link: 'https://docs.google.com/forms/GANTI-LINK',
          cp: 'Rafi — Bidang 4 · WA: 08xx-xxxx-xxxx (GANTI-SAMPLE)'
        },
        {
          id: 'band',
          nama: 'Band Lengkap',
          ringkasBaris: '3–8 peserta · durasi maks. 10 menit',
          ringkas: '3–8 peserta · durasi maks. 10 menit',
          syarat: [
            'Anggota 3–8 siswa aktif SMA IGS — vokal ditambah minimal dua instrumen.',
            'Satu pendaftaran per band: nama band, nama tiap personel, dan posisinya.',
            'Tempel link video penampilan maksimal 3 menit (YouTube/Google Drive publik).',
            'Siapkan daftar dua lagu (satu audisi, satu cadangan), lirik bersih.',
            'Panitia hanya menyediakan sound system dan listrik — alat musik bawa sendiri.',
            'Sound check wajib H-1 sesi audisi.'
          ],
          link: 'https://docs.google.com/forms/GANTI-LINK',
          cp: 'Rafi — Bidang 4 · WA: 08xx-xxxx-xxxx (GANTI-SAMPLE)'
        },
        {
          id: 'bebas',
          nama: 'Talent Bebas',
          ringkasBaris: '1–5 peserta · magic, MC, stand-up, dll.',
          ringkas: '1–5 peserta · durasi maks. 7 menit',
          syarat: [
            'Kategori bebas di luar vokal/dance/band — magic, MC, stand-up, puisi, beatbox, dan lainnya.',
            'Peserta 1–5 siswa aktif SMA IGS.',
            'Isi formulir + tulis deskripsi bakat dan kebutuhan panggung (properti, kabel, meja, dsb.).',
            'Tempel link video maksimal 2 menit (YouTube/Google Drive publik).',
            'Properti khusus wajib disetujui panitia maksimal H-3.',
            'Penampilan sesuai nilai Ignatian — sopan dan tanpa unsur berbahaya.'
          ],
          link: 'https://docs.google.com/forms/GANTI-LINK',
          cp: 'Rafi — Bidang 4 · WA: 08xx-xxxx-xxxx (GANTI-SAMPLE)'
        }
      ]
    },
    galeri: [],
    urutan: 1
  },

/* ------------------------------------------------------------------ */
  {
    slug: 'literasi',
    judul: 'Pekan Literasi Ignatius 2026',
    eyebrow: 'Bahasa & Sastra · Bidang 1',
    status: 'done', // selesai 23 Okt 2026 → pindah ke Dokumentasi + galeri
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
    ringkas: { // versi pendek — baris Dokumentasi di papan /event
      tanggal: '19–23 Okt 2026',
      lokasi: '',
      jam: ''
    },
    lead: 'Sepekan penuh merayakan kegembiraan membaca — pameran buku, pojok baca yang nyaman, dan lomba resensi seru, sukses digelar untuk semua siswa.',
    deskripsi: [
      'Pekan Literasi Ignatius adalah perayaan tahunan dunia baca yang digagas supaya budaya membaca tidak berhenti di ruang kelas. Sepanjang lima hari, perpustakaan dan aula sekolah berubah menjadi ruang literasi terbuka: ada pameran buku dari koleksi sekolah dan sumbangan siswa, swap corner untuk menukar bacaan, sampai pojok baca yang bikin betah sampai jam pelajaran terakhir. Kegiatan ini sekaligus jadi ajang bagi siswa yang suka menulis — resensi terbaik akan dipajang di majalah dinding dan akun Instagram OSIS.',
      'Rangkaian ditutup Jumat, 23 Oktober, dengan book talk santai bersama guru pembina — ramai, hangat, dan banyak cerita seru dari pojok baca. Terima kasih untuk semua siswa yang mampir, menukar buku, dan mengirim resensi; tiga resensi terbaik sudah dipajang di majalah dinding dan akun Instagram OSIS. Sampai jumpa di Pekan Literasi tahun depan, Ignatians!'
    ],
    poin: [
      'Pameran buku & swap corner — koleksi sekolah plus sumbangan siswa',
      'Lomba resensi & book review, hadiah untuk tiga terbaik',
      'Book talk penutupan bersama guru pembina, Jumat 23 Oktober'
    ],
    lomba: null, // event ini gak punya blok "Pendaftaran Lomba"
    galeri: [
      { id: 'literasi-g1', alt: 'Siswa menikmati pojok baca Pekan Literasi' },
      { id: 'literasi-g2', alt: 'Pameran buku dan swap corner' },
      { id: 'literasi-g3', alt: 'Book talk penutupan bersama guru pembina' }
    ],
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
