# Portal OSIS Orvélion (Flask)

Situs resmi Kabinet Orvélion, OSIS SMA Ignatius Global School 2026–2027.

## Menjalankan lokal

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Buka [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Struktur

- `app.py` — titik masuk
- `orvelion/` — aplikasi Flask, data konten, dan pelindung kapasitas
- `templates/` — halaman Jinja
- `static/` — CSS, JavaScript, dan gambar

## Optimasi performa (baca ini sebelum edit CSS/kelas)

1. **Tailwind sudah di-build statis** ke `static/css/tailwind.css` — situs tidak
   lagi memakai Play CDN (dulu ~400 KB JS + kompilator CSS jalan di browser
   tiap pengunjung). Setelah menambah/mengubah kelas Tailwind di `templates/`
   atau `static/js/`, **wajib jalankan lalu commit hasilnya**:

   ```bash
   tools/build-css.sh    # butuh bun (bunx) atau node (npx)
   ```

2. **Navigasi antarhalaman tanpa reload penuh** (soft navigation, PJAX) sudah
   aktif di `static/js/app.js`. HTML saja yang ditukar — CSS/JS/gambar tidak
   diunduh ulang. Matikan per-link tertentu dengan menambah `data-soft="off"`.

3. **Cache cerdas**: CSS/JS memakai versi `?v=` otomatis (mtime) + header
   `immutable` setahun; HTML `no-cache` agar limiter kapasitas selalu sahih.
   Tidak perlu mengatur apa pun manual.
