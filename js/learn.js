// =========================================================
// WordStreet — HỌC TỪ VỰNG THEO BÀI (js/learn.js)
// Mỗi bài ~10 từ chưa học, đi theo thứ tự chủ đề (B1 trước, B2 sau):
//   1. Xem từ mới (nghe phát âm, nghĩa, ví dụ)
//   2. Trắc nghiệm: nhìn từ → chọn nghĩa
//   3. Trắc nghiệm: nhìn nghĩa → chọn từ
//   4. Gõ lại từ vào chỗ trống trong câu ví dụ
// Trả lời sai → câu đó quay lại sau vài lượt. Gõ đúng ở bước 4 = "tốt nghiệp":
// từ được lưu vào "Từ của tôi" và hẹn ôn lại vào ngày mai trong mục Ôn tập.
// File này dùng các hàm chung của app.js qua window.WS (giống js/listen.js).
// =========================================================
(function () {
  "use strict";
  const { $, $$, esc, shuffle, toast, ICONS } = WS;
  const DECKS = WS.data.DECKS;
  const ORDER = ["toeic", "extra", "fin"];           // thứ tự nên học các bộ
  const SIZES = [5, 10, 15];
  const LV = { B1: 0, "B1+": 1, B2: 2, TOEIC: 2, C1: 3 };
  const CHUNK = 5;                                    // xem 5 từ thì luyện ngay 5 từ đó

  // ---------- Tiện ích nhỏ ----------
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const norm = (s) => String(s || "").toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
  function editDistance(a, b) {                       // số ký tự khác nhau (Levenshtein)
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return dp[a.length][b.length];
  }
  function cfg() { const S = WS.S; if (!S.learn) S.learn = { size: 10 }; if (!S.learn.order) S.learn.order = "mixed"; return S.learn; }
  const learned = (t) => !!WS.findWord(t.term);
  const remaining = (deck, topic) => deck.terms.filter((t) => (topic === "all" || t.topic === topic) && !learned(t));
  const firstDeck = () => ORDER.find((id) => DECKS[id] && remaining(DECKS[id], "all").length) || "toeic";

  // Lấy bài tiếp theo. B1 trước rồi mới B2/C1.
  //  - order "mixed": trộn đều các chủ đề (từ dễ/phổ thông của mọi chủ đề trước) — mặc định
  //  - order "topic": học hết chủ đề này rồi mới sang chủ đề khác
  function nextBatch(deckId, topic) {
    const deck = DECKS[deckId];
    let tp = topic;
    const auto = !tp || tp === "next" || tp === "all";
    if (auto && cfg().order === "mixed") {
      const tIdx = {}; deck.topics.forEach((x, i) => (tIdx[x.id] = i));
      const pos = {}, seen = {};
      deck.terms.forEach((t) => { seen[t.topic] = (seen[t.topic] || 0); pos[t.term] = seen[t.topic]++; }); // thứ tự trong chủ đề
      return remaining(deck, "all")
        .sort((a, b) => ((LV[a.level] ?? 1) - (LV[b.level] ?? 1)) || pos[a.term] - pos[b.term] || tIdx[a.topic] - tIdx[b.topic])
        .slice(0, cfg().size);
    }
    if (auto) {
      const t = deck.topics.find((x) => remaining(deck, x.id).length);
      tp = t ? t.id : null;
    }
    if (!tp) return [];
    return remaining(deck, tp)
      .map((t, i) => ({ t, i }))
      .sort((a, b) => ((LV[a.t.level] ?? 1) - (LV[b.t.level] ?? 1)) || a.i - b.i)
      .map((x) => x.t)
      .slice(0, cfg().size);
  }

  // Tách câu ví dụ thành: phần trước + từ cần điền + phần sau
  function clozeOf(t) {
    const ex = t.example || "";
    const base = t.term.toLowerCase().replace(/(e|y)$/, "");
    const m = ex.match(new RegExp("\\b" + reEsc(base).replace(/\s+/g, "\\s+") + "[a-z]*", "i"));
    return m ? { before: ex.slice(0, m.index), answer: m[0], after: ex.slice(m.index + m[0].length) } : null;
  }

  // 3 đáp án nhiễu: ưu tiên cùng từ loại, không trùng nghĩa
  function distractors(t, field) {
    const pool = DECKS[ses.deckId].terms.filter((x) => x.term !== t.term && norm(x[field]) !== norm(t[field]));
    const same = shuffle(pool.filter((x) => x.pos === t.pos));
    const out = [];
    for (const x of same.concat(shuffle(pool))) {
      if (out.length >= 3) break;
      if (!out.some((o) => norm(o[field]) === norm(x[field]))) out.push(x);
    }
    return out;
  }

  // ---------- Phiên học ----------
  let ses = null;
  // ses = { deckId, topicName, words:[{t, miss, done}], queue:[{type, w}], pos, answered, right, wrong }

  function startSession(deckId, topic) {
    const batch = nextBatch(deckId, topic);
    if (!batch.length) { toast("Bạn đã học hết từ trong phần này rồi!"); drawMap(deckId); return; }
    const words = batch.map((t) => ({ t, miss: 0, done: false }));
    const queue = [];
    for (let i = 0; i < words.length; i += CHUNK) {
      const chunk = words.slice(i, i + CHUNK);
      chunk.forEach((w) => queue.push({ type: "intro", w }));
      shuffle(chunk).forEach((w) => queue.push({ type: "mcvi", w }));
      shuffle(chunk).forEach((w) => queue.push({ type: "mcen", w }));
    }
    shuffle(words).forEach((w) => queue.push({ type: "type", w }));
    const oneTopic = batch.every((t) => t.topic === batch[0].topic);
    ses = { deckId, topicName: oneTopic ? WS.topicOf(batch[0].topic).name : "Trộn nhiều chủ đề", words, queue, pos: 0, answered: false, right: 0, wrong: 0 };
    history.replaceState(null, "", "#learn/" + deckId); // F5 giữa chừng sẽ về lộ trình, không tự mở bài mới
    drawTask();
  }

  // Lưu từ vào "Từ của tôi" + hẹn ôn ngày mai (sai nhiều thì "độ dễ" thấp hơn → lần sau gặp lại sớm hơn)
  function graduate(w, knownAlready) {
    if (w.done) return;
    w.done = true;
    const r = WS.addWord(WS.termToWord(w.t, w.t.example, "Học theo bài"));
    const interval = knownAlready ? 4 : 1;
    r.word.srs = { reps: 1, interval, ease: Math.max(1.3, 2.5 - 0.1 * Math.min(w.miss, 4)), due: Date.now() + interval * WS.DAY, last: Date.now() };
    WS.save();
  }

  function retryLater(task) {
    const at = Math.min(ses.queue.length, ses.pos + 4);
    ses.queue.splice(at, 0, { type: task.type, w: task.w });
  }

  // Thanh trên cùng: % cả bài + đang ở bước nào + số từ đã "thuộc" (gõ đúng ở bước cuối)
  const STEP = { intro: "1 · Xem từ mới", mcvi: "2 · Chọn nghĩa", mcen: "3 · Chọn từ", type: "4 · Gõ lại từ" };
  function topBar() {
    const done = ses.words.filter((w) => w.done).length;
    const pct = Math.round((ses.pos / ses.queue.length) * 100);
    const task = ses.queue[ses.pos];
    return `<div class="ln-top">
      <button class="icon-btn" id="ln-exit" title="Thoát bài học">✕</button>
      <div class="bar ln-bar"><span style="width:${pct}%"></span></div>
      <span class="small nowrap"><b>${pct}%</b></span>
    </div>
    <div class="row between xs muted ln-sub">
      <span>${esc(DECKS[ses.deckId].label)} · ${esc(ses.topicName)}</span>
      <span class="nowrap"><span class="tag blue">Bước ${STEP[task.type]}</span>
        <span title="Từ được tính là thuộc khi bạn gõ đúng ở bước 4">Đã thuộc ${done}/${ses.words.length}</span></span>
    </div>`;
  }

  function drawTask() {
    if (!ses) return drawMap(firstDeck());
    if (ses.pos >= ses.queue.length) return drawDone();
    const task = ses.queue[ses.pos];
    ses.answered = false;
    const t = task.w.t;
    let body = "";

    if (task.type === "intro") {
      body = `<div class="ln-kicker"><span class="tag blue">Từ mới</span></div>
        <div class="ln-word-row"><div class="ln-word">${esc(t.term)}</div><button class="icon-btn" data-say title="Phát âm">${ICONS.speak}</button></div>
        <div class="ipa center">${esc(t.ipa || "")} ${t.pos ? "· " + esc(t.pos) : ""} ${t.level ? `· <span class="tag">${esc(t.level)}</span>` : ""}</div>
        <div class="ln-vi">${esc(t.vi)}</div>
        ${t.en ? `<p class="muted small center">${esc(t.en)}</p>` : ""}
        ${t.example ? `<div class="ln-ex">${WS.highlight(t.example, t.term)}</div>` : ""}
        ${t.collocations ? `<p class="small center" style="margin-top:10px"><b>Cụm hay gặp:</b> ${esc(t.collocations)}</p>` : ""}
        ${t.note ? `<p class="xs muted center" style="margin-top:6px">💡 ${esc(t.note)}</p>` : ""}
        <div class="ln-actions">
          <button class="btn btn-ghost btn-sm" id="ln-known" title="Bỏ qua phần luyện, đưa thẳng vào lịch ôn">Tôi biết từ này rồi</button>
          <button class="btn btn-primary" data-next>Đã hiểu, tiếp <span class="kbd">Enter</span></button>
        </div>`;
    } else if (task.type === "mcvi" || task.type === "mcen") {
      const toVi = task.type === "mcvi";
      const opts = shuffle([t].concat(distractors(t, toVi ? "vi" : "term")));
      task.opts = opts;
      body = `<div class="ln-kicker xs muted">${toVi ? "Chọn nghĩa đúng của từ" : "Từ nào có nghĩa là"}</div>
        ${toVi
          ? `<div class="ln-word-row"><div class="ln-word">${esc(t.term)}</div><button class="icon-btn" data-say title="Phát âm">${ICONS.speak}</button></div>
             <div class="ipa center">${esc(t.ipa || "")}</div>`
          : `<div class="ln-vi big">${esc(t.vi)}</div>`}
        <div class="ln-opts">
          ${opts.map((o, i) => `<button class="opt ln-opt" data-i="${i}"><span class="letter">${i + 1}</span><span>${esc(toVi ? o.vi : o.term)}</span></button>`).join("")}
        </div>
        <div id="ln-fb"></div>`;
    } else {
      const cz = clozeOf(t);
      task.answer = cz ? cz.answer : t.term;
      body = `<div class="ln-kicker xs muted">Gõ từ tiếng Anh còn thiếu</div>
        <div class="ln-vi">${esc(t.vi)}</div>
        ${cz ? `<div class="ln-ex">${esc(cz.before)}<span class="blank">_____</span>${esc(cz.after)}</div>` : ""}
        <p class="xs muted center" style="margin-top:8px">Gợi ý: bắt đầu bằng “${esc(task.answer[0])}” · ${task.answer.length} ký tự</p>
        <div class="row ln-type"><input class="input" id="ln-in" placeholder="Gõ từ rồi Enter…" autocomplete="off" autocapitalize="off" spellcheck="false" />
          <button class="btn btn-primary" id="ln-check">Kiểm tra</button></div>
        <div id="ln-fb"></div>`;
    }

    $("#view").innerHTML = `<div class="learn">${topBar()}<div class="card ln-card fade-in">${body}</div></div>`;
    bindTask(task);
  }

  function feedback(ok, html) {
    $("#ln-fb").innerHTML = `<div class="ln-fb ${ok ? "ok" : "no"}"><span>${html}</span>
      <button class="btn ${ok ? "btn-primary" : ""} btn-sm" data-next>Tiếp <span class="kbd">Enter</span></button></div>`;
    $("#ln-fb [data-next]").onclick = next;
  }

  function bindTask(task) {
    const t = task.w.t;
    $("#ln-exit").onclick = () => {
      if (confirm("Thoát bài học? Những từ đã gõ đúng ở bước cuối vẫn được lưu.")) { const d = ses.deckId; ses = null; drawMap(d); }
    };
    $$("[data-say]").forEach((b) => (b.onclick = () => WS.speak(t.term, t.audio)));
    $$("[data-next]").forEach((b) => (b.onclick = next));

    if (task.type === "intro") {
      WS.speak(t.term, t.audio);
      $("#ln-known").onclick = () => {
        graduate(task.w, true);
        ses.queue = ses.queue.filter((q, i) => i <= ses.pos || q.w !== task.w); // bỏ các bước luyện của từ này
        toast(`"${t.term}" → đưa thẳng vào lịch ôn`);
        next();
      };
    } else if (task.type === "mcvi" || task.type === "mcen") {
      if (task.type === "mcvi") WS.speak(t.term, t.audio);
      $$(".ln-opt").forEach((b) => (b.onclick = () => pick(task, +b.dataset.i)));
    } else {
      const input = $("#ln-in");
      input.focus();
      const check = () => {
        if (ses.answered) return next();
        const val = norm(input.value);
        if (!val) return;
        ses.answered = true;
        input.disabled = true; $("#ln-check").disabled = true;
        const targets = [norm(task.answer), norm(t.term)];
        const exact = targets.includes(val);
        const typo = !exact && val.length >= 4 && targets.some((x) => x.length >= 5 && editDistance(val, x) <= 1);
        if (exact || typo) {
          ses.right++;
          graduate(task.w, false);
          WS.speak(t.term, t.audio);
          feedback(true, `<b>${exact ? "Chính xác!" : "Gần đúng, chỉ sai 1 chữ."}</b> ${esc(task.answer)} — ${esc(t.vi)}`);
        } else {
          ses.wrong++; task.w.miss++;
          retryLater(task);
          feedback(false, `<b>Chưa đúng.</b> Đáp án: <b class="ans">${esc(task.answer)}</b> — từ này sẽ quay lại sau ít phút.`);
        }
      };
      $("#ln-check").onclick = check;
      input.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); check(); } };
    }
  }

  function pick(task, i) {
    if (ses.answered) return;
    ses.answered = true;
    const t = task.w.t, chosen = task.opts[i], ok = chosen === t;
    $$(".ln-opt").forEach((b) => {
      b.disabled = true;
      const o = task.opts[+b.dataset.i];
      if (o === t) b.classList.add("right");
      else if (+b.dataset.i === i) b.classList.add("wrong");
    });
    if (task.type === "mcen") WS.speak(t.term, t.audio);
    if (ok) {
      ses.right++;
      feedback(true, `<b>Đúng rồi!</b> ${esc(t.term)} = ${esc(t.vi)}`);
      setTimeout(() => { if (ses && ses.queue[ses.pos] === task) next(); }, 900);
    } else {
      ses.wrong++; task.w.miss++;
      retryLater(task);
      feedback(false, `<b>Chưa đúng.</b> <b class="ans">${esc(t.term)}</b> = ${esc(t.vi)}${task.type === "mcvi" ? "" : ` · còn “${esc(chosen.term)}” = ${esc(chosen.vi)}`}`);
    }
  }

  function next() {
    if (!ses) return;
    ses.pos++;
    drawTask();
  }

  function drawDone() {
    const s = ses, total = s.right + s.wrong;
    const acc = total ? Math.round((s.right / total) * 100) : 100;
    $("#view").innerHTML = `<div class="learn"><div class="card ln-card ln-done fade-in">
      <div class="rv-done-ico">${ICONS.check}</div>
      <h2>Xong bài học!</h2>
      <p class="muted">${s.words.length} từ mới · trả lời đúng ${acc}% · các từ này sẽ hiện trong <b>Ôn tập</b> từ ngày mai.</p>
      <div class="ln-result">
        ${s.words.map((w) => `<div class="ln-res-row">
          <button class="icon-btn" data-say="${esc(w.t.term)}">${ICONS.speak}</button>
          <div style="min-width:0;flex:1"><b>${esc(w.t.term)}</b> <span class="muted small">— ${esc(w.t.vi)}</span></div>
          ${w.miss ? `<span class="tag gold">sai ${w.miss} lần</span>` : `<span class="tag green">thuộc ngay</span>`}
        </div>`).join("")}
      </div>
      <div class="row" style="justify-content:center;flex-wrap:wrap;margin-top:18px">
        <button class="btn btn-primary" id="ln-more">Học tiếp ${cfg().size} từ</button>
        <button class="btn" id="ln-map">Về lộ trình</button>
        <a class="btn" href="#listen">Luyện nghe</a>
      </div></div></div>`;
    $$("[data-say]").forEach((b) => (b.onclick = () => WS.speak(b.dataset.say)));
    const deckId = s.deckId;
    ses = null;
    $("#ln-more").onclick = () => startSession(deckId, "next");
    $("#ln-map").onclick = () => drawMap(deckId);
  }

  // ---------- Lộ trình (bản đồ các bài) ----------
  function drawMap(deckId) {
    if (location.hash !== "#learn/" + deckId) history.replaceState(null, "", "#learn/" + deckId);
    const deck = DECKS[deckId], size = cfg().size;
    const left = remaining(deck, "all").length, total = deck.terms.length, done = total - left;
    const nextTp = deck.topics.find((x) => remaining(deck, x.id).length);
    const mixed = cfg().order === "mixed";
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Học từ vựng theo bài</h1>
        <p>Mỗi bài ${size} từ, mặc định lấy <b>từ dễ, phổ thông của mọi chủ đề trước</b> (hoặc chọn học theo từng chủ đề, hay bấm "Học" ở 1 chủ đề bất kỳ). Mỗi từ đi qua 4 bước: <b>xem</b> → <b>chọn nghĩa</b> → <b>chọn từ</b> → <b>gõ lại</b>. Sai thì gặp lại tới khi đúng.</p></div>
        <div class="seg" id="lm-deck">${ORDER.map((id) => `<button data-deck="${id}" class="${id === deckId ? "on" : ""}">${esc(DECKS[id].label)}</button>`).join("")}</div>
      </div>

      ${ses ? `<div class="card learn-cta" style="border-color:var(--primary)"><div class="learn-cta-main"><b>Bạn đang học dở 1 bài (${esc(ses.topicName)})</b></div>
        <button class="btn btn-primary" id="lm-resume">Học tiếp bài đang dở</button></div>` : ""}

      <div class="card learn-cta">
        <div class="learn-cta-main">
          <div class="row between small"><b>Đã học ${done}/${total} từ</b><span class="muted xs">còn ${left} từ ≈ ${Math.ceil(left / size)} bài</span></div>
          <div class="bar"><span style="width:${total ? (done / total) * 100 : 0}%"></span></div>
          <div class="row small" style="margin-top:10px;gap:10px;flex-wrap:wrap"><span class="muted">Số từ mỗi bài:</span>
            <div class="seg" id="lm-size">${SIZES.map((n) => `<button data-size="${n}" class="${n === size ? "on" : ""}">${n}</button>`).join("")}</div>
            <span class="muted" style="margin-left:6px">Thứ tự:</span>
            <div class="seg" id="lm-order">
              <button data-order="mixed" class="${mixed ? "on" : ""}" title="Lấy từ dễ, phổ thông (B1) của mọi chủ đề trước, rồi mới tới B2">Từ dễ trước</button>
              <button data-order="topic" class="${mixed ? "" : "on"}" title="Học hết 1 chủ đề rồi mới sang chủ đề khác">Từng chủ đề</button>
            </div></div>
        </div>
        ${nextTp ? `<button class="btn btn-primary btn-lg" id="lm-start">Bắt đầu bài tiếp theo<small>${mixed ? "Trộn chủ đề · B1 trước" : esc(nextTp.name)}</small></button>`
                 : `<span class="tag green">✓ Đã học hết bộ này</span>`}
      </div>

      <h2 class="section-title">Các chủ đề</h2>
      <div class="grid grid-3">
        ${deck.topics.map((tp) => {
          const all = deck.terms.filter((t) => t.topic === tp.id).length;
          const rem = remaining(deck, tp.id).length, d = all - rem;
          const lessons = Math.ceil(all / size), lessonsDone = rem ? Math.floor(d / size) : lessons;
          const isNext = !mixed && nextTp && nextTp.id === tp.id;
          return `<div class="card lm-topic ${isNext ? "is-next" : ""} ${rem ? "" : "done"}">
            <div class="row between"><b class="row" style="gap:8px"><span class="dot" style="background:${tp.color}"></span>${esc(tp.name)}</b>
              ${rem ? (isNext ? `<span class="tag blue">Tiếp theo</span>` : "") : `<span class="tag green">✓ Xong</span>`}</div>
            <div class="bar"><span style="width:${all ? (d / all) * 100 : 0}%;background:${tp.color}"></span></div>
            <div class="row between xs muted"><span>${d}/${all} từ · bài ${lessonsDone}/${lessons}</span>
              ${rem ? `<button class="btn btn-sm" data-topic-go="${tp.id}">Học</button>` : `<a class="btn btn-sm btn-ghost" href="#glossary/${deckId}">Xem từ</a>`}</div>
          </div>`;
        }).join("")}
      </div>`;
    $$("#lm-deck [data-deck]").forEach((b) => (b.onclick = () => drawMap(b.dataset.deck)));
    $$("#lm-size [data-size]").forEach((b) => (b.onclick = () => { cfg().size = +b.dataset.size; WS.save(); drawMap(deckId); }));
    $$("#lm-order [data-order]").forEach((b) => (b.onclick = () => { cfg().order = b.dataset.order; WS.save(); drawMap(deckId); }));
    $$("[data-topic-go]").forEach((b) => (b.onclick = () => startSession(deckId, b.dataset.topicGo)));
    const st = $("#lm-start"); if (st) st.onclick = () => startSession(deckId, "next");
    const rs = $("#lm-resume"); if (rs) rs.onclick = drawTask;
  }

  // ---------- Phím tắt: 1–4 chọn đáp án, Enter = tiếp ----------
  document.addEventListener("keydown", (e) => {
    if (!ses || !(location.hash || "").startsWith("#learn") || !$(".ln-card")) return;
    if (document.activeElement && document.activeElement.tagName === "INPUT") return; // ô gõ tự xử lý Enter
    const task = ses.queue[ses.pos];
    if (!task) return;
    if (e.key === "Enter") {
      const b = $("[data-next]");
      if (b) { e.preventDefault(); b.click(); }
    } else if (/^[1-4]$/.test(e.key) && !ses.answered && (task.type === "mcvi" || task.type === "mcen")) {
      const b = $(`.ln-opt[data-i="${+e.key - 1}"]`);
      if (b) b.click();
    }
  });

  // ---------- Đăng ký trang ----------
  // #learn            → lộ trình của bộ đang học dở
  // #learn/toeic      → lộ trình bộ 600 từ TOEIC
  // #learn/toeic.t-office.go → học ngay 1 bài chủ đề Văn phòng ("next" = tự chọn)
  WS.registerPage("learn", (arg) => {
    const [d, tp, go] = String(arg || "").split(".");
    const deckId = DECKS[d] ? d : firstDeck();
    if (go === "go") startSession(deckId, tp || "next");
    else drawMap(deckId);
  });
})();
