/* ============================================================
   WordStreet — LUYỆN NGHE (nghe chép chính tả / dictation)
   ------------------------------------------------------------
   Cách hoạt động:
     1. App đọc 1 câu tiếng Anh bằng giọng máy (US/UK theo nút ở góc trên).
     2. Bạn gõ lại những gì nghe được.
     3. App so từng từ: xanh = đúng, vàng = gần đúng (sai chính tả nhẹ), đỏ = thiếu/sai.
     4. Xem nghĩa cả câu, bấm vào từ để tra & lưu vào "Từ của tôi".

   File này KHÔNG sửa app.js. Nó dùng các hàm chung qua window.WS
   (xem cuối file app.js, mục 15) và tự đăng ký trang "#listen".
   ============================================================ */
(function () {
  "use strict";
  if (!window.WS) { console.warn("listen.js: cần nạp app.js trước"); return; }
  const { $, $$, esc, shuffle, toast, ICONS } = WS;
  const SESSION_SIZE = 10;
  const stopSpeech = () => { if (window.speechSynthesis) speechSynthesis.cancel(); };

  // ---------------------------------------------------------
  // 1. Nguồn câu để nghe (từ dễ đến khó)
  // ---------------------------------------------------------
  const countWords = (s) => s.trim().split(/\s+/).filter(Boolean).length;

  // Câu ví dụ trong bộ từ vựng TOEIC (600 + mở rộng)
  function vocabSentences(minW, maxW, levels) {
    const seen = new Set();
    return WS.data.TOEIC.concat(WS.data.EXTRA)
      .filter((t) => t.example && levels.includes(t.level))
      .map((t) => ({ text: t.example.trim(), from: "Ví dụ của từ “" + t.term + "”" }))
      .filter((x) => { const n = countWords(x.text); if (n < minW || n > maxW || seen.has(x.text)) return false; seen.add(x.text); return true; });
  }
  // Câu trong các bài đọc
  function articleSentences(articles, minW, maxW) {
    const out = [];
    articles.forEach((a) => a.paragraphs.forEach((p) => {
      if (p.includes("|")) return; // bỏ dòng tiêu đề email kiểu "To: ... | From: ..."
      WS.splitSentences(p).forEach((s) => {
        const n = countWords(s);
        if (n >= minW && n <= maxW) out.push({ text: s.trim(), from: "Bài: " + a.title });
      });
    }));
    return out;
  }

  const SOURCES = [
    { id: "short",  name: "Câu ngắn · B1",      desc: "Câu ví dụ 6–11 từ trong bộ từ vựng. Bắt đầu ở đây.",                 build: () => vocabSentences(6, 11, ["B1"]) },
    { id: "medium", name: "Câu vừa · B2",       desc: "Câu ví dụ 9–16 từ, từ vựng khó hơn.",                                build: () => vocabSentences(9, 16, ["B2", "C1"]) },
    { id: "toeic",  name: "Bài đọc TOEIC",      desc: "Câu trong 12 bài đọc TOEIC. Đọc bài trước rồi nghe lại là cách nhớ lâu nhất.", build: () => articleSentences(WS.data.TOEIC_ARTICLES, 6, 26) },
    { id: "fin",    name: "Báo tài chính · khó", desc: "Câu dài trong bài báo C1, giống tốc độ tin tức thật.",              build: () => articleSentences(WS.data.ARTICLES, 8, 32) }
  ];
  const SPEEDS = [
    { rate: 0.7,  label: "Chậm" },
    { rate: 0.85, label: "Vừa" },
    { rate: 1.0,  label: "Thật" }
  ];

  // ---------------------------------------------------------
  // 2. Chấm điểm: so từng từ giữa câu gốc và câu bạn gõ
  // ---------------------------------------------------------
  const WORD_RE = /[A-Za-z0-9]+(?:['’.\-][A-Za-z0-9]+)*/g;
  // "a.m." == "am", "Don’t" == "don't", không phân biệt hoa/thường
  const keyOf = (w) => w.toLowerCase().replace(/’/g, "'").replace(/\./g, "");
  const tokens = (s) => Array.from(s.matchAll(WORD_RE)).map((m) => ({ raw: m[0], key: keyOf(m[0]), index: m.index }));

  // Khoảng cách chỉnh sửa (Levenshtein): cần bao nhiêu lần thêm/xóa/sửa 1 chữ cái để 2 từ giống nhau
  function editDistance(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return dp[a.length][b.length];
  }
  const isTypo = (a, b) => { const d = editDistance(a, b); return a.length >= 4 && (d === 1 || (a.length >= 7 && d === 2)); };

  // So khớp bằng "dãy con chung dài nhất" (LCS) → biết từ nào đúng, thiếu, thừa
  function grade(original, typed) {
    const O = tokens(original), T = tokens(typed);
    const n = O.length, m = T.length;
    const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        L[i][j] = O[i].key === T[j].key ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const ops = [];
    let i = 0, j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && O[i].key === T[j].key) { ops.push({ type: "ok", o: i++, t: j++ }); }
      else if (j < m && (i >= n || L[i][j + 1] >= L[i + 1][j])) { ops.push({ type: "extra", t: j++ }); }
      else { ops.push({ type: "miss", o: i++ }); }
    }
    // Ghép cặp "thiếu" + "thừa" nằm cạnh nhau nếu chỉ sai chính tả nhẹ → "gần đúng"
    const status = new Array(n).fill("miss"), typedAs = new Array(n).fill(null);
    const extras = [];
    let k = 0;
    while (k < ops.length) {
      if (ops[k].type === "ok") { status[ops[k].o] = "ok"; k++; continue; }
      const misses = [], adds = [];
      while (k < ops.length && ops[k].type !== "ok") { (ops[k].type === "miss" ? misses : adds).push(ops[k]); k++; }
      const usedAdds = new Set();
      misses.forEach((mo) => {
        const idx = adds.findIndex((ad, x) => !usedAdds.has(x) && isTypo(O[mo.o].key, T[ad.t].key));
        if (idx >= 0) { usedAdds.add(idx); status[mo.o] = "typo"; typedAs[mo.o] = T[adds[idx].t].raw; }
      });
      adds.forEach((ad, x) => { if (!usedAdds.has(x)) extras.push(T[ad.t].raw); });
    }
    const ok = status.filter((s) => s === "ok").length, typo = status.filter((s) => s === "typo").length;
    const score = n ? Math.round(((ok + typo * 0.5) / n) * 100) : 0;
    return { O, status, typedAs, extras, ok, typo, miss: n - ok - typo, total: n, score };
  }

  // Vẽ lại câu gốc, tô màu từng từ, giữ nguyên dấu câu
  function renderGraded(original, g) {
    let html = "", last = 0;
    g.O.forEach((tok, i) => {
      html += esc(original.slice(last, tok.index));
      const st = g.status[i];
      const title = st === "typo" ? `Bạn gõ: ${g.typedAs[i]}` : st === "miss" ? "Bạn bỏ sót / nghe nhầm từ này" : "";
      html += `<span class="dw dw-${st}" data-w="${esc(tok.raw)}"${title ? ` title="${esc(title)}"` : ""}>${esc(tok.raw)}</span>`;
      last = tok.index + tok.raw.length;
    });
    return html + esc(original.slice(last));
  }

  // Gợi ý: chỉ hiện chữ cái đầu mỗi từ → "T____ y__ f__ y___ p_______."
  const hintOf = (s) => s.replace(WORD_RE, (w) => w[0] + w.slice(1).replace(/[A-Za-z0-9]/g, "_"));

  // ---------------------------------------------------------
  // 3. Dữ liệu luyện nghe lưu trong trình duyệt (cùng chỗ với kho từ)
  // ---------------------------------------------------------
  function stats() {
    const S = WS.S;
    if (!S.listen) S.listen = { rate: 0.85, source: "short", sentences: 0, history: [] };
    return S.listen;
  }

  // ---------------------------------------------------------
  // 4. Giao diện
  // ---------------------------------------------------------
  let session = null;

  function renderHome() {
    const st = stats();
    const today = (WS.S.daily && WS.S.daily.date === WS.todayStr() && WS.S.daily.listen) || 0;
    const recent = st.history.slice(-7);
    const avg = recent.length ? Math.round(recent.reduce((a, h) => a + h.avg, 0) / recent.length) : null;
    const counts = Object.fromEntries(SOURCES.map((s) => [s.id, s.build().length]));

    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Luyện nghe</h1>
        <p>Nghe câu tiếng Anh rồi gõ lại. Đây là cách luyện tai hiệu quả nhất cho TOEIC Listening, vì nó buộc bạn nghe rõ từng từ, kể cả những từ nhỏ như <i>a, the, to, of</i>.</p></div></div>

      <div class="grid stat-row" style="margin-bottom:18px">
        <div class="card flat stat-tile"><span class="muted xs">Hôm nay</span><b>${today} câu</b></div>
        <div class="card flat stat-tile"><span class="muted xs">Chính xác (7 phiên gần nhất)</span><b>${avg == null ? "—" : avg + "%"}</b></div>
        <div class="card flat stat-tile"><span class="muted xs">Tổng đã nghe</span><b>${st.sentences} câu</b></div>
      </div>

      <h2 class="section-title">1. Chọn loại câu</h2>
      <div class="grid grid-2" id="ls-sources">
        ${SOURCES.map((s) => `<button class="card card-click src-card ${st.source === s.id ? "on" : ""}" data-src="${s.id}">
            <div class="row between"><b>${esc(s.name)}</b><span class="muted xs">${counts[s.id]} câu</span></div>
            <p class="muted small" style="margin-top:4px">${esc(s.desc)}</p></button>`).join("")}
      </div>

      <h2 class="section-title">2. Tốc độ đọc</h2>
      <div class="row wrap" style="gap:12px">
        <div class="seg" id="ls-speed">${SPEEDS.map((sp) => `<button data-rate="${sp.rate}" class="${st.rate === sp.rate ? "on" : ""}">${sp.label}</button>`).join("")}</div>
        <span class="muted small">Giọng đọc: <b>${WS.S.accent === "en-GB" ? "Anh (UK)" : "Mỹ (US)"}</b>. Đổi ở nút US/UK góc trên. TOEIC có cả 2 giọng nên hãy tập cả hai.</span>
      </div>

      <div class="row" style="margin-top:22px"><button class="btn btn-primary" id="ls-start">${ICONS.listen} Bắt đầu ${SESSION_SIZE} câu</button></div>

      <div class="card flat how-card" style="margin-top:26px">
        <b>Cách luyện cho hiệu quả</b>
        <ol>
          <li>Nghe <b>tối đa 3 lần</b> rồi mới gõ. Đừng bấm gợi ý ngay.</li>
          <li>Gõ cả những từ nhỏ (<i>a, the, to, has been…</i>). Part 1–2 TOEIC hay bẫy đúng chỗ này.</li>
          <li>Sau khi kiểm tra, <b>nghe lại và nhìn câu gốc</b>, để ý những chỗ âm bị nối hoặc nuốt.</li>
          <li>Đọc to câu đó theo giọng máy 2–3 lần (shadowing) rồi mới sang câu tiếp.</li>
        </ol>
        <p class="muted xs">Phím tắt khi đang gõ: <span class="kbd">Enter</span> kiểm tra · <span class="kbd">↑</span> nghe lại · <span class="kbd">↓</span> nghe chậm</p>
      </div>`;

    $$("#ls-sources [data-src]").forEach((b) => (b.onclick = () => { st.source = b.dataset.src; WS.save(); renderHome(); }));
    $$("#ls-speed [data-rate]").forEach((b) => (b.onclick = () => { st.rate = +b.dataset.rate; WS.save(); renderHome(); }));
    $("#ls-start").onclick = () => startSession(SOURCES.find((s) => s.id === st.source) || SOURCES[0]);
  }

  function startSession(src, list) {
    const pool = list || shuffle(src.build()).slice(0, SESSION_SIZE);
    if (!pool.length) { toast("Chưa có câu cho loại này."); return; }
    session = { src, list: pool, idx: 0, results: [], counted: [] };
    drawItem();
  }

  // fresh = true: làm lại câu này từ đầu (bỏ qua bài đã chấm trước đó)
  function drawItem(fresh) {
    const s = session, item = s.list[s.idx], st = stats();
    const before = fresh ? null : s.results[s.idx]; // câu đã làm rồi (quay lại xem) → hiện lại kết quả cũ
    let plays = 0, checked = false;
    $("#view").innerHTML = `
      <div class="row" style="max-width:760px;margin:0 auto 14px;gap:6px">
        <button class="btn btn-ghost btn-sm" id="ls-quit">${ICONS.back} Thoát</button>
        <button class="btn btn-ghost btn-sm" id="ls-prev" ${s.idx ? "" : "disabled"} title="Quay lại câu trước">← Câu trước</button>
        ${s.results[s.idx + 1] ? `<button class="btn btn-ghost btn-sm" id="ls-fwd">Câu sau →</button>` : ""}
        <span class="spacer"></span>
        <span class="muted small">${esc(s.src.name)} · Câu ${s.idx + 1}/${s.list.length}</span></div>
      <div class="bar" style="max-width:760px;margin:0 auto 16px"><span style="width:${(s.idx / s.list.length) * 100}%"></span></div>
      <div class="card dict-card">
        <div class="row wrap" style="gap:8px">
          <button class="btn btn-primary" id="ls-play">${ICONS.speak} Nghe</button>
          <button class="btn" id="ls-slow">Nghe chậm</button>
          <button class="btn btn-ghost" id="ls-hint">Gợi ý</button>
          <span class="spacer"></span><span class="muted xs" id="ls-plays">Đã nghe 0 lần</span>
        </div>
        <div class="hint-line hidden" id="ls-hint-line"></div>
        <input class="input dict-input" id="ls-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Gõ lại câu bạn nghe được…" />
        <div class="row" style="margin-top:10px">
          <span class="muted xs">Enter: kiểm tra · ↑: nghe lại · ↓: nghe chậm</span><span class="spacer"></span>
          <button class="btn btn-ghost btn-sm" id="ls-skip">Không nghe được, xem đáp án</button>
          <button class="btn btn-primary" id="ls-check">Kiểm tra</button>
        </div>
        <div id="ls-result"></div>
      </div>`;

    const view = $("#view").firstElementChild;
    const play = (rate) => {
      if (!view.isConnected) return; // đã chuyển sang câu/trang khác thì thôi
      if (WS.speakText(item.text, rate)) { plays++; $("#ls-plays").textContent = `Đã nghe ${plays} lần`; }
      if (!checked) $("#ls-input").focus();
    };
    $("#ls-play").onclick = () => play(st.rate);
    $("#ls-slow").onclick = () => play(Math.min(st.rate, 0.6));
    $("#ls-hint").onclick = () => { $("#ls-hint-line").textContent = hintOf(item.text); $("#ls-hint-line").classList.remove("hidden"); $("#ls-input").focus(); };
    $("#ls-quit").onclick = () => { stopSpeech(); session = null; renderHome(); };
    const goTo = (i) => { stopSpeech(); s.idx = i; drawItem(); };
    $("#ls-prev").onclick = () => { if (s.idx > 0) goTo(s.idx - 1); };
    const fw = $("#ls-fwd"); if (fw) fw.onclick = () => goTo(s.idx + 1);

    const check = (gaveUp, restore) => {
      if (checked) return;
      const typed = restore ? restore.typed : $("#ls-input").value.trim();
      if (!typed && !gaveUp && !restore) { toast("Gõ những gì bạn nghe được trước nhé (đúng một phần cũng được)."); return; }
      checked = true;
      const g = grade(item.text, gaveUp ? "" : typed);
      if (restore) $("#ls-input").value = typed;
      else {
        s.results[s.idx] = { item, score: g.score, typed: gaveUp ? "" : typed };
        // Mục tiêu hôm nay chỉ cộng lần đầu làm câu này (làm lại không cộng thêm)
        if (!s.counted[s.idx]) { s.counted[s.idx] = true; st.sentences++; WS.bump("listen"); } else WS.save();
      }
      $("#ls-input").disabled = true;
      $("#ls-check").classList.add("hidden"); $("#ls-skip").classList.add("hidden");
      const tone = g.score >= 90 ? "good" : g.score >= 60 ? "mid" : "low";
      const msg = g.score === 100 ? "Hoàn hảo!" : g.score >= 90 ? "Rất tốt!" : g.score >= 60 ? "Khá ổn, xem lại chỗ đỏ nhé." : "Câu này khó, nghe lại vài lần rồi đọc to theo.";
      $("#ls-result").innerHTML = `
        <div class="dict-result">
          <div class="row between"><b class="score score-${tone}">${g.score}%</b><span class="muted small">${msg}</span></div>
          <div class="k">Câu gốc <span class="muted">(bấm vào từ để tra nghĩa)</span></div>
          <div class="graded" id="ls-graded">${renderGraded(item.text, g)}</div>
          <div class="legend xs muted"><span class="dw dw-ok">đúng</span> <span class="dw dw-typo">sai chính tả nhẹ</span> <span class="dw dw-miss">thiếu / nghe nhầm</span></div>
          ${g.extras.length ? `<div class="small" style="margin-top:6px"><span class="muted">Từ thừa / sai bạn đã gõ:</span> ${g.extras.map((w) => `<s class="extra-w">${esc(w)}</s>`).join(" ")}</div>` : ""}
          <div class="k" style="margin-top:12px">Nghĩa cả câu</div>
          <div class="vi-line" id="ls-vi"><span class="spin"></span> Đang dịch…</div>
          <p class="muted xs" style="margin-top:8px">${esc(item.from)}</p>
          <div class="row" style="margin-top:12px">
            <button class="btn" id="ls-again">${ICONS.speak} Nghe lại</button>
            <button class="btn btn-ghost" id="ls-redo" title="Xoá bài đã gõ, nghe và gõ lại">↻ Làm lại câu này</button><span class="spacer"></span>
            <button class="btn btn-primary" id="ls-next">${s.idx + 1 < s.list.length ? "Câu tiếp →" : "Xem kết quả"}</button>
          </div>
        </div>`;
      WS.translateVi(item.text).then((vi) => { const el = $("#ls-vi"); if (el) el.textContent = vi || "Không dịch được (kiểm tra mạng)."; });
      $("#ls-graded").onclick = (e) => {
        const w = e.target.closest(".dw");
        if (w) WS.openLookup(keyOf(w.dataset.w).replace(/'s$/, ""), { context: item.text, source: "Luyện nghe" });
      };
      $("#ls-again").onclick = () => WS.speakText(item.text, st.rate);
      $("#ls-redo").onclick = () => { stopSpeech(); drawItem(true); };
      $("#ls-next").onclick = () => { stopSpeech(); s.idx++; if (s.idx >= s.list.length) drawSummary(); else drawItem(); };
      $("#ls-next").focus();
    };
    $("#ls-check").onclick = () => check(false);
    $("#ls-skip").onclick = () => check(true);
    $("#ls-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); check(false); }
      else if (e.key === "ArrowUp") { e.preventDefault(); play(st.rate); }
      else if (e.key === "ArrowDown") { e.preventDefault(); play(Math.min(st.rate, 0.6)); }
    });

    if (before) check(!before.typed, before); // quay lại câu đã làm: hiện lại kết quả cũ (bấm "Nghe lại" để nghe)
    else setTimeout(() => play(st.rate), 300); // tự đọc khi mở câu mới
  }

  function drawSummary() {
    const s = session, st = stats();
    const avg = Math.round(s.results.reduce((a, r) => a + r.score, 0) / s.results.length);
    st.history.push({ date: WS.todayStr(), source: s.src.id, avg, n: s.results.length });
    if (st.history.length > 60) st.history = st.history.slice(-60);
    WS.save();
    const weak = s.results.filter((r) => r.score < 80);
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Kết quả: ${avg}%</h1>
        <p>${avg >= 90 ? "Tai bạn đang rất tốt với loại câu này, thử lên mức khó hơn nhé!" : avg >= 70 ? "Tốt! Luyện lại các câu dưới 80% để chắc hơn." : "Bình thường thôi, ai mới tập cũng vậy. Mỗi ngày 10 câu, sau 2–3 tuần bạn sẽ thấy khác biệt rõ."}</p></div></div>
      <div class="card list-card" style="max-width:760px">
        ${s.results.map((r, i) => `<div class="word-row">
          <div><div class="small">${esc(r.item.text)}</div>
            ${r.typed ? `<div class="muted xs" style="margin-top:4px">Bạn gõ: ${esc(r.typed)}</div>` : `<div class="muted xs" style="margin-top:4px">(bỏ qua)</div>`}</div>
          <div class="row" style="gap:6px"><span class="tag ${r.score >= 90 ? "green" : r.score >= 60 ? "gold" : "red"}">${r.score}%</span>
            <button class="icon-btn" data-say="${i}" title="Nghe lại">${ICONS.speak}</button></div></div>`).join("")}
      </div>
      <div class="row wrap" style="gap:8px;margin-top:16px">
        <button class="btn" id="ls-home">${ICONS.back} Về trang luyện nghe</button><span class="spacer"></span>
        ${weak.length ? `<button class="btn" id="ls-weak">Luyện lại ${weak.length} câu dưới 80%</button>` : ""}
        <button class="btn btn-primary" id="ls-more">Thêm ${SESSION_SIZE} câu mới</button>
      </div>`;
    $$("[data-say]").forEach((b) => (b.onclick = () => WS.speakText(s.results[+b.dataset.say].item.text, st.rate)));
    $("#ls-home").onclick = () => { session = null; renderHome(); };
    $("#ls-more").onclick = () => startSession(s.src);
    if (weak.length) $("#ls-weak").onclick = () => startSession(s.src, weak.map((r) => r.item));
  }

  // ---------------------------------------------------------
  // 5. Đăng ký trang #listen với app
  // ---------------------------------------------------------
  WS.registerPage("listen", () => {
    if (session) { stopSpeech(); session = null; }
    renderHome();
  });
})();
