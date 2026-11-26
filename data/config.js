// ============================================================
// WordStreet - CÀI ĐẶT CHUNG
// Bạn có thể sửa chữ trong dấu ngoặc kép "..." và các con số.
// Đừng xóa dấu phẩy , ở cuối mỗi dòng.
// ============================================================
window.WS_CONFIG = {
  appName: "WordStreet",
  tagline: "Tự học TOEIC 800 mỗi ngày",

  // Mục tiêu mỗi ngày
  goals: {
    articles: 1,   // số bài báo cần đọc
    newWords: 10,  // số từ mới cần học mỗi ngày (= 1 bài học)
    reviews: 20,   // số thẻ cần ôn
    quiz: 10,      // số câu luyện đề
    listen: 10     // số câu luyện nghe chép chính tả
  },

  accent: "en-US",          // giọng đọc mặc định: "en-US" (Mỹ) hoặc "en-GB" (Anh)
  backupReminderDays: 7     // nhắc tải file backup sau mỗi 7 ngày
};

// Chủ đề THUẬT NGỮ TÀI CHÍNH (id không được đổi, tên hiển thị đổi thoải mái)
window.WS_TOPICS = [
  { id: "macro",     name: "Kinh tế vĩ mô",              en: "Macroeconomics",        color: "#3b6fb6" },
  { id: "monetary",  name: "Tiền tệ & Ngân hàng TW",     en: "Monetary Policy",       color: "#2b8a9e" },
  { id: "stocks",    name: "Chứng khoán & Đầu tư",       en: "Stocks & Investing",    color: "#2f8a78" },
  { id: "corporate", name: "Tài chính doanh nghiệp",     en: "Corporate Finance",     color: "#6366b5" },
  { id: "news",      name: "Ngôn ngữ tin tài chính",     en: "Financial News",        color: "#8a68b0" },
  { id: "fx",        name: "Forex, hàng hóa & crypto",   en: "FX, Commodities, Crypto", color: "#6b7a8c" }
];

// Chủ đề bộ 600 TỪ VỰNG TOEIC (dữ liệu nằm trong data/toeic600-1.js, -2.js, -3.js)
window.WS_TOEIC_TOPICS = [
  { id: "t-office",   name: "Văn phòng",            en: "Office & Admin",          color: "#4a78b5" },
  { id: "t-hr",       name: "Nhân sự",              en: "Hiring & HR",             color: "#3f8f8a" },
  { id: "t-meet",     name: "Họp & giao tiếp",      en: "Meetings",                color: "#6a6fb8" },
  { id: "t-sales",    name: "Marketing & bán hàng", en: "Marketing & Sales",       color: "#b8783f" },
  { id: "t-order",    name: "Mua hàng & giao nhận", en: "Purchasing & Shipping",   color: "#8a7a5c" },
  { id: "t-travel",   name: "Du lịch & công tác",   en: "Travel",                  color: "#2f8fb0" },
  { id: "t-dining",   name: "Nhà hàng & sự kiện",   en: "Dining & Events",         color: "#b5655f" },
  { id: "t-money",    name: "Ngân hàng & kế toán",  en: "Banking & Accounting",    color: "#3f8a5f" },
  { id: "t-factory",  name: "Sản xuất",             en: "Manufacturing",           color: "#7a8594" },
  { id: "t-property", name: "Nhà ở & bảo trì",      en: "Property & Maintenance",  color: "#9a6fae" },
  { id: "t-health",   name: "Sức khỏe & bảo hiểm",  en: "Health & Insurance",      color: "#b85c7a" },
  { id: "t-contract", name: "Hợp đồng & công nghệ", en: "Contracts & IT",          color: "#5a6478" }
];

// Chủ đề bộ TỪ VỰNG MỞ RỘNG (dữ liệu trong data/toeic-extra-1.js ... -4.js)
window.WS_TOEIC_EXTRA_TOPICS = [
  { id: "x-p56",      name: "Part 5&6 thiết yếu",        en: "Part 5&6 Essentials",      color: "#2c5a94" },
  { id: "x-contract", name: "Hợp đồng & bảo hành",       en: "Contracts & Warranties",   color: "#5a6478" },
  { id: "x-market",   name: "Marketing & mua sắm",       en: "Marketing & Shopping",     color: "#b8783f" },
  { id: "x-plan",     name: "Kế hoạch & hội họp",        en: "Planning & Meetings",      color: "#6a6fb8" },
  { id: "x-tech",     name: "Máy tính & văn phòng",      en: "Computers & Office",       color: "#4a78b5" },
  { id: "x-job",      name: "Tuyển dụng & đãi ngộ",      en: "Jobs & Benefits",          color: "#3f8f8a" },
  { id: "x-ship",     name: "Đặt hàng & kho vận",        en: "Orders & Inventory",       color: "#8a7a5c" },
  { id: "x-finance",  name: "Ngân hàng, kế toán & thuế", en: "Banking & Accounting",     color: "#3f8a5f" },
  { id: "x-product",  name: "Nhà đất & sản phẩm",        en: "Property & Products",      color: "#9a6fae" },
  { id: "x-food",     name: "Ăn uống & sự kiện",         en: "Dining & Events",          color: "#b5655f" },
  { id: "x-travel",   name: "Du lịch & đi lại",          en: "Travel",                   color: "#2f8fb0" },
  { id: "x-arts",     name: "Phim, kịch & âm nhạc",      en: "Entertainment",            color: "#b85c7a" }
];

// Chủ đề bộ CỤM TỪ (dữ liệu trong data/phrases.js)
window.WS_PHRASE_TOPICS = [
  { id: "p-phrasal", name: "Phrasal verbs",            en: "Phrasal Verbs",            color: "#4a78b5" },
  { id: "p-colloc",  name: "Collocations",             en: "Collocations",             color: "#3f8f8a" },
  { id: "p-idiom",   name: "Idioms công sở",           en: "Business Idioms",          color: "#b8783f" }
];
