// =========================================================
// WordStreet — ĐỒNG BỘ GIỮA CÁC MÁY (js/sync.js)
// Web không có máy chủ, nên mỗi trình duyệt giữ 1 kho riêng (localStorage).
// File này lưu 1 bản sao dữ liệu học vào GIST RIÊNG TƯ trên tài khoản GitHub của bạn,
// rồi mỗi máy tự: kéo bản trên GitHub về → GỘP với dữ liệu trong máy → đẩy bản đã gộp lên lại.
//
// Cách gộp (merge) từng từ vựng, gọi là "gộp 3 chiều":
//   so sánh bản trong máy (L), bản trên GitHub (R) và bản lần đồng bộ trước (B):
//   - chỉ 1 bên thay đổi so với B → lấy bên đã thay đổi (kể cả khi bên đó đã xóa từ)
//   - cả 2 bên cùng đổi → lấy bản được ôn/sửa gần đây hơn
// Mã truy cập (token) lưu riêng trên máy, KHÔNG nằm trong file sao lưu hay trên gist.
// =========================================================
(function () {
  "use strict";
  const { $, esc, toast } = WS;
  const FILE = "wordstreet-sync.json";
  const CONF_KEY = "wordstreet_sync_v1";       // { token, gistId, login, lastSync }
  const BASE_KEY = "wordstreet_sync_base_v1";  // bản đã đồng bộ lần trước (để gộp 3 chiều)
  const API = "https://api.github.com";
  const PUSH_DELAY = 15000;                    // học xong 15 giây mới đẩy lên (đỡ gọi API liên tục)
  const TOKEN_URL = "https://github.com/settings/tokens/new?scopes=gist&description=WordStreet%20sync";

  // ---------- Lưu cấu hình trên máy ----------
  function conf() { try { return JSON.parse(localStorage.getItem(CONF_KEY)) || null; } catch (e) { return null; } }
  function setConf(c) { try { c ? localStorage.setItem(CONF_KEY, JSON.stringify(c)) : localStorage.removeItem(CONF_KEY); } catch (e) { /* bỏ qua */ } }
  function loadBase() { try { return JSON.parse(localStorage.getItem(BASE_KEY)) || null; } catch (e) { return null; } }
  function saveBase(s) { try { localStorage.setItem(BASE_KEY, JSON.stringify(s)); } catch (e) { /* bộ nhớ đầy: lần sau gộp 2 chiều */ } }

  // ---------- Gọi GitHub API ----------
  async function gh(path, token, opts) {
    const res = await fetch(API + path, Object.assign({
      cache: "no-store",
      headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "Content-Type": "application/json" }
    }, opts || {}));
    if (res.status === 401) throw new Error("Mã truy cập sai hoặc đã hết hạn.");
    if (res.status === 404) throw new Error("Không tìm thấy gist (có thể đã bị xóa) hoặc mã không có quyền gist.");
    if (!res.ok) throw new Error("GitHub báo lỗi " + res.status + ".");
    return res.json();
  }
  async function pull(c) {
    const g = await gh("/gists/" + c.gistId, c.token);
    const f = g.files && g.files[FILE];
    if (!f) return null;
    // File lớn (>1MB) GitHub không trả hết nội dung → tải bản đầy đủ qua raw_url
    const text = f.truncated ? await (await fetch(f.raw_url, { cache: "no-store" })).text() : f.content;
    try { const d = JSON.parse(text); return d && d.version ? d : null; } catch (e) { return null; }
  }
  function push(c, data) {
    return gh("/gists/" + c.gistId, c.token, { method: "PATCH", body: JSON.stringify({ files: { [FILE]: { content: JSON.stringify(data) } } }) });
  }

  // ---------- Gộp dữ liệu ----------
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const keyOf = (w) => String(w.term || "").toLowerCase().trim();
  const touched = (w) => Math.max((w.srs && w.srs.last) || 0, w.mod || 0, w.created || 0);
  const toMap = (arr) => { const m = {}; (arr || []).forEach((w) => { if (w && w.term) m[keyOf(w)] = w; }); return m; };

  function mergeWords(local, remote, base) {
    const L = toMap(local), R = toMap(remote), B = toMap(base);
    const out = [];
    new Set(Object.keys(L).concat(Object.keys(R))).forEach((k) => {
      const l = L[k], r = R[k], b = B[k];
      let pick;
      if (same(l, r)) pick = l;
      else if (same(l, b)) pick = r;          // chỉ máy kia đổi (hoặc đã xóa)
      else if (same(r, b)) pick = l;          // chỉ máy này đổi (hoặc đã xóa)
      else if (!l) pick = r;                  // 1 bên xóa, 1 bên vẫn học tiếp → giữ lại
      else if (!r) pick = l;
      else pick = touched(l) >= touched(r) ? l : r;
      if (pick) out.push(pick);
    });
    return out.sort((a, b) => (b.created || 0) - (a.created || 0));
  }

  // Chuỗi ngày học: nhà học tới hôm qua (3 ngày) + công ty học hôm nay (1 ngày) → nối lại thành 4 ngày
  const dayNum = (s) => { const [y, mo, d] = s.split("-").map(Number); return Math.round(Date.UTC(y, mo - 1, d) / 86400000); };
  function mergeStreak(a, b) {
    if (!a.last) return clone(b); if (!b.last) return clone(a);
    const [newer, older] = a.last >= b.last ? [a, b] : [b, a];
    const startN = dayNum(newer.last) - ((newer.count || 1) - 1);
    const startO = dayNum(older.last) - ((older.count || 1) - 1);
    if (dayNum(older.last) < startN - 1) return clone(newer);       // có ngày nghỉ ở giữa → không nối
    return { count: dayNum(newer.last) - Math.min(startN, startO) + 1, last: newer.last };
  }

  function merge(local, remote, base) {
    base = base || {};
    const m = Object.assign({}, clone(remote), clone(local));
    m.words = clone(mergeWords(local.words, remote.words, base.words));
    m.articlesDone = Object.assign({}, remote.articlesDone, local.articlesDone);
    const arts = {}; (remote.customArticles || []).concat(local.customArticles || []).forEach((a) => (arts[a.id] = a));
    m.customArticles = Object.values(arts);
    m.quizStats = {};
    new Set(Object.keys(local.quizStats || {}).concat(Object.keys(remote.quizStats || {}))).forEach((k) => {
      const a = (local.quizStats || {})[k], b = (remote.quizStats || {})[k];
      m.quizStats[k] = !a ? b : !b ? a : (a.t >= b.t ? a : b); // lấy bản đã làm nhiều câu hơn
    });
    // Sổ câu sai: mỗi câu lấy bản cập nhật sau cùng (sai thêm / đã sửa)
    m.mistakes = {};
    new Set(Object.keys(local.mistakes || {}).concat(Object.keys(remote.mistakes || {}))).forEach((k) => {
      const a = (local.mistakes || {})[k], b = (remote.mistakes || {})[k];
      m.mistakes[k] = !a ? b : !b ? a : ((a.t || 0) >= (b.t || 0) ? a : b);
    });
    // Các lần thi thử: gộp 2 bên theo thời điểm thi (không trùng lặp)
    if (local.tests || remote.tests) {
      const byT = {}; (remote.tests || []).concat(local.tests || []).forEach((x) => (byT[x.t] = x));
      m.tests = Object.values(byT).sort((a, b) => a.t - b.t).slice(-30);
    }
    // Bài Part 3–4 / Part 6 đã làm: lấy điểm cao hơn
    ["p34", "p6"].forEach((k) => {
      if (!local[k] && !remote[k]) return;
      const a = (local[k] || {}).done || {}, b = (remote[k] || {}).done || {}, done = {};
      new Set(Object.keys(a).concat(Object.keys(b))).forEach((id) => (done[id] = Math.max(a[id] || 0, b[id] || 0)));
      m[k] = Object.assign({}, clone(remote[k] || {}), clone(local[k] || {}), { done });
    });
    // Mục tiêu hôm nay: cùng ngày thì lấy số lớn hơn, khác ngày thì lấy ngày mới hơn
    const dl = local.daily || {}, dr = remote.daily || {};
    if (dl.date === dr.date) { m.daily = Object.assign({}, dr, dl); Object.keys(dr).forEach((k) => { if (typeof dr[k] === "number") m.daily[k] = Math.max(dr[k], dl[k] || 0); }); }
    else m.daily = clone((dl.date || "") > (dr.date || "") ? dl : dr);
    m.streak = mergeStreak(local.streak || {}, remote.streak || {});
    if (local.listen || remote.listen) {
      const hl = (local.listen && local.listen.history) || [], hr = (remote.listen && remote.listen.history) || [];
      const h = {}; hr.concat(hl).forEach((x) => (h[[x.date, x.source, x.avg, x.n].join("|")] = x));
      m.listen = Object.assign({}, clone(remote.listen || {}), clone(local.listen || {}), { history: Object.values(h).slice(-60) });
    }
    m.lastBackup = Math.max(local.lastBackup || 0, remote.lastBackup || 0);
    return m;
  }

  // ---------- Đồng bộ ----------
  let busy = false, timer = null, applying = false, status = "off", lastError = "";

  function setStatus(s, err) {
    status = s; lastError = err || "";
    const b = $("#sync-btn");
    if (b) {
      b.dataset.state = s;
      const c = conf();
      b.title = s === "off" ? "Chưa bật đồng bộ giữa các máy"
        : s === "busy" ? "Đang đồng bộ…"
        : s === "error" ? "Lỗi đồng bộ: " + lastError
        : "Đã đồng bộ" + (c && c.lastSync ? " lúc " + new Date(c.lastSync).toLocaleTimeString("vi-VN") : "");
    }
    if ((location.hash || "").startsWith("#sync")) drawPage();
  }

  async function syncNow(opts) {
    opts = opts || {};
    const c = conf();
    if (!c) return setStatus("off");
    if (busy) return;
    busy = true; clearTimeout(timer); timer = null;
    setStatus("busy");
    try {
      const S = WS.S;
      const before = JSON.stringify(S);
      const remote = await pull(c);
      const merged = remote ? merge(S, remote, loadBase()) : clone(S);
      const changedHere = JSON.stringify(merged) !== before;
      if (changedHere) {
        applying = true;                                   // tránh tự hẹn đồng bộ lại vòng lặp
        Object.keys(merged).forEach((k) => (S[k] = merged[k]));
        WS.ensureDay(); WS.save();
        applying = false;
      }
      if (!remote || !same(remote, merged)) await push(c, merged);
      saveBase(merged);
      c.lastSync = Date.now(); setConf(c);
      setStatus("ok");
      if (changedHere && opts.render) WS.refresh();
      if (opts.toast) toast(changedHere ? "Đã đồng bộ, dữ liệu từ máy khác đã được gộp vào." : "Đã đồng bộ. Dữ liệu đã giống nhau.");
    } catch (e) {
      applying = false;
      setStatus("error", e.message || "Không kết nối được GitHub.");
      if (opts.toast) toast("Đồng bộ lỗi: " + (e.message || "không kết nối được GitHub"));
    } finally {
      busy = false;
    }
  }

  // Mỗi lần app lưu dữ liệu → hẹn 15 giây sau đẩy lên
  WS.onSave = () => {
    if (applying || !conf()) return;
    clearTimeout(timer);
    timer = setTimeout(() => syncNow(), PUSH_DELAY);
  };

  // Trang nào an toàn để vẽ lại khi có dữ liệu mới (không cắt ngang bài đang học/làm)
  const safeToRender = () => ["", "today", "glossary", "words", "sync"].includes((location.hash || "").slice(1).split("/")[0]);

  document.addEventListener("visibilitychange", () => {
    if (!conf()) return;
    if (document.visibilityState === "hidden") { if (timer) syncNow(); }   // rời tab → đẩy ngay
    else syncNow({ render: safeToRender() });                            // quay lại tab → kéo bản mới
  });

  // ---------- Kết nối lần đầu ----------
  async function connect(token) {
    token = token.trim();
    if (!token) return;
    setStatus("busy");
    try {
      const user = await gh("/user", token);
      const gists = await gh("/gists?per_page=100", token);
      let g = gists.find((x) => x.files && x.files[FILE]);
      if (!g) {
        g = await gh("/gists", token, { method: "POST", body: JSON.stringify({
          description: "WordStreet: dữ liệu học đồng bộ giữa các máy (đừng xóa)", public: false,
          files: { [FILE]: { content: JSON.stringify(WS.S) } }
        }) });
      }
      setConf({ token, gistId: g.id, login: user.login, lastSync: 0 });
      await syncNow({ render: false, toast: true });
    } catch (e) {
      setConf(null);
      setStatus("off");
      toast("Kết nối thất bại: " + (e.message || "kiểm tra lại mã"));
      drawPage();
    }
  }

  // ---------- Trang #sync ----------
  function drawPage() {
    const c = conf();
    const view = $("#view");
    if (!c) {
      view.innerHTML = `
        <div class="page-head"><div><h1>Đồng bộ giữa các máy</h1>
          <p>Học ở nhà, mở máy công ty vẫn thấy đúng tiến độ. Dữ liệu học được lưu vào 1 <b>gist riêng tư</b> (file bí mật) trong tài khoản GitHub của bạn, mỗi máy tự kéo về và gộp lại.</p></div></div>
        <div class="grid grid-2 sync-grid">
          <div class="card stack">
            <h3>Bước 1 · Tạo mã truy cập GitHub</h3>
            <ol class="sync-steps">
              <li>Bấm nút dưới (đăng nhập GitHub nếu được hỏi).</li>
              <li><b>Expiration</b>: chọn <b>No expiration</b> (hoặc 1 năm).</li>
              <li>Ô <b>gist</b> đã được tick sẵn. <b>Không tick thêm ô nào khác.</b></li>
              <li>Kéo xuống cuối, bấm <b>Generate token</b>, rồi copy mã bắt đầu bằng <code>ghp_</code>.</li>
            </ol>
            <a class="btn" href="${TOKEN_URL}" target="_blank" rel="noopener">Mở trang tạo mã trên GitHub ↗</a>
          </div>
          <div class="card stack">
            <h3>Bước 2 · Dán mã vào đây</h3>
            <input class="input mono" id="sy-token" type="password" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" autocomplete="off" spellcheck="false" />
            <button class="btn btn-primary" id="sy-connect">${status === "busy" ? "Đang kết nối…" : "Kết nối & đồng bộ"}</button>
            <p class="xs muted">Làm 2 bước này <b>trên từng máy</b> (nhà, công ty, điện thoại). Máy nào kết nối sau sẽ tự gộp dữ liệu với máy trước, không mất từ nào.</p>
          </div>
        </div>
        <div class="card flat sync-note small">
          🔒 <b>An toàn:</b> mã chỉ có quyền đọc/ghi <i>gist</i>, không đụng được vào code hay repo của bạn. Mã chỉ lưu trong trình duyệt của máy này, không nằm trong file sao lưu.
          Máy dùng chung thì bấm "Ngắt kết nối" khi xong. Lộ mã thì vào <a href="https://github.com/settings/tokens" target="_blank" rel="noopener">github.com/settings/tokens</a> bấm Delete là mã hết tác dụng ngay.
        </div>`;
      const btn = $("#sy-connect"), inp = $("#sy-token");
      btn.disabled = status === "busy";
      btn.onclick = () => connect(inp.value);
      inp.onkeydown = (e) => { if (e.key === "Enter") connect(inp.value); };
      return;
    }
    const S = WS.S;
    const label = status === "busy" ? "Đang đồng bộ…" : status === "error" ? "Lỗi: " + esc(lastError)
      : c.lastSync ? "Đồng bộ lần cuối lúc " + new Date(c.lastSync).toLocaleString("vi-VN") : "Chưa đồng bộ";
    view.innerHTML = `
      <div class="page-head"><div><h1>Đồng bộ giữa các máy</h1>
        <p>Đã bật. App tự đồng bộ khi bạn mở web, khi quay lại tab, và khoảng 15 giây sau mỗi lần học.</p></div></div>
      <div class="card sync-status" data-state="${status}">
        <div class="row" style="gap:12px;align-items:flex-start">
          <span class="sync-big-dot"></span>
          <div style="flex:1;min-width:0">
            <b>${label}</b>
            <p class="small muted" style="margin-top:4px">Tài khoản GitHub: <b>${esc(c.login || "")}</b> ·
              <a href="https://gist.github.com/${esc(c.gistId)}" target="_blank" rel="noopener">xem gist dữ liệu ↗</a></p>
            <p class="small muted">Trong máy này: ${S.words.length} từ · ${Object.keys(S.articlesDone || {}).length} bài đã đọc · chuỗi ${(S.streak && S.streak.count) || 0} ngày</p>
          </div>
        </div>
        <div class="row" style="margin-top:16px;flex-wrap:wrap">
          <button class="btn btn-primary" id="sy-now" ${status === "busy" ? "disabled" : ""}>Đồng bộ ngay</button>
          <button class="btn btn-ghost" id="sy-off">Ngắt kết nối trên máy này</button>
        </div>
      </div>
      <div class="card flat sync-note small">
        💡 Mỗi lần đồng bộ, GitHub giữ lại 1 phiên bản cũ của gist (tab <i>Revisions</i>), lỡ có gì vẫn xem lại được.
        Ngắt kết nối chỉ xóa mã trên máy này, dữ liệu học trong máy và trên GitHub vẫn còn nguyên.
      </div>`;
    $("#sy-now").onclick = () => syncNow({ render: false, toast: true });
    $("#sy-off").onclick = () => {
      if (!confirm("Ngắt đồng bộ trên máy này? (Dữ liệu không bị xóa.)")) return;
      setConf(null); try { localStorage.removeItem(BASE_KEY); } catch (e) { /* bỏ qua */ }
      setStatus("off"); drawPage();
    };
  }

  // Cho phép kiểm thử hàm gộp từ bên ngoài (không dùng trong app)
  WS.sync = { merge, syncNow };
  WS.registerPage("sync", drawPage);

  // Mở web → đồng bộ 1 lần
  setStatus(conf() ? "ok" : "off");
  if (conf()) setTimeout(() => syncNow({ render: safeToRender() }), 300);
})();
