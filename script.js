/* ============================================================
   Orvèlion — script.js (v2)
   Vanilla JS, tanpa framework. Tiga sistem, satu file:

   1) PJAX antar halaman (Home · Event · About Us)
      klik link → fetch HTML asli → DOMParser → replaceChildren
      isi main.bodys → history.pushState → fallback navigasi
      normal saat error apa pun.

   2) DETAIL OVERLAY untuk kartu event (beda implementasi,
      sistem PJAX yang sama):
      klik kartu → fetch halaman detail (/event/...) → artikel diekstrak →
      ditampilkan di panel yang "TUMBUH" dari posisi kartu yang
      diklik (animasi FLIP) → pushState (URL detail = bisa
      di-share) → back/✕/ESC/klik luar menutup.
      Detail tetap HTML asli: dibuka langsung = halaman penuh,
      Google bisa index, tanpa JS tetap jalan.

   3) KOTAK LOMBA 3-KEADAAN (.evd-lbox) di halaman detail event:
      Detail → "Lihat Lomba" → daftar lomba → "Daftar" → panel
      pendaftaran (syarat + link form per lomba). Tanpa JS semua
      keadaan tetap tampil berurutan di HTML.

   Bonus: prefetch hover/sentuh, placeholder logo saat banner
   loading (auto-hapus begitu banner siap), reveal halus saat
   scroll, semua hormat prefers-reduced-motion. Semua URL di
   konten hasil fetch di-rebase jadi absolut (foto & link tetap
   bener walau situs jalan di subpath github.io/<repo>/).
   ============================================================ */

(() => {
  'use strict';

  /* browser lama tanpa fetch/DOMParser → diam, navigasi normal */
  if (!window.fetch || !window.DOMParser) return;

  const MAIN_SEL   = 'main.bodys';
  const LEAVE_MS   = 150;   // durasi fade-out konten lama (PJAX)
  const HOVER_MS   = 90;    // jeda dwell sebelum prefetch saat hover
  const TIMEOUT_MS = 5000;  // fetch macet > 5 detik → abort → fallback
  const FLIP_MS    = 300;   // durasi animasi overlay menutup

  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cache = new Map();  // URL → Promise<html string>
  let currentPath = pagePath(location.href);
  let busy = false;         // sedang PJAX swap
  let io = null;            // IntersectionObserver reveal

  /* ---------------- util ---------------- */

  /* segmen terakhir path = id halaman ("/" → 'index.html'); id ini dipakai
     buat sinkron nav & deteksi halaman sama — jalan untuk URL bersih
     (/event, /event/talent) maupun URL .html lama. */
  function pagePath(url) {
    return new URL(url, location.href).pathname.split('/').pop() || 'index.html';
  }

  /* null kalau bukan link internal (http lain, mailto:, tel:, dll) */
  function internalURL(href) {
    try {
      const u = new URL(href, location.href);
      return u.origin === location.origin ? u : null;
    } catch {
      return null;
    }
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* html punya scroll-behavior:smooth — matikan sekejap biar instan */
  function instantTop() {
    const el = document.documentElement;
    const keep = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    el.style.scrollBehavior = keep;
  }

  /* ---------------- rebase URL konten hasil fetch ----------------
     Konten hasil fetch membawa URL RELATIF milik halaman ASALNYA
     (contoh: <img src="../Img/x.jpg"> dari halaman detail). Begitu
     di-inject ke halaman yang sedang dibuka, browser me-resolve
     path itu terhadap HALAMAN INI — bukan halaman asal. Di situs
     subpath (username.github.io/<repo>/) efeknya fatal: "../" naik
     keluar repo → 404 → foto overlay gak pernah muncul, padahal
     dibuka langsung fotonya normal.
     Solusi: sebelum injeksi, semua URL relatif diubah jadi ABSOLUT
     terhadap halaman asal kontennya — jalan di root, subpath,
     maupun server lokal. */

  const SKIP_URL = /^(data:|blob:|javascript:|mailto:|tel:|about:|#)/i;

  function rebaseURLs(root, baseURL) {
    const abs = (raw) => {
      try { return new URL(raw, baseURL).href; } catch { return raw; }
    };
    const fixSrcset = (raw) =>
      raw.split(',')
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => c.replace(/^(\S+)([\s\S]*)$/, (_, u, rest) => abs(u) + rest))
        .join(', ');

    root.querySelectorAll('img, source, video, audio, script, iframe, embed, track, a')
      .forEach((el) => {
        [['src', abs], ['srcset', fixSrcset], ['href', abs], ['poster', abs]].forEach(([at, fn]) => {
          const v = el.getAttribute(at);
          if (!v || SKIP_URL.test(v.trim())) return;
          el.setAttribute(at, fn(v));
        });
      });
  }

  /* ---------------- fetch + cache ---------------- */

  function getHTML(url) {
    if (!cache.has(url)) {
      cache.set(
        url,
        fetch(url, {
          credentials: 'same-origin',
          signal: window.AbortSignal.timeout ? AbortSignal.timeout(TIMEOUT_MS) : undefined,
        })
          .then((res) => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
          })
          .catch((err) => {
            cache.delete(url); // gagal → buang, klik berikutnya bisa coba lagi
            throw err;
          })
      );
    }
    return cache.get(url);
  }

  /* ---------------- placeholder logo → banner fade-in ----------------
     Selama gambar belum siap, [data-lz] menampilkan latar krem + logo
     (dari CSS). Begitu <img> selesai (atau sudah cache), pasang .img-in
     → banner fade-in, logo otomatis lenyap. Gagal load → .img-err,
     placeholder logo tetap tampil (gak pernah kosong).

     PENTING — "selesai" di sini = bitmap sudah DECODE dan siap dipaint,
     bukan sekadar "file sudah di cache". Tanpa decode(), gambar yang
     ke-cache langsung .img-in → watermark lenyap tapi bitmap belum siap
     → penonton lihat kotak kosong lalu foto muncul mendadak tanpa
     transisi (terasa "gak ada loading sama sekali"). */

  function initLazyImages(root) {
    root.querySelectorAll('[data-lz] > img').forEach((img) => {
      const wrap = img.parentElement;
      if (wrap.classList.contains('img-in') || wrap.classList.contains('img-err')) return;
      const markIn  = () => wrap.classList.add('img-in');
      const markErr = () => { if (!wrap.classList.contains('img-in')) wrap.classList.add('img-err'); };
      /* file sudah ada di memori → tunggu decode siap dipaint, baru fade-in.
         (decode() menunggu load+decode; kalau browser lama gak punya,
         langsung fade-in seperti dulu.) */
      const settle = () => {
        if (img.decode) img.decode().then(markIn, markIn);
        else markIn();
      };
      if (img.complete) {
        img.naturalWidth ? settle() : markErr();   // gagal duluan → placeholder
      } else {
        img.addEventListener('load',  settle,  { once: true });
        img.addEventListener('error', markErr, { once: true });
      }
    });
  }

  /* ---------------- reveal saat scroll (s2/s3, papan event) ---------------- */

  function initReveal(root) {
    const els = root.querySelectorAll('.section:not(.s1)');
    if (!els.length) return;

    if (!motionOK || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in')); // langsung tampil
      return;
    }

    io && io.disconnect();
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target); // sekali saja, tidak berulang
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => {
      if (!el.classList.contains('in')) io.observe(el);
    });
  }

  /* ---------------- sinkron nav aktif + judul ---------------- */

  function syncNav(page) {
    const links = Array.from(document.querySelectorAll('header nav.link a'));
    /* halaman detail (/event/*) menandai nav lewat body[data-nav];
       kalau nama file gak cocok nav mana pun, pakai penanda itu */
    const match = links.find((a) => pagePath(a.getAttribute('href')) === page);
    const want = match ? page : document.body.dataset.nav;
    links.forEach((a) => {
      const on = pagePath(a.getAttribute('href')) === want;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  /* <script> dalam konten hasil fetch tidak dieksekusi otomatis —
     injeksi ulang satu-per-satu biar jalan */
  function runScripts(root) {
    root.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      Array.from(old.attributes).forEach((at) => s.setAttribute(at.name, at.value));
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }

  /* favicon: setelah pushState (URL ganti), browser bisa minta ulang
     <link rel=icon> dan me-resolve href relatifnya dari URL BARU —
     dari halaman lain foldernya bisa 404 (contoh "../Img/Logo.jpeg"
     di-resolve dari URL halaman lain). Sinkronkan ikon dari halaman target
     dalam bentuk ABSOLUT supaya selalu bener. */
  function syncIcon(doc, baseURL) {
    const live = document.querySelector('link[rel~="icon"]');
    const next = doc.querySelector('link[rel~="icon"]');
    if (!live || !next) return;
    const href = next.getAttribute('href');
    if (!href) return;
    try { live.href = new URL(href, baseURL).href; } catch { /* biarkan */ }
  }

  /* ---------------- SISTEM 3 — KOTAK LOMBA 3-KEADAAN ----------------
     Kotak "Pendaftaran Lomba" (.evd-lbox) di halaman detail event:
       Detail → tombol "Lihat Lomba" → daftar lomba → tombol "Daftar"
       → panel pendaftaran lomba itu (syarat + link form).
     Semua keadaan udah ada di HTML — tanpa JS dia tampil berurutan
     (CSS nge-highlight cuma panel .is-on saat html.js nyala).
     JS cuma mindahin class .is-on antar panel + jaga posisi scroll
     & fokus. Dipasang di 3 titik: load awal, selesai PJAX swap,
     dan begitu isi overlay di-inject (listener gak ikut kebawa
     sama fetch, jadi wajib dipasang ulang tiap injeksi). */

  function initLombaBox(root) {
    root.querySelectorAll('.evd-lbox').forEach((box) => {
      if (box.dataset.lboxReady) return; // udah dipasang (overlay cache)
      box.dataset.lboxReady = '1';

      /* peta panel: detail, list, + satu panel pendaftaran per lomba */
      const panels = new Map();
      const pDetail = box.querySelector('.evd-lp-detail');
      const pList   = box.querySelector('.evd-lp-list');
      if (pDetail) panels.set('detail', pDetail);
      if (pList)   panels.set('list', pList);
      box.querySelectorAll('.evd-lp-daftar').forEach((p) => {
        if (p.dataset.lomba) panels.set('daftar:' + p.dataset.lomba, p);
      });
      if (panels.size < 2) return; // struktur gak lengkap → biarkan statis

      /* panel jadi target fokus — keyboard & screen reader ikut pindah */
      box.querySelectorAll('.evd-lp').forEach((p) => { p.tabIndex = -1; });

      const show = (key, state) => {
        const panel = panels.get(key);
        if (!panel) return;
        box.querySelectorAll('.evd-lp').forEach((p) => {
          p.classList.toggle('is-on', p === panel);
        });
        box.dataset.state = state; // stepper kepala kotak ikut nyala

        /* kotak bisa jauh di atas/di bawah layar — pastikan keliatan.
           (Di dalam overlay, scrollIntoView menggulir .ev-panel-scroll,
           bukan halaman — body kekunci .ev-lock.) */
        const r = box.getBoundingClientRect();
        if (r.top < 8 || r.top > window.innerHeight * 0.55) {
          box.scrollIntoView({
            behavior: motionOK ? 'smooth' : 'auto',
            block: 'start'
          });
        }
        const target = panel.querySelector('.evd-lomba-h') || panel;
        target.focus({ preventScroll: true });
      };

      box.addEventListener('click', (e) => {
        const b = e.target.closest(
          'button[data-golomba], button[data-godaftar], button[data-gback]'
        );
        if (!b) return;
        /* hasAttribute, bukan dataset — data-golomba gak punya nilai,
           dataset.golomba = "" (falsy) dan bikin klik gak kepake */
        if (b.hasAttribute('data-golomba')) show('list', 'list');
        else if (b.hasAttribute('data-godaftar')) show('daftar:' + b.dataset.godaftar, 'daftar');
        else if (b.hasAttribute('data-gback')) show(b.dataset.gback, b.dataset.gback);
      });
    });
  }

  /* ============================================================
     SISTEM 1 — PJAX antar halaman
     ============================================================ */

  const getMain = () => document.querySelector(MAIN_SEL);

  async function navigate(rawURL, { push = true } = {}) {
    const main = getMain();
    const url = internalURL(rawURL);
    if (busy || !main || !url) return;

    const page = url.pathname.split('/').pop() || 'index.html';

    /* halaman yang sama, tanpa hash → cukup gulir ke atas */
    if (page === currentPath && !url.hash) {
      if (push) window.scrollTo({ top: 0, behavior: motionOK ? 'smooth' : 'auto' });
      return;
    }

    busy = true;

    try {
      /* fade-out konten lama sambil fetch berjalan paralel */
      if (motionOK) main.classList.add('pjax-leave');
      const [html] = await Promise.all([
        getHTML(url.href),
        sleep(motionOK ? LEAVE_MS : 0),
      ]);

      const doc = new DOMParser().parseFromString(html, 'text/html');
      const fresh = doc.querySelector(MAIN_SEL);
      if (!fresh) throw new Error('struktur halaman tak dikenal');

      /* URL relatif → absolut (base = halaman tujuan) — cegah foto
         404 saat swap dari halaman yang beda foldernya, misal dari
         halaman detail ke papan ("Img/..." relatif bisa nyasar ke
         event/Img/...). Lihat catatan di rebaseURLs(). */
      rebaseURLs(fresh, url.href);

      /* tukar isi main — header, nav & footer tetap utuh */
      main.replaceChildren(...fresh.childNodes);

      document.title = doc.title || document.title;
      syncNav(page);
      syncIcon(doc, url.href);
      runScripts(main);
      currentPath = page;

      /* posisi awal: hash → ke elemen, selain itu ke atas */
      if (url.hash) {
        const target = main.querySelector(url.hash);
        if (target) target.scrollIntoView({ behavior: motionOK ? 'smooth' : 'auto' });
        else instantTop();
      } else {
        instantTop();
      }

      /* fade-in singkat: mulai dari transparan → lepas class di frame berikut */
      if (motionOK) {
        main.classList.remove('pjax-leave');
        main.classList.add('pjax-enter');
        requestAnimationFrame(() =>
          requestAnimationFrame(() => main.classList.remove('pjax-enter'))
        );
      }

      if (push) history.pushState({ page }, '', url.href);

      initReveal(main);
      initLazyImages(main);
      initLombaBox(main);

      /* pindahkan fokus ke konten — ramah keyboard & screen reader */
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
    } catch {
      /* fallback: error apa pun → navigasi normal, halaman tetap terjangkau */
      const m = getMain();
      if (m) m.classList.remove('pjax-leave', 'pjax-enter');
      location.href = url.href;
      return;
    }

    setTimeout(() => { busy = false; }, 160);
  }

  /* ============================================================
     SISTEM 2 — DETAIL OVERLAY (PJAX layer dengan animasi FLIP)
     ============================================================ */

  let layer = null;          // elemen .ev-layer (dibuat sekali)
  let panelEl = null;        // .ev-panel — kotak yang "tumbuh"
  let scrollEl = null;       // .ev-panel-scroll
  let panelBody = null;      // wadah isi artikel
  let closeBtn = null;
  let ovOpen = false;        // overlay sedang tampil?
  let closing = false;       // sedang animasi menutup?
  let lastCard = null;       // kartu asal (untuk FLIP balik + fokus)
  let savedTitle = '';       // judul board, dikembalikan saat tutup

  function buildLayer() {
    if (layer) return;
    layer = document.createElement('div');
    layer.className = 'ev-layer';
    layer.hidden = true;
    layer.innerHTML =
      '<div class="ev-scrim"></div>' +
      '<div class="ev-panel" role="dialog" aria-modal="true" aria-label="Detail event">' +
      '  <button class="ev-close" type="button" aria-label="Tutup detail event">✕</button>' +
      '  <div class="ev-panel-scroll"><div class="ev-panel-body"></div></div>' +
      '</div>';
    document.body.appendChild(layer);
    panelEl   = layer.querySelector('.ev-panel');
    scrollEl  = layer.querySelector('.ev-panel-scroll');
    panelBody = layer.querySelector('.ev-panel-body');
    closeBtn  = layer.querySelector('.ev-close');

    /* klik luar (scrim) & tombol ✕ → tutup via history.back() */
    layer.addEventListener('click', (e) => {
      if (e.target === layer.querySelector('.ev-scrim')) closeOverlay();
    });
    closeBtn.addEventListener('click', () => closeOverlay());
  }

  /* transform FLIP: bikin panel terlihat berada di posisi kartu */
  function flipToCard(fromEl, toEl) {
    const c = fromEl.getBoundingClientRect();
    const p = toEl.getBoundingClientRect();
    const sx = Math.max(0.04, c.width / p.width);
    const sy = Math.max(0.04, c.height / p.height);
    const dx = (c.left + c.width / 2)  - (p.left + p.width / 2);
    const dy = (c.top  + c.height / 2) - (p.top  + p.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
  }

  async function openOverlay(card, href, fromHistory = false) {
    const url = internalURL(href);
    if (ovOpen || !url) return;
    buildLayer();

    let doc;
    try {
      const html = await getHTML(url.href);
      doc = new DOMParser().parseFromString(html, 'text/html');
    } catch {
      location.href = url.href;   // fetch gagal → buka sebagai halaman biasa
      return;
    }
    const art = doc.querySelector('.ev-detail');
    if (!art) { location.href = url.href; return; }   // struktur tak dikenal → fallback

    /* path relatif detail ("../Img/...") → absolut base detail —
       tanpa ini foto banner/galeri overlay 404 di situs subpath */
    rebaseURLs(art, url.href);

    lastCard = card || null;
    savedTitle = document.title;
    panelBody.replaceChildren(...art.childNodes);   // injeksi isi artikel
    document.title = doc.title || savedTitle;
    syncIcon(doc, url.href);
    scrollEl.scrollTop = 0;

    initLazyImages(panelEl);
    initLombaBox(panelEl);
    runScripts(panelEl);

    document.body.classList.add('ev-lock');   // kunci scroll latar
    layer.hidden = false;
    ovOpen = true;

    /* animasi masuk — panel "tumbuh" dari kartu (FLIP) */
    requestAnimationFrame(() => {
      layer.classList.add('on');               // scrim fade-in
      panelEl.classList.add('is-anim');
      if (motionOK && lastCard && lastCard.isConnected) {
        panelEl.style.transform = flipToCard(lastCard, panelEl);
        panelEl.style.opacity = '0';
      } else {
        panelEl.style.transform = 'scale(0.94)';
        panelEl.style.opacity = motionOK ? '0' : '1';
      }
      panelEl.getBoundingClientRect();        // paksa reflow (invert selesai)

      requestAnimationFrame(() => {
        panelEl.style.transform = '';         // play → tumbuh ke posisi akhir
        panelEl.style.opacity = '';
        setTimeout(() => panelEl.classList.remove('is-anim'), 380);
      });

      /* simpan URL ABSOLUT — kalau relatif, saat forward-reopen dia akan
         diresolve ulang dari URL detail dan menghasilkan path ganda */
      if (!fromHistory) history.pushState({ ov: url.href }, '', url.href);
    });

    closeBtn.focus({ preventScroll: true });
  }

  function closeOverlay(fromPop = false) {
    if (!ovOpen || closing) return;
    closing = true;

    const done = () => {
      layer.hidden = true;
      layer.classList.remove('on');
      panelBody.replaceChildren();            // kosongkan — hemat memori
      document.body.classList.remove('ev-lock');
      panelEl.style.transform = '';
      panelEl.style.opacity = '';
      panelEl.classList.remove('is-anim');
      document.title = savedTitle || document.title;
      ovOpen = false;
      closing = false;
      if (lastCard && lastCard.isConnected) lastCard.focus({ preventScroll: true });
    };

    if (motionOK) {
      /* balik: panel "menyusut" kembali ke kartu */
      panelEl.classList.add('is-anim');
      if (lastCard && lastCard.isConnected) {
        panelEl.style.transform = flipToCard(lastCard, panelEl);
      } else {
        panelEl.style.transform = 'scale(0.94)';
      }
      panelEl.style.opacity = '0';
      setTimeout(done, FLIP_MS);
    } else {
      done();
    }

    /* tutup oleh user → mundurkan history; popstate akan lewat sini
       sekali lagi (fromPop=true, diblokir guard `closing`) */
    if (!fromPop) history.back();
  }

  function trapFocus(e) {
    const f = panelEl.querySelectorAll(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  /* ---------------- intercept klik ---------------- */

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const a = e.target.closest('a');
    if (!a) return;
    if (a.target && a.target !== '_self') return;          // tab baru: biarkan
    if (a.hasAttribute('download')) return;
    if (a.dataset.pjax === 'off') return;                   // pintu darurat

    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;              // anchor halaman ini
    if (!internalURL(href)) return;                         // eksternal/mailto/tel

    e.preventDefault();

    if (ovOpen) return;   // overlay buka: bekukan semua navigasi link

    /* kartu event / baris arsip / tile galeri / item pendaftaran →
       overlay FLIP (bukan swap halaman). Saat HTML detail masih
       di-fetch, elemen diberi .is-opening (umpan balik visual —
       shimmer di banner kartu, denyut halus di baris) biar klik
       gak terasa "mati"; class dilepas otomatis begitu overlay
       terbuka / fetch gagal (fallback navigasi normal). */
    const isEvLink =
      a.classList.contains('ev-card')  || a.classList.contains('ev-row') ||
      a.classList.contains('ev-gcard') || a.classList.contains('ev-regitem');
    if (isEvLink) {
      a.classList.add('is-opening');
      openOverlay(a, href).finally(() => a.classList.remove('is-opening'));
      return;
    }

    navigate(href);
  });

  /* keyboard: ESC menutup overlay, Tab ditahan di dalam panel */
  document.addEventListener('keydown', (e) => {
    if (!ovOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeOverlay(); }
    else if (e.key === 'Tab') trapFocus(e);
  });

  /* ---------------- history: back/forward ---------------- */

  window.addEventListener('popstate', (e) => {
    const st = e.state || {};

    /* dari overlay terbuka → mundur berarti menutup */
    if (ovOpen) {
      if (!st.ov) closeOverlay(true);
      return;
    }
    /* maju ke state overlay → buka lagi (dari cache, instan) */
    if (st.ov) {
      openOverlay(null, st.ov, true);
      return;
    }
    /* pindah halaman biasa lewat tombol back/forward */
    if (pagePath(location.href) !== currentPath) {
      navigate(location.href, { push: false });
    }
  });

  /* ---------------- prefetch: siapkan sebelum diklik ---------------- */

  let hoverTimer = null;

  function prefetch(href) {
    const url = internalURL(href);
    if (!url) return;
    if (pagePath(url.href) === currentPath && !href.includes('event/')) return;
    getHTML(url.href).catch(() => {}); // prefetch gagal bukan masalah
  }

  /* hover / fokus keyboard → tunggu sebentar (dwell) lalu prefetch */
  function queueHover(e) {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => prefetch(href), HOVER_MS);
  }

  document.addEventListener('mouseover', queueHover, { passive: true });
  document.addEventListener('focusin', queueHover, { passive: true });

  /* sentuh/tekan → prefetch langsung (tap terasa instan di HP) */
  document.addEventListener('pointerdown', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    prefetch(href);
  }, { passive: true });

  /* ---------------- init ---------------- */

  document.documentElement.classList.add('js'); // flag: CSS transisi aktif
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  syncNav(currentPath);   // pastikan aria-current benar sejak awal
  initReveal(document);
  initLazyImages(document);
  initLombaBox(document);
})();
