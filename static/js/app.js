const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ============ manajemen timer per-halaman (anti-bocor saat soft-nav) ============ */

const pageTimers = [];

function addPageTimer(id) {
  pageTimers.push(id);
}

function clearPageTimers() {
  pageTimers.forEach((id) => clearInterval(id));
  pageTimers.length = 0;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function scrollTop(y) {
  try {
    window.scrollTo({ top: y, behavior: "instant" });
  } catch (_e) {
    window.scrollTo(0, y);
  }
}

/* ============ init per komponen (aman dipanggil ulang tiap soft-nav) ============ */

function initNav() {
  const header = $("#site-header");
  const toggle = $("#nav-toggle");
  const drawer = $("#nav-drawer");
  if (!header) return;

  // window tidak ikut ke-swap -> listener cukup sekali seumur dokumen.
  // Query #site-header dilakukan HIDUP-hidup agar tetap sahih setelah header
  // diganti saat soft-nav. passive: agar tidak mengganggu thread gulir.
  if (!initNav._scrollBound) {
    window.addEventListener(
      "scroll",
      () => {
        $("#site-header")?.classList.toggle("is-scrolled", window.scrollY > 20);
      },
      { passive: true }
    );
    initNav._scrollBound = true;
  }

  toggle?.addEventListener("click", () => {
    drawer?.classList.toggle("hidden");
  });

  $$("[data-close-nav]").forEach((el) => {
    el.addEventListener("click", () => drawer?.classList.add("hidden"));
  });
}

function initTabs() {
  $$("[data-tab-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-tab-target");
      $$("[data-tab-target]").forEach((b) => b.classList.toggle("is-active", b === btn));
      $$("[data-tab-panel]").forEach((panel) => {
        panel.classList.toggle("hidden", panel.getAttribute("data-tab-panel") !== name);
      });
    });
  });
}

function initScrollTop() {
  $("#scroll-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initCountdown() {
  const root = $("#countdown");
  if (!root) return;
  const target = new Date("2026-11-14T08:00:00+07:00").getTime();
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    root.querySelector("[data-days]").textContent = String(days);
    root.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
    root.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");
    root.querySelector("[data-seconds]").textContent = String(seconds).padStart(2, "0");
  };
  tick();
  // Bersih-bersih mandiri: kalau halaman sudah dilepas (soft-nav pindah halaman),
  // interval berhenti sendiri — tidak ada timer yatim yang tetap berdetak.
  const timer = setInterval(() => {
    if (!root.isConnected) {
      clearInterval(timer);
      return;
    }
    tick();
  }, 1000);
  addPageTimer(timer);
}

function initEvents() {
  const grid = $("#event-grid");
  const dataEl = $("#events-data");
  if (!grid || !dataEl) return;

  const cards = $$("[data-event-card]", grid);
  const empty = $("#event-empty");
  const search = $("#event-search");
  const modal = $("#event-modal");
  const events = JSON.parse(dataEl.textContent);

  const applyFilter = () => {
    const cat = $("[data-category].is-active")?.getAttribute("data-category") || "Semua";
    const q = (search?.value || "").toLowerCase().trim();
    let shown = 0;
    cards.forEach((card) => {
      const matchCat = cat === "Semua" || card.dataset.category === cat;
      const hay = `${card.dataset.title} ${card.dataset.desc} ${card.dataset.location}`.toLowerCase();
      const matchQ = !q || hay.includes(q);
      const ok = matchCat && matchQ;
      card.classList.toggle("hidden", !ok);
      if (ok) shown += 1;
    });
    empty?.classList.toggle("hidden", shown !== 0);
  };

  $$("[data-category]").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("[data-category]").forEach((b) => b.classList.toggle("is-active", b === btn));
      applyFilter();
    });
  });
  search?.addEventListener("input", applyFilter);

  const fillModal = (event) => {
    $("#modal-kicker").textContent = `${event.category} • ${event.status}`;
    $("#modal-title").textContent = event.title;
    $("#modal-date").textContent = event.date;
    $("#modal-time").textContent = event.time;
    $("#modal-location").textContent = event.location;
    $("#modal-desc").textContent = event.description;
    $("#modal-highlight").textContent = event.highlight;
    $("#modal-success").classList.add("hidden");
    $("#modal-actions").classList.remove("hidden");
    modal.classList.remove("hidden");
    modal.dataset.eventId = event.id;
  };

  $$("[data-open-event]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const event = events.find((item) => item.id === btn.getAttribute("data-open-event"));
      if (event) fillModal(event);
    });
  });

  $$("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => modal.classList.add("hidden"));
  });

  $("#modal-register")?.addEventListener("click", () => {
    $("#modal-success").classList.remove("hidden");
    $("#modal-actions").classList.add("hidden");
  });
}

function initCabinets() {
  const spotlight = $("#cabinet-spotlight");
  const dataEl = $("#cabinets-data");
  if (!spotlight || !dataEl) return;
  const cabinets = JSON.parse(dataEl.textContent);

  const render = (cab) => {
    $("#cab-image").src = `/static/images/${cab.image}`;
    $("#cab-image").alt = cab.name;
    $("#cab-period").textContent = `Emblem Resmi • ${cab.period}`;
    $("#cab-symbol").textContent = cab.symbol;
    $("#cab-name").textContent = cab.name;
    $("#cab-tagline").textContent = cab.tagline;
    $("#cab-philosophy").textContent = cab.philosophy;
    $("#cab-legacy").textContent = cab.keyLegacy;
    const list = $("#cab-achievements");
    list.innerHTML = cab.achievements
      .map(
        (item) =>
          `<div class="p-3 rounded-xl bg-[#1c1714]/80 border border-[rgba(253,140,90,0.15)] flex items-start gap-2.5 text-xs text-[#fdb18f]/85"><span class="w-1.5 h-1.5 rounded-full bg-[#FD8C5A] mt-1.5 shrink-0"></span><span>${item}</span></div>`
      )
      .join("");
    $$("[data-cabinet]").forEach((btn) => {
      btn.classList.toggle("is-selected", btn.getAttribute("data-cabinet") === cab.id);
    });
  };

  $$("[data-cabinet]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cab = cabinets.find((item) => item.id === btn.getAttribute("data-cabinet"));
      if (cab) render(cab);
    });
  });
}

function initWaitingRoom() {
  const root = $("#waiting-room");
  if (!root) return;
  const returnUrl = root.dataset.returnUrl || "/";
  const countEl = $("#queue-count");
  const bar = $("#queue-bar");
  const countdown = $("#queue-countdown");
  const status = $("#queue-status");
  let left = 3;

  const check = async () => {
    status.textContent = "Memeriksa slot...";
    try {
      const res = await fetch("/api/queue-status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        countEl.textContent = `${data.activeCount} / ${data.maxAllowed} Slot`;
        bar.style.width = `${Math.min(100, (data.activeCount / data.maxAllowed) * 100)}%`;
        if (data.allowed) {
          window.location.href = returnUrl;
          return;
        }
      }
    } catch (_err) {
      /* keep waiting */
    }
    status.textContent = "Siaga";
  };

  const timer = setInterval(() => {
    if (!root.isConnected) {
      clearInterval(timer);
      return;
    }
    left -= 1;
    if (left <= 0) {
      left = 3;
      check();
    }
    countdown.textContent = `${left}s`;
  }, 1000);
  addPageTimer(timer);

  $("#try-access")?.addEventListener("click", () => {
    window.location.href = returnUrl;
  });
}

/* ============ navigasi halus (soft-nav, tanpa reload penuh) ============
   Pola PJAX: klik link internal -> fetch HTML -> tukar isi <main> (+ header
   biar status nav ikut) -> pushState. CSS/JS/gambar tidak diunduh ulang.
   Error apa pun -> jatuh ke navigasi biasa (selalu aman).
   Pintu darurat per-link: tambahkan data-soft="off".                        */

const SOFT = {
  motionOK: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  LEAVE_MS: 110,
  busy: false,
  token: 0,
};

// Halaman yang SEDANG tampil. TIDAK bisa pakai location.pathname saat popstate —
// saat event itu menyala, location sudah pindah ke tujuan, jadi pembanding
// "halaman sama" harus path yang benar-benar sedang dirender, bukan address bar.
let currentPath = location.pathname + location.search;

function softNavCapable() {
  return !!(window.history && window.history.pushState && window.fetch && window.DOMParser);
}

/* Link ini boleh lewat soft-nav? Kembalikan URL-nya, atau null. */
function internalLink(a, e) {
  if (!softNavCapable() || e.defaultPrevented || e.button !== 0) return null;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  if (a.target && a.target !== "_self") return null;
  if (a.hasAttribute("download")) return null;
  if (a.dataset.soft === "off") return null;
  const href = a.getAttribute("href") || "";
  if (!href || href.startsWith("#")) return null;
  if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) return null;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return null;
  return url;
}

async function navigate(rawUrl, { push = true, restoreY = null } = {}) {
  const main = $("main");
  if (!main || SOFT.busy) return;

  const url = new URL(rawUrl, location.href);

  // Halaman sama (path+query identik dengan yang sedang tampil) -> tidak perlu
  // fetch, cukup gulir. Kasus hash (#footer) tidak sampai sini; browser urus.
  if (url.pathname + url.search === currentPath) {
    if (push && !url.hash) scrollTop(0);
    return;
  }

  const token = ++SOFT.token;
  SOFT.busy = true;
  const ctrl = new AbortController();
  const killer = setTimeout(() => ctrl.abort(), 8000);

  try {
    if (SOFT.motionOK) main.classList.add("soft-leave");
    const [res] = await Promise.all([
      fetch(url.href, {
        headers: { "X-Soft-Nav": "1" },
        signal: ctrl.signal,
        redirect: "follow",
      }),
      sleep(SOFT.motionOK ? SOFT.LEAVE_MS : 0),
    ]);
    if (token !== SOFT.token) return;

    const ctype = res.headers.get("content-type") || "";
    if (!ctype.includes("text/html")) throw new Error("bukan html");
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const freshMain = doc.querySelector("main");
    if (!freshMain) throw new Error("struktur halaman tak dikenal");

    // Papan kapasitas penuh? Server 302 ke /waiting-room — fetch otomatis
    // mengikutinya, jadi res.url adalah URL final. Address bar tetap jujur.
    const finalUrl = res.url || url.href;

    // Simpan posisi gulir untuk tombol back, lalu catat riwayat baru.
    if (push) {
      history.replaceState({ ...history.state, sy: window.scrollY }, "");
      history.pushState({ soft: true }, "", finalUrl);
    }

    document.title = doc.title || document.title;

    // Tukar tiga wilayah yang berbeda antar halaman. Sprite ikon & <script>
    // tidak disentuh — tetap hidup tanpa dieksekusi ulang.
    const swapRegion = (sel) => {
      const fresh = doc.querySelector(sel);
      const cur = document.querySelector(sel);
      if (fresh && cur) cur.replaceWith(fresh);
    };
    swapRegion("#site-header"); // status link aktif ikut halaman baru
    swapRegion("main");
    swapRegion("#footer");

    const final = new URL(finalUrl, location.href);
    currentPath = final.pathname + final.search;

    initPage();

    const nextMain = $("main");
    nextMain.classList.add("soft-enter");
    if (SOFT.motionOK) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => nextMain.classList.remove("soft-enter"))
      );
    } else {
      nextMain.classList.remove("soft-enter");
    }

    scrollTop(restoreY ?? 0);

    // Fokus ke konten utama untuk aksesibilitas (pembaca layar) tanpa menggulir.
    nextMain.setAttribute("tabindex", "-1");
    nextMain.focus({ preventScroll: true });
  } catch (_err) {
    // Jaringan gagal / timeout / struktur aneh -> navigasi biasa.
    window.location.href = url.href;
  } finally {
    clearTimeout(killer);
    SOFT.busy = false;
    $("main")?.classList.remove("soft-leave");
  }
}

/* Intersepsi klik (delegasi dokumen — tetap sahih setelah swap isi) */
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a) return;
  const url = internalLink(a, e);
  if (!url) return;
  e.preventDefault();
  navigate(url.href);
});

window.addEventListener("popstate", (e) => {
  const sy = e.state && typeof e.state.sy === "number" ? e.state.sy : null;
  navigate(location.href, { push: false, restoreY: sy });
});

/* ============ bootstrap ============ */

function initPage() {
  clearPageTimers();
  initNav();
  initTabs();
  initScrollTop();
  initCountdown();
  initEvents();
  initCabinets();
  initWaitingRoom();
}

document.addEventListener("DOMContentLoaded", initPage);
