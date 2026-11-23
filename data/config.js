// ============================================================
// FinFluent - CÀI ĐẶT CHUNG
// Bạn có thể sửa chữ trong dấu ngoặc kép "..." và các con số.
// Đừng xóa dấu phẩy , ở cuối mỗi dòng.
// ============================================================
window.FF_CONFIG = {
  appName: "FinFluent",
  tagline: "English for Finance · C1 & TOEIC 800+",

  // Mục tiêu mỗi ngày
  goals: {
    articles: 1,   // số bài báo cần đọc
    newWords: 5,   // số từ mới cần lưu
    reviews: 20,   // số thẻ cần ôn
    quiz: 10       // số câu luyện đề
  },

  accent: "en-US",          // giọng đọc mặc định: "en-US" (Mỹ) hoặc "en-GB" (Anh)
  backupReminderDays: 7     // nhắc tải file backup sau mỗi 7 ngày
};

// Danh sách chủ đề (id không được đổi, tên hiển thị đổi thoải mái)
window.FF_TOPICS = [
  { id: "macro",     name: "Kinh tế vĩ mô",              en: "Macroeconomics",        color: "#2f6fdb" },
  { id: "monetary",  name: "Tiền tệ & Ngân hàng TW",     en: "Monetary Policy",       color: "#0f8a7e" },
  { id: "stocks",    name: "Chứng khoán & Đầu tư",       en: "Stocks & Investing",    color: "#2e9a4f" },
  { id: "corporate", name: "Tài chính doanh nghiệp",     en: "Corporate Finance",     color: "#c27a12" },
  { id: "news",      name: "Ngôn ngữ tin tài chính",     en: "Financial News",        color: "#c2334d" },
  { id: "fx",        name: "Forex, hàng hóa & crypto",   en: "FX, Commodities, Crypto", color: "#1f8fb8" }
];
