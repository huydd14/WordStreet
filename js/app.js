/* ============================================================
   WordStreet — code ứng dụng
   Bạn KHÔNG cần sửa file này. Nội dung nằm trong thư mục data/.
   ============================================================ */
(function () {
  "use strict";

  // ---------------------------------------------------------
  // 0. Dữ liệu đầu vào
  // ---------------------------------------------------------
  const CFG = Object.assign(
    { appName: "WordStreet", tagline: "English for Finance", goals: { articles: 1, newWords: 5, reviews: 20, quiz: 10 }, accent: "en-US", backupReminderDays: 7 },
    window.WS_CONFIG || {}
  );
  const TOPICS = window.WS_TOPICS || [];
  const TERMS = window.WS_TERMS || [];
  const ARTICLES = window.WS_ARTICLES || [];                 // bài báo tài chính (nâng cao)
  const QUIZ = window.WS_QUIZ || [];                         // đề tài chính (nâng cao)
  // Bài đọc & đề TOEIC cơ bản, xếp theo thứ tự dễ → khó
  const TOEIC_ARTICLES = (window.WS_TOEIC_ARTICLES || []).slice().sort((a, b) => (a.step || 0) - (b.step || 0));
  const TOEIC_QUIZ = window.WS_TOEIC_QUIZ || [];
  const BUILTIN_ARTICLES = TOEIC_ARTICLES.concat(ARTICLES);
  const STAGES = [
    { id: 1, name: "Bậc 1 · B1", desc: "Bài ngắn ~100 từ: thông báo, quảng cáo, email, tin nhắn" },
    { id: 2, name: "Bậc 2 · B1+", desc: "~170 từ: memo, thư, tin tuyển dụng, trang web" },
    { id: 3, name: "Bậc 3 · B2", desc: "~250 từ: bài báo, thư chính thức, thông cáo báo chí" }
  ];

  // Bộ 600 từ TOEIC: điền sẵn các trường còn thiếu để dùng chung code với thuật ngữ
  const TOEIC_TOPICS = window.WS_TOEIC_TOPICS || [];
  const TOEIC = (window.WS_TOEIC || []).map((t) => Object.assign({ level: "B1", en: "", collocations: "", synonyms: "", note: "" }, t));
  // Bộ từ vựng mở rộng (Part 5&6 + 600 từ theo chủ đề bạn sưu tầm)
  const EXTRA_TOPICS = window.WS_TOEIC_EXTRA_TOPICS || [];
  const EXTRA = (window.WS_TOEIC_EXTRA || []).map((t) => Object.assign({ level: "B1", en: "", collocations: "", synonyms: "", note: "" }, t));
  // Bộ cụm từ: phrasal verbs, collocations, idioms
  const PHRASE_TOPICS = window.WS_PHRASE_TOPICS || [];
  const PHRASES = (window.WS_PHRASES || []).map((t) => Object.assign({ level: "B1", ipa: "", en: "", collocations: "", synonyms: "", note: "" }, t));
  const ALL_TOPICS = TOPICS.concat(TOEIC_TOPICS, EXTRA_TOPICS, PHRASE_TOPICS);
  const ALL_TERMS = TERMS.concat(TOEIC, EXTRA, PHRASES);

  // Các "bộ từ" trong mục Từ vựng (thứ tự = thứ tự nên học)
  const DECKS = {
    toeic: { id: "toeic", label: "600 từ TOEIC",        terms: TOEIC, topics: TOEIC_TOPICS, levels: ["B1", "B2"],
             desc: "từ vựng cốt lõi hay gặp trong đề TOEIC (văn phòng, nhân sự, du lịch, mua hàng…). Nên học hết B1 trước rồi lên B2." },
    extra: { id: "extra", label: "TOEIC mở rộng",       terms: EXTRA, topics: EXTRA_TOPICS, levels: ["B1", "B2", "C1"],
             desc: "từ bổ sung: cụm từ Part 5&6 thiết yếu và bộ từ theo chủ đề bạn sưu tầm (đã bỏ từ trùng, nghĩa được viết lại cho đúng ngữ cảnh TOEIC)." },
    phr:   { id: "phr",   label: "Cụm từ & Idioms",     terms: PHRASES, topics: PHRASE_TOPICS, levels: ["B1", "B2", "C1"],
             desc: "cụm từ hay gặp trong TOEIC: phrasal verbs, collocations (make a decision, meet a deadline…) và idioms công sở. Học cả cụm, đừng tách từng chữ." },
    fin:   { id: "fin",   label: "Thuật ngữ tài chính", terms: TERMS, topics: TOPICS, levels: ["B2", "C1", "TOEIC"],
             desc: "thuật ngữ chọn lọc cho báo chí tài chính, TOEIC 800+ và C1." }
  };

  // LƯU Ý: giữ nguyên tên khóa lưu trữ cũ ("finfluent_...") để KHÔNG mất kho từ đã học sau khi đổi tên web.
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
  const topicOf = (id) => ALL_TOPICS.find((t) => t.id === id) || { id: id || "other", name: "Khác", en: "Other", color: "#8a8f96" };
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
    listen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>'
  };

  // Menu chính chỉ còn 5 mục. Mỗi mục có "tab con" (SUBNAV) hiện ngay dưới thanh trên cùng.
  const NAV = [
    { id: "today", label: "Hôm nay", icon: ICONS.today },
    { id: "vocab", href: "learn", label: "Từ vựng", icon: ICONS.glossary },
    { id: "read", label: "Đọc", icon: ICONS.read },
    { id: "listen", label: "Nghe", icon: ICONS.listen },
    { id: "quiz", label: "Luyện đề", icon: ICONS.quiz }
  ];
  const SUBNAV = {
    vocab: [
      { id: "learn", label: "Học bài mới" },
      { id: "review", label: "Ôn tập", badge: "review" },
      { id: "glossary", label: "Kho từ" },
      { id: "words", label: "Từ của tôi" }
    ],
    listen: [
      { id: "part2", label: "Hỏi – đáp (Part 2)" },
      { id: "part34", label: "Hội thoại & bài nói (Part 3–4)" },
      { id: "listen", label: "Nghe chép chính tả" }
    ],
    quiz: [
      { id: "quiz", label: "Part 5" },
      { id: "part6", label: "Part 6" },
      { id: "test", label: "Thi thử" },
      { id: "mistakes", label: "Sổ câu sai", badge: "mistakes" }
    ]
  };
  // trang → mục menu chứa nó
  const GROUP_OF = { learn: "vocab", review: "vocab", glossary: "vocab", words: "vocab", listen: "listen", part2: "listen", part34: "listen", quiz: "quiz", part6: "quiz", test: "quiz", mistakes: "quiz", read: "read", today: "today" };
  // Còn quá nhiều thẻ chưa ôn thì nên ôn trước rồi mới học từ mới (tránh dồn thẻ)
  const REVIEW_CAP = 40;

  // ---------------------------------------------------------
  // 2. Lưu trữ (localStorage)
  // ---------------------------------------------------------
  function freshDaily() { return { date: todayStr(), articles: 0, newWords: 0, reviews: 0, quiz: 0, quizCorrect: 0, listen: 0 }; }
  function defaultState() {
    return {
      version: 1,
      words: [],
      articlesDone: {},
      customArticles: [],
      quizStats: {},
      mistakes: {},          // sổ câu sai: { khóa câu: { deck, n, t, fixed } }
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
    // Báo cho js/sync.js biết dữ liệu vừa đổi (để hẹn đồng bộ lên GitHub)
    if (window.WS && typeof window.WS.onSave === "function") window.WS.onSave();
  }
  function ensureDay() { if (S.daily.date !== todayStr()) { S.daily = freshDaily(); } }
  function touchStreak() {
    const t = todayStr();
    if (S.streak.last === t) return;
    const y = dateStr(new Date(Date.now() - DAY));
    S.streak.count = S.streak.last === y ? S.streak.count + 1 : 1;
    S.streak.last = t;
  }
  // (S.daily[key] || 0): dữ liệu cũ có thể chưa có mục mới (vd "listen") → coi như 0
  function bump(key, n) { ensureDay(); S.daily[key] = (S.daily[key] || 0) + (n == null ? 1 : n); touchStreak(); save(); }
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
  // Thuật ngữ tài chính được ưu tiên nếu trùng từ với bộ TOEIC
  ALL_TERMS.forEach((t) => { const k = t.term.toLowerCase(); if (!termMap.has(k)) termMap.set(k, t); });

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
    if (existing) { Object.assign(existing, data, { id: existing.id, srs: existing.srs, created: existing.created, mod: Date.now() }); save(); return { word: existing, isNew: false }; }
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
  // r = mức nhớ: 1 Chưa nhớ · 2 Nhớ mang máng · 3 Nhớ được · 4 Quá dễ
  // Càng nhớ chắc thì lần ôn sau càng xa. Luôn đảm bảo: mang máng < nhớ được < quá dễ (không bị trùng số ngày).
  function schedule(srs, r) {
    const reps = srs.reps || 0, interval = srs.interval || 0;
    let ease = srs.ease || 2.5;
    const now = Date.now();
    // last = lúc ôn gần nhất (dùng khi đồng bộ 2 máy: bản nào ôn sau thì thắng)
    if (r === 1) return { reps: 0, interval: 0, ease: Math.max(1.3, ease - 0.2), due: now + 10 * 60000, last: now };
    const base = Math.max(1, interval);
    const hard = reps === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
    const good = reps === 0 ? 2 : Math.max(hard + 1, Math.round(base * ease));
    const easy = reps === 0 ? 4 : Math.max(good + 1, Math.round(base * ease * 1.3));
    const next = r === 2 ? hard : r === 3 ? good : easy;
    if (r === 2) ease = Math.max(1.3, ease - 0.15);
    if (r === 4) ease += 0.15;
    return { reps: reps + 1, interval: next, ease, due: now + next * DAY, last: now };
  }
  function intervalLabel(srs, r) {
    const n = schedule(srs, r);
    if (r === 1) return "gặp lại sau 10 phút";
    if (n.interval >= 30) return Math.round(n.interval / 30) + " tháng nữa";
    return n.interval + " ngày nữa";
  }
  // Mức nhớ 0–5 theo khoảng cách ôn (để vẽ các chấm ●●●○○)
  function memoryLevel(srs) {
    const i = srs.interval || 0;
    if (!srs.reps) return 0;
    return i >= MASTERED_DAYS ? 5 : i >= 10 ? 4 : i >= 4 ? 3 : i >= 2 ? 2 : 1;
  }
  function memoryDots(srs) {
    const lv = memoryLevel(srs);
    const names = ["Mới", "Mới học", "Đang nhớ", "Nhớ khá", "Nhớ chắc", "Đã thuộc"];
    return `<span class="mem" title="Mức nhớ: ${names[lv]}">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= lv ? "on" : ""}"></i>`).join("")}<small>${names[lv]}</small></span>`;
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

  // Đọc 1 câu với tốc độ tùy chọn (dùng cho Luyện nghe). rate: 0.6 (chậm) → 1.0 (bình thường)
  function speakText(text, rate, onEnd) {
    if (!("speechSynthesis" in window)) { toast("Trình duyệt không hỗ trợ đọc phát âm. Hãy dùng Chrome hoặc Edge."); return false; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = S.accent;
    u.rate = rate || 0.9;
    const voices = speechSynthesis.getVoices();
    const v = voices.find((x) => x.lang === S.accent) || voices.find((x) => /^en[-_]/i.test(x.lang));
    if (v) u.voice = v;
    if (onEnd) u.onend = onEnd;
    speechSynthesis.speak(u);
    return true;
  }

  // Đọc nhiều câu liên tiếp bằng nhiều giọng (dùng cho Part 2, Part 3–4, thi thử).
  // parts: [{ text, who: "M" | "W" | "N" }]   M = nam, W = nữ, N = người dẫn (giọng mặc định)
  // Trả về hàm stop() để dừng giữa chừng.
  const FEMALE = /zira|aria|jenny|susan|hazel|libby|sonia|samantha|karen|moira|tessa|victoria|fiona|serena|female|michelle|emma|natasha|clara|sara|ava|allison|google us english|google uk english female/i;
  const MALE = /david|mark|guy|george|ryan|daniel|alex|fred|oliver|male|christopher|eric|roger|thomas|william|brian|andrew|google uk english male/i;
  function voiceFor(who) {
    if (!("speechSynthesis" in window)) return null;
    const all = speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
    const mine = all.filter((v) => v.lang.replace("_", "-") === S.accent);
    const pool = mine.length ? mine : all;
    const female = pool.filter((v) => FEMALE.test(v.name));
    const male = pool.filter((v) => MALE.test(v.name) && !FEMALE.test(v.name));
    if (who === "W") return female[0] || pool[0] || null;
    if (who === "M") return male[0] || pool.find((v) => !FEMALE.test(v.name)) || pool[1] || pool[0] || null;
    if (who === "M2") return male[1] || male[0] || pool[0] || null;
    return pool[0] || null;
  }
  let seqToken = 0;
  function stopSeq() { seqToken++; if ("speechSynthesis" in window) speechSynthesis.cancel(); }
  function speakSeq(parts, opts) {
    opts = opts || {};
    if (!("speechSynthesis" in window)) { toast("Trình duyệt không đọc được. Hãy dùng Chrome hoặc Edge."); return stopSeq; }
    stopSeq();
    const token = seqToken;
    let i = 0;
    const next = () => {
      if (token !== seqToken) return;
      if (i >= parts.length) { if (opts.onDone) opts.onDone(); return; }
      const p = parts[i++];
      const u = new SpeechSynthesisUtterance(p.text);
      u.lang = S.accent; u.rate = opts.rate || 0.95;
      const v = voiceFor(p.who);
      if (v) u.voice = v;
      // Không tìm được giọng nam/nữ riêng thì đổi cao độ cho dễ phân biệt
      const vq = voiceFor("N");
      if (p.who === "M" && (!v || v === vq) && voiceFor("W") === vq) u.pitch = 0.75;
      if (p.pitch) u.pitch = p.pitch;
      u.onend = () => setTimeout(next, p.gap != null ? p.gap : 450);
      u.onerror = () => setTimeout(next, 100);
      speechSynthesis.speak(u);
    };
    next();
    return stopSeq;
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

  // Dịch Anh → Việt tự động (miễn phí, không cần tài khoản).
  // Thử Google Dịch trước, lỗi thì dùng MyMemory. Kết quả được nhớ lại để lần sau khỏi gọi mạng.
  const VI_CACHE_KEY = "wordstreet_vi_cache_v1";
  async function translateVi(text) {
    const q = String(text || "").trim();
    if (!q) return null;
    let cache = {};
    try { cache = JSON.parse(localStorage.getItem(VI_CACHE_KEY)) || {}; } catch (e) { /* bỏ qua */ }
    if (cache[q]) return cache[q];
    let vi = null;
    try {
      const r = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=" + encodeURIComponent(q));
      if (r.ok) { const d = await r.json(); vi = (d[0] || []).map((s) => s[0]).join("").trim() || null; }
    } catch (e) { /* thử nguồn dự phòng */ }
    if (!vi) {
      try {
        const r = await fetch("https://api.mymemory.translated.net/get?langpair=en|vi&q=" + encodeURIComponent(q));
        if (r.ok) { const d = await r.json(); const t = d && d.responseData && d.responseData.translatedText; if (t && !/MYMEMORY WARNING/i.test(t)) vi = t.trim(); }
      } catch (e) { /* mất mạng */ }
    }
    if (!vi) return null;
    // Từ đơn viết thường → bỏ viết hoa chữ đầu mà máy dịch hay tự thêm
    if (!/[.!?]/.test(q) && q === q.toLowerCase()) vi = vi.charAt(0).toLowerCase() + vi.slice(1);
    try {
      cache[q] = vi;
      const keys = Object.keys(cache);
      if (keys.length > 500) keys.slice(0, keys.length - 500).forEach((k) => delete cache[k]);
      localStorage.setItem(VI_CACHE_KEY, JSON.stringify(cache));
    } catch (e) { /* bỏ qua */ }
    return vi;
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
  function openMistakes(deck) {
    return Object.values(S.mistakes || {}).filter((m) => !m.fixed && (!deck || m.deck === deck)).length;
  }
  function updateBadges() {
    const set = (sel, n) => $$(sel).forEach((b) => { b.textContent = n > 99 ? "99+" : n; b.classList.toggle("hidden", n === 0); });
    set("[data-badge=review]", dueWords().length);
    set("[data-badge=mistakes]", openMistakes());
  }

  // ---------------------------------------------------------
  // 6. Điều hướng (hash router)
  // ---------------------------------------------------------
  function renderNav() {
    $("#nav").innerHTML = NAV.map((n) => `
      <a href="#${n.href || n.id}" data-nav="${n.id}">${n.icon}<span class="lbl">${n.label}</span>${n.id === "vocab" ? '<span class="badge hidden" data-badge="review"></span>' : ""}</a>`).join("");
    updateBadges();
  }
  // Tab con của mục đang mở (vd Từ vựng: Học bài mới · Ôn tập · Kho từ · Từ của tôi)
  function renderSubnav(page) {
    const el = $("#subnav"), items = SUBNAV[GROUP_OF[page]];
    if (!el) return;
    if (!items) { el.classList.add("hidden"); el.innerHTML = ""; return; }
    el.innerHTML = `<div class="subnav-in">${items.map((x) => `<a href="#${x.id}" class="${x.id === page ? "on" : ""}">${x.label}${x.badge ? `<span class="badge hidden" data-badge="${x.badge}"></span>` : ""}</a>`).join("")}</div>`;
    el.classList.remove("hidden");
    updateBadges();
  }
  function route() {
    ensureDay();
    closeSheet();
    const hash = (location.hash || "#today").slice(1);
    const [page, arg] = hash.split("/");
    const view = $("#view");
    const group = GROUP_OF[page] || (PAGES[page] ? page : "today");
    $$("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.nav === group));
    renderSubnav(page);
    view.classList.remove("fade-in"); void view.offsetWidth; view.classList.add("fade-in");
    switch (page) {
      case "read": arg ? renderArticle(decodeURIComponent(arg)) : renderArticleList(); break;
      case "glossary":
        if (arg && DECKS[arg] && arg !== glossDeck) { glossDeck = arg; glossTopic = "all"; glossLevel = "all"; }
        renderGlossary(); break;
      case "words": renderWords(); break;
      case "review": renderReview(); break;
      case "quiz": renderQuiz(); break;
      case "mistakes": renderMistakes(); break;
      default:
        // Trang do file khác đăng ký (vd js/listen.js) qua WS.registerPage
        if (PAGES[page]) PAGES[page](arg); else renderToday();
    }
    renderBanner();
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------
  // 7. Trang "Hôm nay"
  // ---------------------------------------------------------
  // "Đã học" = đã qua bài học hoặc đã ôn ít nhất 1 lần (chỉ bấm "+ Lưu" thì chưa tính)
  function isLearned(w) { return !!(w.srs && (w.srs.last || w.srs.reps > 0)); }

  function renderToday() {
    const g = CFG.goals, d = S.daily;
    const due = dueWords().length;
    const reviewTarget = Math.min(g.reviews, d.reviews + due) || g.reviews;
    const learned = S.words.filter(isLearned).length;
    const mastered = S.words.filter((w) => w.srs.interval >= MASTERED_DAYS).length;
    const wrongOpen = openMistakes();
    const qs = Object.values(S.quizStats).reduce((acc, x) => ({ c: acc.c + x.c, t: acc.t + x.t }), { c: 0, t: 0 });
    const acc = qs.t ? Math.round((qs.c / qs.t) * 100) + "%" : "–";
    const now = new Date(), h = now.getHours();
    const hello = h < 11 ? "Chào buổi sáng" : h < 14 ? "Chào buổi trưa" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối";
    const dateline = now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric", year: "numeric" });
    const streak = currentStreak();
    // Gợi ý: đọc hết bài TOEIC theo thứ tự trước, rồi mới tới bài báo tài chính
    const nextArticle = BUILTIN_ARTICLES.find((a) => !S.articlesDone[a.id]) || BUILTIN_ARTICLES[0];
    const tooMany = due > REVIEW_CAP;
    const lastTest = (S.tests || [])[(S.tests || []).length - 1];

    // Thứ tự = thứ tự nên làm: ôn thẻ cũ trước, rồi mới học từ mới
    const plan = [
      { title: "Ôn thẻ đến hạn", cur: d.reviews, max: reviewTarget, href: "#review", cta: due ? `Ôn ${due} thẻ` : "Ôn tập",
        sub: due ? `Còn ${due} thẻ đang chờ. Nên làm việc này trước.` : "Không còn thẻ nào đến hạn." },
      { title: "Học từ mới", cur: d.newWords, max: g.newWords, warn: tooMany,
        href: tooMany ? "#review" : "#learn/next.next.go", cta: tooMany ? "Ôn bớt trước" : "Học bài tiếp",
        sub: tooMany ? `Đang dồn ${due} thẻ chưa ôn. Ôn xuống dưới ${REVIEW_CAP} rồi hẵng học thêm, không thì sẽ quên nhanh.` : `1 bài ${g.newWords} từ: xem → chọn nghĩa → chọn từ → gõ lại.` },
      { title: "Luyện đề Part 5", cur: d.quiz, max: g.quiz, href: wrongOpen >= 5 ? "#mistakes" : "#quiz", cta: wrongOpen >= 5 ? `Làm lại ${wrongOpen} câu sai` : "Làm đề",
        sub: d.quiz ? `Hôm nay đúng ${d.quizCorrect}/${d.quiz} câu.` : wrongOpen ? `Sổ câu sai đang có ${wrongOpen} câu chờ làm lại.` : "10 câu điền vào chỗ trống, có giải thích." },
      { title: "Luyện nghe", cur: d.listen || 0, max: g.listen || 10, href: "#part2", cta: "Nghe",
        sub: "Part 2 hỏi – đáp hoặc nghe chép chính tả, đều được tính." },
      { title: "Đọc 1 bài", cur: d.articles, max: g.articles, href: nextArticle ? "#read/" + nextArticle.id : "#read", cta: "Đọc",
        sub: nextArticle ? "Bài tiếp theo: " + nextArticle.title : "" }
    ];
    const left = plan.filter((x) => x.cur < x.max).length;

    // Tiến độ từng bộ từ: đã học (nhạt) và đã thuộc (đậm)
    const deckRows = ["toeic", "extra", "phr", "fin"].map((id) => {
      const dk = DECKS[id];
      const keys = new Set(dk.terms.map((t) => t.term.toLowerCase()));
      const mine = S.words.filter((w) => keys.has(w.term.toLowerCase()));
      const l = mine.filter(isLearned).length, m = mine.filter((w) => w.srs.interval >= MASTERED_DAYS).length, n = dk.terms.length;
      return `<a class="deck-row" href="#learn/${id}">
        <div class="row between"><b>${esc(dk.label)}</b><span class="muted xs">${l}/${n} đã học${m ? ` · ${m} đã thuộc` : ""}</span></div>
        <div class="bar duo"><span class="b1" style="width:${n ? (l / n) * 100 : 0}%"></span><span class="b2" style="width:${n ? (m / n) * 100 : 0}%"></span></div>
      </a>`;
    }).join("");

    $("#view").innerHTML = `
      <section class="today-head">
        <p class="dateline"><span>${esc(dateline.charAt(0).toUpperCase() + dateline.slice(1))}</span>${streak ? `<span class="streak-pill">${streak} ngày liên tiếp</span>` : ""}</p>
        <h1>${hello}.</h1>
        <p class="lede">${left ? `Hôm nay còn <b>${left} việc</b>. Làm lần lượt từ trên xuống là được.` : "Xong hết kế hoạch hôm nay rồi. Muốn học thêm thì cứ bấm “Làm thêm”."}</p>
        <dl class="ledger">
          <div><dt>Từ đã học</dt><dd>${learned}</dd></div>
          <div><dt>Đã thuộc</dt><dd>${mastered}</dd></div>
          <div><dt>Thẻ chờ ôn</dt><dd class="${tooMany ? "warn" : ""}">${due}</dd></div>
          <div><dt>Câu sai chờ làm lại</dt><dd>${wrongOpen}</dd></div>
          ${lastTest ? `<div><dt>Điểm thi thử gần nhất</dt><dd><a href="#test" class="plain">${lastTest.total}</a></dd></div>` : `<div><dt>Đúng khi luyện đề</dt><dd>${acc}</dd></div>`}
        </dl>
      </section>
      ${lastTest ? "" : `<a class="callout" href="#test"><b>Chưa biết mình đang khoảng bao nhiêu điểm?</b> Làm bài kiểm tra đầu vào 25 phút (đủ Nghe và Đọc), web sẽ gợi ý nên học từ mức nào. <span class="callout-go">Làm ngay →</span></a>`}

      <h2 class="section-title">Kế hoạch hôm nay</h2>
      <ol class="plan">
        ${plan.map((x, i) => {
          const done = x.cur >= x.max && x.max > 0;
          const pct = x.max ? Math.min(100, Math.round((x.cur / x.max) * 100)) : 0;
          return `<li class="plan-row ${done ? "done" : ""} ${x.warn ? "warn" : ""}">
            <span class="plan-no">${done ? ICONS.check : i + 1}</span>
            <div class="plan-main">
              <div class="plan-title">${x.title} <span class="plan-count">${x.cur}/${x.max}</span></div>
              <p class="plan-sub">${esc(x.sub)}</p>
              <div class="bar thin"><span style="width:${pct}%"></span></div>
            </div>
            <a class="btn btn-sm ${done ? "btn-ghost" : "btn-primary"}" href="${x.href}">${done ? "Làm thêm" : x.cta}</a>
          </li>`;
        }).join("")}
      </ol>

      <div class="grid grid-2 today-bottom">
        <div>
          <h2 class="section-title">Tiến độ từ vựng</h2>
          <div class="decks">${deckRows}</div>
          <p class="xs muted" style="margin-top:10px">Vạch nhạt: đã học qua. Vạch đậm: đã thuộc (lần ôn sau cách từ ${MASTERED_DAYS} ngày trở lên).</p>
        </div>
        <div class="roadmap">
          <h2 class="section-title">Lộ trình 12 tuần</h2>
          <ol>
            <li><div><b>Tuần 1–4 · Nền từ vựng</b><span class="muted small">Mỗi ngày 1 bài 10 từ trong <a href="#learn/toeic">600 từ TOEIC</a> (B1 trước) và ôn hết thẻ đến hạn. Nghe Part 2 mỗi ngày 10 câu cho quen tai.</span></div></li>
            <li><div><b>Tuần 5–8 · Ngữ pháp & đọc</b><span class="muted small">Luyện đề Part 5 mỗi ngày, làm lại hết câu trong Sổ câu sai. Đọc 1 bài TOEIC/ngày, để ý cách đề diễn đạt lại ý bằng từ khác.</span></div></li>
            <li><div><b>Tuần 9–12 · Tăng tốc</b><span class="muted small">Chuyển sang TOEIC mở rộng và Cụm từ, đọc thêm báo tài chính. Mục tiêu: đúng 85% trở lên ở Part 5 và Part 2.</span></div></li>
          </ol>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------
  // 8. Đọc báo
  // ---------------------------------------------------------
  let readTopic = "all", readDeck = "toeic", readStage = "all";
  const allArticles = () => BUILTIN_ARTICLES.concat(S.customArticles || []);
  const finArticles = () => ARTICLES.concat(S.customArticles || []);

  function topicChips(current, onPick, counts, topics) {
    const html = `<div class="chips">
      <button class="chip ${current === "all" ? "on" : ""}" data-topic="all">Tất cả${counts ? ` · ${counts.all}` : ""}</button>
      ${(topics || TOPICS).map((t) => `<button class="chip ${current === t.id ? "on" : ""}" data-topic="${t.id}"><span class="dot" style="background:${t.color}"></span>${esc(t.name)}${counts ? ` · ${counts[t.id] || 0}` : ""}</button>`).join("")}
    </div>`;
    setTimeout(() => $$("[data-topic]").forEach((b) => (b.onclick = () => onPick(b.dataset.topic))), 0);
    return html;
  }

  function articleCard(a, isNext) {
    const t = topicOf(a.topic), done = S.articlesDone[a.id];
    const stage = a.stage ? STAGES.find((s) => s.id === a.stage) : null;
    return `<a class="card card-click article-card ${isNext ? "is-next" : ""}" href="#read/${encodeURIComponent(a.id)}" style="text-decoration:none;color:inherit">
      <div class="meta">
        ${isNext ? `<span class="tag blue">→ Nên đọc tiếp</span>` : ""}
        ${a.step ? `<span class="tag">Bài ${a.step}</span>` : ""}
        <span class="tag"><span class="dot" style="background:${t.color}"></span>${esc(t.name)}</span>
        ${a.level ? `<span class="tag">${esc(a.level)}</span>` : ""}
        ${a.custom ? '<span class="tag blue">Bài của bạn</span>' : ""}
        ${done ? `<span class="tag green">✓ ${done.score}/${done.total}</span>` : ""}</div>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.summary || a.style || "")}</p>
      <p class="xs" style="margin-top:auto;padding-top:10px">${esc(a.style || "")}${a.style ? " · " : ""}${wordCount(a)} từ · ~${Math.max(1, Math.round(wordCount(a) / 150))} phút${stage ? " · " + esc(stage.name) : ""}</p>
    </a>`;
  }

  function renderArticleList() {
    const isToeic = readDeck === "toeic";
    let listHtml, filterHtml;
    if (isToeic) {
      const nextId = (TOEIC_ARTICLES.find((a) => !S.articlesDone[a.id]) || {}).id;
      const doneCount = TOEIC_ARTICLES.filter((a) => S.articlesDone[a.id]).length;
      const scounts = { all: TOEIC_ARTICLES.length };
      TOEIC_ARTICLES.forEach((a) => (scounts[a.stage] = (scounts[a.stage] || 0) + 1));
      filterHtml = `
        <div class="card flat deck-progress">
          <div class="row between small"><b>Đã đọc ${doneCount}/${TOEIC_ARTICLES.length} bài TOEIC</b><span class="muted xs">Đọc theo thứ tự Bài 1 → ${TOEIC_ARTICLES.length}, độ khó tăng dần</span></div>
          <div class="bar"><span style="width:${TOEIC_ARTICLES.length ? (doneCount / TOEIC_ARTICLES.length) * 100 : 0}%"></span></div>
        </div>
        <div class="chips" id="stage-chips">
          <button class="chip ${readStage === "all" ? "on" : ""}" data-stage="all">Tất cả · ${scounts.all}</button>
          ${STAGES.map((s) => `<button class="chip ${String(readStage) === String(s.id) ? "on" : ""}" data-stage="${s.id}" title="${esc(s.desc)}">${esc(s.name)} · ${scounts[s.id] || 0}</button>`).join("")}
        </div>`;
      const stages = readStage === "all" ? STAGES : STAGES.filter((s) => String(s.id) === String(readStage));
      listHtml = stages.map((s) => {
        const items = TOEIC_ARTICLES.filter((a) => a.stage === s.id);
        if (!items.length) return "";
        return `<h2 class="section-title">${esc(s.name)} <span class="stage-desc">— ${esc(s.desc)}</span></h2>
          <div class="grid grid-3">${items.map((a) => articleCard(a, a.id === nextId)).join("")}</div>`;
      }).join("");
    } else {
      const fin = finArticles();
      const list = fin.filter((a) => readTopic === "all" || a.topic === readTopic);
      const counts = { all: fin.length };
      fin.forEach((a) => (counts[a.topic] = (counts[a.topic] || 0) + 1));
      filterHtml = topicChips(readTopic, (t) => { readTopic = t; renderArticleList(); }, counts);
      listHtml = `<div class="grid grid-3">${list.map((a) => articleCard(a, false)).join("") || `<div class="empty card" style="grid-column:1/-1"><h3>Chưa có bài trong chủ đề này</h3><p>Bấm "Dán bài của bạn" để thêm.</p></div>`}</div>`;
    }
    $("#view").innerHTML = `
      <div class="page-head">
        <div><h1>Đọc hiểu</h1><p>${isToeic
          ? "Bài đọc kiểu TOEIC Part 7, đi từ ngắn và dễ đến dài hơn. Đọc xong bậc 3 là sẵn sàng cho bài báo tài chính."
          : "Bài báo tài chính trình độ C1. Bấm vào bất kỳ từ nào để tra nghĩa và lưu kèm câu gốc."} Mỗi bài có 3 câu hỏi đọc hiểu.</p></div>
        <div class="row wrap" style="gap:8px">
          <div class="seg" id="read-deck">
            <button data-deck="toeic" class="${isToeic ? "on" : ""}">TOEIC · dễ → khó · ${TOEIC_ARTICLES.length}</button>
            <button data-deck="fin" class="${!isToeic ? "on" : ""}">Báo tài chính · ${finArticles().length}</button>
          </div>
          <button class="btn" id="btn-paste">${ICONS.plus} Dán bài của bạn</button>
        </div>
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
      ${filterHtml}
      ${listHtml}`;

    $$("#read-deck [data-deck]").forEach((b) => (b.onclick = () => {
      if (readDeck === b.dataset.deck) return;
      readDeck = b.dataset.deck; readTopic = "all"; readStage = "all"; renderArticleList();
    }));
    $$("#stage-chips [data-stage]").forEach((b) => (b.onclick = () => { readStage = b.dataset.stage; renderArticleList(); }));
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
      readDeck = "fin"; // bài tự dán nằm trong mục "Báo tài chính"
      location.hash = "#read/" + a.id;
    };
  }

  // Tách câu & từ để bấm tra
  let readerSentences = [];
  function buildPhraseMatcher() {
    const phrases = new Set();
    ALL_TERMS.forEach((t) => { if (/\s/.test(t.term)) phrases.add(t.term.toLowerCase()); });
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
    // Mỗi đoạn có 1 ô bản dịch tiếng Việt ẩn bên dưới (bấm "Hiện bản dịch" mới dịch)
    const body = a.paragraphs.map((p, pi) => "<p>" + splitSentences(p).map((s) => { readerSentences.push(s); return renderSentence(s, readerSentences.length - 1, pm); }).join(" ") + `</p><div class="para-vi hidden" data-pi="${pi}"></div>`).join("");
    const savedHere = new Set($$(".tok.saved", (() => { const d = document.createElement("div"); d.innerHTML = body; return d; })()).map((e) => e.dataset.k)).size;
    const done = S.articlesDone[a.id];

    $("#view").innerHTML = `
      <div class="row" style="margin-bottom:14px;max-width:760px;margin-inline:auto">
        <a class="btn btn-ghost btn-sm" href="#read">${ICONS.back} Danh sách bài</a><span class="spacer"></span>
        <button class="btn btn-sm" id="btn-trans" title="Mẹo: đọc và làm câu hỏi trước, rồi mới bật bản dịch để dò lại">Hiện bản dịch</button>
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
      </section>` : ""}
      ${(() => {
        const i = TOEIC_ARTICLES.findIndex((x) => x.id === a.id);
        if (i < 0) return "";
        const next = TOEIC_ARTICLES[i + 1];
        return `<div class="row qblock" style="margin-top:16px">
          <a class="btn btn-ghost btn-sm" href="#read">${ICONS.back} Danh sách bài</a><span class="spacer"></span>
          ${next ? `<a class="btn btn-primary" href="#read/${encodeURIComponent(next.id)}">Bài tiếp theo: Bài ${next.step} →</a>`
                 : `<a class="btn btn-primary" href="#read" id="btn-to-fin">Xong bài TOEIC cuối! Thử báo tài chính →</a>`}
        </div>`;
      })()}`;

    $("#reader-body").onclick = (e) => {
      const tok = e.target.closest(".tok");
      if (!tok) return;
      $$(".tok.sel").forEach((x) => x.classList.remove("sel"));
      tok.classList.add("sel");
      openLookup(tok.dataset.k, { context: readerSentences[+tok.dataset.s] || "", source: a.custom ? "Bài tự dán" : "Bài báo WordStreet", topic: a.topic, onSaved: () => { tok.classList.remove("term"); tok.classList.add("saved"); } });
    };
    $("#btn-listen").onclick = () => tts(a.paragraphs.join(" "));

    // Bật/tắt bản dịch song ngữ. Dịch lần lượt từng đoạn (máy dịch), kết quả được nhớ lại.
    let transOn = false, transLoaded = false;
    $("#btn-trans").onclick = async () => {
      transOn = !transOn;
      $("#btn-trans").textContent = transOn ? "Ẩn bản dịch" : "Hiện bản dịch";
      $("#btn-trans").classList.toggle("btn-primary", transOn);
      $$(".para-vi").forEach((el) => el.classList.toggle("hidden", !transOn));
      if (!transOn || transLoaded) return;
      transLoaded = true;
      const myView = a.id;
      for (const el of $$(".para-vi")) {
        el.innerHTML = `<span class="spin"></span> Đang dịch…`;
      }
      for (const el of $$(".para-vi")) {
        const vi = await translateVi(a.paragraphs[+el.dataset.pi]);
        if (!document.body.contains(el) || myView !== a.id) return; // đã chuyển trang
        el.textContent = vi || "Không dịch được đoạn này (kiểm tra mạng).";
      }
    };
    if ($("#btn-to-fin")) $("#btn-to-fin").onclick = () => { readDeck = "fin"; readTopic = "all"; };
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
              ${src.level ? `<span class="tag blue">${esc(src.level)}</span>` : ""}
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
          <input class="input" id="lk-vi" value="${esc(src.vi || "")}" placeholder="Gõ nghĩa tiếng Việt bạn hiểu…" />
          <div class="auto-note" id="lk-vi-note"></div></div>
        <div id="lk-en">${src.en ? `<div class="info-block"><div class="k">Định nghĩa (EN)</div>${esc(src.en)}</div>` : ""}</div>
        ${src.collocations ? `<div class="info-block"><div class="k">Collocations · cụm hay đi kèm</div>${esc(src.collocations)}</div>` : ""}
        ${src.synonyms ? `<div class="info-block"><div class="k">Paraphrase / đồng nghĩa</div>${esc(src.synonyms)}</div>` : ""}
        ${src.example && src.example !== context ? `<div class="info-block"><div class="k">Ví dụ</div><div class="ex">${highlight(src.example, name)}</div></div>` : ""}
        ${src.note ? `<div class="tip">${esc(src.note)}</div>` : ""}
        <div class="field"><label class="label" for="lk-ctx">Câu ngữ cảnh (giúp bạn nhớ lâu)</label>
          <textarea class="textarea" id="lk-ctx" rows="3" placeholder="Câu bạn gặp từ này…">${esc(context)}</textarea>
          <div class="ctx-vi hidden" id="lk-ctx-vi"></div>
          <div class="row" style="margin-top:6px"><button type="button" class="btn btn-ghost btn-sm" id="lk-ctx-tr">Dịch cả câu</button></div></div>
        <div class="links"><a target="_blank" rel="noopener" href="https://dictionary.cambridge.org/dictionary/english-vietnamese/${encodeURIComponent(name.replace(/\s+/g, "-"))}">Cambridge Anh–Việt ↗</a>
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

    // Tự dịch nghĩa tiếng Việt nếu chưa có (bạn vẫn sửa lại được trước khi lưu)
    let userTypedVi = false;
    $("#lk-vi").addEventListener("input", () => { userTypedVi = true; });
    if (!src.vi) {
      $("#lk-vi-note").innerHTML = `<span class="spin"></span> Đang dịch tự động…`;
      translateVi(name).then((vi) => {
        if (myToken !== sheetToken) return;
        if (!vi) { $("#lk-vi-note").textContent = "Không dịch tự động được (kiểm tra mạng). Bạn gõ nghĩa giúp nhé."; return; }
        if (!userTypedVi && !$("#lk-vi").value.trim()) $("#lk-vi").value = vi;
        $("#lk-vi-note").textContent = "✨ Dịch tự động. Đọc câu ngữ cảnh rồi sửa lại cho sát nghĩa nếu cần.";
      });
    }
    // Dịch cả câu ngữ cảnh để hiểu từ trong câu
    const translateCtx = () => {
      const s = $("#lk-ctx").value.trim();
      const box = $("#lk-ctx-vi");
      if (!s) { box.classList.add("hidden"); return; }
      box.classList.remove("hidden");
      box.innerHTML = `<span class="spin"></span> Đang dịch câu…`;
      translateVi(s).then((vi) => {
        if (myToken !== sheetToken) return;
        box.innerHTML = vi ? `<span class="k">Nghĩa cả câu</span>${esc(vi)}` : `<span class="muted">Không dịch được câu này (kiểm tra mạng).</span>`;
      });
    };
    $("#lk-ctx-tr").onclick = translateCtx;
    if (context) translateCtx();

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
          $("#lk-en").innerHTML = `<p class="muted small">${res === null ? "Không có định nghĩa tiếng Anh cho từ này trong từ điển online. Nghĩa tiếng Việt ở trên vẫn được dịch tự động." : "Không kết nối được từ điển online (kiểm tra mạng). Bạn vẫn lưu được bình thường."}</p>`;
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
  // Regex tìm 1 từ / cụm từ trong câu, cho phép chữ đầu được chia:
  // "carry out" khớp "carried out", "carrying out". Các chữ sau giữ nguyên (chữ cuối được thêm s/es).
  function termRegex(term) {
    const ws = String(term || "").toLowerCase().trim().split(/\s+/);
    const first = ws[0].length > 3 ? ws[0].replace(/(e|y)$/, "") : ws[0];
    // Mạo từ/sở hữu thay được cho nhau: "meet a deadline" cũng khớp "meet the deadline"
    const DET = "(?:a|an|the|this|that|these|those|your|my|our|their|his|her|its)";
    const isDet = (w) => new RegExp("^" + DET + "$").test(w);
    const parts = [reEsc(first) + "[a-z]*"].concat(ws.slice(1).map((w, i, arr) => isDet(w) ? DET : reEsc(w) + (i === arr.length - 1 ? "(?:s|es)?" : "")));
    return new RegExp("\\b(" + parts.join("\\s+") + ")\\b", "i");
  }
  function highlight(sentence, word) {
    const safe = esc(sentence);
    if (!word) return safe;
    return safe.replace(termRegex(word), '<mark class="hl">$1</mark>');
  }

  // ---------------------------------------------------------
  // 10. Thuật ngữ
  // ---------------------------------------------------------
  let glossDeck = "toeic", glossTopic = "all", glossQuery = "", glossLevel = "all";
  function renderGlossary() {
    const deck = DECKS[glossDeck];
    const TERMS = deck.terms; // chỉ dùng bộ từ đang chọn trong trang này
    const counts = { all: TERMS.length };
    TERMS.forEach((t) => (counts[t.topic] = (counts[t.topic] || 0) + 1));
    const learned = TERMS.filter((t) => findWord(t.term)).length;
    const pctL = TERMS.length ? Math.round((learned / TERMS.length) * 100) : 0;
    const lessonSize = (S.learn && S.learn.size) || 10;
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Từ vựng</h1>
        <p>${TERMS.length} ${deck.desc}</p></div>
        <div class="seg" id="g-deck">
          ${Object.values(DECKS).map((d) => `<button data-deck="${d.id}" class="${glossDeck === d.id ? "on" : ""}">${d.label} · ${d.terms.length}</button>`).join("")}
        </div></div>
      <div class="card learn-cta">
        <div class="learn-cta-main">
          <div class="row between small"><b>Đã học ${learned}/${TERMS.length} từ · ${esc(deck.label)}</b><span class="muted xs">${pctL}%</span></div>
          <div class="bar"><span style="width:${pctL}%"></span></div>
          <p class="muted xs" style="margin-top:8px">${learned >= TERMS.length ? "Bạn đã học hết bộ này! Giờ chỉ cần ôn đều mỗi ngày." : `Học lần lượt từng bài ${lessonSize} từ: xem từ → trắc nghiệm → gõ lại. Học xong, từ tự vào lịch Ôn tập.`}</p>
        </div>
        <div class="row" style="gap:8px;flex-wrap:wrap">
          <a class="btn" href="#learn/${deck.id}">Xem lộ trình</a>
          ${learned < TERMS.length ? `<a class="btn btn-primary" href="#learn/${deck.id}.${glossTopic === "all" ? "next" : glossTopic}.go">Học ${lessonSize} từ tiếp theo</a>` : ""}
        </div>
      </div>
      ${topicChips(glossTopic, (t) => { glossTopic = t; renderGlossary(); }, counts, deck.topics)}
      <div class="toolbar">
        <input class="input" id="g-search" placeholder="Tìm từ hoặc nghĩa tiếng Việt…" value="${esc(glossQuery)}" />
        <select class="select" id="g-level">
          <option value="all">Mọi cấp độ</option>
          ${deck.levels.map((l) => `<option value="${l}" ${glossLevel === l ? "selected" : ""}>${l}</option>`).join("")}
        </select>
        <button class="btn" id="g-add5" title="Đưa thẳng vào lịch ôn, không qua bước học">Lưu nhanh 5 từ ngẫu nhiên</button>
      </div>
      <div class="grid grid-3" id="g-list"></div>`;
    $$("#g-deck [data-deck]").forEach((b) => (b.onclick = () => {
      if (glossDeck === b.dataset.deck) return;
      glossDeck = b.dataset.deck; glossTopic = "all"; glossLevel = "all"; renderGlossary();
    }));
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
          ${t.en ? `<div class="en">${esc(t.en)}</div>` : ""}
          <div class="ex">${highlight(t.example, t.term)}</div>
          ${t.collocations ? `<div class="colloc"><b>Cụm hay gặp:</b> ${esc(t.collocations)}</div>` : ""}
          <div class="row" style="margin-top:auto;padding-top:4px">
            <span class="tag"><span class="dot" style="background:${tp.color}"></span>${esc(tp.name)}</span><span class="tag blue">${esc(t.level)}</span>
            <span class="spacer"></span>
            ${saved ? `<span class="tag green">✓ Đã học</span>` : `<button class="btn btn-sm" data-save="${esc(t.term)}" title="Đã biết từ này rồi? Lưu thẳng vào lịch ôn">${ICONS.plus} Lưu</button>`}
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
          <button class="btn" id="w-export" title="Tải về 1 file .json chứa toàn bộ từ đã lưu + tiến độ học. Giữ file này để khôi phục khi đổi máy hoặc lỡ xóa dữ liệu trình duyệt.">Sao lưu ra file</button>
          <label class="btn" for="w-import" style="cursor:pointer" title="Chọn file .json đã sao lưu trước đó để khôi phục từ vựng (không xóa từ đang có).">Khôi phục từ file</label>
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
            <div class="field"><label class="label" for="f-topic">Chủ đề</label><select class="select" id="f-topic">${ALL_TOPICS.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select></div>
          </div>
          <p class="muted xs" id="f-info"></p>
          <div class="row"><span class="spacer"></span><button type="button" class="btn btn-ghost" id="f-cancel">Hủy</button><button class="btn btn-primary" type="submit">Lưu từ</button></div>
        </div>
      </form>

      <div class="toolbar">
        <input class="input" id="w-search" placeholder="Tìm trong từ đã lưu…" value="${esc(wordsQuery)}" />
        <select class="select" id="w-topic"><option value="all">Mọi chủ đề</option>${ALL_TOPICS.map((t) => `<option value="${t.id}" ${wordsTopic === t.id ? "selected" : ""}>${esc(t.name)}</option>`).join("")}</select>
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
        $("#f-info").textContent = `Có sẵn trong bộ từ vựng: ${t.en || t.vi}`;
        return;
      }
      $("#f-info").textContent = "Đang tra từ điển và dịch tự động…";
      const [r, vi] = await Promise.all([dictLookup(term), translateVi(term)]);
      if (vi && !$("#f-vi").value.trim()) $("#f-vi").value = vi;
      if (r) { autoData = { ipa: r.ipa, pos: r.pos, en: r.defs[0] ? r.defs[0].def : "", audio: r.audio }; $("#f-info").textContent = `${r.ipa} · ${r.defs.map((d) => d.pos + ": " + d.def).slice(0, 2).join(" | ")}`; }
      else $("#f-info").textContent = vi ? "✨ Đã dịch tự động nghĩa tiếng Việt, bạn kiểm tra lại nhé." : r === null ? "Không có trong từ điển online, bạn tự gõ nghĩa nhé." : "Không kết nối được từ điển online.";
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
    a.download = `wordstreet-backup-${todayStr()}.json`;
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
      } catch (e) { toast("File không đúng định dạng backup WordStreet."); }
    };
    r.readAsText(file);
  }

  // ---------------------------------------------------------
  // 12. Ôn tập
  // ---------------------------------------------------------
  let reviewMode = "flash", reviewQueue = [], reviewIdx = 0, revealed = false, extraPractice = false;
  let rvStats = { 1: 0, 2: 0, 3: 0, 4: 0 }, rvHelp = false;
  function buildQueue() {
    const due = dueWords().sort((a, b) => a.srs.due - b.srs.due);
    reviewQueue = due.length ? due : (extraPractice ? shuffle(S.words).slice(0, 20) : []);
    reviewIdx = 0; revealed = false; rvStats = { 1: 0, 2: 0, 3: 0, 4: 0 };
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
      box.innerHTML = `<div class="card empty"><h3>Chưa có từ để ôn</h3><p>Học 1 bài từ mới trước, từ đã học sẽ tự vào đây để ôn.</p><div class="row" style="justify-content:center;margin-top:14px"><a class="btn btn-primary" href="#learn">Học bài mới</a></div></div>`;
      return;
    }
    if (reviewIdx >= reviewQueue.length) {
      const tomorrow = S.words.filter((x) => x.srs.due <= Date.now() + DAY).length;
      const done = rvStats[1] + rvStats[2] + rvStats[3] + rvStats[4];
      const stat = (n, l, c) => `<div class="rv-stat ${c}"><b>${n}</b><span>${l}</span></div>`;
      box.innerHTML = `<div class="card flash rv-done">
        <div class="rv-done-ico">${ICONS.check}</div>
        <h3>${due === 0 ? "Xong hết thẻ đến hạn hôm nay!" : "Hết lượt này"}</h3>
        <p class="muted">Hôm nay bạn đã ôn ${S.daily.reviews} thẻ. ${due ? `Còn ${due} thẻ đến hạn.` : `Trong 24 giờ tới có <b>${tomorrow}</b> từ đến hạn ôn.`}</p>
        ${done ? `<div class="rv-stats">${stat(rvStats[1], "Chưa nhớ", "r1")}${stat(rvStats[2], "Mang máng", "r2")}${stat(rvStats[3], "Nhớ được", "r3")}${stat(rvStats[4], "Quá dễ", "r4")}</div>` : ""}
        <div class="row" style="justify-content:center;margin-top:18px;flex-wrap:wrap">
          ${due ? `<button class="btn btn-primary" id="rv-again">Ôn tiếp</button>` : `<a class="btn btn-primary" href="#learn">Học từ mới</a><button class="btn" id="rv-extra">Luyện thêm 20 từ ngẫu nhiên</button>`}
          <a class="btn" href="#quiz">Sang Luyện đề</a></div></div>`;
      const a = $("#rv-again"), x = $("#rv-extra");
      if (a) a.onclick = () => { extraPractice = false; renderReview(); };
      if (x) x.onclick = () => { extraPractice = true; renderReview(); };
      return;
    }
    const w = reviewQueue[reviewIdx];
    const pct = Math.round((reviewIdx / reviewQueue.length) * 100);
    const head = `<div class="rv-head">
        <div class="row between small muted"><span>Thẻ ${reviewIdx + 1} / ${reviewQueue.length}${extraPractice && !due ? " · luyện thêm" : ""}</span>
        <span class="row" style="gap:6px"><span class="dot" style="background:${topicOf(w.topic).color}"></span>${esc(topicOf(w.topic).name)}</span></div>
        <div class="bar thin"><span style="width:${pct}%"></span></div></div>`;
    if (reviewMode === "flash") drawFlash(box, w, head); else drawCloze(box, w, head);
  }
  function rate(w, r) {
    w.srs = schedule(w.srs, r);
    rvStats[r]++;
    bump("reviews");
    if (r === 1) reviewQueue.push(w); // gặp lại cuối lượt
    reviewIdx++; revealed = false;
    drawReview();
  }
  function drawFlash(box, w, head) {
    const ctx = w.context || w.example || "";
    const RATES = [
      ["r1", 1, "Chưa nhớ", "Không nhớ ra / nhớ sai"],
      ["r2", 2, "Mang máng", "Nghĩ lâu mới ra"],
      ["r3", 3, "Nhớ được", "Nhớ ra sau vài giây"],
      ["r4", 4, "Quá dễ", "Nhìn là biết ngay"]
    ];
    box.innerHTML = `<div class="flash">${head}<div class="card flash-card">
      <div class="row between" style="margin-bottom:-8px">${memoryDots(w.srs)}<span class="xs muted">${esc(w.level || "")}</span></div>
      <div class="front">
        <div class="row" style="justify-content:center;gap:10px"><div class="word">${esc(w.term)}</div><button class="icon-btn" id="fl-say" title="Phát âm">${ICONS.speak}</button></div>
        <div class="ipa" style="margin-top:4px">${esc(w.ipa || "")} ${w.pos ? "· " + esc(w.pos) : ""}</div>
        ${ctx ? `<div class="ctx">${highlight(ctx, w.term)}</div>` : ""}
      </div>
      <div class="back ${revealed ? "" : "hidden"}" id="fl-back">
        <div class="vi">${esc(w.vi)}</div>
        ${w.en ? `<p class="muted small" style="text-align:center;margin-top:4px">${esc(w.en)}</p>` : ""}
        ${w.collocations || w.synonyms ? `<div class="grid grid-2" style="margin-top:14px">
          ${w.collocations ? `<div class="info-block small"><div class="k">Collocations</div>${esc(w.collocations)}</div>` : ""}
          ${w.synonyms ? `<div class="info-block small"><div class="k">Paraphrase</div>${esc(w.synonyms)}</div>` : ""}</div>` : ""}
        <div class="rate-q"><b>Lúc nãy bạn nhớ nghĩa từ này tới đâu?</b>
          <button class="link-btn" id="rv-help-btn">${rvHelp ? "Ẩn giải thích" : "Các nút này là gì?"}</button></div>
        <div class="rate-help ${rvHelp ? "" : "hidden"}" id="rv-help">
          Đây là <b>ôn tập ngắt quãng</b>: bạn chấm mức nhớ, app hẹn ngày ôn lại. Nhớ càng chắc thì <b>lần gặp lại càng xa</b> (1 → 3 → 7 → 16 ngày…), nên từ dễ không làm phiền, từ khó được nhắc nhiều hơn.
          Chọn <b>Chưa nhớ</b> thì từ quay lại ngay cuối lượt này. Khi khoảng cách đạt 21 ngày, từ được tính là <b>Đã thuộc</b>.
        </div>
        <div class="rate">
          ${RATES.map(([c, r, l, d]) => `<button class="${c}" data-rate="${r}" title="${d}"><span class="rk">${r}</span>${l}<small>${intervalLabel(w.srs, r)}</small></button>`).join("")}
        </div>
      </div>
      <div id="fl-reveal-wrap" class="${revealed ? "hidden" : ""}" style="margin-top:22px">
        <button class="btn btn-primary btn-block btn-lg" id="fl-reveal">Lật thẻ xem nghĩa <span class="kbd">Space</span></button>
        <p class="xs muted" style="text-align:center;margin-top:8px">Tự nói nghĩa trong đầu trước, rồi mới lật. Nhớ hay quên đều được, quan trọng là chấm thật lòng.</p>
      </div></div></div>`;
    $("#fl-say").onclick = () => speak(w.term, w.audio);
    $("#fl-reveal").onclick = () => {
      revealed = true;
      $("#fl-back").classList.remove("hidden"); $("#fl-reveal-wrap").classList.add("hidden");
      speak(w.term, w.audio);
    };
    $("#rv-help-btn").onclick = () => {
      rvHelp = !rvHelp;
      $("#rv-help").classList.toggle("hidden", !rvHelp);
      $("#rv-help-btn").textContent = rvHelp ? "Ẩn giải thích" : "Các nút này là gì?";
    };
    $$("[data-rate]", box).forEach((b) => (b.onclick = () => rate(w, +b.dataset.rate)));
  }
  function drawCloze(box, w, head) {
    const ctx = w.context || w.example || "";
    const m = ctx.match(termRegex(w.term));
    const answer = m ? m[0] : w.term;
    const sentence = m ? esc(ctx.slice(0, m.index)) + '<span class="blank">_____</span>' + esc(ctx.slice(m.index + m[0].length)) : `<span class="muted">(Chưa có câu ngữ cảnh)</span> Từ tiếng Anh nghĩa là: <b>${esc(w.vi)}</b>`;
    box.innerHTML = `<div class="flash">${head}<div class="card">
      <p class="ctx" style="font-family:var(--serif);font-size:19px;line-height:1.65;margin-bottom:12px">${sentence}</p>
      <p class="small muted">Nghĩa: <b style="color:var(--ink)">${esc(w.vi)}</b> · bắt đầu bằng “${esc(answer[0])}” · ${answer.length} ký tự</p>
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
      rvStats[ok ? 3 : 1]++;
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
  let quizTopic = "all", quizDeck = "toeic", quizLevel = "all", quizSession = null;
  function renderQuiz() {
    if (quizSession && !quizSession.finished) return drawQuizQuestion();
    const isToeic = quizDeck === "toeic";
    const bank = isToeic ? TOEIC_QUIZ : QUIZ;
    const topics = isToeic ? TOEIC_TOPICS : TOPICS;
    const counts = { all: bank.length };
    bank.forEach((q) => (counts[q.topic] = (counts[q.topic] || 0) + 1));
    const lcounts = { all: bank.length };
    bank.forEach((q) => (lcounts[q.level] = (lcounts[q.level] || 0) + 1));
    const pool = bank.filter((q) => isToeic ? (quizLevel === "all" || q.level === quizLevel) : (quizTopic === "all" || q.topic === quizTopic));
    const stats = topics.map((t) => { const s = S.quizStats[t.id]; return s ? `<span class="tag">${esc(t.name)}: ${Math.round((s.c / s.t) * 100)}%</span>` : ""; }).join("");
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Luyện đề</h1>
        <p>${isToeic
          ? "TOEIC Part 5 cơ bản: ngữ pháp, từ loại và từ vựng công sở. Mỗi phiên 10 câu, câu B1 ra trước rồi mới tới B2."
          : "Nâng cao: Part 5, collocation và paraphrase C1 trong ngữ cảnh tài chính."} Có giải thích tiếng Việt cho từng câu.</p></div>
        <div class="seg" id="qz-deck">
          <button data-deck="toeic" class="${isToeic ? "on" : ""}">TOEIC cơ bản · ${TOEIC_QUIZ.length}</button>
          <button data-deck="fin" class="${!isToeic ? "on" : ""}">Tài chính nâng cao · ${QUIZ.length}</button>
        </div></div>
      ${isToeic ? `<div class="chips" id="qz-levels">
          <button class="chip ${quizLevel === "all" ? "on" : ""}" data-level="all">Trộn B1 + B2 · ${lcounts.all}</button>
          <button class="chip ${quizLevel === "B1" ? "on" : ""}" data-level="B1">B1 · cơ bản · ${lcounts.B1 || 0}</button>
          <button class="chip ${quizLevel === "B2" ? "on" : ""}" data-level="B2">B2 · khá · ${lcounts.B2 || 0}</button>
        </div>` : topicChips(quizTopic, (t) => { quizTopic = t; quizSession = null; renderQuiz(); }, counts)}
      <div class="card" style="max-width:640px">
        <h3 style="font-size:17px">Sẵn sàng?</h3>
        <p class="muted small" style="margin:6px 0 14px">${isToeic
          ? (quizLevel === "all" ? "Trộn câu B1 và B2, câu dễ ra trước." : "Chỉ câu cấp " + esc(quizLevel) + ".")
          : (quizTopic === "all" ? "Trộn câu hỏi từ mọi chủ đề." : "Chủ đề: " + esc(topicOf(quizTopic).name))} · ${Math.min(10, pool.length)} câu</p>
        ${stats ? `<div class="row wrap" style="gap:6px;margin-bottom:14px">${stats}</div>` : ""}
        ${quizSession && quizSession.finished ? quizSummary() : ""}
        <button class="btn btn-primary" id="qz-start">${quizSession && quizSession.finished ? "Làm phiên mới" : "Bắt đầu 10 câu"}</button>
      </div>`;
    $$("#qz-deck [data-deck]").forEach((b) => (b.onclick = () => {
      if (quizDeck === b.dataset.deck) return;
      quizDeck = b.dataset.deck; quizTopic = "all"; quizLevel = "all"; quizSession = null; renderQuiz();
    }));
    $$("#qz-levels [data-level]").forEach((b) => (b.onclick = () => { quizLevel = b.dataset.level; quizSession = null; renderQuiz(); }));
    $("#qz-start").onclick = () => {
      if (!pool.length) { toast("Chưa có câu hỏi cho lựa chọn này."); return; }
      let list = shuffle(pool).slice(0, 10);
      // Thăng tiến từ từ: câu B1 trước, B2 sau
      if (isToeic) list = list.filter((q) => q.level === "B1").concat(list.filter((q) => q.level !== "B1"));
      quizSession = { list, idx: 0, results: [], finished: false };
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
        <div class="row wrap" style="gap:6px;margin-bottom:8px"><span class="tag blue">${esc(q.type || "")}</span>${q.level ? `<span class="tag">${esc(q.level)}</span>` : ""}<span class="tag"><span class="dot" style="background:${t.color}"></span>${esc(t.name)}</span></div>
        <div id="qz-box">${questionHtml(q, 0, "qz").replace('<div class="q-text">1. ', '<div class="q-text" style="font-size:17px">')}</div>
        <div class="row hidden" id="qz-next-row" style="margin-top:14px"><span class="spacer"></span><button class="btn btn-primary" id="qz-next">${s.idx + 1 < s.list.length ? "Câu tiếp →" : "Xem kết quả"}</button></div>
      </div>`;
    $("#qz-quit").onclick = () => { quizSession = null; renderQuiz(); };
    bindQuestions($("#qz-box"), [q], "qz", (i, ok) => {
      s.results.push({ q, ok });
      const st = S.quizStats[q.topic] || (S.quizStats[q.topic] = { c: 0, t: 0 });
      st.t++; if (ok) st.c++;
      noteMistake(TOEIC_QUIZ.includes(q) ? "toeic" : "fin", q.q, ok);
      ensureDay(); S.daily.quizCorrect += ok ? 1 : 0; bump("quiz");
      $("#qz-next-row").classList.remove("hidden");
      $("#qz-next").focus();
    });
    $("#qz-next").onclick = () => {
      s.idx++;
      if (s.idx >= s.list.length) { s.finished = true; s.fromMistakes ? renderMistakes() : renderQuiz(); } else drawQuizQuestion();
    };
    if (s.fromMistakes) $("#qz-quit").onclick = () => { quizSession = null; renderMistakes(); };
  }

  // ---------------------------------------------------------
  // 13b. Sổ câu sai
  // Làm sai → câu vào sổ. Làm lại đúng → gạch khỏi sổ (vẫn giữ lịch sử để đồng bộ giữa các máy).
  // deck: "toeic" | "fin" (Luyện đề) | "p2" (Nghe Part 2, do js/part2.js ghi)
  // ---------------------------------------------------------
  function noteMistake(deck, text, ok) {
    if (!S.mistakes) S.mistakes = {};
    const key = deck + "|" + String(text).slice(0, 120);
    const m = S.mistakes[key];
    if (!ok) S.mistakes[key] = { deck, n: (m ? m.n : 0) + 1, t: Date.now(), fixed: false };
    else if (m && !m.fixed) S.mistakes[key] = Object.assign({}, m, { fixed: true, t: Date.now() });
    else return;
    save();
  }
  function mistakeQuestions(deck) {
    const bank = deck === "toeic" ? TOEIC_QUIZ : QUIZ;
    return bank.filter((q) => { const m = (S.mistakes || {})[deck + "|" + String(q.q).slice(0, 120)]; return m && !m.fixed; });
  }
  function renderMistakes() {
    if (quizSession && !quizSession.finished && quizSession.fromMistakes) return drawQuizQuestion();
    const sets = [
      { deck: "toeic", name: "TOEIC Part 5", list: mistakeQuestions("toeic") },
      { deck: "fin", name: "Tài chính nâng cao", list: mistakeQuestions("fin") }
    ];
    const p2 = openMistakes("p2"), p34 = openMistakes("p34"), p6 = openMistakes("p6");
    const total = sets.reduce((a, x) => a + x.list.length, 0) + p2 + p34 + p6;
    const fixed = Object.values(S.mistakes || {}).filter((m) => m.fixed).length;
    const last = quizSession && quizSession.finished && quizSession.fromMistakes ? quizSession : null;
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Sổ câu sai</h1>
        <p>Câu nào làm sai sẽ tự vào đây. Làm lại đúng thì câu đó được gạch khỏi sổ. Đây là cách nhanh nhất để tăng điểm: không làm câu mới, mà sửa đúng chỗ mình hay sai.</p></div></div>
      ${last ? `<div class="explain" style="max-width:720px;margin-bottom:16px"><b>Vừa làm lại: đúng ${last.results.filter((r) => r.ok).length}/${last.results.length} câu.</b> Câu đúng đã được gạch khỏi sổ.</div>` : ""}
      ${total ? `<div class="mk-list">
        ${sets.filter((x) => x.list.length).map((x) => `
          <div class="mk-row"><div><b>${x.name}</b><p class="muted small">${x.list.length} câu chờ làm lại</p></div>
            <button class="btn btn-primary btn-sm" data-mk="${x.deck}">Làm lại ${Math.min(10, x.list.length)} câu</button></div>`).join("")}
        ${p2 ? `<div class="mk-row"><div><b>Nghe Part 2</b><p class="muted small">${p2} câu chờ nghe lại</p></div>
            <a class="btn btn-primary btn-sm" href="#part2/mistakes">Nghe lại</a></div>` : ""}
        ${p34 ? `<div class="mk-row"><div><b>Nghe Part 3–4</b><p class="muted small">${p34} câu chờ làm lại</p></div>
            <a class="btn btn-primary btn-sm" href="#part34/mistakes">Làm lại</a></div>` : ""}
        ${p6 ? `<div class="mk-row"><div><b>Part 6 · Điền đoạn văn</b><p class="muted small">${p6} chỗ trống chờ làm lại</p></div>
            <a class="btn btn-primary btn-sm" href="#part6/mistakes">Làm lại</a></div>` : ""}
      </div>` : `<div class="empty card"><h3>Sổ đang trống</h3><p>${fixed ? `Bạn đã sửa xong ${fixed} câu từng làm sai.` : "Chưa có câu sai nào."} Vào <a href="#quiz">Luyện đề</a> hoặc <a href="#part2">Nghe Part 2</a> để làm tiếp.</p></div>`}
      ${sets.some((x) => x.list.length) ? `<h2 class="section-title">Các câu đang trong sổ</h2>
        <div class="card list-card">${sets.flatMap((x) => x.list.map((q) => {
          const m = S.mistakes[x.deck + "|" + String(q.q).slice(0, 120)];
          return `<div class="word-row"><div><div class="small">${esc(q.q).replace(/_{3,}/g, "_____")}</div>
            <div class="xs muted" style="margin-top:4px">${esc(q.type || x.name)} · sai ${m.n} lần</div></div></div>`;
        })).join("")}</div>` : ""}`;
    $$("[data-mk]").forEach((b) => (b.onclick = () => {
      const list = shuffle(mistakeQuestions(b.dataset.mk)).slice(0, 10);
      quizSession = { list, idx: 0, results: [], finished: false, fromMistakes: true };
      drawQuizQuestion();
    }));
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

  // ---------------------------------------------------------
  // 15. "Cửa" cho các file tính năng khác (vd js/listen.js)
  // ---------------------------------------------------------
  // app.js được bọc trong (function(){ ... })() nên biến bên trong là "riêng tư".
  // window.WS mở ra một số hàm dùng chung để file khác gọi được, ví dụ: WS.toast("Xin chào").
  const PAGES = {};
  window.WS = {
    $, $$, esc, shuffle, todayStr, toast, ICONS,
    get S() { return S; },                 // dữ liệu học của bạn (luôn lấy bản mới nhất)
    save, bump, ensureDay,
    speakText, translateVi, openLookup, findWord, splitSentences,
    speak, highlight, topicOf, addWord, termToWord, schedule, DAY, termRegex, findTerm, stemCandidates, closeSheet,
    dueWords, REVIEW_CAP, noteMistake, openMistakes, isLearned, updateBadges, speakSeq, stopSeq, questionHtml, bindQuestions,
    get TOEIC_QUIZ() { return TOEIC_QUIZ; },
    refresh: () => route(),               // vẽ lại trang hiện tại (vd sau khi đồng bộ kéo dữ liệu mới về)
    data: { TOEIC, EXTRA, TERMS, TOEIC_ARTICLES, ARTICLES, STAGES, DECKS },
    registerPage(id, render) {
      PAGES[id] = render;
      // Nếu đang đứng đúng trang đó (vd F5 tại #listen) thì vẽ lại ngay
      if ((location.hash || "").slice(1).split("/")[0] === id) route();
    }
  };

  document.title = `${CFG.appName} — ${CFG.tagline}`;
  $("#app-name").textContent = CFG.appName;
  $("#app-tagline").textContent = CFG.tagline;
  if ("speechSynthesis" in window) speechSynthesis.getVoices();
  renderNav();
  setAccent(S.accent || "en-US");
  window.addEventListener("hashchange", route);
  route();
})();
