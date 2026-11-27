/* ============================================================
   WordStreet — NGHE TOEIC PART 3 (HỘI THOẠI) & PART 4 (BÀI NÓI) (js/part34.js)
   ------------------------------------------------------------
   Giống đề thật: 3 câu hỏi IN SẴN, nghe 1 lần rồi trả lời.
     1. Đọc lướt 3 câu hỏi trước (biết cần nghe gì).
     2. Bấm nghe: hội thoại đọc bằng giọng nam/nữ khác nhau.
     3. Trả lời → xem giải thích, mở lời thoại để dò lại.
   Câu sai vào Sổ câu sai (deck "p34"). Mỗi câu trả lời tính 1 vào mục tiêu "Luyện nghe".
   Dữ liệu: data/toeic-part34.js
   ============================================================ */
(function () {
  "use strict";
  if (!window.WS) return;
  const { $, $$, esc, ICONS } = WS;
  const SETS = window.WS_TOEIC_PART34 || [];
  const SPEEDS = [{ rate: 0.8, label: "Chậm" }, { rate: 0.95, label: "Vừa" }, { rate: 1.05, label: "Thật" }];
  const WHO = { M: "Nam", W: "Nữ", M2: "Nam 2", N: "" };

  function st() {
    const S = WS.S;
    if (!S.p34) S.p34 = { filter: "all", speed: 1, done: {} };
    return S.p34;
  }
  const mkKey = (set, q) => set.id + " · " + q.q;
  const openIn = (set) => set.qs.filter((q) => { const m = (WS.S.mistakes || {})["p34|" + mkKey(set, q).slice(0, 120)]; return m && !m.fixed; }).length;

  let cur = null; // { set, answers: [] }

  // Đọc bài từ lượt nói thứ `from` tới hết (from = 0: đọc từ đầu). Nút lượt đang đọc được tô sáng.
  const mark = (i) => $$("#p34-seg [data-seg]").forEach((b) => b.classList.toggle("on", +b.dataset.seg === i));
  function play(set, from) {
    from = from || 0;
    const parts = set.lines.slice(from).map((l) => ({ text: l.t, who: l.s, gap: 350 }));
    WS.speakSeq(parts, { rate: SPEEDS[st().speed].rate, onPart: (i) => mark(i < 0 ? -1 : from + i) });
  }

  function drawSet(set, again) { // again = làm lại: không tính thêm vào mục tiêu / sổ câu sai
    cur = { set, answers: [], again: !!again };
    const s = st();
    $("#view").innerHTML = `
      <div class="learn p34">
        <div class="ln-top"><a class="icon-btn" href="#part34" title="Danh sách bài">${ICONS.back}</a>
          <span class="tag">${set.part === 3 ? "Part 3 · Hội thoại" : "Part 4 · Bài nói"}</span><span class="tag">${esc(set.level)}</span>
          <span class="spacer"></span>${prevSet(set) ? `<button class="btn btn-ghost btn-sm" id="p34-prev" title="Bài liền trước trong danh sách">← Bài trước</button>` : ""}</div>
        <div class="card ln-card">
          <h2 class="p34-title">${esc(set.title)}</h2>
          <p class="muted small">Bước 1: đọc lướt 3 câu hỏi bên dưới. Bước 2: bấm nghe. Đề thật chỉ cho nghe 1 lần, cố gắng đừng nghe lại.</p>
          <div class="p2-player" style="margin-bottom:6px">
            <button class="p2-play" id="p34-play" title="Nghe (phím R)" aria-label="Nghe"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></button>
            <div class="seg" id="p34-speed">${SPEEDS.map((x, i) => `<button data-sp="${i}" class="${i === s.speed ? "on" : ""}">${x.label}</button>`).join("")}</div>
          </div>
          <div class="seg-strip" id="p34-seg" style="margin-bottom:14px">
            <span class="xs muted">Nghe lại từ lượt:</span>
            ${set.lines.map((l, i) => `<button class="chip" data-seg="${i}" title="Đọc tiếp từ lượt ${i + 1}${WHO[l.s] ? " (" + WHO[l.s] + ")" : ""} tới hết">${i + 1}${WHO[l.s] ? " · " + WHO[l.s] : ""}</button>`).join("")}
            <button class="chip" id="p34-stop" title="Dừng đọc">■ Dừng</button>
          </div>
          <div id="p34-qs">${set.qs.map((q, i) => WS.questionHtml(q, i, "pq")).join("")}</div>
          <div id="p34-after" class="hidden">
            <div class="row between" style="margin-top:8px"><b id="p34-score"></b>
              <button class="btn btn-sm" id="p34-tx">Xem lời thoại</button></div>
            <div class="transcript hidden" id="p34-trans">
              ${set.lines.map((l) => `<p>${WHO[l.s] ? `<b>${WHO[l.s]}:</b> ` : ""}${esc(l.t)}</p>`).join("")}
              <p class="xs muted">Bôi đen chữ bất kỳ để tra và lưu từ.</p>
            </div>
            <div class="ln-actions"><span class="row" style="gap:8px;flex-wrap:wrap"><a class="btn btn-ghost" href="#part34">Danh sách bài</a><button class="btn" id="p34-redo">↻ Làm lại bài này</button></span>
              ${nextSet(set) ? `<button class="btn btn-primary" id="p34-next">Bài tiếp theo</button>` : ""}</div>
          </div>
        </div>
      </div>`;
    $("#p34-play").onclick = () => play(set);
    $$("#p34-seg [data-seg]").forEach((b) => (b.onclick = () => play(set, +b.dataset.seg)));
    $("#p34-stop").onclick = () => { WS.stopSeq(); mark(-1); };
    $$("#p34-speed [data-sp]").forEach((b) => (b.onclick = () => { s.speed = +b.dataset.sp; WS.save(); $$("#p34-speed button").forEach((x) => x.classList.toggle("on", x === b)); }));
    WS.bindQuestions($("#p34-qs"), set.qs, "pq", (i, ok) => {
      cur.answers[i] = ok;
      if (!cur.again) { WS.noteMistake("p34", mkKey(set, set.qs[i]), ok); WS.bump("listen"); }
      if (cur.answers.filter((x) => x !== undefined).length === set.qs.length) {
        const c = cur.answers.filter(Boolean).length;
        s.done[set.id] = Math.max(s.done[set.id] || 0, c);
        WS.save();
        $("#p34-score").textContent = `Đúng ${c}/${set.qs.length} câu`;
        $("#p34-after").classList.remove("hidden");
      }
    });
    $("#p34-tx").onclick = () => $("#p34-trans").classList.toggle("hidden");
    const nx = $("#p34-next"); if (nx) nx.onclick = () => { location.hash = "#part34/" + nextSet(set).id; };
    $("#p34-redo").onclick = () => { WS.stopSeq(); drawSet(set, true); window.scrollTo(0, 0); };
    const pv = $("#p34-prev"); if (pv) pv.onclick = () => { WS.stopSeq(); location.hash = "#part34/" + prevSet(set).id; };
  }

  function prevSet(set) { const list = visible(), i = list.indexOf(set); return i > 0 ? list[i - 1] : null; }
  function visible() { const f = st().filter; return SETS.filter((x) => f === "all" || String(x.part) === f); }
  function nextSet(set) {
    const list = visible(), i = list.indexOf(set);
    return list.slice(i + 1).find((x) => st().done[x.id] == null) || list[i + 1] || null;
  }

  function drawHome() {
    const s = st(), list = visible();
    const next = list.find((x) => s.done[x.id] == null);
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Nghe Part 3–4 · Hội thoại & bài nói</h1>
        <p>Nghe 1 đoạn hội thoại hoặc 1 người nói, trả lời 3 câu hỏi in sẵn. Mẹo quan trọng nhất: <b>đọc câu hỏi trước khi nghe</b>, và nhớ thông tin trong bài thường được nói lại bằng từ khác ở đáp án.</p></div>
        <div class="seg" id="p34-filter">${[["all", "Tất cả"], ["3", "Part 3"], ["4", "Part 4"]].map(([id, l]) => `<button data-f="${id}" class="${s.filter === id ? "on" : ""}">${l}</button>`).join("")}</div>
      </div>
      ${next ? `<div class="card learn-cta"><div class="learn-cta-main"><b>Bài nên làm tiếp: ${esc(next.title)}</b><span class="muted small">${next.part === 3 ? "Hội thoại" : "Bài nói"} · ${esc(next.level)} · 3 câu hỏi</span></div>
        <a class="btn btn-primary" href="#part34/${next.id}">Làm bài này</a></div>` : ""}
      <div class="mk-list" style="max-width:none">
        ${list.map((x) => {
          const d = s.done[x.id], wrong = openIn(x);
          return `<a class="mk-row p34-row" href="#part34/${x.id}">
            <div><b>${esc(x.title)}</b><p class="muted small">${x.part === 3 ? "Part 3 · Hội thoại" : "Part 4 · Bài nói"} · ${esc(x.level)}</p></div>
            <span>${d != null ? `<span class="tag ${d === 3 ? "green" : "gold"}">${d}/3</span>` : ""}${wrong ? ` <span class="tag red">${wrong} câu sai</span>` : ""}</span></a>`;
        }).join("")}
      </div>`;
    $$("#p34-filter [data-f]").forEach((b) => (b.onclick = () => { s.filter = b.dataset.f; WS.save(); drawHome(); }));
  }

  document.addEventListener("keydown", (e) => {
    if (!cur || !(location.hash || "").startsWith("#part34/") || !$(".p34")) return;
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (["INPUT", "TEXTAREA"].includes(tag)) return;
    if (e.key.toLowerCase() === "r") { e.preventDefault(); play(cur.set); }
  });
  window.addEventListener("hashchange", () => { if (!(location.hash || "").startsWith("#part34")) WS.stopSeq(); });

  // #part34 → danh sách · #part34/<id> → làm bài · #part34/mistakes → bài đầu tiên còn câu sai
  WS.registerPage("part34", (arg) => {
    WS.stopSeq();
    if (arg === "mistakes") { const x = SETS.find((y) => openIn(y)); return x ? drawSet(x) : drawHome(); }
    const set = SETS.find((x) => x.id === arg);
    if (set) drawSet(set); else drawHome();
  });
})();
