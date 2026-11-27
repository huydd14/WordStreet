/* ============================================================
   WordStreet — NGHE TOEIC PART 2: HỎI – ĐÁP (js/part2.js)
   ------------------------------------------------------------
   Giống đề thật:
     1. Máy đọc 1 câu hỏi, rồi một giọng khác đọc 3 câu trả lời A, B, C.
     2. Mặc định KHÔNG hiện chữ (đề thật không in chữ). Mới tập thì bật "Hiện chữ".
     3. Chọn A/B/C → xem lời thoại, nghĩa và giải thích bẫy.
   Câu sai tự vào "Sổ câu sai" (deck "p2"). Mỗi câu trả lời tính 1 vào mục tiêu "Luyện nghe".
   Dữ liệu câu hỏi: data/toeic-part2.js
   ============================================================ */
(function () {
  "use strict";
  if (!window.WS) return;
  const { $, $$, esc, shuffle, toast, ICONS } = WS;
  const BANK = window.WS_TOEIC_PART2 || [];
  const SIZE = 10;
  // Tên loại câu hỏi (chỉ hiện SAU khi trả lời, vì đề thật không cho biết trước)
  const TYPE_VI = { "Yes/No": "Hỏi Có / Không", Choice: "Hỏi lựa chọn (A hay B)", Suggestion: "Lời đề nghị / nhờ vả", Statement: "Câu kể, không phải câu hỏi", Tag: "Câu hỏi đuôi" };
  const SPEEDS = [{ rate: 0.8, label: "Chậm" }, { rate: 0.95, label: "Vừa" }, { rate: 1.05, label: "Thật" }];

  // Cài đặt + thống kê riêng của Part 2 (nằm trong dữ liệu học → được đồng bộ)
  function st() {
    const S = WS.S;
    if (!S.part2) S.part2 = { level: "all", showText: false, speed: 1, seen: {}, c: 0, t: 0 };
    return S.part2;
  }
  const keyOf = (it) => "p2|" + it.q.slice(0, 120);
  const isOpenMistake = (it) => { const m = (WS.S.mistakes || {})[keyOf(it)]; return m && !m.fixed; };

  // ---------- Giọng đọc: câu hỏi giọng nữ, đáp án giọng nam (WS.speakSeq trong app.js) ----------
  const stop = () => { WS.stopSeq(); mark(-1); };
  const partsOf = (item, order) => [{ text: item.q, who: "W", gap: 800 }].concat(order.map((oi, k) => ({ text: "ABC"[k] + ". " + item.opts[oi], who: "M" })));
  // Tô sáng nút đoạn đang được đọc (-1 = tắt hết)
  const mark = (i) => $$("#p2-seg [data-seg]").forEach((b) => b.classList.toggle("on", +b.dataset.seg === i));
  function play(item, order, onDone) {
    WS.speakSeq(partsOf(item, order), { rate: SPEEDS[st().speed].rate, onDone, onPart: mark });
  }
  // Nghe lại đúng 1 đoạn: 0 = câu hỏi, 1–3 = câu trả lời A–C
  function playPart(item, order, k) {
    const p = Object.assign({}, partsOf(item, order)[k], { gap: 0 });
    WS.speakSeq([p], { rate: SPEEDS[st().speed].rate, onPart: (i) => mark(i < 0 ? -1 : k) });
  }

  // ---------- Phiên luyện ----------
  let ses = null; // { list:[{it, order}], idx, picks:[vị trí đã chọn], results:[bool], counted:[bool], answered, mode }

  function pickList(mode) {
    const s = st();
    let pool = mode === "mistakes" ? BANK.filter(isOpenMistake) : BANK.filter((it) => s.level === "all" || it.level === s.level);
    // Câu chưa nghe ra trước, B1 trước B2
    const unseen = shuffle(pool.filter((it) => !s.seen[keyOf(it)]));
    const seen = shuffle(pool.filter((it) => s.seen[keyOf(it)]));
    let list = unseen.concat(seen).slice(0, SIZE);
    list = list.filter((it) => it.level === "B1").concat(list.filter((it) => it.level !== "B1"));
    return list.map((it) => ({ it, order: shuffle([0, 1, 2]) }));
  }
  function start(mode) {
    const list = pickList(mode);
    if (!list.length) { toast(mode === "mistakes" ? "Không còn câu Part 2 nào trong sổ câu sai." : "Chưa có câu hỏi."); return; }
    ses = { list, idx: 0, picks: [], results: [], counted: [], answered: null, mode };
    history.replaceState(null, "", "#part2");
    drawQ(true);
  }

  function drawQ(autoplay) {
    const cur = ses.list[ses.idx], it = cur.it, s = st();
    const ans = ses.answered;                     // null = chưa chọn, số = vị trí đã chọn (0–2)
    const right = cur.order.indexOf(it.a);        // vị trí A/B/C của đáp án đúng
    const show = s.showText || ans !== null;
    const done = ses.results.filter(Boolean).length;
    $("#view").innerHTML = `
      <div class="learn p2">
        <div class="ln-top">
          <button class="icon-btn" id="p2-quit" title="Thoát">${ICONS.back}</button>
          <div class="bar ln-bar"><span style="width:${(ses.idx / ses.list.length) * 100}%"></span></div>
          <span class="muted small nowrap">${ses.idx + 1}/${ses.list.length} · đúng ${done}</span>
        </div>
        <div class="p2-nav">
          <button class="btn btn-ghost btn-sm" id="p2-prev" ${ses.idx ? "" : "disabled"} title="Quay lại câu trước (phím ←)">← Câu trước</button>
          ${ses.picks[ses.idx + 1] != null ? `<button class="btn btn-ghost btn-sm" id="p2-fwd" title="Phím →">Câu sau →</button>` : ""}
        </div>
        <div class="card ln-card">
          <div class="row between"><span>${ans !== null ? `<span class="tag">${esc(TYPE_VI[it.type] || it.type)}</span>` : ""}</span><span class="tag">${esc(it.level)}</span></div>
          <div class="p2-player">
            <button class="p2-play" id="p2-play" title="Nghe lại (phím R)" aria-label="Nghe lại">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></button>
            <div>
              <div class="p2-q">${show ? esc(it.q) : '<span class="muted">Nghe câu hỏi và 3 câu trả lời…</span>'}</div>
              ${ans !== null ? `<div class="muted small" style="margin-top:4px">${esc(it.vi)}</div>` : ""}
            </div>
          </div>
          <div class="p2-tools">
            <div class="seg" id="p2-speed">${SPEEDS.map((x, i) => `<button data-sp="${i}" class="${i === s.speed ? "on" : ""}">${x.label}</button>`).join("")}</div>
            <div class="seg-strip" id="p2-seg" title="Bấm để nghe lại riêng đoạn đó">
              <span class="xs muted">Nghe lại đoạn:</span>
              ${["Câu hỏi", "A", "B", "C"].map((l, i) => `<button class="chip" data-seg="${i}">${ICONS.speak} ${l}</button>`).join("")}
            </div>
          </div>
          <div class="opts p2-opts">
            ${cur.order.map((oi, k) => {
              const cls = ans === null ? "" : k === right ? "right" : k === ans ? "wrong" : "";
              return `<button class="opt ${cls}" data-k="${k}" ${ans !== null ? "disabled" : ""}>
                <span class="letter">${"ABC"[k]}</span><span>${show ? esc(it.opts[oi]) : '<span class="muted">Câu trả lời ' + "ABC"[k] + "</span>"}</span></button>`;
            }).join("")}
          </div>
          ${ans !== null ? `<div class="explain"><b class="${ans === right ? "ok" : "no"}">${ans === right ? "Chính xác!" : "Chưa đúng. Đáp án là " + "ABC"[right] + "."}</b> ${esc(it.ex)}</div>
            <div class="ln-actions"><span class="xs muted">Bôi đen chữ bất kỳ để tra và lưu từ.</span>
              <span class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" id="p2-retry" title="Giấu đáp án, nghe và chọn lại">↻ Làm lại câu này</button>
              <button class="btn btn-primary" data-next>${ses.idx + 1 < ses.list.length ? "Câu tiếp" : "Xem kết quả"} <span class="kbd">Enter</span></button></span></div>`
          : `<div class="ln-actions"><label class="row small muted" style="gap:8px;cursor:pointer"><input type="checkbox" id="p2-text" ${s.showText ? "checked" : ""}/> Hiện chữ (cho người mới)</label>
              <span class="xs muted">Phím 1–3 để chọn, R để nghe lại, ← câu trước</span></div>`}
        </div>
      </div>`;
    $("#p2-quit").onclick = () => { stop(); ses = null; drawHome(); };
    $("#p2-play").onclick = () => play(it, cur.order);
    $$("#p2-seg [data-seg]").forEach((b) => (b.onclick = () => playPart(it, cur.order, +b.dataset.seg)));
    $$("#p2-speed [data-sp]").forEach((b) => (b.onclick = () => { s.speed = +b.dataset.sp; WS.save(); drawQ(false); play(it, cur.order); }));
    const tx = $("#p2-text"); if (tx) tx.onchange = () => { s.showText = tx.checked; WS.save(); drawQ(false); };
    $$(".p2-opts .opt").forEach((b) => (b.onclick = () => answer(+b.dataset.k)));
    const nx = $("[data-next]"); if (nx) { nx.onclick = next; nx.focus(); }
    $("#p2-prev").onclick = prev;
    const fw = $("#p2-fwd"); if (fw) fw.onclick = next;
    const rt = $("#p2-retry"); if (rt) rt.onclick = retry;
    if (autoplay) setTimeout(() => play(it, cur.order), 250);
  }

  function answer(k) {
    if (!ses || ses.answered !== null) return;
    const cur = ses.list[ses.idx], it = cur.it, s = st();
    const ok = cur.order[k] === it.a;
    stop();
    ses.answered = k;
    ses.picks[ses.idx] = k;
    ses.results[ses.idx] = ok;
    // Thống kê + sổ câu sai chỉ tính LẦN ĐẦU trả lời (làm lại không xoá lỗi lần đầu)
    if (!ses.counted[ses.idx]) {
      ses.counted[ses.idx] = true;
      s.seen[keyOf(it)] = 1; s.t++; if (ok) s.c++;
      WS.noteMistake("p2", it.q, ok);
      WS.bump("listen");
    } else WS.save();
    drawQ(false);
  }
  // Đi tới câu idx: câu đã làm thì hiện lại đáp án đã chọn, câu chưa làm thì tự đọc
  function go(idx, autoplay) {
    stop();
    ses.idx = idx;
    if (ses.idx >= ses.list.length) return drawDone();
    ses.answered = ses.picks[idx] != null ? ses.picks[idx] : null;
    drawQ(autoplay === undefined ? ses.answered === null : autoplay);
  }
  const next = () => go(ses.idx + 1);
  const prev = () => { if (ses.idx > 0) go(ses.idx - 1, true); };
  // Làm lại câu đang xem: giấu đáp án, đọc lại từ đầu
  function retry() {
    ses.picks[ses.idx] = null;
    go(ses.idx, true);
  }

  function drawDone() {
    const c = ses.results.filter(Boolean).length, n = ses.results.length;
    const wrong = ses.list.filter((x, i) => !ses.results[i]);
    $("#view").innerHTML = `
      <div class="learn"><div class="card ln-card ln-done">
        <div class="rv-done-ico">${ICONS.check}</div>
        <h2>Đúng ${c}/${n} câu</h2>
        <p class="muted">${c === n ? "Không sai câu nào. Thử tốc độ “Thật” hoặc tắt “Hiện chữ” xem!" : c >= n * 0.7 ? "Khá lắm. Xem lại mấy câu sai bên dưới, để ý bẫy." : "Part 2 khó vì bẫy âm giống nhau. Nghe lại câu sai vài lần là quen."}</p>
        ${wrong.length ? `<div class="ln-result">${wrong.map((x) => `<div class="ln-res-row" style="display:block">
            <div class="small"><b>${esc(x.it.q)}</b></div><div class="xs muted">→ ${esc(x.it.opts[x.it.a])}</div></div>`).join("")}</div>` : ""}
        <div class="row" style="justify-content:center;margin-top:20px;flex-wrap:wrap">
          <button class="btn btn-primary" id="p2-again">Làm 10 câu nữa</button>
          ${wrong.length ? `<button class="btn" id="p2-wrong">Nghe lại ${wrong.length} câu sai</button>` : ""}
          <a class="btn btn-ghost" href="#today">Về trang Hôm nay</a>
        </div>
      </div></div>`;
    $("#p2-again").onclick = () => start(ses.mode === "mistakes" ? "mistakes" : "new");
    const w = $("#p2-wrong"); if (w) w.onclick = () => start("mistakes");
  }

  function drawHome() {
    const s = st();
    const counts = { all: BANK.length, B1: BANK.filter((x) => x.level === "B1").length, B2: BANK.filter((x) => x.level === "B2").length };
    const seenN = BANK.filter((it) => s.seen[keyOf(it)]).length;
    const mk = BANK.filter(isOpenMistake).length;
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Nghe Part 2 · Hỏi – đáp</h1>
        <p>Nghe 1 câu hỏi và 3 câu trả lời, chọn câu hợp lý nhất. Đề thật có 25 câu kiểu này và không in chữ, nên tập nghe không nhìn chữ càng sớm càng tốt.</p></div></div>
      <div class="grid grid-2">
        <div class="card">
          <h3 style="font-size:17px">Bắt đầu</h3>
          <div class="chips" id="p2-level" style="margin:12px 0 14px">
            ${[["all", "Trộn B1 + B2"], ["B1", "B1 · dễ"], ["B2", "B2 · khó"]].map(([id, label]) => `<button class="chip ${s.level === id ? "on" : ""}" data-lv="${id}">${label} · ${counts[id]}</button>`).join("")}
          </div>
          <label class="row small" style="gap:8px;cursor:pointer;margin-bottom:16px"><input type="checkbox" id="p2-text-h" ${s.showText ? "checked" : ""}/> Hiện chữ khi nghe (bật lúc mới tập, quen rồi thì tắt)</label>
          <div class="row wrap">
            <button class="btn btn-primary" id="p2-start">Nghe ${SIZE} câu</button>
            ${mk ? `<button class="btn" id="p2-mk">Nghe lại ${mk} câu sai</button>` : ""}
          </div>
          <p class="xs muted" style="margin-top:14px">Đã nghe ${seenN}/${BANK.length} câu${s.t ? ` · đúng ${Math.round((s.c / s.t) * 100)}%` : ""}. Mỗi câu tính 1 vào mục tiêu “Luyện nghe” hôm nay.</p>
        </div>
        <div class="card how-card">
          <h3 style="font-size:17px">3 bẫy hay gặp</h3>
          <ol>
            <li>Câu hỏi <b>Where / When / Who / Why</b> mà đáp án mở đầu bằng <b>Yes / No</b> thì gần như chắc chắn sai.</li>
            <li>Đáp án <b>lặp lại một từ</b> trong câu hỏi, hoặc có từ <b>phát âm na ná</b> (copy / coffee, contract / contact) thường là bẫy.</li>
            <li>Đáp án đúng hay trả lời <b>vòng</b>: “Let me check.”, “Ask Ms. Park.”, “It hasn't been decided yet.”</li>
          </ol>
          <p class="xs muted">Mẹo: nghe kỹ <b>từ đầu tiên</b> của câu hỏi (What, Where, Who…). Nghe được từ đó là loại được 1–2 đáp án.</p>
        </div>
      </div>`;
    $$("#p2-level [data-lv]").forEach((b) => (b.onclick = () => { s.level = b.dataset.lv; WS.save(); drawHome(); }));
    $("#p2-text-h").onchange = (e) => { s.showText = e.target.checked; WS.save(); };
    $("#p2-start").onclick = () => start("new");
    const m = $("#p2-mk"); if (m) m.onclick = () => start("mistakes");
  }

  // Phím tắt: 1–3 / A–C chọn, R nghe lại, Enter câu tiếp
  document.addEventListener("keydown", (e) => {
    if (!ses || !(location.hash || "").startsWith("#part2") || !$(".p2")) return;
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" && document.activeElement.type !== "checkbox") return;
    const k = e.key.toLowerCase();
    const cur = ses.list[ses.idx];
    if (ses.answered === null && ["1", "2", "3", "a", "b", "c"].includes(k)) { e.preventDefault(); answer("123".includes(k) ? +k - 1 : "abc".indexOf(k)); }
    else if (k === "r") { e.preventDefault(); play(cur.it, cur.order); }
    else if (e.key === "Enter" && ses.answered !== null) { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === "ArrowRight" && (ses.answered !== null || ses.picks[ses.idx + 1] != null)) { e.preventDefault(); next(); }
  });
  window.addEventListener("hashchange", () => { if (!(location.hash || "").startsWith("#part2")) stop(); });

  // #part2 → trang chính (hoặc câu đang làm dở) · #part2/mistakes → nghe lại câu sai
  WS.registerPage("part2", (arg) => {
    if (arg === "mistakes") return start("mistakes");
    if (ses && ses.idx < ses.list.length) return drawQ(false);
    drawHome();
  });
})();
