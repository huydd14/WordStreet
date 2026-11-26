/* ============================================================
   WordStreet — THI THỬ MINI & ĐIỂM ƯỚC LƯỢNG (js/test.js)
   ------------------------------------------------------------
   29 câu, 25 phút, đi theo thứ tự giống đề thật:
     Nghe: 6 câu Part 2 + 1 bài Part 3 + 1 bài Part 4 (12 câu)
     Đọc : 10 câu Part 5 + 1 đoạn Part 6 + 1 bài Part 7 (17 câu)
   Trong lúc làm KHÔNG hiện đúng/sai. Nộp bài xong mới chấm,
   quy ra điểm Nghe / Đọc trên thang 5–495 (ước lượng thô, sai số khoảng ±50).
   Lần đầu tiên = bài kiểm tra đầu vào → gợi ý nên học từ mức nào.
   Câu sai được đưa vào Sổ câu sai như khi luyện từng phần.
   ============================================================ */
(function () {
  "use strict";
  if (!window.WS) return;
  const { $, $$, esc, shuffle, ICONS } = WS;
  const MINUTES = 25;
  const P2 = window.WS_TOEIC_PART2 || [], P34 = window.WS_TOEIC_PART34 || [], P6 = window.WS_TOEIC_PART6 || [];

  const tests = () => (WS.S.tests || (WS.S.tests = []));
  // Quy % đúng ra điểm thang 5–495 (làm tròn 5 điểm như đề thật)
  const scale = (c, n) => n ? Math.max(5, Math.min(495, Math.round((5 + (c / n) * 490) / 5) * 5)) : 5;

  function level(total) {
    if (total < 450) return { name: "Nền tảng (B1)", tip: "Học 600 từ TOEIC theo bài mỗi ngày, Part 2 và Part 5 mức B1. Chưa cần đọc báo tài chính.", href: "#learn/toeic", cta: "Học 600 từ TOEIC" };
    if (total < 650) return { name: "Đang lên (B1 → B2)", tip: "Trộn câu B1 + B2, làm hết Sổ câu sai mỗi ngày, bắt đầu Part 3–4 và Part 6.", href: "#part34", cta: "Luyện Part 3–4" };
    if (total < 800) return { name: "Khá (B2)", tip: "Chuyển sang TOEIC mở rộng và Cụm từ, luyện Part 6–7 và tốc độ đọc. Mục tiêu 800 đã gần.", href: "#learn/extra", cta: "Học TOEIC mở rộng" };
    return { name: "Tốt (B2+ / C1)", tip: "Giữ phong độ: đọc báo tài chính, đề tài chính nâng cao, thuật ngữ C1.", href: "#read", cta: "Đọc báo tài chính" };
  }

  // ---------- Tạo đề ----------
  function build() {
    const units = [];
    shuffle(P2).slice(0, 6).forEach((it) => units.push({ kind: "p2", sec: "L", it, order: shuffle([0, 1, 2]), qs: [{ answer: null }] }));
    const p3 = shuffle(P34.filter((x) => x.part === 3))[0], p4 = shuffle(P34.filter((x) => x.part === 4))[0];
    [p3, p4].filter(Boolean).forEach((set) => units.push({ kind: "p34", sec: "L", set, qs: set.qs }));
    const bank = WS.TOEIC_QUIZ;
    const p5 = shuffle(bank.filter((q) => q.level === "B1")).slice(0, 5).concat(shuffle(bank.filter((q) => q.level !== "B1")).slice(0, 5));
    p5.forEach((q) => units.push({ kind: "p5", sec: "R", q, qs: [q] }));
    const p6 = shuffle(P6)[0]; if (p6) units.push({ kind: "p6", sec: "R", set: p6, qs: p6.qs });
    const arts = WS.data.TOEIC_ARTICLES.filter((a) => a.questions && a.questions.length);
    const p7 = shuffle(arts)[0]; if (p7) units.push({ kind: "p7", sec: "R", a: p7, qs: p7.questions });
    units.forEach((u) => (u.ans = u.qs.map(() => null)));
    return units;
  }

  let T = null; // { units, idx, start, timer, finished }

  function start() {
    T = { units: build(), idx: 0, start: Date.now(), finished: false };
    history.replaceState(null, "", "#test");
    draw();
  }
  const leftMs = () => T.start + MINUTES * 60000 - Date.now();
  const fmt = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  function tick() {
    if (!T || T.finished) return;
    const el = $("#t-timer");
    if (leftMs() <= 0) { finish(true); return; }
    if (el) { el.textContent = fmt(leftMs()); el.classList.toggle("warn", leftMs() < 3 * 60000); }
  }
  setInterval(tick, 1000);

  // Câu hỏi ở chế độ thi: chỉ đánh dấu lựa chọn, không chấm
  function tq(text, options, ui, qi, letters) {
    const u = T.units[ui], sel = u.ans[qi];
    return `<div class="q">${text ? `<div class="q-text">${text}</div>` : ""}
      <div class="opts">${options.map((o, j) => `<button class="opt ${sel === j ? "sel" : ""}" data-ui="${ui}" data-qi="${qi}" data-j="${j}">
        <span class="letter">${(letters || "ABCD")[j]}</span><span>${o}</span></button>`).join("")}</div></div>`;
  }

  function playP2(u) {
    WS.speakSeq([{ text: u.it.q, who: "W", gap: 800 }].concat(u.order.map((oi, k) => ({ text: "ABC"[k] + ". " + u.it.opts[oi], who: "M" }))), { rate: 0.95 });
  }
  function playP34(u) { WS.speakSeq(u.set.lines.map((l) => ({ text: l.t, who: l.s, gap: 350 })), { rate: 0.95 }); }

  function draw(autoplay) {
    const u = T.units[T.idx], ui = T.idx;
    const nL = T.units.filter((x) => x.sec === "L").length;
    const secLabel = u.sec === "L" ? `Phần Nghe · ${T.idx + 1}/${nL}` : `Phần Đọc · ${T.idx - nL + 1}/${T.units.length - nL}`;
    const play = `<div class="p2-player"><button class="p2-play" id="t-play" title="Nghe"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></button>
      <span class="muted small">Đề thật chỉ nghe 1 lần. Bấm để nghe lại nếu bị lỡ.</span></div>`;
    let body = "";
    if (u.kind === "p2") body = `<p class="t-part">Part 2 · Chọn câu trả lời hợp lý nhất (không có chữ)</p>${play}${tq("", ["Câu trả lời A", "Câu trả lời B", "Câu trả lời C"], ui, 0, "ABC")}`;
    if (u.kind === "p34") body = `<p class="t-part">${u.set.part === 3 ? "Part 3 · Hội thoại" : "Part 4 · Bài nói"} · Đọc câu hỏi trước rồi nghe</p>${play}${u.qs.map((q, i) => tq(`${i + 1}. ${esc(q.q)}`, q.options.map(esc), ui, i)).join("")}`;
    if (u.kind === "p5") body = `<p class="t-part">Part 5 · Điền vào chỗ trống</p>${tq(esc(u.q.q).replace(/_{3,}/g, '<span class="blank">_____</span>'), u.q.options.map(esc), ui, 0)}`;
    if (u.kind === "p6") body = `<p class="t-part">Part 6 · Điền vào đoạn văn</p>
      <div class="t-passage">${u.set.paragraphs.map((p) => `<p>${esc(p).replace(/\n/g, "<br/>").replace(/\{(\d)\}/g, '<span class="p6-blank">($1)</span>')}</p>`).join("")}</div>
      ${u.qs.map((q, i) => tq(`Chỗ trống (${i + 1})`, q.options.map(esc), ui, i)).join("")}`;
    if (u.kind === "p7") body = `<p class="t-part">Part 7 · Đọc hiểu</p>
      <div class="t-passage"><b>${esc(u.a.title)}</b>${u.a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      ${u.qs.map((q, i) => tq(`${i + 1}. ${esc(q.q)}`, q.options.map(esc), ui, i)).join("")}`;
    const last = T.idx === T.units.length - 1;
    $("#view").innerHTML = `
      <div class="t-wrap">
        <div class="t-top"><button class="btn btn-ghost btn-sm" id="t-quit">${ICONS.back} Dừng</button>
          <span class="muted small">${secLabel}</span><span class="spacer"></span>
          <span class="t-timer" id="t-timer">${fmt(leftMs())}</span></div>
        <div class="bar thin" style="margin-bottom:14px"><span style="width:${(T.idx / T.units.length) * 100}%"></span></div>
        <div class="card t-card">${body}
          <div class="ln-actions"><span class="xs muted">Chưa chắc cũng cứ chọn, bỏ trống tính là sai.</span>
            <button class="btn btn-primary" id="t-next">${last ? "Nộp bài" : "Tiếp"}</button></div>
        </div>
      </div>`;
    $$(".t-card .opt").forEach((b) => (b.onclick = () => {
      const x = T.units[+b.dataset.ui]; x.ans[+b.dataset.qi] = +b.dataset.j;
      $$(`.t-card .opt[data-qi="${b.dataset.qi}"]`).forEach((o) => o.classList.toggle("sel", o === b));
    }));
    const pl = $("#t-play"); if (pl) pl.onclick = () => (u.kind === "p2" ? playP2(u) : playP34(u));
    $("#t-next").onclick = () => {
      WS.stopSeq();
      if (last) { if (u.ans.includes(null) && !confirm("Còn câu chưa chọn. Nộp bài luôn?")) return; finish(false); return; }
      T.idx++; draw(true); window.scrollTo(0, 0);
    };
    $("#t-quit").onclick = () => { if (confirm("Dừng bài thi? Kết quả sẽ không được lưu.")) { WS.stopSeq(); T = null; drawHome(); } };
    if (autoplay && (u.kind === "p2" || u.kind === "p34")) setTimeout(() => (u.kind === "p2" ? playP2(u) : playP34(u)), 400);
  }

  // Đáp án đúng của câu qi trong 1 phần
  function correctOf(u, qi) { return u.kind === "p2" ? u.order.indexOf(u.it.a) : u.qs[qi].answer; }

  function finish(timeUp) {
    WS.stopSeq();
    T.finished = true;
    let lc = 0, ln = 0, rc = 0, rn = 0;
    T.units.forEach((u) => u.qs.forEach((q, qi) => {
      const ok = u.ans[qi] === correctOf(u, qi);
      if (u.sec === "L") { ln++; if (ok) lc++; } else { rn++; if (ok) rc++; }
      // Câu sai vào Sổ câu sai (cùng khóa với khi luyện từng phần)
      if (u.kind === "p2") WS.noteMistake("p2", u.it.q, ok);
      if (u.kind === "p34") WS.noteMistake("p34", u.set.id + " · " + q.q, ok);
      if (u.kind === "p5") WS.noteMistake("toeic", q.q, ok);
      if (u.kind === "p6") WS.noteMistake("p6", u.set.id + " · chỗ trống " + (qi + 1), ok);
    }));
    const rec = { t: Date.now(), lc, ln, rc, rn, l: scale(lc, ln), r: scale(rc, rn), timeUp: !!timeUp, min: Math.round((Date.now() - T.start) / 60000) };
    rec.total = rec.l + rec.r;
    const first = !tests().length;
    tests().push(rec);
    if (tests().length > 30) tests().splice(0, tests().length - 30);
    WS.save();
    drawResult(rec, first);
  }

  function reviewHtml() {
    return T.units.map((u) => u.qs.map((q, qi) => {
      const c = correctOf(u, qi), a = u.ans[qi], ok = a === c;
      if (ok) return "";
      const text = u.kind === "p2" ? u.it.q : u.kind === "p6" ? `${u.set.title} · chỗ trống (${qi + 1})` : q.q;
      const opts = u.kind === "p2" ? u.order.map((oi) => u.it.opts[oi]) : q.options;
      const ex = u.kind === "p2" ? u.it.ex : q.explain;
      return `<div class="word-row" style="display:block"><div class="small"><b>${esc(text)}</b></div>
        <div class="xs" style="margin-top:4px"><span class="tag red">Bạn chọn: ${a == null ? "bỏ trống" : esc(opts[a])}</span> <span class="tag green">Đúng: ${esc(opts[c])}</span></div>
        <div class="xs muted" style="margin-top:6px">${esc(ex || "")}</div></div>`;
    }).join("")).join("");
  }

  function drawResult(rec, first) {
    const lv = level(rec.total), wrong = reviewHtml();
    $("#view").innerHTML = `
      <div class="t-wrap">
        <div class="card t-card center">
          <p class="muted small">${first ? "Kết quả bài kiểm tra đầu vào" : "Kết quả thi thử"}${rec.timeUp ? " · hết giờ, tự nộp" : ""}</p>
          <div class="t-score">${rec.total}<small>/990</small></div>
          <div class="t-split"><div><b>${rec.l}</b><span>Nghe · đúng ${rec.lc}/${rec.ln}</span></div><div><b>${rec.r}</b><span>Đọc · đúng ${rec.rc}/${rec.rn}</span></div></div>
          <p class="xs muted" style="margin-top:10px">Ước lượng thô từ ${rec.ln + rec.rn} câu (đề thật 200 câu), sai số khoảng ±50 điểm. Nhìn xu hướng qua nhiều lần thi mới chính xác.</p>
          <div class="tip" style="text-align:left;margin-top:16px"><b>Mức hiện tại: ${lv.name}.</b> ${lv.tip}</div>
          <div class="row" style="justify-content:center;margin-top:16px;flex-wrap:wrap">
            <a class="btn btn-primary" href="${lv.href}">${lv.cta}</a><a class="btn" href="#mistakes">Mở Sổ câu sai</a><a class="btn btn-ghost" href="#today">Về Hôm nay</a></div>
        </div>
        ${wrong ? `<h2 class="section-title">Các câu sai (đã thêm vào Sổ câu sai)</h2><div class="card list-card">${wrong}</div>` : ""}
      </div>`;
    T = null;
  }

  function drawHome() {
    const list = tests(), last = list[list.length - 1];
    const best = list.reduce((m, x) => Math.max(m, x.total), 0);
    const maxBar = 990;
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>${list.length ? "Thi thử mini" : "Kiểm tra đầu vào"}</h1>
        <p>29 câu trong ${MINUTES} phút, đủ các phần giống đề thật: Nghe (Part 2, 3, 4) rồi Đọc (Part 5, 6, 7). Trong lúc làm không hiện đúng sai. Nộp bài xong web quy ra điểm ước lượng và gợi ý nên học gì tiếp.</p></div></div>
      <div class="grid grid-2">
        <div class="card">
          <h3 style="font-size:17px">${list.length ? "Làm thêm 1 bài" : "Làm bài đầu tiên"}</h3>
          <ul class="t-list">
            <li>Nghe: 6 câu hỏi – đáp, 1 hội thoại, 1 bài nói (12 câu)</li>
            <li>Đọc: 10 câu điền từ, 1 đoạn văn, 1 bài đọc (17 câu)</li>
            <li>Cần loa hoặc tai nghe. Ngồi chỗ yên tĩnh, làm một mạch.</li>
          </ul>
          <button class="btn btn-primary btn-lg" id="t-start">Bắt đầu · ${MINUTES} phút</button>
          <p class="xs muted" style="margin-top:10px">Nên thi lại khoảng 2 tuần 1 lần để xem tiến bộ.</p>
        </div>
        <div class="card">
          <h3 style="font-size:17px">Các lần thi</h3>
          ${list.length ? `<p class="small muted" style="margin:4px 0 12px">Gần nhất: <b class="t-inline">${last.total}</b> · Cao nhất: <b class="t-inline">${best}</b> · Mục tiêu: <b class="t-inline">800</b></p>
            <div class="t-chart">${list.slice(-12).map((x) => `<div class="t-col" title="${new Date(x.t).toLocaleDateString("vi-VN")}: ${x.total} (Nghe ${x.l} · Đọc ${x.r})">
              <span class="t-val">${x.total}</span><div class="t-barwrap"><div class="t-bar" style="height:${(x.total / maxBar) * 100}%"></div><div class="t-goal" style="bottom:${(800 / maxBar) * 100}%"></div></div>
              <span class="t-date">${new Date(x.t).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })}</span></div>`).join("")}</div>
            <p class="xs muted" style="margin-top:8px">Vạch ngang = mốc 800 điểm.</p>`
          : `<p class="muted small" style="margin-top:6px">Chưa có lần thi nào. Bài đầu tiên được dùng làm kiểm tra đầu vào: web sẽ cho biết bạn đang ở khoảng bao nhiêu điểm và nên bắt đầu từ đâu.</p>`}
        </div>
      </div>`;
    $("#t-start").onclick = start;
  }

  window.addEventListener("hashchange", () => { if (!(location.hash || "").startsWith("#test")) WS.stopSeq(); });
  WS.registerPage("test", () => { if (T && !T.finished) draw(false); else drawHome(); });
})();
