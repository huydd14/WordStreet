// ============================================================
// WordStreet - TOEIC PART 6: ĐIỀN VÀO ĐOẠN VĂN (Text completion)
// ------------------------------------------------------------
// Mỗi đoạn có 4 chỗ trống. 3 chỗ là từ/cụm từ, 1 chỗ là CẢ CÂU (chọn câu hợp ngữ cảnh).
// Khác Part 5: phải đọc cả đoạn, vì đáp án thường phụ thuộc câu trước/câu sau
// (thì của động từ, đại từ "it/they", từ nối "however/therefore"...).
//
// Cách thêm đoạn mới: chép 1 khối { ... } rồi sửa.
//   paragraphs : các đoạn văn; chỗ trống ghi {1}, {2}, {3}, {4}
//   qs         : 4 câu theo thứ tự chỗ trống { type, options (4), answer (0–3), explain }
// ============================================================
window.WS_TOEIC_PART6 = [
  {
    id: "p6-gym", level: "B1", style: "Notice", title: "Thông báo phòng gym",
    paragraphs: [
      "To all members of City Fitness Center:",
      "Starting Monday, June 3, the swimming pool will be closed for two weeks {1} cleaning and repairs. During this time, members can use the pool at our Riverside branch free of charge. {2}",
      "We will also use this time to replace the old lockers in the changing rooms. The new lockers {3} with electronic keys instead of coins.",
      "We are sorry for any inconvenience and thank you for your {4}."
    ],
    qs: [
      { type: "Grammar", options: ["because", "for", "since", "although"], answer: 1, explain: "Sau chỗ trống là cụm danh từ 'cleaning and repairs' → cần giới từ. 'For' = để (chỉ mục đích). 'Because/although' phải đi với mệnh đề." },
      { type: "Sentence", options: ["Simply show your membership card at the front desk.", "The pool was built ten years ago.", "Swimming lessons are very popular with children.", "Our prices will increase next year."], answer: 0, explain: "Câu trước nói được dùng hồ bơi chi nhánh Riverside miễn phí → câu tiếp hợp lý là hướng dẫn cách dùng: chỉ cần đưa thẻ hội viên. Các câu khác không nối ý." },
      { type: "Grammar", options: ["open", "opened", "will open", "opening"], answer: 2, explain: "Tủ mới chưa có, việc sắp diễn ra → thì TƯƠNG LAI 'will open'. Đây là kiểu bẫy Part 6: phải nhìn ngữ cảnh 'will also use this time to replace' mới biết thì." },
      { type: "Vocabulary", options: ["patience", "patient", "patiently", "patients"], answer: 0, explain: "Sau 'your' cần danh từ. 'Thank you for your patience' = cảm ơn vì đã kiên nhẫn – câu kết kinh điển. 'Patients' = bệnh nhân." }
    ]
  },
  {
    id: "p6-email-order", level: "B1", style: "E-mail", title: "Email xác nhận đơn hàng",
    paragraphs: [
      "Dear Ms. Alvarez,",
      "Thank you for your order of 200 printed notebooks. We are pleased to {1} that production has already started.",
      "As you requested, your company logo will appear on the front cover. {2} we will add your website address on the back at no extra cost.",
      "The notebooks will be shipped on May 20 and should arrive within three business days. {3}",
      "If you have any questions, please do not hesitate to {4} me.",
      "Best regards,\nPeter Wong, Customer Service"
    ],
    qs: [
      { type: "Vocabulary", options: ["confirm", "remind", "require", "receive"], answer: 0, explain: "'We are pleased to confirm that…' = vui mừng xác nhận rằng… 'Remind' cần tân ngữ người (remind you that)." },
      { type: "Grammar", options: ["However,", "In addition,", "Instead,", "Otherwise,"], answer: 1, explain: "Câu trước: logo ở bìa trước; câu này: thêm địa chỉ web ở bìa sau → THÊM thông tin → 'In addition'. 'However' dùng khi ý trái ngược." },
      { type: "Sentence", options: ["You will receive a tracking number by e-mail on that day.", "Our factory was founded in 1985.", "Notebooks are a popular gift.", "Please pay in cash when you visit our store."], answer: 0, explain: "Câu trước nói ngày gửi hàng → câu sau hợp lý: sẽ nhận mã theo dõi đơn hàng hôm đó." },
      { type: "Vocabulary", options: ["contact", "contacting", "contacted", "contacts"], answer: 0, explain: "'Hesitate to + V nguyên mẫu' → 'contact'. 'Do not hesitate to contact me' = cứ liên hệ tôi." }
    ]
  },
  {
    id: "p6-job-ad", level: "B1", style: "Advertisement", title: "Tin tuyển dụng",
    paragraphs: [
      "Harbor Café is looking for a part-time barista to join our friendly team. The {1} candidate will have at least one year of experience making coffee drinks.",
      "Working hours are flexible, but applicants must be {2} on weekends. {3}",
      "To apply, please send your résumé to jobs@harborcafe.com by April 30. Only candidates who are selected for an interview {4}."
    ],
    qs: [
      { type: "Vocabulary", options: ["ideal", "idea", "ideally", "ideas"], answer: 0, explain: "Đứng giữa 'The' và danh từ 'candidate' → cần TÍNH TỪ: ideal (lý tưởng). 'The ideal candidate' rất hay gặp trong tin tuyển dụng." },
      { type: "Vocabulary", options: ["available", "possible", "comfortable", "valuable"], answer: 0, explain: "'Be available on weekends' = có thể đi làm cuối tuần. 'Possible' không dùng cho người." },
      { type: "Sentence", options: ["We offer free meals during every shift and a staff discount.", "Our café opened in a different city.", "Coffee prices have risen this year.", "Please return your uniform after work."], answer: 0, explain: "Đoạn đang nói về điều kiện làm việc → câu nói về quyền lợi (bữa ăn miễn phí, giảm giá nhân viên) nối ý tự nhiên." },
      { type: "Grammar", options: ["will contact", "will be contacted", "have contacted", "are contacting"], answer: 1, explain: "Ứng viên ĐƯỢC liên hệ (không tự liên hệ) → BỊ ĐỘNG tương lai: 'will be contacted'." }
    ]
  },
  {
    id: "p6-memo-policy", level: "B2", style: "Memo", title: "Thông báo nội bộ: chính sách chi phí",
    paragraphs: [
      "To: All Staff\nFrom: Finance Department\nSubject: Changes to expense reports",
      "Beginning next month, all expense reports must be submitted through the new online system. Paper forms will no longer be {1}.",
      "The new system allows employees to upload photos of receipts directly from their phones. {2}, managers will be able to approve requests much more quickly.",
      "{3} A short guide explaining each step is attached to this memo. Employees who {4} questions about the system should contact Mr. Lee in the Finance Department."
    ],
    qs: [
      { type: "Vocabulary", options: ["accepted", "accepting", "acceptable", "acceptance"], answer: 0, explain: "'Will no longer be + V3' (bị động) → 'accepted': mẫu giấy sẽ không còn được chấp nhận. 'Acceptable' là tính từ, nghĩa 'chấp nhận được', không hợp." },
      { type: "Grammar", options: ["As a result", "For example", "Nevertheless", "In contrast"], answer: 0, explain: "Tải ảnh hóa đơn trực tiếp → KẾT QUẢ là duyệt nhanh hơn → 'As a result'." },
      { type: "Sentence", options: ["We understand that learning a new system takes time.", "The finance department moved to the third floor.", "Last year's profits were higher than expected.", "Paper is becoming more expensive."], answer: 0, explain: "Câu sau nhắc tới hướng dẫn từng bước đính kèm → câu trước hợp lý: 'biết là học hệ thống mới cần thời gian'." },
      { type: "Grammar", options: ["has", "have", "having", "to have"], answer: 1, explain: "Chủ ngữ 'Employees who…' số nhiều → 'have'. Bẫy: nhiều người chọn 'has' vì nhìn chữ 'who'." }
    ]
  },
  {
    id: "p6-press", level: "B2", style: "Press release", title: "Thông cáo báo chí",
    paragraphs: [
      "LONDON (March 2) — GreenWay Motors announced today that it will open a new factory in northern England next year. The factory is expected to {1} around 800 new jobs.",
      "The company has seen strong demand for its electric scooters, {2} sales doubled last year. {3}",
      "\"This investment shows our long-term commitment to the region,\" said CEO Laura Mills. Construction will begin in May, and the factory is scheduled to be fully {4} by the end of next year."
    ],
    qs: [
      { type: "Vocabulary", options: ["create", "creative", "creation", "creatively"], answer: 0, explain: "'Be expected to + V nguyên mẫu' → 'create' (tạo ra việc làm). 'Create jobs' là collocation quen thuộc." },
      { type: "Grammar", options: ["which", "whose", "where", "what"], answer: 1, explain: "'…electric scooters, whose sales doubled' = những chiếc xe mà DOANH SỐ CỦA CHÚNG tăng gấp đôi. 'Whose' chỉ sở hữu." },
      { type: "Sentence", options: ["The new factory will allow the company to meet this demand.", "Electric scooters were invented many years ago.", "Ms. Mills started her career as an engineer.", "Many people prefer to travel by train."], answer: 0, explain: "Câu trước nói nhu cầu tăng mạnh → câu tiếp: nhà máy mới giúp đáp ứng nhu cầu đó. 'This demand' nối thẳng với 'strong demand'." },
      { type: "Vocabulary", options: ["operational", "operation", "operate", "operator"], answer: 0, explain: "Sau 'be fully' cần TÍNH TỪ → 'operational' (đi vào hoạt động)." }
    ]
  },
  {
    id: "p6-letter-complaint", level: "B2", style: "Letter", title: "Thư trả lời khiếu nại",
    paragraphs: [
      "Dear Mr. Kowalski,",
      "Thank you for your letter regarding your recent stay at the Grand Plaza Hotel. I was sorry to read that the air conditioning in your room was not working {1}.",
      "We have since inspected the system and replaced several parts. {2} To apologize for the inconvenience, we would like to offer you a {3} night's stay at any of our hotels.",
      "Please present this letter when you make your reservation. We look forward to {4} you again.",
      "Sincerely,\nNina Park, Guest Relations Manager"
    ],
    qs: [
      { type: "Vocabulary", options: ["proper", "properly", "property", "proportion"], answer: 1, explain: "Bổ nghĩa cho động từ 'was not working' → cần TRẠNG TỪ: 'properly' (hoạt động bình thường, đúng cách)." },
      { type: "Sentence", options: ["It should now work without any problems.", "Our hotel has 300 rooms.", "Air conditioning is expensive to install.", "Many guests visit us in summer."], answer: 0, explain: "Vừa thay linh kiện → câu tiếp: giờ đã hoạt động bình thường. 'It' thay cho 'the system'." },
      { type: "Vocabulary", options: ["complimentary", "complementary", "competitive", "compulsory"], answer: 0, explain: "'Complimentary' = miễn phí (tặng). Bẫy kinh điển với 'complementary' (bổ sung cho nhau) – chỉ khác 1 chữ cái." },
      { type: "Grammar", options: ["welcome", "welcoming", "welcomed", "be welcomed"], answer: 1, explain: "'Look forward to + V-ing' ('to' ở đây là giới từ) → 'welcoming'. Rất hay ra trong đề." }
    ]
  }
];
