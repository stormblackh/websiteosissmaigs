/* ============================================================================
   DATA EVENT ORVÈLION — MODE DUMMY (lihat fungsi doang)
   ----------------------------------------------------------------------------
   Semua konten = lorem ipsum, SEMUA FOTO DIHAPUS (banner: null + galeri
   kosong → views otomatis nampilin placeholder krem, gak ada <img> sama
   sekali, gak pernah ada foto pecah). Struktur & fungsi tetap utuh 100%:

   · papan /event  : 1 kartu live (placeholder) + baris pendaftaran lomba
                     + 5 baris Dokumentasi (galeri otomatis hilang — kosong)
   · detail/overlay: kotak lomba 3-KEADAAN tetap jalan (Detail → Pilih
                     Lomba → Pendaftaran) — semua teksnya lorem.

   Isi konten asli lagi? Edit di sini (satu tempat): ganti teks lorem, isi
   banner.id + banner.alt, isi galeri[] — foto & galeri otomatis balik.

   Dipake di 3 tempat:
   1. server.js    → render halaman /event + /event/<slug> (DB dulu, file ini
                     fallbacknya — jalur sama kayak API, gak pernah selisih).
   2. seed.js      → nyalin data ini ke MongoDB Atlas (sekali jalanin).
   3. api/events*  → FALLBACK: kalau database belum diset / belum konek, API
                     tetap ngirim data dari sini. Jadi situs gak pernah mati.

   Catatan slug: sengaja TETAP (talent, literasi, dst.) supaya URL & fungsi
   gak berubah pas isi dummy — slug itu identitas, bukan konten.
   ========================================================================== */

module.exports = [

/* ------------------------------------------------------------------ */
  {
    slug: 'talent',
    judul: 'Lorem Ipsum Dolor 01',
    eyebrow: 'Lorem Ipsum · Lorem 01',
    status: 'live', // SATU-satunya event live di papan (aturan: satu event per waktu)
    accent: '#9C381C',
    banner: null, // DUMMY: tanpa foto → views render placeholder, bukan <img>
    meta: {
      tanggal: 'Lorem 20–29 Ipsum 2026',
      jam: 'Lorem 15.30–21.00',
      lokasi: 'Lorem ipsum dolor sit amet',
      htm: 'Lorem ipsum — consectetur adipiscing elit'
    },
    ringkas: {
      tanggal: 'Lorem 20–29 Ipsum 2026',
      lokasi: 'Lorem Ipsum Dolor',
      jam: 'Lorem 15.30–21.00'
    },
    lead: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit — sed do eiusmod tempor incididunt ut labore.',
    deskripsi: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    ],
    poin: [
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit',
      'Sed do eiusmod tempor incididunt'
    ],
    // DUMMY: kotak lomba 3-keadaan tetap dirender dari shape ini
    // (judulPapan = baris "Pendaftaran Lomba" di papan; catatan & cp = keadaan
    //  Detail; items[] = baris "Pilih Lomba" + panel pendaftarannya).
    lomba: {
      deadline: 'Lorem 12 Ipsum 2026',
      deadlinePendek: 'Lorem 12 Ipsum',
      judulPapan: 'Lorem Ipsum Dolor 01 — Lorem',
      catatan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore — ut enim ad minim veniam, quis nostrud.',
      cp: 'Lorem Ipsum · WA: 08xx-xxxx-xxxx',
      bidangPapan: 'Lorem ipsum · consectetur · adipiscing · elit',
      items: [
        {
          id: 'solo',
          nama: 'Lorem Ipsum 01',
          ringkasBaris: 'Lorem ipsum dolor sit amet',
          ringkas: 'Lorem ipsum · dolor sit amet',
          syarat: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
            'Nisi ut aliquip ex ea commodo consequat.',
            'Duis aute irure dolor in reprehenderit in voluptate velit esse.'
          ],
          link: '#',
          cp: 'Lorem Ipsum · WA: 08xx-xxxx-xxxx'
        },
        {
          id: 'dance',
          nama: 'Lorem Ipsum 02',
          ringkasBaris: 'Sed do eiusmod tempor incididunt',
          ringkas: 'Sed do · eiusmod tempor',
          syarat: [
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
            'Nisi ut aliquip ex ea commodo consequat.',
            'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
          ],
          link: '#',
          cp: 'Lorem Ipsum · WA: 08xx-xxxx-xxxx'
        },
        {
          id: 'band',
          nama: 'Lorem Ipsum 03',
          ringkasBaris: 'Ut enim ad minim veniam',
          ringkas: 'Ut enim · ad minim veniam',
          syarat: [
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
            'Nisi ut aliquip ex ea commodo consequat.',
            'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          ],
          link: '#',
          cp: 'Lorem Ipsum · WA: 08xx-xxxx-xxxx'
        },
        {
          id: 'bebas',
          nama: 'Lorem Ipsum 04',
          ringkasBaris: 'Nisi ut aliquip commodo consequat',
          ringkas: 'Nisi ut · aliquip consequat',
          syarat: [
            'Nisi ut aliquip ex ea commodo consequat.',
            'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco.'
          ],
          link: '#',
          cp: 'Lorem Ipsum · WA: 08xx-xxxx-xxxx'
        }
      ]
    },
    galeri: [],
    urutan: 1
  },

/* ------------------------------------------------------------------ */
  {
    slug: 'literasi',
    judul: 'Lorem Ipsum Dolor 02',
    eyebrow: 'Lorem Ipsum · Lorem 02',
    status: 'done',
    accent: '#D9530D',
    banner: null, // DUMMY: tanpa foto
    meta: {
      tanggal: 'Lorem 19–23 Ipsum 2026',
      jam: 'Lorem 07.30–15.00',
      lokasi: 'Lorem ipsum dolor sit amet',
      htm: 'Lorem ipsum — consectetur adipiscing elit'
    },
    ringkas: {
      tanggal: 'Lorem 19–23 Ipsum 2026',
      lokasi: '',
      jam: ''
    },
    lead: 'Lorem ipsum dolor sit amet — consectetur adipiscing elit sed do eiusmod tempor.',
    deskripsi: [
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      'Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.'
    ],
    poin: [
      'Sed do eiusmod tempor',
      'Incididunt ut labore et dolore',
      'Magna aliqua consectetur'
    ],
    lomba: null,
    galeri: [],
    urutan: 2
  },

/* ------------------------------------------------------------------ */
  {
    slug: 'baksos',
    judul: 'Lorem Ipsum Dolor 03',
    eyebrow: 'Lorem Ipsum · Lorem 03',
    status: 'done',
    accent: '#E6B1B5',
    banner: null, // DUMMY: tanpa foto
    meta: {
      tanggal: 'Lorem 3 Ipsum 2026',
      jam: 'Lorem 07.00–12.00',
      lokasi: 'Lorem ipsum dolor sit amet',
      htm: 'Lorem ipsum — consectetur adipiscing elit'
    },
    ringkas: { tanggal: 'Lorem 3 Ipsum 2026', lokasi: '', jam: '' },
    lead: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    deskripsi: [
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse. Lorem ipsum dolor sit amet, consectetur.'
    ],
    poin: [
      'Ut enim ad minim veniam',
      'Quis nostrud exercitation',
      'Ullamco laboris nisi'
    ],
    lomba: null,
    galeri: [],
    urutan: 3
  },

/* ------------------------------------------------------------------ */
  {
    slug: 'classmeet',
    judul: 'Lorem Ipsum Dolor 04',
    eyebrow: 'Lorem Ipsum · Lorem 04',
    status: 'done',
    accent: '#C79A5B',
    banner: null, // DUMMY: tanpa foto
    meta: {
      tanggal: 'Lorem 19–20 Ipsum 2026',
      jam: 'Lorem 07.00–16.00',
      lokasi: 'Lorem ipsum dolor sit amet',
      htm: 'Lorem ipsum — consectetur adipiscing elit'
    },
    ringkas: { tanggal: 'Lorem 19–20 Ipsum 2026', lokasi: '', jam: '' },
    lead: 'Ut enim ad minim veniam — quis nostrud exercitation ullamco laboris.',
    deskripsi: [
      'Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
    ],
    poin: [
      'Nisi ut aliquip',
      'Ex ea commodo consequat',
      'Duis aute irure dolor'
    ],
    lomba: null,
    galeri: [],
    urutan: 4
  },

/* ------------------------------------------------------------------ */
  {
    slug: 'poi',
    judul: 'Lorem Ipsum Dolor 05',
    eyebrow: 'Lorem Ipsum · Lorem 05',
    status: 'done',
    accent: '#B4552D',
    banner: null, // DUMMY: tanpa foto
    meta: {
      tanggal: 'Lorem 7–9 Ipsum 2026',
      jam: 'Lorem 07.00–16.00',
      lokasi: 'Lorem ipsum dolor sit amet',
      htm: 'Lorem ipsum — consectetur adipiscing elit'
    },
    ringkas: { tanggal: 'Lorem 7–9 Ipsum 2026', lokasi: '', jam: '' },
    lead: 'Nisi ut aliquip ex ea commodo consequat — duis aute irure dolor.',
    deskripsi: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.'
    ],
    poin: [
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit',
      'Voluptate velit esse'
    ],
    lomba: null,
    galeri: [],
    urutan: 5
  },

/* ------------------------------------------------------------------ */
  {
    slug: 'mpo',
    judul: 'Lorem Ipsum Dolor 06',
    eyebrow: 'Lorem Ipsum · Lorem 06',
    status: 'done',
    accent: '#FD8C5A',
    banner: null, // DUMMY: tanpa foto
    meta: {
      tanggal: 'Lorem 14–15 Ipsum 2026',
      jam: 'Lorem 07.00–15.30',
      lokasi: 'Lorem ipsum dolor sit amet',
      htm: 'Lorem ipsum — consectetur adipiscing elit'
    },
    ringkas: { tanggal: 'Lorem 14–15 Ipsum 2026', lokasi: '', jam: '' },
    lead: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
    deskripsi: [
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Sed do eiusmod tempor incididunt.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi ut aliquip ex ea commodo consequat.'
    ],
    poin: [
      'Ut enim ad minim',
      'Veniam quis nostrud',
      'Exercitation ullamco'
    ],
    lomba: null,
    galeri: [],
    urutan: 6
  }

];
