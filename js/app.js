/* ============================================================
   FinFluent — code ứng dụng
   Bạn KHÔNG cần sửa file này. Nội dung nằm trong thư mục data/.
   ============================================================ */
(function () {
  "use strict";

  // ---------------------------------------------------------
  // 0. Dữ liệu đầu vào
  // ---------------------------------------------------------
  const CFG = Object.assign(
    { appName: "FinFluent", tagline: "English for Finance", goals: { articles: 1, newWords: 5, reviews: 20, quiz: 10 }, accent: "en-US", backupReminderDays: 7 },
    window.FF_CONFIG || {}
  );
  const TOPICS = window.FF_TOPICS || [];
  const TERMS = window.FF_TERMS || [];
  const ARTICLES = window.FF_ARTICLES || [];
  const QUIZ = window.FF_QUIZ || [];

  const STORE_KEY = "finfluent_v1";
  const CACHE_KEY = "finfluent_dict_cache_v1";
  const DAY = 86400000;
  const MASTERED_DAYS = 21;

  // ---------------------------------------------------------
  // 1. Tiện ích
  // ---------------------------------------------------------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const dateStr = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const todayStr = () => dateStr(new Date());
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const topicOf = (id) => TOPICS.find((t) => t.id === id) || { id: id || "other", name: "Khác", en: "Other", color: "#8a8f96" };
  const uid = () => "w" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const wordCount = (a) => a.paragraphs.join(" ").split(/\s+/).filter(Boolean).length;

  const ICONS = {
    today: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    read: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h13v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v10a2 2 0 0 1-2 2"/><path d="M8 9h5M8 13h5M8 17h3"/></svg>',
    glossary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5-5 4 4 8-9"/><path d="M15 7h5v5"/></svg>',
    words: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 13.7-5.6L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15"/><path d="M4 20v-5h5"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
    speak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>'
  };

  const NAV = [
    { id: "today", label: "Hôm nay", icon: ICONS.today },
    { id: "read", label: "Đọc báo", icon: ICONS.read },
    { id: "glossary", label: "Thuật ngữ", icon: ICONS.glossary },
    { id: "words", label: "Từ của tôi", icon: ICONS.words },
    { id: "review", label: "Ôn tập", icon: ICONS.review },
    { id: "quiz", label: "Luyện đề", icon: ICONS.quiz }
  ];

  // ---------------------------------------------------------
  // 2. Lưu trữ (localStorage)
  // ---------------------------------------------------------
  function freshDaily() { return { date: todayStr(), articles: 0, newWords: 0, reviews: 0, quiz: 0, quizCorrect: 0 }; }
  function defaultState() {
    return {
      version: 1,
      words: [],
      articlesDone: {},
      customArticles: [],
      quizStats: {},
      daily: freshDaily(),
      streak: { count: 0, last: null },
      accent: CFG.accent || "en-US",
      lastBackup: Date.now(),
      backupSnoozeUntil: 0
    };
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.version) return Object.assign(defaultState(), s);
      }
    } catch (e) { /* bỏ qua */ }
    return defaultState();
  }
  let S = loadState();

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); }
    catch (e) { toast("Không lưu được dữ liệu — bộ nhớ trình duyệt có thể đã đầy."); }
    updateBadges();
  }
  function ensureDay() { if (S.daily.date !== todayStr()) { S.daily = freshDaily(); } }
  function touchStreak() {
    const t = todayStr();
    if (S.streak.last === t) return;
    const y = dateStr(new Date(Date.now() - DAY));
    S.streak.count = S.streak.last === y ? S.streak.count + 1 : 1;
    S.streak.last = t;
  }
  function bump(key, n) { ensureDay(); S.daily[key] += n == null ? 1 : n; touchStreak(); save(); }
  function currentStreak() {
    const t = todayStr(), y = dateStr(new Date(Date.now() - DAY));
    return S.streak.last === t || S.streak.last === y ? S.streak.count : 0;
  }

  // Bộ nhớ đệm từ điển online
  function loadCache() { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (e) { return {}; } }
  function saveCache(c) {
    try {
      const keys = Object.keys(c);
      if (keys.length > 600) keys.slice(0, keys.length - 600).forEach((k) => delete c[k]);
      localStorage.setItem(CACHE_KEY, JSON.stringify(c));
    } catch (e) { /* bỏ qua */ }
  }

  // ---------------------------------------------------------
  // 3. Từ điển & từ đã lưu
  // ---------------------------------------------------------
  const termMap = new Map();
  TERMS.forEach((t) => termMap.set(t.term.toLowerCase(), t));

  function stemCandidates(w) {
    const c = [];
    if (w.endsWith("ies")) c.push(w.slice(0, -3) + "y");
    if (w.endsWith("ied")) c.push(w.slice(0, -3) + "y");
    if (w.endsWith("es")) c.push(w.slice(0, -2));
    if (w.endsWith("s")) c.push(w.slice(0, -1));
    if (w.endsWith("ed")) c.push(w.slice(0, -2), w.slice(0, -1));
    if (w.endsWith("ing")) c.push(w.slice(0, -3), w.slice(0, -3) + "e");
    if (/([b-df-hj-np-tv-z])\1(ed|ing)$/.test(w)) c.push(w.replace(/([b-df-hj-np-tv-z])\1(ed|ing)$/, "$1"));
    return c;
  }
  function findTerm(raw) {
    const w = String(raw || "").toLowerCase().trim();
    if (!w) return null;
    if (termMap.has(w)) return termMap.get(w);
    for (const c of stemCandidates(w)) if (termMap.has(c)) return termMap.get(c);
    return null;
  }
  function findWord(raw) {
    const w = String(raw || "").toLowerCase().trim();
    if (!w) return null;
    let hit = S.words.find((x) => x.term.toLowerCase() === w);
    if (hit) return hit;
    for (const c of stemCandidates(w)) { hit = S.words.find((x) => x.term.toLowerCase() === c); if (hit) return hit; }
    const t = findTerm(w);
    if (t) return S.words.find((x) => x.term.toLowerCase() === t.term.toLowerCase()) || null;
    return null;
  }
  function newSrs() { return { reps: 0, interval: 0, ease: 2.5, due: Date.now() }; }
  function addWord(data) {
    const existing = findWord(data.term);
    if (existing) { Object.assign(existing, data, { id: existing.id, srs: existing.srs, created: existing.created }); save(); return { word: existing, isNew: false }; }
    const w = Object.assign({ id: uid(), created: Date.now(), srs: newSrs() }, data);
    S.words.unshift(w);
    bump("newWords");
    return { word: w, isNew: true };
  }
  function termToWord(t, context, source) {
    return {
      term: t.term, vi: t.vi || "", en: t.en || "", ipa: t.ipa || "", pos: t.pos || "", level: t.level || "",
      topic: t.topic || "", example: t.example || "", collocations: t.collocations || "", synonyms: t.synonyms || "",
      note: t.note || "", context: context || t.example || "", source: source || "Thuật ngữ"
    };
  }
  function status(w) {
    if (w.srs.interval >= MASTERED_DAYS) return { id: "mastered", label: "Đã thuộc", cls: "green" };
    if (w.srs.due <= Date.now()) return { id: "due", label: w.srs.reps === 0 ? "Mới · cần ôn" : "Cần ôn", cls: "gold" };
    return { id: "learning", label: "Đang nhớ", cls: "" };
  }
  const dueWords = () => S.words.filter((w) => w.srs.due <= Date.now());

  // Lịch ôn ngắt quãng (SRS)
  function schedule(srs, r) {
    let reps = srs.reps || 0, interval = srs.interval || 0, ease = srs.ease || 2.5;
    const now = Date.now();
    if (r === 1) return { reps: 0, interval: 0, ease: Math.max(1.3, ease - 0.2), due: now + 10 * 60000 };
    if (r === 2) { interval = Math.max(1, Math.round(interval * 1.2)); ease = Math.max(1.3, ease - 0.15); }
    else if (r === 3) { interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.max(interval + 1, Math.round(interval * ease)); }
    else { interval = reps === 0 ? 4 : Math.max(interval + 2, Math.round(interval * ease * 1.3)); ease += 0.15; }
    return { reps: reps + 1, interval, ease, due: now + interval * DAY };
  }
  function intervalLabel(srs, r) {
    const n = schedule(srs, r);
    if (r === 1) return "10 phút";
    if (n.interval >= 30) return Math.round(n.interval / 30) + " tháng";
    return n.interval + " ngày";
  }

  // ---------------------------------------------------------
  // 4. Phát âm & từ điển online
  // ---------------------------------------------------------
  let audioEl = null;
  function speak(text, audioUrl) {
    if (audioUrl) {
      try { if (audioEl) audioEl.pause(); audioEl = new Audio(audioUrl); audioEl.play().catch(() => tts(text)); return; } catch (e) { /* dùng TTS */ }
    }
    tts(text);
  }
  function tts(text) {
    if (!("speechSynthesis" in window)) { toast("Trình duyệt không hỗ trợ đọc phát âm."); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = S.accent;
    u.rate = text.length > 40 ? 0.95 : 0.85;
    const v = speechSynthesis.getVoices().find((x) => x.lang === S.accent);
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }

  async function dictLookup(word) {
    const key = word.toLowerCase();
    const cache = loadCache();
    if (Object.prototype.hasOwnProperty.call(cache, key)) return cache[key];
    try {
      const r = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(key));
      if (r.status === 404) { cache[key] = null; saveCache(cache); return null; }
      if (!r.ok) return undefined;
      const data = await r.json();
      const e = data[0] || {};
      const ph = [].concat(...data.map((d) => d.phonetics || []));
      const want = S.accent === "en-GB" ? /-uk\.mp3$/ : /-us\.mp3$/;
      const audio = (ph.find((p) => p.audio && want.test(p.audio)) || ph.find((p) => p.audio) || {}).audio || "";
      const meanings = [].concat(...data.map((d) => d.meanings || []));
      const res = {
        ipa: e.phonetic || (ph.find((p) => p.text) || {}).text || "",
        audio,
        pos: (meanings[0] || {}).partOfSpeech || "",
        defs: meanings.slice(0, 3).map((m) => ({
          pos: m.partOfSpeech,
          def: (m.definitions[0] || {}).definition || "",
          ex: (m.definitions.find((x) => x.example) || {}).example || ""
        })).filter((x) => x.def)
      };
      cache[key] = res; saveCache(cache);
      return res;
    } catch (err) {
      return undefined; // mất mạng
    }
  }

  // ---------------------------------------------------------
  // 5. Thông báo, banner, huy hiệu
  // ---------------------------------------------------------
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.remove("hidden");
    el.style.animation = "none"; void el.offsetWidth; el.style.animation = "";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), 2600);
  }
  function renderBanner() {
    const el = $("#banner");
    const days = Math.floor((Date.now() - (S.lastBackup || 0)) / DAY);
    if (S.words.length >= 5 && days >= CFG.backupReminderDays && Date.now() > (S.backupSnoozeUntil || 0)) {
      el.innerHTML = `<span>Đã ${days} ngày bạn chưa tải file backup. Kho từ chỉ lưu trên trình duyệt này — tải về cho an toàn nhé.</span>
        <span class="spacer"></span>
        <button class="btn btn-sm btn-primary" id="banner-backup">Tải backup</button>
        <button class="btn btn-sm btn-ghost" id="banner-later">Để sau</button>`;
      el.classList.remove("hidden");
      $("#banner-backup").onclick = () => { exportBackup(); el.classList.add("hidden"); };
      $("#banner-later").onclick = () => { S.backupSnoozeUntil = Date.now() + 2 * DAY; save(); el.classList.add("hidden"); };
    } else el.classList.add("hidden");
  }
  function updateBadges() {
    const n = dueWords().length;
    const b = $("#nav-badge-review");
    if (b) { b.textContent = n > 99 ? "99+" : n; b.classList.toggle("hidden", n === 0); }
  }

  // ---------------------------------------------------------
  // 6. Điều hướng (hash router)
  // ---------------------------------------------------------
  function renderNav() {
    $("#nav").innerHTML = NAV.map((n) => `
      <a href="#${n.id}" data-nav="${n.id}">${n.icon}<span class="lbl">${n.label}</span>${n.id === "review" ? '<span class="badge hidden" id="nav-badge-review"></span>' : ""}</a>`).join("");
    updateBadges();
  }
  function route() {
    ensureDay();
    closeSheet();
    const hash = (location.hash || "#today").slice(1);
    const [page, arg] = hash.split("/");
    const view = $("#view");
    $$("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.nav === page));
    view.classList.remove("fade-in"); void view.offsetWidth; view.classList.add("fade-in");
    switch (page) {
      case "read": arg ? renderArticle(decodeURIComponent(arg)) : renderArticleList(); break;
      case "glossary": renderGlossary(); break;
      case "words": renderWords(); break;
      case "review": renderReview(); break;
      case "quiz": renderQuiz(); break;
      default: renderToday();
    }
    renderBanner();
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------
  // 7. Trang "Hôm nay"
  // ---------------------------------------------------------
  function renderToday() {
    const g = CFG.goals, d = S.daily;
    const due = dueWords().length;
    const reviewTarget = Math.min(g.reviews, d.reviews + due) || g.reviews;
    const mastered = S.words.filter((w) => w.srs.interval >= MASTERED_DAYS).length;
    const allArticles = ARTICLES.length;
    const readCount = ARTICLES.filter((a) => S.articlesDone[a.id]).length;
    const qs = Object.values(S.quizStats).reduce((acc, x) => ({ c: acc.c + x.c, t: acc.t + x.t }), { c: 0, t: 0 });
    const acc = qs.t ? Math.round((qs.c / qs.t) * 100) + "%" : "—";
    const h = new Date().getHours();
    const hello = h < 11 ? "Chào buổi sáng" : h < 14 ? "Chào buổi trưa" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối";
    const nextArticle = ARTICLES.find((a) => !S.articlesDone[a.id]) || ARTICLES[0];

    const goals = [
      { icon: ICONS.read, title: "Đọc 1 bài báo", cur: d.articles, max: g.articles, href: nextArticle ? "#read/" + nextArticle.id : "#read", cta: "Đọc ngay", sub: nextArticle ? nextArticle.title : "" },
      { icon: ICONS.words, title: "Lưu từ mới", cur: d.newWords, max: g.newWords, href: "#glossary", cta: "Mở thuật ngữ", sub: "Từ bài báo, thuật ngữ, hoặc clip TikTok" },
      { icon: ICONS.review, title: "Ôn thẻ đến hạn", cur: d.reviews, max: reviewTarget, href: "#review", cta: due ? `Ôn ${due} thẻ` : "Ôn tập", sub: due ? `Còn ${due} thẻ đang chờ` : "Không còn thẻ đến hạn" },
      { icon: ICONS.quiz, title: "Luyện đề", cur: d.quiz, max: g.quiz, href: "#quiz", cta: "Làm đề", sub: d.quiz ? `Đúng ${d.quizCorrect}/${d.quiz} câu hôm nay` : "TOEIC Part 5 & C1 usage" }
    ];

    const topicRows = TOPICS.map((t) => {
      const total = TERMS.filter((x) => x.topic === t.id).length;
      const saved = S.words.filter((w) => w.topic === t.id).length;
      const st = S.quizStats[t.id];
      const pct = total ? Math.min(100, Math.round((saved / total) * 100)) : 0;
      return `<div class="stack" style="gap:6px">
        <div class="row between small"><span class="row" style="gap:8px"><span class="dot" style="background:${t.color}"></span><b>${esc(t.name)}</b></span>
        <span class="muted xs">${saved}/${total} từ${st ? ` · đề ${Math.round((st.c / st.t) * 100)}%` : ""}</span></div>
        <div class="bar"><span style="width:${pct}%;background:${t.color}"></span></div></div>`;
    }).join("");

    $("#view").innerHTML = `
      <section class="hero">
        <div class="streak"><b>${currentStreak()}</b><small>ngày liên tiếp</small></div>
        <h1>${hello}! Hôm nay học gì?</h1>
        <p>Mục tiêu: đọc hiểu báo tài chính, dùng thuật ngữ chuẩn — hướng tới <b>C1</b> và <b>TOEIC 800+</b>.</p>
        <div class="ticker">
          <div><b>${S.words.length}</b>từ đã lưu</div>
          <div><b>${mastered}</b>từ đã thuộc</div>
          <div><b>${readCount}/${allArticles}</b>bài đã đọc</div>
          <div><b>${acc}</b>độ chính xác luyện đề</div>
        </div>
      </section>

      <h2 class="section-title">Kế hoạch hôm nay</h2>
      <div class="grid grid-4">
        ${goals.map((x) => {
          const done = x.cur >= x.max && x.max > 0;
          const pct = x.max ? Math.min(100, Math.round((x.cur / x.max) * 100)) : 0;
          return `<div class="card goal ${done ? "done" : ""}">
            <div class="goal-top"><span class="goal-icon">${done ? ICONS.check : x.icon}</span>
              <div><h3>${x.title}</h3><div class="count">${x.cur} / ${x.max}</div></div></div>
            <div class="bar"><span style="width:${pct}%"></span></div>
            <p class="muted xs" style="min-height:34px">${esc(x.sub)}</p>
            <a class="btn btn-sm ${done ? "" : "btn-primary"}" href="${x.href}">${done ? "Làm thêm" : x.cta}</a>
          </div>`;
        }).join("")}
      </div>

      <div class="grid grid-2" style="margin-top:14px">
        <div class="card">
          <h3 style="font-size:16px;margin-bottom:14px">Tiến độ theo chủ đề</h3>
          <div class="stack" style="gap:14px">${topicRows}</div>
        </div>
        <div class="card roadmap">
          <h3 style="font-size:16px;margin-bottom:14px">Lộ trình 12 tuần gợi ý</h3>
          <ol>
            <li><div><b>Tuần 1–4 · Nền thuật ngữ</b><span class="muted small">Mỗi ngày lưu 5 từ trong mục Thuật ngữ, ôn hết thẻ đến hạn. Bắt đầu với Vĩ mô và Tiền tệ.</span></div></li>
            <li><div><b>Tuần 5–8 · Đọc báo & paraphrase</b><span class="muted small">Mỗi ngày 1 bài báo, làm 3 câu đọc hiểu. Để ý cách bài báo diễn đạt lại một ý bằng từ khác (paraphrase) — kỹ năng cốt lõi của TOEIC Part 7 và C1.</span></div></li>
            <li><div><b>Tuần 9–12 · Luyện đề & tăng tốc</b><span class="muted small">Mỗi ngày 10–20 câu luyện đề, dán thêm bài báo thật (Reuters, Bloomberg) để đọc nhanh hơn.</span></div></li>
          </ol>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------
  // 8. Đọc báo
  // ---------------------------------------------------------
  let readTopic = "all";
  const allArticles = () => ARTICLES.concat(S.customArticles || []);

  function topicChips(current, onPick, counts) {
    const html = `<div class="chips">
      <button class="chip ${current === "all" ? "on" : ""}" data-topic="all">Tất cả${counts ? ` · ${counts.all}` : ""}</button>
      ${TOPICS.map((t) => `<button class="chip ${current === t.id ? "on" : ""}" data-topic="${t.id}"><span class="dot" style="background:${t.color}"></span>${esc(t.name)}${counts ? ` · ${counts[t.id] || 0}` : ""}</button>`).join("")}
    </div>`;
    setTimeout(() => $$("[data-topic]").forEach((b) => (b.onclick = () => onPick(b.dataset.topic))), 0);
    return html;
  }

  function renderArticleList() {
    const list = allArticles().filter((a) => readTopic === "all" || a.topic === readTopic);
    const counts = { all: allArticles().length };
    allArticles().forEach((a) => (counts[a.topic] = (counts[a.topic] || 0) + 1));
    $("#view").innerHTML = `
      <div class="page-head">
        <div><h1>Đọc báo tài chính</h1><p>Bấm vào bất kỳ từ nào trong bài để tra nghĩa và lưu kèm câu gốc. Mỗi bài có 3 câu hỏi đọc hiểu kiểu TOEIC Part 7.</p></div>
        <button class="btn" id="btn-paste">${ICONS.plus} Dán bài của bạn</button>
      </div>
      <div id="paste-box" class="card hidden" style="margin-bottom:18px">
        <div class="stack">
          <h3 style="font-size:16px">Dán bài báo / transcript bạn đang đọc</h3>
          <p class="muted small">Bài dán chỉ lưu trên trình duyệt của bạn. Hợp với bài Reuters, Bloomberg, CafeF English, transcript video TikTok/YouTube…</p>
          <div class="grid grid-2">
            <div class="field"><label class="label" for="paste-title">Tiêu đề</label><input class="input" id="paste-title" placeholder="VD: Fed signals two more cuts" /></div>
            <div class="field"><label class="label" for="paste-topic">Chủ đề</label><select class="select" id="paste-topic">${TOPICS.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select></div>
          </div>
          <div class="field"><label class="label" for="paste-text">Nội dung tiếng Anh</label><textarea class="textarea" id="paste-text" rows="7" placeholder="Dán nội dung vào đây. Mỗi đoạn cách nhau bằng 1 dòng trống."></textarea></div>
          <div class="row"><span class="spacer"></span><button class="btn btn-ghost" id="paste-cancel">Hủy</button><button class="btn btn-primary" id="paste-save">Mở bài</button></div>
        </div>
      </div>
      ${topicChips(readTopic, (t) => { readTopic = t; renderArticleList(); }, counts)}
      <div class="grid grid-3">
        ${list.map((a) => {
          const t = topicOf(a.topic), done = S.articlesDone[a.id];
          return `<a class="card card-click article-card" href="#read/${encodeURIComponent(a.id)}" style="text-decoration:none;color:inherit">
            <div class="meta"><span class="tag"><span class="dot" style="background:${t.color}"></span>${esc(t.name)}</span>
              ${a.level ? `<span class="tag">${esc(a.level)}</span>` : ""}
              ${a.custom ? '<span class="tag gold">Bài của bạn</span>' : ""}
              ${done ? `<span class="tag green">✓ ${done.score}/${done.total}</span>` : ""}</div>
            <h3>${esc(a.title)}</h3>
            <p>${esc(a.summary || a.style || "")}</p>
            <p class="xs" style="margin-top:10px">${esc(a.style || "")}${a.style ? " · " : ""}${wordCount(a)} từ · ~${Math.max(1, Math.round(wordCount(a) / 180))} phút</p>
          </a>`;
        }).join("") || `<div class="empty card" style="grid-column:1/-1"><h3>Chưa có bài trong chủ đề này</h3><p>Bấm "Dán bài của bạn" để thêm.</p></div>`}
      </div>`;

    $("#btn-paste").onclick = () => $("#paste-box").classList.toggle("hidden");
    $("#paste-cancel").onclick = () => $("#paste-box").classList.add("hidden");
    $("#paste-save").onclick = () => {
      const text = $("#paste-text").value.trim();
      if (text.split(/\s+/).length < 10) { toast("Dán ít nhất vài câu tiếng Anh nhé."); return; }
      const a = {
        id: "my-" + Date.now().toString(36), custom: true,
        topic: $("#paste-topic").value, level: "", style: "Bài tự dán",
        title: $("#paste-title").value.trim() || "Bài đọc của tôi",
        summary: "", paragraphs: text.split(/\n\s*\n|\n/).map((s) => s.trim()).filter(Boolean), questions: []
      };
      S.customArticles.unshift(a); save();
      location.hash = "#read/" + a.id;
    };
  }

  // Tách câu & từ để bấm tra
  let readerSentences = [];
  function buildPhraseMatcher() {
    const phrases = new Set();
    TERMS.forEach((t) => { if (/\s/.test(t.term)) phrases.add(t.term.toLowerCase()); });
    S.words.forEach((w) => { if (/\s/.test(w.term)) phrases.add(w.term.toLowerCase()); });
    const list = Array.from(phrases).sort((a, b) => b.length - a.length).map((p) => {
      const ws = p.split(/\s+/).map(reEsc);
      const f = ws[0];
      let fp;
      if (/e$/.test(f)) fp = f.slice(0, -1) + "(?:e|es|ed|ing)";
      else if (/[^aeiou]y$/.test(f)) fp = f.slice(0, -1) + "(?:y|ies|ied|ying)";
      else fp = f + "(?:s|es|ed|ing)?";
      const last = ws.length > 1 ? ws[ws.length - 1] + "(?:s|es)?" : "";
      const pat = [fp].concat(ws.slice(1, -1), last ? [last] : []).join("\\s+");
      return { p, pat, anch: new RegExp("^(?:" + pat + ")$", "i") };
    });
    return { list, re: list.length ? new RegExp("\\b(?:" + list.map((x) => x.pat).join("|") + ")\\b", "gi") : null };
  }
  function tokSpan(text, key, sIdx) {
    const t = findTerm(key), saved = findWord(key);
    const cls = saved ? "saved" : t ? "term" : "";
    return `<span class="tok ${cls}" data-k="${esc(key)}" data-s="${sIdx}">${esc(text)}</span>`;
  }
  function renderWordsInText(text, sIdx) {
    return text.split(/(\s+)/).map((ch) => {
      if (!ch) return "";
      if (/^\s+$/.test(ch)) return ch;
      const m = ch.match(/^([^A-Za-z]*)([A-Za-z](?:[A-Za-z'’\-]*[A-Za-z])?)(.*)$/);
      if (!m) return esc(ch);
      const key = m[2].toLowerCase().replace(/['’]s$/, "");
      if (key.length < 2) return esc(ch);
      return esc(m[1]) + tokSpan(m[2], key, sIdx) + esc(m[3]);
    }).join("");
  }
  function renderSentence(sent, sIdx, pm) {
    if (!pm.re) return renderWordsInText(sent, sIdx);
    let html = "", last = 0, m;
    pm.re.lastIndex = 0;
    while ((m = pm.re.exec(sent))) {
      html += renderWordsInText(sent.slice(last, m.index), sIdx);
      const hit = pm.list.find((x) => x.anch.test(m[0]));
      html += tokSpan(m[0], hit ? hit.p : m[0].toLowerCase(), sIdx);
      last = m.index + m[0].length;
    }
    return html + renderWordsInText(sent.slice(last), sIdx);
  }
  function splitSentences(p) { return p.split(/(?<=[.!?]["”’)]?)\s+(?=["“(]?[A-Z0-9])/); }

  function renderArticle(id) {
    const a = allArticles().find((x) => x.id === id);
    if (!a) { $("#view").innerHTML = `<div class="empty card"><h3>Không tìm thấy bài đọc</h3><a class="btn" href="#read">Về danh sách</a></div>`; return; }
    const t = topicOf(a.topic);
    const pm = buildPhraseMatcher();
    readerSentences = [];
    const body = a.paragraphs.map((p) => "<p>" + splitSentences(p).map((s) => { readerSentences.push(s); return renderSentence(s, readerSentences.length - 1, pm); }).join(" ") + "</p>").join("");
    const savedHere = new Set($$(".tok.saved", (() => { const d = document.createElement("div"); d.innerHTML = body; return d; })()).map((e) => e.dataset.k)).size;
    const done = S.articlesDone[a.id];

    $("#view").innerHTML = `
      <div class="row" style="margin-bottom:14px;max-width:760px;margin-inline:auto">
        <a class="btn btn-ghost btn-sm" href="#read">${ICONS.back} Danh sách bài</a><span class="spacer"></span>
        <button class="btn btn-sm" id="btn-listen">${ICONS.speak} Nghe cả bài</button>
        ${a.custom ? `<button class="btn btn-sm btn-ghost btn-danger" id="btn-del-article">${ICONS.trash} Xóa bài</button>` : ""}
      </div>
      <article class="reader">
        <div class="kicker">${esc(t.en)}${a.style ? " · " + esc(a.style) : ""}${a.level ? " · " + esc(a.level) : ""}</div>
        <h1>${esc(a.title)}</h1>
        <div class="summary">${a.summary ? esc(a.summary) : "Bấm vào từ để tra."}
          <div class="hint"><span><span class="sample-term">thuật ngữ</span> có sẵn nghĩa</span><span><span class="sample-saved">từ đã lưu</span></span><span>${savedHere} từ đã lưu trong bài</span></div></div>
        <div class="body" id="reader-body">${body}</div>
      </article>
      ${a.questions && a.questions.length ? `
      <section class="qblock" style="margin-top:22px">
        <div class="card">
          <div class="row between" style="margin-bottom:6px"><h3 style="font-size:17px">Câu hỏi đọc hiểu · TOEIC Part 7 / C1</h3>
          <span class="muted small" id="aq-score">${done ? `Lần trước: ${done.score}/${done.total}` : ""}</span></div>
          <div id="aq-list">${a.questions.map((q, i) => questionHtml(q, i, "aq")).join("")}</div>
        </div>
      </section>` : ""}`;

    $("#reader-body").onclick = (e) => {
      const tok = e.target.closest(".tok");
      if (!tok) return;
      $$(".tok.sel").forEach((x) => x.classList.remove("sel"));
      tok.classList.add("sel");
      openLookup(tok.dataset.k, { context: readerSentences[+tok.dataset.s] || "", source: a.custom ? "Bài tự dán" : "Bài báo FinFluent", topic: a.topic, onSaved: () => { tok.classList.remove("term"); tok.classList.add("saved"); } });
    };
    $("#btn-listen").onclick = () => tts(a.paragraphs.join(" "));
    if (a.custom) $("#btn-del-article").onclick = () => {
      if (!confirm("Xóa bài này?")) return;
      S.customArticles = S.customArticles.filter((x) => x.id !== a.id); save(); location.hash = "#read";
    };

    if (a.questions && a.questions.length) {
      const answers = {};
      bindQuestions($("#aq-list"), a.questions, "aq", (i, ok) => {
        answers[i] = ok;
        if (Object.keys(answers).length === a.questions.length) {
          const score = Object.values(answers).filter(Boolean).length;
          const first = !S.articlesDone[a.id];
          S.articlesDone[a.id] = { score, total: a.questions.length, date: todayStr() };
          if (first || S.articlesDone[a.id].date !== S.daily.date) bump("articles"); else save();
          $("#aq-score").textContent = `Kết quả: ${score}/${a.questions.length}`;
          toast(score === a.questions.length ? "Xuất sắc! Đúng hết cả 3 câu." : `Bạn đúng ${score}/${a.questions.length} câu — đọc lại phần giải thích nhé.`);
        }
      });
    }
  }

  // Câu hỏi trắc nghiệm dùng chung
  function questionHtml(q, i, prefix) {
    return `<div class="q" data-qi="${i}">
      <div class="q-text">${i + 1}. ${esc(q.q).replace(/_{3,}/g, '<span class="blank">_____</span>')}</div>
      <div class="opts">${q.options.map((o, j) => `<button class="opt" data-${prefix}="${i}" data-j="${j}"><span class="letter">${"ABCD"[j]}</span><span>${esc(o)}</span></button>`).join("")}</div>
      <div class="explain hidden"></div></div>`;
  }
  function bindQuestions(root, questions, prefix, onAnswer) {
    root.onclick = (e) => {
      const b = e.target.closest(".opt");
      if (!b || b.disabled) return;
      const i = +b.dataset[prefix], j = +b.dataset.j, q = questions[i];
      const block = b.closest(".q");
      const ok = j === q.answer;
      $$(".opt", block).forEach((x, k) => { x.disabled = true; if (k === q.answer) x.classList.add("right"); else if (k === j) x.classList.add("wrong"); });
      const ex = $(".explain", block);
      ex.innerHTML = `<b class="${ok ? "ok" : "no"}">${ok ? "Chính xác!" : "Chưa đúng."}</b> ${esc(q.explain || "")}`;
      ex.classList.remove("hidden");
      onAnswer(i, ok);
    };
  }

  // ---------------------------------------------------------
  // 9. Bảng tra từ (sheet)
  // ---------------------------------------------------------
  let sheetToken = 0;
  function closeSheet() {
    $("#sheet").classList.remove("open");
    $("#sheet").setAttribute("aria-hidden", "true");
    $("#sheet-backdrop").classList.add("hidden");
    $$(".tok.sel").forEach((x) => x.classList.remove("sel"));
  }
  function openLookup(key, opts) {
    opts = opts || {};
    const myToken = ++sheetToken;
    const saved = findWord(key);
    const term = findTerm(key);
    const name = saved ? saved.term : term ? term.term : key;
    const src = saved || term || {};
    const topic = src.topic || opts.topic || "";
    const context = (saved && saved.context) || opts.context || "";
    const t = topicOf(topic);

    const sheet = $("#sheet");
    sheet.innerHTML = `
      <div class="sheet-head">
        <div class="row" style="align-items:flex-start">
          <div style="flex:1;min-width:0">
            <div class="row wrap" style="gap:6px;margin-bottom:6px">
              ${topic ? `<span class="tag"><span class="dot" style="background:${t.color}"></span>${esc(t.name)}</span>` : ""}
              ${src.level ? `<span class="tag gold">${esc(src.level)}</span>` : ""}
              ${saved ? `<span class="tag green">✓ Đã lưu</span>` : ""}
            </div>
            <h2>${esc(name)}</h2>
            <div class="row" style="gap:8px;margin-top:4px"><span class="ipa" id="lk-ipa">${esc(src.ipa || "")}</span><span class="muted small" id="lk-pos">${esc(src.pos || "")}</span></div>
          </div>
          <button class="icon-btn" id="lk-speak" title="Phát âm">${ICONS.speak}</button>
          <button class="icon-btn" id="lk-close" title="Đóng">${ICONS.close}</button>
        </div>
      </div>
      <div class="sheet-body">
        <div class="field"><label class="label" for="lk-vi">Nghĩa tiếng Việt</label>
          <input class="input" id="lk-vi" value="${esc(src.vi || "")}" placeholder="Gõ nghĩa tiếng Việt bạn hiểu…" /></div>
        <div id="lk-en">${src.en ? `<div class="info-block"><div class="k">Định nghĩa (EN)</div>${esc(src.en)}</div>` : ""}</div>
        ${src.collocations ? `<div class="info-block"><div class="k">Collocations · cụm hay đi kèm</div>${esc(src.collocations)}</div>` : ""}
        ${src.synonyms ? `<div class="info-block"><div class="k">Paraphrase / đồng nghĩa</div>${esc(src.synonyms)}</div>` : ""}
        ${src.example && src.example !== context ? `<div class="info-block"><div class="k">Ví dụ</div><div class="ex">${highlight(src.example, name)}</div></div>` : ""}
        ${src.note ? `<div class="tip">${esc(src.note)}</div>` : ""}
        <div class="field"><label class="label" for="lk-ctx">Câu ngữ cảnh (giúp bạn nhớ lâu)</label>
          <textarea class="textarea" id="lk-ctx" rows="3" placeholder="Câu bạn gặp từ này…">${esc(context)}</textarea></div>
        <div class="links"><a target="_blank" rel="noopener" href="https://translate.google.com/?sl=en&tl=vi&text=${encodeURIComponent(context && context.length < 400 ? context : name)}">Google Dịch ↗</a>
          <a target="_blank" rel="noopener" href="https://dictionary.cambridge.org/dictionary/english-vietnamese/${encodeURIComponent(name.replace(/\s+/g, "-"))}">Cambridge Anh–Việt ↗</a>
          <a target="_blank" rel="noopener" href="https://www.investopedia.com/search?q=${encodeURIComponent(name)}">Investopedia ↗</a></div>
      </div>
      <div class="sheet-foot">
        ${saved ? `<button class="btn btn-ghost btn-danger btn-sm" id="lk-del">${ICONS.trash} Xóa</button>` : ""}
        <span class="spacer"></span>
        <button class="btn btn-primary" id="lk-save">${saved ? "Cập nhật" : "Lưu vào Từ của tôi"}</button>
      </div>`;
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    $("#sheet-backdrop").classList.remove("hidden");

    let audio = (saved && saved.audio) || "";
    let apiPos = "";
    $("#lk-close").onclick = closeSheet;
    $("#lk-speak").onclick = () => speak(name, audio);

    // Tra online nếu chưa có định nghĩa
    if (!src.en && !/\s/.test(name)) {
      $("#lk-en").innerHTML = `<div class="loading"><span class="spin"></span> Đang tra từ điển online…</div>`;
      const lookupWord = name;
      dictLookup(lookupWord).then(async (res) => {
        if (res === null) {
          for (const c of stemCandidates(lookupWord)) { const r2 = await dictLookup(c); if (r2) { res = r2; break; } }
        }
        if (myToken !== sheetToken) return;
        if (!res) {
          $("#lk-en").innerHTML = `<p class="muted small">${res === null ? "Không tìm thấy trong từ điển online. Bạn có thể tra Google Dịch bên dưới rồi gõ nghĩa." : "Không kết nối được từ điển online (kiểm tra mạng). Bạn vẫn lưu được bình thường."}</p>`;
          return;
        }
        audio = audio || res.audio;
        apiPos = res.pos;
        if (!$("#lk-ipa").textContent) $("#lk-ipa").textContent = res.ipa;
        if (!$("#lk-pos").textContent) $("#lk-pos").textContent = res.pos;
        $("#lk-en").innerHTML = `<div class="info-block"><div class="k">Định nghĩa (EN) · dictionaryapi.dev</div>
          ${res.defs.map((d) => `<div style="margin-bottom:6px"><i class="muted">${esc(d.pos)}</i> — ${esc(d.def)}${d.ex ? `<div class="muted small" style="font-family:var(--serif)">“${esc(d.ex)}”</div>` : ""}</div>`).join("")}</div>`;
        $("#lk-en").dataset.en = res.defs[0] ? res.defs[0].def : "";
      });
    }

    $("#lk-save").onclick = () => {
      const vi = $("#lk-vi").value.trim();
      if (!vi) { toast("Gõ nghĩa tiếng Việt trước khi lưu nhé."); $("#lk-vi").focus(); return; }
      const data = Object.assign(term ? termToWord(term) : {}, saved ? {} : {}, {
        term: name, vi,
        en: src.en || $("#lk-en").dataset.en || "",
        ipa: $("#lk-ipa").textContent || "",
        pos: $("#lk-pos").textContent || apiPos || "",
        topic: topic || opts.topic || "",
        context: $("#lk-ctx").value.trim(),
        source: (saved && saved.source) || opts.source || "Tra từ",
        audio
      });
      const r = addWord(data);
      toast(r.isNew ? `Đã lưu "${name}" — sẽ nhắc bạn ôn đúng lúc.` : `Đã cập nhật "${name}".`);
      if (opts.onSaved) opts.onSaved();
      closeSheet();
    };
    if (saved) $("#lk-del").onclick = () => {
      if (!confirm(`Xóa "${saved.term}" khỏi Từ của tôi?`)) return;
      S.words = S.words.filter((x) => x.id !== saved.id); save();
      toast("Đã xóa."); closeSheet();
      if (opts.onDeleted) opts.onDeleted();
    };
    setTimeout(() => { if (!src.vi) $("#lk-vi").focus(); }, 250);
  }
  function highlight(sentence, word) {
    const safe = esc(sentence);
    if (!word) return safe;
    const base = word.toLowerCase().replace(/(e|y)$/, "");
    const re = new RegExp("(" + reEsc(esc(base)).replace(/\s+/g, "\\s+") + "[a-z]*)", "i");
    return safe.replace(re, '<mark class="hl">$1</mark>');
  }

  // ---------------------------------------------------------
  // 10. Thuật ngữ
  // ---------------------------------------------------------
  let glossTopic = "all", glossQuery = "", glossLevel = "all";
  function renderGlossary() {
    const counts = { all: TERMS.length };
    TERMS.forEach((t) => (counts[t.topic] = (counts[t.topic] || 0) + 1));
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Thuật ngữ tài chính</h1>
        <p>${TERMS.length} thuật ngữ chọn lọc cho báo chí tài chính, TOEIC 800+ và C1. Bấm "+ Lưu" để đưa vào lịch ôn.</p></div></div>
      ${topicChips(glossTopic, (t) => { glossTopic = t; renderGlossary(); }, counts)}
      <div class="toolbar">
        <input class="input" id="g-search" placeholder="Tìm thuật ngữ hoặc nghĩa tiếng Việt…" value="${esc(glossQuery)}" />
        <select class="select" id="g-level">
          <option value="all">Mọi cấp độ</option>
          ${["B2", "C1", "TOEIC"].map((l) => `<option value="${l}" ${glossLevel === l ? "selected" : ""}>${l}</option>`).join("")}
        </select>
        <button class="btn" id="g-add5">Lưu 5 từ ngẫu nhiên chưa học</button>
      </div>
      <div class="grid grid-3" id="g-list"></div>`;
    const draw = () => {
      const q = glossQuery.toLowerCase();
      const list = TERMS.filter((t) => (glossTopic === "all" || t.topic === glossTopic) && (glossLevel === "all" || t.level === glossLevel) &&
        (!q || (t.term + " " + t.vi + " " + (t.synonyms || "")).toLowerCase().includes(q)));
      $("#g-list").innerHTML = list.map((t) => {
        const saved = findWord(t.term), tp = topicOf(t.topic);
        return `<div class="card term-card">
          <div class="head"><div style="flex:1;min-width:0">
            <h3>${esc(t.term)}</h3><div class="row" style="gap:8px"><span class="ipa">${esc(t.ipa)}</span><span class="muted xs">${esc(t.pos)}</span></div></div>
            <button class="icon-btn" data-say="${esc(t.term)}" title="Phát âm">${ICONS.speak}</button></div>
          <div class="vi">${esc(t.vi)}</div>
          <div class="en">${esc(t.en)}</div>
          <div class="ex">${highlight(t.example, t.term)}</div>
          ${t.collocations ? `<div class="colloc"><b>Cụm hay gặp:</b> ${esc(t.collocations)}</div>` : ""}
          <div class="row" style="margin-top:auto;padding-top:4px">
            <span class="tag"><span class="dot" style="background:${tp.color}"></span>${esc(tp.name)}</span><span class="tag gold">${esc(t.level)}</span>
            <span class="spacer"></span>
            ${saved ? `<span class="tag green">✓ Đã lưu</span>` : `<button class="btn btn-sm btn-primary" data-save="${esc(t.term)}">${ICONS.plus} Lưu</button>`}
          </div></div>`;
      }).join("") || `<div class="empty card" style="grid-column:1/-1"><h3>Không có thuật ngữ phù hợp</h3><p>Thử từ khóa khác.</p></div>`;
    };
    draw();
    $("#g-search").oninput = (e) => { glossQuery = e.target.value; draw(); };
    $("#g-level").onchange = (e) => { glossLevel = e.target.value; draw(); };
    $("#g-list").onclick = (e) => {
      const say = e.target.closest("[data-say]");
      if (say) return speak(say.dataset.say);
      const sv = e.target.closest("[data-save]");
      if (sv) { const t = termMap.get(sv.dataset.save.toLowerCase()); addWord(termToWord(t, t.example, "Thuật ngữ")); toast(`Đã lưu "${t.term}".`); draw(); }
    };
    $("#g-add5").onclick = () => {
      const pool = TERMS.filter((t) => (glossTopic === "all" || t.topic === glossTopic) && !findWord(t.term));
      const pick = shuffle(pool).slice(0, 5);
      if (!pick.length) { toast("Bạn đã lưu hết thuật ngữ trong chủ đề này!"); return; }
      pick.forEach((t) => addWord(termToWord(t, t.example, "Thuật ngữ")));
      toast("Đã lưu: " + pick.map((t) => t.term).join(", "));
      draw();
    };
  }

  // ---------------------------------------------------------
  // 11. Từ của tôi
  // ---------------------------------------------------------
  let wordsQuery = "", wordsTopic = "all", wordsStatus = "all";
  function renderWords() {
    const SOURCES = ["TikTok", "Facebook", "YouTube", "Báo / bài đọc", "Đề TOEIC", "Khác"];
    $("#view").innerHTML = `
      <div class="page-head">
        <div><h1>Từ của tôi</h1><p>Mọi từ bạn lưu từ bài báo, thuật ngữ, hay clip TikTok/Facebook đều ở đây và được nhắc ôn tự động.</p></div>
        <div class="row wrap">
          <button class="btn btn-primary" id="w-add-toggle">${ICONS.plus} Thêm từ nhanh</button>
          <button class="btn" id="w-export">Tải backup</button>
          <label class="btn" for="w-import" style="cursor:pointer">Nhập backup</label>
          <input type="file" id="w-import" accept=".json,application/json" class="hidden" />
        </div>
      </div>

      <form id="w-form" class="card hidden" style="margin-bottom:18px" autocomplete="off">
        <div class="stack">
          <h3 style="font-size:16px">Vừa gặp từ hay trên TikTok / Facebook?</h3>
          <div class="grid grid-2">
            <div class="field"><label class="label" for="f-term">Từ / cụm từ *</label>
              <div class="row"><input class="input" id="f-term" required placeholder="VD: dovish, priced in, rate cut" />
              <button type="button" class="btn" id="f-auto">Tra</button></div></div>
            <div class="field"><label class="label" for="f-vi">Nghĩa tiếng Việt *</label><input class="input" id="f-vi" required placeholder="VD: ôn hòa (nghiêng về nới lỏng)" /></div>
          </div>
          <div class="field"><label class="label" for="f-ctx">Câu bạn nghe/đọc được</label><textarea class="textarea" id="f-ctx" rows="2" placeholder="VD: The market has already priced in two rate cuts this year."></textarea></div>
          <div class="grid grid-2">
            <div class="field"><label class="label" for="f-src">Nguồn</label><select class="select" id="f-src">${SOURCES.map((s) => `<option>${s}</option>`).join("")}</select></div>
            <div class="field"><label class="label" for="f-topic">Chủ đề</label><select class="select" id="f-topic">${TOPICS.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select></div>
          </div>
          <p class="muted xs" id="f-info"></p>
          <div class="row"><span class="spacer"></span><button type="button" class="btn btn-ghost" id="f-cancel">Hủy</button><button class="btn btn-primary" type="submit">Lưu từ</button></div>
        </div>
      </form>

      <div class="toolbar">
        <input class="input" id="w-search" placeholder="Tìm trong từ đã lưu…" value="${esc(wordsQuery)}" />
        <select class="select" id="w-topic"><option value="all">Mọi chủ đề</option>${TOPICS.map((t) => `<option value="${t.id}" ${wordsTopic === t.id ? "selected" : ""}>${esc(t.name)}</option>`).join("")}</select>
        <select class="select" id="w-status">
          <option value="all">Mọi trạng thái</option>
          <option value="due" ${wordsStatus === "due" ? "selected" : ""}>Cần ôn</option>
          <option value="learning" ${wordsStatus === "learning" ? "selected" : ""}>Đang nhớ</option>
          <option value="mastered" ${wordsStatus === "mastered" ? "selected" : ""}>Đã thuộc</option>
        </select>
      </div>
      <div class="card list-card" id="w-list"></div>`;

    const draw = () => {
      const q = wordsQuery.toLowerCase();
      const list = S.words.filter((w) => (wordsTopic === "all" || w.topic === wordsTopic) && (wordsStatus === "all" || status(w).id === wordsStatus) &&
        (!q || (w.term + " " + w.vi + " " + (w.context || "")).toLowerCase().includes(q)));
      if (!S.words.length) {
        $("#w-list").innerHTML = `<div class="empty"><h3>Chưa có từ nào</h3><p>Bắt đầu bằng cách đọc 1 bài báo hoặc lưu vài thuật ngữ.</p>
          <div class="row" style="justify-content:center;margin-top:14px"><a class="btn btn-primary" href="#read">Đọc báo</a><a class="btn" href="#glossary">Xem thuật ngữ</a></div></div>`;
        return;
      }
      $("#w-list").innerHTML = `<div class="row between small muted" style="padding:12px 16px;border-bottom:1px solid var(--line)"><span>${list.length} / ${S.words.length} từ</span><span>Bấm vào từ để sửa</span></div>` +
        (list.map((w) => {
          const st = status(w), tp = topicOf(w.topic);
          return `<div class="word-row">
            <div style="min-width:0;cursor:pointer" data-edit="${w.id}">
              <div class="row wrap" style="gap:8px"><h3>${esc(w.term)}</h3><span class="ipa">${esc(w.ipa || "")}</span><span class="tag ${st.cls}">${st.label}</span></div>
              <div style="font-weight:500;color:var(--primary)">${esc(w.vi)}</div>
              ${w.context ? `<div class="ctx">${highlight(w.context, w.term)}</div>` : ""}
              <div class="row wrap xs muted" style="gap:8px;margin-top:6px"><span class="row" style="gap:5px"><span class="dot" style="background:${tp.color}"></span>${esc(tp.name)}</span><span>· ${esc(w.source || "")}</span>${w.srs.reps ? `<span>· ôn lại sau ${w.srs.due > Date.now() ? Math.max(1, Math.round((w.srs.due - Date.now()) / DAY)) + " ngày" : "ngay"}</span>` : ""}</div>
            </div>
            <div class="row" style="gap:6px"><button class="icon-btn" data-say="${w.id}" title="Phát âm">${ICONS.speak}</button><button class="icon-btn" data-del="${w.id}" title="Xóa">${ICONS.trash}</button></div>
          </div>`;
        }).join("") || `<div class="empty"><p>Không có từ nào khớp bộ lọc.</p></div>`);
    };
    draw();

    $("#w-search").oninput = (e) => { wordsQuery = e.target.value; draw(); };
    $("#w-topic").onchange = (e) => { wordsTopic = e.target.value; draw(); };
    $("#w-status").onchange = (e) => { wordsStatus = e.target.value; draw(); };
    $("#w-list").onclick = (e) => {
      const say = e.target.closest("[data-say]");
      if (say) { const w = S.words.find((x) => x.id === say.dataset.say); return speak(w.term, w.audio); }
      const del = e.target.closest("[data-del]");
      if (del) { const w = S.words.find((x) => x.id === del.dataset.del); if (confirm(`Xóa "${w.term}"?`)) { S.words = S.words.filter((x) => x.id !== w.id); save(); draw(); } return; }
      const ed = e.target.closest("[data-edit]");
      if (ed) { const w = S.words.find((x) => x.id === ed.dataset.edit); openLookup(w.term, { onSaved: draw, onDeleted: draw }); }
    };

    const form = $("#w-form");
    let autoData = {};
    $("#w-add-toggle").onclick = () => { form.classList.toggle("hidden"); if (!form.classList.contains("hidden")) $("#f-term").focus(); };
    $("#f-cancel").onclick = () => form.classList.add("hidden");
    $("#f-auto").onclick = async () => {
      const term = $("#f-term").value.trim();
      if (!term) return;
      const t = findTerm(term);
      if (t) {
        autoData = termToWord(t);
        $("#f-vi").value = t.vi; $("#f-topic").value = t.topic;
        if (!$("#f-ctx").value) $("#f-ctx").value = t.example;
        $("#f-info").textContent = `Có sẵn trong bộ thuật ngữ: ${t.en}`;
        return;
      }
      $("#f-info").textContent = "Đang tra từ điển online…";
      const r = await dictLookup(term);
      if (r) { autoData = { ipa: r.ipa, pos: r.pos, en: r.defs[0] ? r.defs[0].def : "", audio: r.audio }; $("#f-info").textContent = `${r.ipa} · ${r.defs.map((d) => d.pos + ": " + d.def).slice(0, 2).join(" | ")}`; }
      else $("#f-info").textContent = r === null ? "Không có trong từ điển online — bạn tự gõ nghĩa nhé." : "Không kết nối được từ điển online.";
    };
    form.onsubmit = (e) => {
      e.preventDefault();
      const term = $("#f-term").value.trim(), vi = $("#f-vi").value.trim();
      if (!term || !vi) return;
      const r = addWord(Object.assign({}, autoData, { term, vi, context: $("#f-ctx").value.trim(), source: $("#f-src").value, topic: $("#f-topic").value }));
      toast(r.isNew ? `Đã lưu "${term}".` : `Đã cập nhật "${term}".`);
      form.reset(); autoData = {}; $("#f-info").textContent = "";
      draw();
    };
    $("#w-export").onclick = exportBackup;
    $("#w-import").onchange = (e) => importBackup(e.target.files[0], draw);
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `finfluent-backup-${todayStr()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    S.lastBackup = Date.now(); save();
    toast("Đã tải file backup. Giữ file này cẩn thận nhé!");
  }
  function importBackup(file, after) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        const words = Array.isArray(data) ? data : data.words;
        if (!Array.isArray(words)) throw new Error("bad");
        let added = 0;
        words.forEach((w) => {
          if (!w || !w.term) return;
          if (findWord(w.term)) return;
          S.words.push(Object.assign({ id: uid(), created: Date.now(), srs: newSrs(), vi: "", context: "" }, w));
          added++;
        });
        if (!Array.isArray(data)) {
          Object.assign(S.articlesDone, data.articlesDone || {});
          (data.customArticles || []).forEach((a) => { if (!S.customArticles.find((x) => x.id === a.id)) S.customArticles.push(a); });
          Object.entries(data.quizStats || {}).forEach(([k, v]) => { if (!S.quizStats[k]) S.quizStats[k] = v; });
        }
        save(); toast(`Đã nhập ${added} từ mới.`); if (after) after();
      } catch (e) { toast("File không đúng định dạng backup FinFluent."); }
    };
    r.readAsText(file);
  }

  // ---------------------------------------------------------
  // 12. Ôn tập
  // ---------------------------------------------------------
  let reviewMode = "flash", reviewQueue = [], reviewIdx = 0, revealed = false, extraPractice = false;
  function buildQueue() {
    const due = dueWords().sort((a, b) => a.srs.due - b.srs.due);
    reviewQueue = due.length ? due : (extraPractice ? shuffle(S.words).slice(0, 20) : []);
    reviewIdx = 0; revealed = false;
  }
  function renderReview() {
    buildQueue();
    drawReview();
  }
  function drawReview() {
    const due = dueWords().length;
    $("#view").innerHTML = `
      <div class="page-head">
        <div><h1>Ôn tập ngắt quãng</h1><p>Mỗi từ được nhắc lại đúng lúc bạn sắp quên. Trả lời trung thực để lịch ôn chính xác.</p></div>
        <div class="seg"><button data-mode="flash" class="${reviewMode === "flash" ? "on" : ""}">Thẻ ghi nhớ</button><button data-mode="cloze" class="${reviewMode === "cloze" ? "on" : ""}">Điền từ vào câu</button></div>
      </div>
      <div id="rv"></div>`;
    $$("[data-mode]").forEach((b) => (b.onclick = () => { reviewMode = b.dataset.mode; drawReview(); }));
    const box = $("#rv");
    if (!S.words.length) {
      box.innerHTML = `<div class="card empty"><h3>Chưa có từ để ôn</h3><p>Lưu vài từ trong bài báo hoặc mục Thuật ngữ trước nhé.</p><div class="row" style="justify-content:center;margin-top:14px"><a class="btn btn-primary" href="#glossary">Mở Thuật ngữ</a></div></div>`;
      return;
    }
    if (reviewIdx >= reviewQueue.length) {
      box.innerHTML = `<div class="card empty flash"><h3>${due === 0 ? "Xong hết thẻ đến hạn hôm nay!" : "Hết lượt này"}</h3>
        <p>Hôm nay bạn đã ôn ${S.daily.reviews} thẻ. ${due ? `Còn ${due} thẻ đến hạn.` : "Lịch ôn tiếp theo đã được hẹn sẵn."}</p>
        <div class="row" style="justify-content:center;margin-top:16px">
          ${due ? `<button class="btn btn-primary" id="rv-again">Ôn tiếp</button>` : `<button class="btn" id="rv-extra">Luyện thêm 20 từ ngẫu nhiên</button>`}
          <a class="btn" href="#quiz">Sang Luyện đề</a></div></div>`;
      const a = $("#rv-again"), x = $("#rv-extra");
      if (a) a.onclick = () => { extraPractice = false; renderReview(); };
      if (x) x.onclick = () => { extraPractice = true; renderReview(); };
      return;
    }
    const w = reviewQueue[reviewIdx];
    const head = `<div class="row between small muted" style="margin-bottom:10px"><span>Thẻ ${reviewIdx + 1} / ${reviewQueue.length}${extraPractice && !due ? " · luyện thêm" : ""}</span><span class="row" style="gap:6px"><span class="dot" style="background:${topicOf(w.topic).color}"></span>${esc(topicOf(w.topic).name)}</span></div>`;
    if (reviewMode === "flash") drawFlash(box, w, head); else drawCloze(box, w, head);
  }
  function rate(w, r) {
    w.srs = schedule(w.srs, r);
    bump("reviews");
    if (r === 1) reviewQueue.push(w); // gặp lại cuối lượt
    reviewIdx++; revealed = false;
    drawReview();
  }
  function drawFlash(box, w, head) {
    const ctx = w.context || w.example || "";
    box.innerHTML = `<div class="flash">${head}<div class="card">
      <div class="front">
        <div class="row" style="justify-content:center;gap:10px"><div class="word">${esc(w.term)}</div><button class="icon-btn" id="fl-say">${ICONS.speak}</button></div>
        <div class="ipa" style="margin-top:4px">${esc(w.ipa || "")} ${w.pos ? "· " + esc(w.pos) : ""}</div>
        ${ctx ? `<div class="ctx">${highlight(ctx, w.term)}</div>` : ""}
      </div>
      <div class="back ${revealed ? "" : "hidden"}" id="fl-back">
        <div class="vi">${esc(w.vi)}</div>
        ${w.en ? `<p class="muted small" style="text-align:center;margin-top:4px">${esc(w.en)}</p>` : ""}
        ${w.collocations || w.synonyms ? `<div class="grid grid-2" style="margin-top:14px">
          ${w.collocations ? `<div class="info-block small"><div class="k">Collocations</div>${esc(w.collocations)}</div>` : ""}
          ${w.synonyms ? `<div class="info-block small"><div class="k">Paraphrase</div>${esc(w.synonyms)}</div>` : ""}</div>` : ""}
        <div class="rate">
          ${[["r1", "Quên", 1], ["r2", "Khó", 2], ["r3", "Nhớ", 3], ["r4", "Dễ", 4]].map(([c, l, r]) => `<button class="${c}" data-rate="${r}">${l}<small>${intervalLabel(w.srs, r)}</small></button>`).join("")}
        </div>
        <p class="xs muted" style="text-align:center;margin-top:10px">Phím tắt: <span class="kbd">1</span> <span class="kbd">2</span> <span class="kbd">3</span> <span class="kbd">4</span></p>
      </div>
      <div id="fl-reveal-wrap" class="${revealed ? "hidden" : ""}" style="margin-top:20px">
        <button class="btn btn-primary btn-block" id="fl-reveal">Hiện nghĩa <span class="kbd" style="color:inherit;border-color:currentColor;opacity:.7">Space</span></button>
        <p class="xs muted" style="text-align:center;margin-top:8px">Tự nói nghĩa trong đầu trước, rồi mới bấm.</p>
      </div></div></div>`;
    $("#fl-say").onclick = () => speak(w.term, w.audio);
    $("#fl-reveal").onclick = () => { revealed = true; $("#fl-back").classList.remove("hidden"); $("#fl-reveal-wrap").classList.add("hidden"); };
    $$("[data-rate]", box).forEach((b) => (b.onclick = () => rate(w, +b.dataset.rate)));
  }
  function drawCloze(box, w, head) {
    const ctx = w.context || w.example || "";
    const base = w.term.toLowerCase().replace(/(e|y)$/, "");
    const re = new RegExp("\\b" + reEsc(base).replace(/\s+/g, "\\s+") + "[a-z]*", "i");
    const m = ctx.match(re);
    const answer = m ? m[0] : w.term;
    const sentence = m ? esc(ctx.slice(0, m.index)) + '<span class="blank">_____</span>' + esc(ctx.slice(m.index + m[0].length)) : `<span class="muted">(Chưa có câu ngữ cảnh)</span> Từ tiếng Anh nghĩa là: <b>${esc(w.vi)}</b>`;
    box.innerHTML = `<div class="flash">${head}<div class="card">
      <p class="ctx" style="font-family:var(--serif);font-size:19px;line-height:1.65;margin-bottom:12px">${sentence}</p>
      <p class="small muted">Gợi ý: <b style="color:var(--ink)">${esc(w.vi)}</b> · bắt đầu bằng “${esc(answer[0])}” · ${answer.length} ký tự</p>
      <div class="row" style="margin-top:14px"><input class="input" id="cz-in" placeholder="Gõ từ còn thiếu rồi Enter…" autocomplete="off" autocapitalize="off" spellcheck="false" />
      <button class="btn btn-primary" id="cz-check">Kiểm tra</button></div>
      <div id="cz-fb" class="explain hidden"></div>
      <div class="row hidden" id="cz-next-row" style="margin-top:12px"><span class="spacer"></span><button class="btn" id="cz-next">Tiếp theo →</button></div>
    </div></div>`;
    const input = $("#cz-in");
    input.focus();
    let checked = false;
    const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
    const check = () => {
      if (checked) { next(); return; }
      checked = true;
      const val = norm(input.value);
      const ok = val === norm(answer) || val === norm(w.term);
      const fb = $("#cz-fb");
      fb.classList.remove("hidden");
      fb.innerHTML = ok ? `<b class="ok">Chính xác!</b> ${esc(answer)} — ${esc(w.vi)}` : `<b class="no">Chưa đúng.</b> Đáp án: <b>${esc(answer)}</b> (${esc(w.term)}) — ${esc(w.vi)}`;
      w.srs = schedule(w.srs, ok ? 3 : 1);
      if (!ok) reviewQueue.push(w);
      bump("reviews");
      if (ok) speak(w.term, w.audio);
      $("#cz-next-row").classList.remove("hidden");
      $("#cz-check").disabled = true;
    };
    const next = () => { reviewIdx++; drawReview(); };
    $("#cz-check").onclick = check;
    $("#cz-next").onclick = next;
    input.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); check(); } };
  }

  // ---------------------------------------------------------
  // 13. Luyện đề
  // ---------------------------------------------------------
  let quizTopic = "all", quizSession = null;
  function renderQuiz() {
    if (quizSession && !quizSession.finished) return drawQuizQuestion();
    const counts = { all: QUIZ.length };
    QUIZ.forEach((q) => (counts[q.topic] = (counts[q.topic] || 0) + 1));
    const stats = TOPICS.map((t) => { const s = S.quizStats[t.id]; return s ? `<span class="tag">${esc(t.name)}: ${Math.round((s.c / s.t) * 100)}%</span>` : ""; }).join("");
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Luyện đề TOEIC 800+ & C1</h1>
        <p>Mỗi phiên 10 câu: ngữ pháp TOEIC Part 5, từ vựng, collocation và paraphrase trong ngữ cảnh tài chính. Có giải thích tiếng Việt cho từng câu.</p></div></div>
      ${topicChips(quizTopic, (t) => { quizTopic = t; quizSession = null; renderQuiz(); }, counts)}
      <div class="card" style="max-width:640px">
        <h3 style="font-size:17px">Sẵn sàng?</h3>
        <p class="muted small" style="margin:6px 0 14px">${quizTopic === "all" ? "Trộn câu hỏi từ mọi chủ đề." : "Chủ đề: " + esc(topicOf(quizTopic).name)} · ${Math.min(10, counts[quizTopic === "all" ? "all" : quizTopic] || 0)} câu</p>
        ${stats ? `<div class="row wrap" style="gap:6px;margin-bottom:14px">${stats}</div>` : ""}
        ${quizSession && quizSession.finished ? quizSummary() : ""}
        <button class="btn btn-primary" id="qz-start">${quizSession && quizSession.finished ? "Làm phiên mới" : "Bắt đầu 10 câu"}</button>
      </div>`;
    $("#qz-start").onclick = () => {
      const pool = QUIZ.filter((q) => quizTopic === "all" || q.topic === quizTopic);
      if (!pool.length) { toast("Chưa có câu hỏi cho chủ đề này."); return; }
      quizSession = { list: shuffle(pool).slice(0, 10), idx: 0, results: [], finished: false };
      drawQuizQuestion();
    };
    const retry = $("#qz-retry");
    if (retry) retry.onclick = () => {
      const wrong = quizSession.results.filter((r) => !r.ok).map((r) => r.q);
      quizSession = { list: shuffle(wrong), idx: 0, results: [], finished: false };
      drawQuizQuestion();
    };
  }
  function quizSummary() {
    const s = quizSession, c = s.results.filter((r) => r.ok).length;
    const wrong = s.results.filter((r) => !r.ok);
    return `<div class="explain" style="margin:0 0 14px"><b>Kết quả phiên vừa rồi: ${c}/${s.results.length}</b>
      ${wrong.length ? `<div style="margin-top:8px" class="small">Câu sai:<ul style="margin:6px 0 0;padding-left:18px">${wrong.map((r) => `<li style="margin-bottom:6px">${esc(r.q.q)}<br/><span class="muted">→ ${esc(r.q.options[r.q.answer])}</span></li>`).join("")}</ul></div>
      <button class="btn btn-sm" id="qz-retry" style="margin-top:8px">Làm lại ${wrong.length} câu sai</button>` : " — tuyệt vời!"}</div>`;
  }
  function drawQuizQuestion() {
    const s = quizSession, q = s.list[s.idx], t = topicOf(q.topic);
    $("#view").innerHTML = `
      <div class="row" style="max-width:720px;margin:0 auto 14px"><button class="btn btn-ghost btn-sm" id="qz-quit">${ICONS.back} Thoát</button><span class="spacer"></span>
        <span class="muted small">Câu ${s.idx + 1}/${s.list.length} · Đúng ${s.results.filter((r) => r.ok).length}</span></div>
      <div class="bar" style="max-width:720px;margin:0 auto 16px"><span style="width:${(s.idx / s.list.length) * 100}%"></span></div>
      <div class="card" style="max-width:720px;margin:0 auto">
        <div class="row wrap" style="gap:6px;margin-bottom:8px"><span class="tag gold">${esc(q.type || "")}</span><span class="tag"><span class="dot" style="background:${t.color}"></span>${esc(t.name)}</span></div>
        <div id="qz-box">${questionHtml(q, 0, "qz").replace('<div class="q-text">1. ', '<div class="q-text" style="font-size:17px">')}</div>
        <div class="row hidden" id="qz-next-row" style="margin-top:14px"><span class="spacer"></span><button class="btn btn-primary" id="qz-next">${s.idx + 1 < s.list.length ? "Câu tiếp →" : "Xem kết quả"}</button></div>
      </div>`;
    $("#qz-quit").onclick = () => { quizSession = null; renderQuiz(); };
    bindQuestions($("#qz-box"), [q], "qz", (i, ok) => {
      s.results.push({ q, ok });
      const st = S.quizStats[q.topic] || (S.quizStats[q.topic] = { c: 0, t: 0 });
      st.t++; if (ok) st.c++;
      ensureDay(); S.daily.quizCorrect += ok ? 1 : 0; bump("quiz");
      $("#qz-next-row").classList.remove("hidden");
      $("#qz-next").focus();
    });
    $("#qz-next").onclick = () => {
      s.idx++;
      if (s.idx >= s.list.length) { s.finished = true; renderQuiz(); } else drawQuizQuestion();
    };
  }

  // ---------------------------------------------------------
  // 14. Phím tắt & khởi động
  // ---------------------------------------------------------
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeSheet(); return; }
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    if ((location.hash || "").startsWith("#review") && reviewMode === "flash" && reviewQueue[reviewIdx]) {
      if (e.code === "Space" && !revealed) { e.preventDefault(); const b = $("#fl-reveal"); if (b) b.click(); }
      else if (revealed && ["1", "2", "3", "4"].includes(e.key)) { const b = $(`[data-rate="${e.key}"]`); if (b) b.click(); }
    }
  });
  $("#sheet-backdrop").onclick = closeSheet;

  function setAccent(a) {
    S.accent = a; save();
    $("#accent-us").classList.toggle("on", a !== "en-GB");
    $("#accent-uk").classList.toggle("on", a === "en-GB");
  }
  $("#accent-us").onclick = () => { setAccent("en-US"); toast("Giọng Mỹ (US)"); };
  $("#accent-uk").onclick = () => { setAccent("en-GB"); toast("Giọng Anh (UK)"); };

  document.title = `${CFG.appName} — ${CFG.tagline}`;
  $("#app-name").textContent = CFG.appName;
  $("#app-tagline").textContent = CFG.tagline;
  if ("speechSynthesis" in window) speechSynthesis.getVoices();
  renderNav();
  setAccent(S.accent || "en-US");
  window.addEventListener("hashchange", route);
  route();
})();
