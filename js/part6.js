/* ============================================================
   WordStreet — TOEIC PART 6: ĐIỀN VÀO ĐOẠN VĂN (js/part6.js)
   ------------------------------------------------------------
   Mỗi đoạn có 4 chỗ trống, trong đó 1 chỗ là chọn CẢ CÂU.
   Trả lời xong chỗ nào thì đoạn văn tự điền đáp án đúng vào chỗ đó,
   để đọc lại cả đoạn cho trôi.
   Câu sai vào Sổ câu sai (deck "p6"). Mỗi câu tính 1 vào mục tiêu "Luyện đề".
   Dữ liệu: data/toeic-part6.js
   ============================================================ */
(function () {
  "use strict";
  if (!window.WS) return;
  const { $, $$, esc, ICONS } = WS;
  const SETS = window.WS_TOEIC_PART6 || [];
  const TYPE_VI = { Grammar: "Ngữ pháp", Vocabulary: "Từ vựng", "Word form": "Từ loại", Sentence: "Chọn câu phù hợp" };

  function st() { const S = WS.S; if (!S.p6) S.p6 = { done: {} }; return S.p6; }
  const mkKey = (set, i) => set.id + " · chỗ trống " + (i + 1);
  const openIn = (set) => set.qs.filter((q, i) => { const m = (WS.S.mistakes || {})["p6|" + mkKey(set, i)]; return m && !m.fixed; }).length;

  function passageHtml(set, filled) {
    return set.paragraphs.map((p) => `<p>${esc(p).replace(/\n/g, "<br/>").replace(/\{(\d)\}/g, (m, n) => {
      const i = +n - 1, f = filled[i];
      return f != null ? `<span class="p6-fill">${esc(set.qs[i].options[set.qs[i].answer])}</span>` : `<span class="p6-blank">(${n})</span>`;
    })}</p>`).join("");
  }

  function drawSet(set) {
    const filled = [];
    const qs = set.qs.map((q, i) => Object.assign({}, q, { q: `Chỗ trống (${i + 1}) · ${TYPE_VI[q.type] || q.type}` }));
    $("#view").innerHTML = `
      <div class="p6">
        <div class="row" style="margin-bottom:14px"><a class="btn btn-ghost btn-sm" href="#part6">${ICONS.back} Danh sách đoạn</a><span class="spacer"></span>
          <span class="tag">${esc(set.style)}</span><span class="tag">${esc(set.level)}</span></div>
        <div class="p6-grid">
          <article class="reader p6-text"><div class="kicker">Part 6 · ${esc(set.title)}</div><div class="body" id="p6-body">${passageHtml(set, filled)}</div></article>
          <div class="card p6-qs"><div id="p6-qs">${qs.map((q, i) => WS.questionHtml(q, i, "p6")).join("")}</div>
            <div id="p6-after" class="hidden"><div class="explain" id="p6-score"></div>
              <div class="ln-actions"><a class="btn btn-ghost" href="#part6">Danh sách</a>${nextSet(set) ? `<a class="btn btn-primary" href="#part6/${nextSet(set).id}">Đoạn tiếp theo</a>` : ""}</div></div>
          </div>
        </div>
      </div>`;
    const answers = [];
    WS.bindQuestions($("#p6-qs"), qs, "p6", (i, ok) => {
      answers[i] = ok; filled[i] = true;
      $("#p6-body").innerHTML = passageHtml(set, filled);
      WS.noteMistake("p6", mkKey(set, i), ok);
      const S = WS.S, qst = S.quizStats.p6 || (S.quizStats.p6 = { c: 0, t: 0 });
      qst.t++; if (ok) qst.c++;
      WS.ensureDay(); S.daily.quizCorrect += ok ? 1 : 0; WS.bump("quiz");
      if (answers.filter((x) => x !== undefined).length === set.qs.length) {
        const c = answers.filter(Boolean).length;
        st().done[set.id] = Math.max(st().done[set.id] || 0, c); WS.save();
        $("#p6-score").innerHTML = `<b>Đúng ${c}/4.</b> Đoạn văn bên trái đã được điền đủ, đọc lại một lượt để quen cách các câu nối với nhau.`;
        $("#p6-after").classList.remove("hidden");
      }
    });
  }

  function nextSet(set) { const i = SETS.indexOf(set); return SETS.slice(i + 1).find((x) => st().done[x.id] == null) || SETS[i + 1] || null; }

  function drawHome() {
    const s = st(), next = SETS.find((x) => s.done[x.id] == null);
    $("#view").innerHTML = `
      <div class="page-head"><div><h1>Part 6 · Điền vào đoạn văn</h1>
        <p>Mỗi đoạn (email, thông báo, quảng cáo…) có 4 chỗ trống, trong đó 1 chỗ phải chọn cả câu. Khác Part 5 ở chỗ phải đọc câu trước và câu sau mới biết đáp án: thì của động từ, từ nối (however, in addition…), đại từ “it/they” đang nói tới cái gì.</p></div></div>
      ${next ? `<div class="card learn-cta"><div class="learn-cta-main"><b>Đoạn nên làm tiếp: ${esc(next.title)}</b><span class="muted small">${esc(next.style)} · ${esc(next.level)} · 4 chỗ trống</span></div>
        <a class="btn btn-primary" href="#part6/${next.id}">Làm đoạn này</a></div>` : ""}
      <div class="mk-list" style="max-width:none">
        ${SETS.map((x) => { const d = s.done[x.id], w = openIn(x); return `<a class="mk-row p34-row" href="#part6/${x.id}">
          <div><b>${esc(x.title)}</b><p class="muted small">${esc(x.style)} · ${esc(x.level)}</p></div>
          <span>${d != null ? `<span class="tag ${d === 4 ? "green" : "gold"}">${d}/4</span>` : ""}${w ? ` <span class="tag red">${w} câu sai</span>` : ""}</span></a>`; }).join("")}
      </div>`;
  }

  // #part6 → danh sách · #part6/<id> → làm đoạn · #part6/mistakes → đoạn đầu tiên còn câu sai
  WS.registerPage("part6", (arg) => {
    if (arg === "mistakes") { const x = SETS.find(openIn); return x ? drawSet(x) : drawHome(); }
    const set = SETS.find((x) => x.id === arg);
    if (set) drawSet(set); else drawHome();
  });
})();
