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
                <!-- GANTI-LEAD: lorem placeholder — ganti dengan deskripsi
                     singkat situs (kalimat asli versi English disimpan di
                     riwayat git commit 5e51cc0). -->
                <p class="hero-lead">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua ut enim ad minim veniam.
                </p>
                <div class="hero-cta">
                    <a class="btn-solid" href="/event">See Events →</a>
                    <a class="btn-ghost" href="/aboutus">About Us</a>
                </div>
                <!-- elemen pendukung: logo kabinet sebagai jangkar visual hero -->
                <div class="hero-visual" aria-hidden="true">
                    <img src="${LOGO(512)}" alt="">
                </div>
            </div>
            <!-- statistik statis: ganti angka 32 & 8 dengan data asli kabinet -->
            <!-- realignment: dipindah keluar kolom hero -> strip di dasar section -->
            <p class="hero-stats">
                <span><strong>32</strong> members</span>
                <span aria-hidden="true">·</span>
                <span><strong>8</strong> divisions</span>
                <span aria-hidden="true">·</span>
                <span><strong>3</strong> annual events</span>
            </p>
        </div>
        <div class="section s2">
            <!-- GANTI-NAMA: teks lorem di bawah cuma placeholder —
                 tinggal ganti dengan arti/cerita asli nama Orvèlion -->
            <div class="name-story">
                <p class="eyebrow">01 · Meaning of the Name</p>
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
            <!-- GANTI-VISI-MISI: teks visi & 4 poin misi di bawah lorem
                 placeholder. Ganti dengan visi & misi resmi kabinet kamu
                 (versi English awal disimpan di riwayat git 5e51cc0). -->
            <p class="eyebrow">02 · Cabinet Foundation</p>
            <h2>Vision &amp; Mission</h2>
            <div class="vm-grid">
                <div class="vm-visi">
                    <blockquote class="visi-quote">
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua — ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip.
                    </blockquote>
                </div>
                <ol class="vm-misi">
                    <li>
                        <span class="no">01</span>
                        <span class="tx">Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit, sed do eiusmod tempor incididunt ut labore.</span>
                    </li>
                    <li>
                        <span class="no">02</span>
                        <span class="tx">Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo.</span>
                    </li>
                    <li>
                        <span class="no">03</span>
                        <span class="tx">Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
                    </li>
                    <li>
                        <span class="no">04</span>
                        <span class="tx">Excepteur sint occaecat cupidatat non
                        proident, sunt in culpa qui officia deserunt mollit anim.</span>
                    </li>
                </ol>
            </div>
        </div>`;
};
