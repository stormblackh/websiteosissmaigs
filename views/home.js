/* Halaman Home (/) — isi <main>.
   Konten 1:1 dengan halaman lama; penanda GANTI-* tetap ada biar gampang
   dicari pas mau isi konten asli. */

const { LOGO } = require('./cdn');

module.exports = function home() {
  return `
        <div class="section s1">
            <div class="hero">
                <p class="eyebrow">OSIS SMA IGS · 2026/2027</p>
                <h1 class="hero-title">Orv<span class="grave">è</span>lion</h1>
                <p class="hero-slogan">Rise Together, Thrive forever</p>
                <p class="hero-lead">
                    Tempat kamu nemuin semua agenda, cerita, dan orang-orang di balik
                    OSIS SMA Ignatius Global School tahun ini.
                </p>
                <div class="hero-cta">
                    <a class="btn-solid" href="/event">Lihat Event →</a>
                    <a class="btn-ghost" href="/aboutus">Tentang Kami</a>
                </div>
                <!-- elemen pendukung: logo kabinet sebagai jangkar visual hero -->
                <div class="hero-visual" aria-hidden="true">
                    <img src="${LOGO(512)}" alt="">
                </div>
            </div>
            <!-- statistik statis: ganti angka 32 & 8 dengan data asli kabinet -->
            <!-- realignment: dipindah keluar kolom hero -> strip di dasar section -->
            <p class="hero-stats">
                <span><strong>32</strong> anggota</span>
                <span aria-hidden="true">·</span>
                <span><strong>8</strong> divisi</span>
                <span aria-hidden="true">·</span>
                <span><strong>3</strong> event tahunan</span>
            </p>
        </div>
        <div class="section s2">
            <!-- GANTI-NAMA: teks lorem di bawah cuma placeholder —
                 tinggal ganti dengan arti/cerita asli nama Orvèlion -->
            <div class="name-story">
                <p class="eyebrow">01 · Makna Nama</p>
                <h2 class="name-wordmark">Orv<span class="grave">è</span>lion</h2>
                <div class="name-grid">
                    <div class="name-text">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore
                            magna aliqua.
                        </p>
                        <p>
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                            irure dolor in reprehenderit in voluptate velit esse.
                        </p>
                    </div>
                    <aside class="name-aside">
                        <p class="name-quote">Rise Together,<br>Thrive forever</p>
                    </aside>
                </div>
            </div>
        </div>
        <div class="section s3">
            <!-- GANTI-VISI-MISI: teks visi & 4 poin misi di bawah masih DRAF.
                 Ganti dengan visi & misi resmi kabinet kamu. -->
            <p class="eyebrow">02 · Fondasi Kabinet</p>
            <h2>Visi &amp; Misi</h2>
            <div class="vm-grid">
                <div class="vm-visi">
                    <blockquote class="visi-quote">
                        Menjadi rumah bagi setiap siswa SMA Ignatius Global School —
                        tempat ide didengar, bakat diasah, dan perbedaan dirayakan;
                        OSIS yang hadir untuk semua, bukan untuk segelintir.
                    </blockquote>
                </div>
                <ol class="vm-misi">
                    <li>
                        <span class="no">01</span>
                        <span class="tx">Membangun budaya di mana setiap siswa berani
                        menyuarakan idenya — dan ide itu ditindaklanjuti nyata.</span>
                    </li>
                    <li>
                        <span class="no">02</span>
                        <span class="tx">Menghadirkan agenda sekolah yang berkarakter:
                        bukan sekadar ramai, tapi meninggalkan bekas.</span>
                    </li>
                    <li>
                        <span class="no">03</span>
                        <span class="tx">Merawat kebersamaan antar kelas, divisi, dan
                        angkatan lewat kerja yang terbuka dan jujur.</span>
                    </li>
                    <li>
                        <span class="no">04</span>
                        <span class="tx">Menjaga OSIS tetap dekat dengan siswa,
                        dipercaya sekolah, dan bermanfaat bagi semua.</span>
                    </li>
                </ol>
            </div>
        </div>`;
};
