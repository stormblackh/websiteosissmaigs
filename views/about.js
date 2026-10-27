/* Halaman About Us (/aboutus) — isi <main>.
   Struktur & isi mengikuti situs lama osissmaigs.com (kabinet Ardraxis
   2025/2026), diadaptasi ke tema Orvèlion 2026/2027 + bahasa Inggris:
   · s1 — identitas: siapa kita (pola page-head ala halaman Event)
   · s2 — kabinet: nama + filosofi kerja (padanan bagian "tentang
           Ardraxis" di situs lama; arti nama belum ada datanya →
           lorem + penanda GANTI-NAMA, konvensi sama dengan home.js)
   · s3 — kabinet-kabinet sebelumnya: Ardraxis, Valiance, Asteration,
           Credence (data dari situs lama, digeser satu periode)
   Semua kelas CSS (page-head, name-*, vm-*) dipakai ulang dari tema —
   tanpa nambah CSS baru. Kontak & sosmed sudah termuat di footer. */

module.exports = function about() {
  return `
        <section class="section s1">
            <div class="page-head">
                <p class="eyebrow">OSIS SMA IGS · 2026/2027</p>
                <h1>About Us</h1>
                <p class="page-lead">
                    Orv&egrave;lion — the student council cabinet of
                    SMA Ignatius Global School for the 2026/2027 period.
                </p>
            </div>
        </section>
        <div class="section s2">
            <div class="name-story">
                <p class="eyebrow">01 · The Cabinet</p>
                <h2 class="name-wordmark">Orv<span class="grave">&egrave;</span>lion</h2>
                <div class="name-grid">
                    <div class="name-text">
                        <!-- GANTI-NAMA: lorem setelah kalimat pertama =
                             arti/cerita nama Orvèlion, tinggal ganti dengan
                             versi resminya (konvensi sama dengan home.js). -->
                        <p>
                            Orv&egrave;lion is the name of the student council
                            cabinet of SMA Ignatius Global School for the
                            2026/2027 period. Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.
                        </p>
                        <p>
                            A council that stands tall and holds firm through
                            every problem and conflict — one that dares to
                            work, dares to grow tired, and dares to take
                            responsibility for everything it carries.
                        </p>
                    </div>
                    <aside class="name-aside">
                        <p class="name-quote">Rise Together,<br>Thrive forever</p>
                    </aside>
                </div>
            </div>
        </div>
        <div class="section s3">
            <p class="eyebrow">02 · Past Cabinets</p>
            <h2>The Lineage Before Us</h2>
            <div class="vm-grid">
                <div class="vm-visi">
                    <blockquote class="visi-quote">
                        One school, one story — every cabinet
                        carries it forward, year after year.
                    </blockquote>
                </div>
                <ol class="vm-misi">
                    <li>
                        <span class="no">01</span>
                        <span class="tx"><strong>Ardraxis</strong> — the student
                        council cabinet of SMA Ignatius Global School,
                        2025/2026.</span>
                    </li>
                    <li>
                        <span class="no">02</span>
                        <span class="tx"><strong>Valiance</strong> — the student
                        council cabinet of SMA Ignatius Global School,
                        2024/2025.</span>
                    </li>
                    <li>
                        <span class="no">03</span>
                        <span class="tx"><strong>Asteration</strong> — the student
                        council cabinet of SMA Ignatius Global School,
                        2023/2024.</span>
                    </li>
                    <li>
                        <span class="no">04</span>
                        <span class="tx"><strong>Credence</strong> — the student
                        council cabinet of SMA Ignatius Global School,
                        2022/2023.</span>
                    </li>
                </ol>
            </div>
        </div>`;
};
