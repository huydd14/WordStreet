// =========================================================
// WordStreet — GHI TỪ NHANH (js/quicknote.js)
// 1. Bôi đen (kéo chuột chọn) 1 từ hoặc 1 cụm ở BẤT KỲ đâu trong trang
//    (bài đọc, câu hỏi, đáp án, bài nghe…) → hiện nút "Tra & lưu".
// 2. Nút ✎ nổi ở góc màn hình: gõ từ/cụm từ → tra & lưu ngay.
// Cả 2 đều mở bảng tra từ đè lên trang hiện tại, nên bài đang đọc/làm KHÔNG bị mất.
// =========================================================
(function () {
  "use strict";
  const { $, esc } = WS;
  const MAX_WORDS = 8;

  // ---------- Tìm "dạng gốc" của cụm: "carried out" → "carry out" nếu có trong bộ từ ----------
  function normalize(text) {
    const raw = text.replace(/[“”"()[\]{}.,!?;:]+/g, " ").replace(/\s+/g, " ").trim();
    const low = raw.toLowerCase();
    if (WS.findTerm(low)) return WS.findTerm(low).term;
    const ws = low.split(" ");
    if (ws.length > 1) {
      for (const c of WS.stemCandidates(ws[0])) {
        const t = WS.findTerm([c].concat(ws.slice(1)).join(" "));
        if (t) return t.term;
      }
    }
    // Giữ chữ hoa nếu là tên riêng (vd "Federal Reserve"), còn lại viết thường
    return /^[A-Z][a-z]/.test(raw) && ws.length > 1 && raw.split(" ").every((w) => /^[A-Z]/.test(w)) ? raw : low;
  }

  // Câu chứa đoạn được chọn (làm câu ngữ cảnh khi lưu)
  function contextOf(node, text) {
    const el = node && (node.nodeType === 1 ? node : node.parentElement);
    const block = el && el.closest("p, li, .q-text, .opt, .ln-ex, .ex, .ctx, .dict-card, .graded, .vi-line, div");
    const full = block ? block.textContent.replace(/\s+/g, " ").trim() : "";
    if (!full) return "";
    const hit = WS.splitSentences(full).find((s) => s.toLowerCase().includes(text.toLowerCase()));
    return (hit || full).slice(0, 300);
  }

  function pageSource() {
    const p = (location.hash || "#today").slice(1).split("/")[0];
    return { read: "Bài đọc", quiz: "Đề TOEIC", listen: "Luyện nghe", review: "Ôn tập", learn: "Học từ" }[p] || "Ghi nhanh";
  }

  // ---------- 1. Nút nổi khi bôi đen ----------
  const pop = document.createElement("button");
  pop.className = "sel-pop hidden";
  pop.type = "button";
  document.body.appendChild(pop);
  let picked = null;

  function hidePop() { pop.classList.add("hidden"); picked = null; }

  function checkSelection() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount || $("#sheet").classList.contains("open")) return hidePop();
    const text = sel.toString().replace(/\s+/g, " ").trim();
    const range = sel.getRangeAt(0);
    const host = range.commonAncestorContainer;
    const hostEl = host.nodeType === 1 ? host : host.parentElement;
    // Chỉ trong nội dung trang, không trong ô nhập, và phải là chữ tiếng Anh (1–8 từ)
    if (!hostEl || !hostEl.closest("#view") || hostEl.closest("input, textarea")) return hidePop();
    if (!/[A-Za-z]/.test(text) || text.length > 80 || text.split(" ").length > MAX_WORDS) return hidePop();
    const r = range.getBoundingClientRect();
    if (!r.width && !r.height) return hidePop();
    picked = { text, node: range.startContainer };
    pop.innerHTML = `🔍 Tra & lưu <b>“${esc(text.length > 28 ? text.slice(0, 26) + "…" : text)}”</b>`;
    pop.classList.remove("hidden");
    const w = pop.offsetWidth;
    const left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    const top = r.top > 54 ? r.top - 44 : r.bottom + 8;
    pop.style.left = left + "px";
    pop.style.top = top + "px";
  }

  let selTimer = null;
  document.addEventListener("selectionchange", () => { clearTimeout(selTimer); selTimer = setTimeout(checkSelection, 250); });
  window.addEventListener("scroll", hidePop, { passive: true });
  window.addEventListener("hashchange", hidePop);
  // Nhấn giữ nút không làm mất vùng chọn
  pop.addEventListener("mousedown", (e) => e.preventDefault());
  pop.addEventListener("click", () => {
    if (!picked) return;
    const key = normalize(picked.text);
    const ctx = contextOf(picked.node, picked.text);
    hidePop();
    const sel = window.getSelection(); if (sel) sel.removeAllRanges();
    WS.openLookup(key, { context: ctx, source: pageSource() });
  });

  // ---------- 2. Nút ✎ Ghi từ ----------
  const fab = document.createElement("div");
  fab.className = "qn";
  fab.innerHTML = `
    <div class="qn-panel hidden" id="qn-panel">
      <div class="row between"><b>Ghi từ mới</b><span class="xs muted">Bài đang làm vẫn giữ nguyên</span></div>
      <div class="row" style="margin-top:10px">
        <input class="input" id="qn-in" placeholder="Từ hoặc cụm từ, vd: carry out" autocomplete="off" autocapitalize="off" spellcheck="false" />
        <button class="btn btn-primary" id="qn-go">Tra</button>
      </div>
      <p class="xs muted" style="margin-top:8px">Mẹo: bôi đen chữ ngay trong bài cũng tra được, kể cả cả cụm.</p>
    </div>
    <button class="qn-fab" id="qn-fab" type="button" title="Ghi từ mới (phím N)" aria-label="Ghi từ mới">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>
      <span>Ghi từ</span>
    </button>`;
  document.body.appendChild(fab);
  const panel = $("#qn-panel"), input = $("#qn-in");

  function openPanel() {
    panel.classList.remove("hidden");
    const s = window.getSelection();
    const t = s ? s.toString().trim() : "";
    if (t && t.split(/\s+/).length <= MAX_WORDS) input.value = t;
    setTimeout(() => input.focus(), 30);
  }
  function closePanel() { panel.classList.add("hidden"); }
  function go() {
    const v = input.value.trim();
    if (!v) return input.focus();
    closePanel(); input.value = "";
    WS.openLookup(normalize(v), { context: "", source: pageSource() });
  }
  $("#qn-fab").onclick = () => (panel.classList.contains("hidden") ? openPanel() : closePanel());
  $("#qn-go").onclick = go;
  input.onkeydown = (e) => { if (e.key === "Enter") go(); if (e.key === "Escape") closePanel(); };
  document.addEventListener("mousedown", (e) => { if (!fab.contains(e.target)) closePanel(); });
  // Phím N mở nhanh (khi không gõ trong ô nhập)
  document.addEventListener("keydown", (e) => {
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (e.key.toLowerCase() === "n" && !e.ctrlKey && !e.metaKey && !e.altKey && !["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
      e.preventDefault(); openPanel();
    }
  });
})();
