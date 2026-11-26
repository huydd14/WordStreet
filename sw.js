/* ============================================================
   WordStreet — Service worker (cho phép cài web như app & mở khi mất mạng)
   ------------------------------------------------------------
   Cách làm: "mạng trước, bộ nhớ sau".
   - Có mạng: luôn tải bản MỚI NHẤT (nên mỗi lần push code lên GitHub là thấy ngay),
     đồng thời lưu 1 bản vào bộ nhớ máy.
   - Mất mạng: lấy bản đã lưu ra dùng.
   Chỉ lưu file của chính web này. Tra từ, dịch, đồng bộ GitHub vẫn cần mạng.
   ============================================================ */
const CACHE = "wordstreet-v2";
const SHELL = [
  "./", "index.html", "css/style.css", "manifest.webmanifest",
  "js/app.js", "js/listen.js", "js/learn.js", "js/part2.js", "js/part34.js", "js/part6.js", "js/test.js", "js/sync.js", "js/quicknote.js",
  "data/config.js", "data/terms.js", "data/toeic600-1.js", "data/toeic600-2.js", "data/toeic600-3.js",
  "data/toeic-extra-1.js", "data/toeic-extra-2.js", "data/toeic-extra-3.js", "data/toeic-extra-4.js",
  "data/phrases.js", "data/toeic-reading.js", "data/toeic-quiz.js", "data/toeic-quiz-2.js", "data/articles.js", "data/quiz.js",
  "data/toeic-part2.js", "data/toeic-part34.js", "data/toeic-part6.js",
  "icons/icon-192.png", "icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // API bên ngoài: để trình duyệt tự xử lý
  const isPage = e.request.mode === "navigate";
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
        return res;
      })
      // Mất mạng: lấy bản đã lưu. CHỈ trả trang chủ khi đang mở trang (không bao giờ trả HTML thay cho file .js/.css,
      // vì như vậy trình duyệt sẽ chạy nhầm HTML như JavaScript → các tính năng không chạy)
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || (isPage ? caches.match("index.html") : Response.error())))
  );
});
