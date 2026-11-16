/* ============================================================
   AMAPIANO IS HERE — 2027 sign-up page
   Content lives in js/config.js
   ============================================================ */
(() => {
  "use strict";
  const C = window.AIH || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Links ---------- */
  $("#year").textContent = new Date().getFullYear();
  const L = C.links || {};
  if (L.instagram) $("#igLink").href = L.instagram; else $("#igLink").parentElement.remove();
  if (L.email) { $("#mailLink").href = "mailto:" + L.email; $("#mailLink").textContent = L.email; }
  else $("#mailLink").parentElement.remove();
  if (L.presenter) $("#presenterLink").href = L.presenter;

  /* ---------- Nav + sticky sign-up button ---------- */
  const nav = $("#nav");
  const sticky = $("#stickyCta");
  const formCard = $("#join");
  let formVisible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(es => es.forEach(e => { formVisible = e.isIntersecting; onScroll(); }), { threshold: 0.2 }).observe(formCard);
  }
  function onScroll() {
    nav.classList.toggle("is-solid", window.scrollY > 40);
    const pastHero = window.scrollY > window.innerHeight * 0.6;
    sticky.hidden = !(pastHero && !formVisible && !form.classList.contains("is-sent"));
    document.body.classList.toggle("has-sticky", !sticky.hidden);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Who's played the room: scrolling names ---------- */
  const N = C.names || {};
  const rows = [
    { label: "Headliners", names: N.headliners || [], cls: "marquee__row--big", speed: 1 },
    { label: "Residents", names: N.residents || [], cls: "marquee__row--outline", speed: -0.8 },
    { label: "Guests", names: N.guests || [], cls: "marquee__row--gold", speed: 1.25 }
  ].filter(r => r.names.length);
  $("#marquee").innerHTML = rows.map(r => {
    const unit = `<em>${esc(r.label)}</em>` + r.names.map(n => `<span>${esc(n)}</span><i></i>`).join("");
    const half = Array(4).fill(unit).join("");
    return `<div class="marquee__row ${r.cls}" data-speed="${r.speed}"><div class="marquee__track">${half}${half}</div></div>`;
  }).join("");
  $("#artistList").innerHTML = rows.map(r => `<li>${esc(r.label)}: ${r.names.map(esc).join(", ")}</li>`).join("");

  /* ---------- Photo wall: counter-scrolling rows ---------- */
  const flat = (C.gallery || []).filter(it => it.photo || it.clip);
  const photoSrc = (p, w) => `assets/photos/${p}-${w}.jpg`;
  const gridEl = $("#galleryGrid");
  const rowCount = Math.max(1, Math.min(4, C.galleryRows || 3));
  const rowsOf = Array.from({ length: rowCount }, () => []);
  flat.forEach((it, i) => rowsOf[i % rowCount].push(i));
  const tileHtml = i => {
    const it = flat[i];
    const media = it.clip
      ? `<video src="${esc(it.clip)}" poster="${esc(it.poster || "")}" muted loop playsinline autoplay preload="metadata"></video>`
      : `<img src="${photoSrc(it.photo, 800)}" srcset="${photoSrc(it.photo, 800)} 800w, ${photoSrc(it.photo, 1600)} 1600w" sizes="(max-width: 640px) 50vw, 520px"${it.w ? ` width="${it.w}" height="${it.h}"` : ""} alt="${esc(it.alt)}" loading="lazy" decoding="async">`;
    const ratio = it.clip ? "4 / 5" : (it.w ? `${it.w} / ${it.h}` : "4 / 5");
    return `<button class="tile" style="aspect-ratio:${ratio}" data-i="${i}" aria-label="Open photo: ${esc(it.alt)}">${media}</button>`;
  };
  gridEl.innerHTML = rowsOf.map((ids, ri) => `
    <div class="reel" data-dir="${ri % 2 ? 1 : -1}">
      <div class="reel__viewport"><div class="reel__track">${ids.map(tileHtml).join("")}</div></div>
    </div>`).join("");

  // pause clips that are off screen
  const vio = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !reduceMotion) e.target.play().catch(() => {}); else e.target.pause();
  }), { threshold: 0.15 }) : null;
  const watchVideos = () => { if (vio) $$("video").forEach(v => vio.observe(v)); };
  if (reduceMotion) $$("video").forEach(v => { v.removeAttribute("autoplay"); v.pause(); });

  const reels = $$(".reel").map(el => ({
    el, viewport: $(".reel__viewport", el), track: $(".reel__track", el),
    dir: parseFloat(el.dataset.dir), travel: 0, cur: null, target: 0
  }));
  function layoutReels() {
    if (reduceMotion) return;
    reels.forEach(r => {
      $$(".is-clone", r.track).forEach(n => n.remove());
      const originals = $$(".tile", r.track);
      const setW = r.track.scrollWidth, vw = r.viewport.clientWidth;
      if (!setW || !vw) return;
      const need = Math.max(vw * 2, setW + vw * 0.5);
      let total = setW, copies = 0;
      while (total < need && copies++ < 6) {
        originals.forEach(t => {
          const c = t.cloneNode(true);
          c.classList.add("is-clone"); c.tabIndex = -1; c.setAttribute("aria-hidden", "true");
          r.track.appendChild(c);
        });
        total += setW;
      }
      total = r.track.scrollWidth;
      r.travel = Math.min(total - vw, Math.max(setW - vw + 80, vw * 0.4));
      r.cur = null;
    });
    watchVideos();
  }
  layoutReels();
  watchVideos();
  let reelTimer;
  window.addEventListener("resize", () => { clearTimeout(reelTimer); reelTimer = setTimeout(layoutReels, 200); });

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox"), lbMedia = $("#lbMedia"), lbCap = $("#lbCap");
  let lbIndex = 0, lastFocus = null;
  function showLb(i) {
    lbIndex = (i + flat.length) % flat.length;
    const g = flat[lbIndex];
    lbMedia.innerHTML = g.clip
      ? `<video src="${esc(g.clip)}" poster="${esc(g.poster || "")}" muted loop playsinline autoplay controls></video>`
      : `<img src="${photoSrc(g.photo, 1600)}" alt="${esc(g.alt)}">`;
    lbCap.textContent = `${lbIndex + 1} of ${flat.length}`;
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    showLb(i); lb.hidden = false; document.body.style.overflow = "hidden";
    $(".lightbox__close", lb).focus();
  }
  function closeLb() { lb.hidden = true; lbMedia.innerHTML = ""; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  gridEl.addEventListener("click", e => { const t = e.target.closest(".tile"); if (t) openLb(+t.dataset.i); });
  $(".lightbox__close", lb).addEventListener("click", closeLb);
  $(".lightbox__nav--prev", lb).addEventListener("click", () => showLb(lbIndex - 1));
  $(".lightbox__nav--next", lb).addEventListener("click", () => showLb(lbIndex + 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
    if (e.key === "Tab") {
      const f = $$("button", lb).filter(b => b.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let tx = null;
  lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 45) showLb(lbIndex + (dx < 0 ? 1 : -1));
    tx = null;
  });

  /* ---------- Playlist ---------- */
  const player = $("#player");
  const follow = $("#spotifyFollow");
  const m = (C.spotifyPlaylistUrl || "").match(/playlist[/:]([A-Za-z0-9]+)/);
  const vinyl = (title, line) => `<div class="player__empty"><div><div class="player__vinyl" aria-hidden="true"></div><p><strong>${title}</strong></p><p style="margin:0 auto">${line}</p></div></div>`;
  if (m) {
    const url = `https://open.spotify.com/playlist/${m[1]}`;
    follow.href = url;
    player.innerHTML = C.preview
      ? vinyl("The Amapiano Is Here playlist", `The Spotify player shows here on the live site. <a href="${url}" target="_blank" rel="noopener">Open it on Spotify</a>.`)
      : `<iframe title="Amapiano Is Here playlist on Spotify" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${m[1]}?utm_source=generator" width="100%" height="352" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
  } else {
    $("#playlist").remove();
  }

  /* ---------- Gentle motion: photo rows + name rows follow the scroll ---------- */
  const marqueeRows = $$(".marquee__row").map(row => ({ track: $(".marquee__track", row), speed: parseFloat(row.dataset.speed) || 1, off: 0 }));
  marqueeRows.forEach(r => { if (r.speed < 0) r.off = -r.track.scrollWidth / 2; });
  let lastY = window.scrollY, boost = 0, dir = -1;
  function updateReelTargets() {
    const vh = window.innerHeight;
    reels.forEach(r => {
      const rect = r.el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      r.target = r.dir < 0 ? -r.travel * p : -r.travel * (1 - p);
      if (r.cur === null) r.cur = r.target;
    });
  }
  window.addEventListener("scroll", () => {
    const y = window.scrollY, v = y - lastY;
    lastY = y;
    if (v) { dir = v > 0 ? -1 : 1; boost = Math.max(boost, Math.min(Math.abs(v), 120) * 0.35); }
    if (!reduceMotion) updateReelTargets();
  }, { passive: true });
  if (!reduceMotion) {
    updateReelTargets();
    let prev = performance.now();
    const loop = now => {
      const dt = Math.min(48, now - prev) / 16.67; prev = now;
      boost *= Math.pow(0.9, dt);
      reels.forEach(r => {
        if (r.cur === null) return;
        r.cur += (r.target - r.cur) * Math.min(1, 0.12 * dt);
        r.track.style.transform = `translate3d(${r.cur.toFixed(1)}px, 0, 0)`;
      });
      marqueeRows.forEach(r => {
        const half = r.track.scrollWidth / 2 || 1;
        r.off += dir * r.speed * (0.9 + boost * 0.8) * dt;
        if (r.off <= -half) r.off += half;
        if (r.off > 0) r.off -= half;
        r.track.style.transform = `translate3d(${r.off.toFixed(1)}px, 0, 0)`;
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------- Sign-up form ---------- */
  const form = $("#joinForm");
  const status = $("#formStatus");
  const btn = $("#joinBtn");
  const rules = {
    name: v => v.trim().length > 0,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    phone: v => !v.trim() || v.replace(/\D/g, "").replace(/^1/, "").length === 10
  };
  function check(name) {
    const input = form.elements[name];
    const ok = rules[name](input.value);
    input.closest(".field").classList.toggle("is-bad", !ok);
    input.setAttribute("aria-invalid", !ok);
    if (ok) input.removeAttribute("aria-describedby"); else input.setAttribute("aria-describedby", "err-" + name);
    return ok;
  }
  Object.keys(rules).forEach(n => {
    form.elements[n].addEventListener("blur", () => { if (form.elements[n].value) check(n); });
    form.elements[n].addEventListener("input", () => { if (form.elements[n].closest(".field").classList.contains("is-bad")) check(n); });
  });
  form.elements.phone.addEventListener("input", e => {
    const d = e.target.value.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
    if (!d) return;
    e.target.value = d.length < 4 ? `(${d}` : d.length < 7 ? `(${d.slice(0, 3)}) ${d.slice(3)}` : `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (Object.keys(rules).map(check).includes(false)) {
      const firstBad = $(".field.is-bad input", form);
      if (firstBad) firstBad.focus();
      status.className = "form__status bad";
      status.textContent = "Fix the highlighted fields to join.";
      return;
    }
    if (form.elements.sms_consent.checked && !form.elements.phone.value.trim()) {
      status.className = "form__status bad";
      status.textContent = "Add a mobile number to get text alerts, or untick the text box.";
      form.elements.phone.focus();
      return;
    }
    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      city: form.elements.city.value,
      interests: ["2027-tickets"],
      list: C.listTag || "aih-2027-interest",
      sms_consent: form.elements.sms_consent.checked,
      company: form.elements.company.value, // honeypot
      source: "amapianoishere.com",
      submitted_at: new Date().toISOString()
    };
    btn.disabled = true; btn.textContent = "Joining…";
    status.className = "form__status"; status.textContent = "";
    try {
      if (C.preview) {
        await new Promise(r => setTimeout(r, 500)); // preview: nothing is sent
      } else {
        const res = await fetch(C.formEndpoint || "/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(res.status);
      }
      form.classList.add("is-sent");
      status.className = "form__status ok";
      status.innerHTML = `<em>Thank you, ${esc(data.name)}.</em>You're on the 2027 list.` +
        (C.preview ? `<small>Preview only: sign-ups save once the site is live.</small>` : "");
      onScroll();
    } catch (err) {
      status.className = "form__status bad";
      status.textContent = "That didn't go through. Check your connection and try again.";
      btn.disabled = false; btn.textContent = "Join the list";
    }
  });

  onScroll();
})();
