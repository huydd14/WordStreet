// ============================================================
// WordStreet - BÀI ĐỌC TOEIC (đi từ dễ đến khó)
// ------------------------------------------------------------
// stage: 1 = Bậc 1 (B1, ~100 từ: thông báo, quảng cáo, email ngắn, tin nhắn)
//        2 = Bậc 2 (B1+, ~170 từ: memo, thư, tin tuyển dụng, trang web)
//        3 = Bậc 3 (B2, ~250 từ: bài báo, thư chính thức, thông cáo báo chí)
// step: thứ tự nên đọc (1, 2, 3...). App sẽ gợi ý bài tiếp theo theo số này.
// topic: id trong WS_TOEIC_TOPICS (data/config.js)
// Câu hỏi: "answer" là chỉ số 0-3 của đáp án đúng.
// ============================================================
window.WS_TOEIC_ARTICLES = [
  // =================== BẬC 1 · B1 ===================
  {
    id: "toeic-elevator-notice", step: 1, stage: 1, level: "B1", topic: "t-property", style: "Notice",
    title: "Elevator Maintenance This Saturday",
    summary: "Thông báo ngắn của ban quản lý tòa nhà về việc bảo trì thang máy vào thứ Bảy. Dạng bài quen thuộc nhất của TOEIC Part 7.",
    paragraphs: [
      "To all tenants of the Harbor View Office Building:",
      "Routine maintenance will be carried out on both elevators this Saturday, May 18, from 8:00 a.m. to 4:00 p.m. During this time, the elevators will be out of order, and all visitors and staff will need to use the stairs.",
      "The main entrance will remain open as usual. Deliveries scheduled for Saturday should be moved to Friday or Monday if possible.",
      "We apologize for any inconvenience. If you have questions, please contact the building management office at extension 100.",
      "Thank you for your patience."
    ],
    questions: [
      { q: "What is the purpose of the notice?", options: ["To announce a new entrance", "To inform tenants about elevator work", "To introduce a new building manager", "To ask tenants to move offices"], answer: 1, explain: "Ngay câu đầu đoạn 2: 'Routine maintenance will be carried out on both elevators'. Dạng câu hỏi mục đích (purpose) thường có đáp án ở 1–2 câu đầu bài." },
      { q: "What are tenants asked to do?", options: ["Use a different entrance", "Work from home on Saturday", "Reschedule Saturday deliveries", "Call the elevator company"], answer: 2, explain: "Đoạn 3: 'Deliveries scheduled for Saturday should be moved to Friday or Monday'. 'Moved to another day' được diễn đạt lại (paraphrase) thành 'reschedule'. Lối vào chính vẫn mở nên A sai." },
      { q: "The phrase \"out of order\" in paragraph 2 is closest in meaning to", options: ["not working", "very busy", "in the wrong place", "newly installed"], answer: 0, explain: "'Out of order' = bị hỏng, không hoạt động. Thang máy đang bảo trì nên không dùng được, mọi người phải đi cầu thang bộ." }
    ]
  },
  {
    id: "toeic-cafe-opening", step: 2, stage: 1, level: "B1", topic: "t-sales", style: "Advertisement",
    title: "Grand Opening: Green Leaf Café",
    summary: "Quảng cáo khai trương quán cà phê kèm ưu đãi. Chú ý các con số, ngày giờ và điều kiện khuyến mãi, vì TOEIC rất hay hỏi chi tiết này.",
    paragraphs: [
      "Green Leaf Café is opening its doors on Monday, June 3, at 45 Market Street, right across from the central library!",
      "To celebrate, we are offering a free pastry with any coffee purchase during our first week. Customers who sign up for our loyalty program will also receive 10% off every order for the rest of the month.",
      "We serve fresh sandwiches, salads, and homemade soups, and all of our coffee beans come from local farms. Vegetarian options are available every day.",
      "Opening hours are 7:00 a.m. to 7:00 p.m., Monday to Saturday. Free Wi-Fi is available for all customers. Need a space for a small meeting? Our private room can be reserved by calling 555-0182."
    ],
    questions: [
      { q: "Where is Green Leaf Café located?", options: ["Inside the central library", "Next to a farm", "Opposite the library", "On the top floor of a hotel"], answer: 2, explain: "Đoạn 1: 'right across from the central library'. 'Across from' = 'opposite' (đối diện). Đáp án A là bẫy vì có chữ 'library' nhưng sai vị trí." },
      { q: "How can customers get a discount for the rest of the month?", options: ["By buying a pastry", "By joining the loyalty program", "By visiting on a Monday", "By reserving the private room"], answer: 1, explain: "Đoạn 2: 'Customers who sign up for our loyalty program will also receive 10% off'. 'Sign up for' = 'join'. Bánh ngọt miễn phí chỉ là quà tặng tuần đầu." },
      { q: "What is NOT mentioned about the café?", options: ["It has free Wi-Fi", "It opens on Sundays", "It uses local coffee beans", "It serves vegetarian food"], answer: 1, explain: "Dạng câu hỏi NOT: dò từng đáp án. Bài ghi 'Monday to Saturday' nên quán KHÔNG mở Chủ nhật. Wi-Fi, cà phê địa phương và món chay đều có nhắc." }
    ]
  },
  {
    id: "toeic-welcome-email", step: 3, stage: 1, level: "B1", topic: "t-hr", style: "Email",
    title: "Welcome to the Team!",
    summary: "Email chào mừng nhân viên mới, kèm lịch ngày làm việc đầu tiên. Học các từ về nhân sự: orientation, paperwork, supervisor…",
    paragraphs: [
      "To: Minh Pham | From: Laura Chen, Human Resources | Subject: Your first day",
      "Dear Minh,",
      "Welcome to Brightway Marketing! We are very happy that you are joining our design team. Your first day will be Monday, July 1.",
      "Please arrive at the front desk at 8:45 a.m. and bring a photo ID so we can prepare your staff badge. In the morning, you will attend a short orientation session where you will learn about company policies and complete some paperwork.",
      "After lunch, your supervisor, Daniel Ortiz, will show you your workstation and introduce you to your colleagues. Lunch on your first day will be provided by the company.",
      "If you have any questions before Monday, feel free to reply to this email.",
      "Best regards,",
      "Laura Chen"
    ],
    questions: [
      { q: "Why did Ms. Chen write to Mr. Pham?", options: ["To offer him a job interview", "To explain his first-day schedule", "To ask him to change his start date", "To request his design portfolio"], answer: 1, explain: "Tiêu đề 'Your first day' và cả email mô tả việc cần làm ngày đầu: đến lúc nào, mang gì, buổi sáng và buổi chiều làm gì." },
      { q: "What should Mr. Pham bring on Monday?", options: ["His lunch", "A signed contract", "A form of identification", "His own computer"], answer: 2, explain: "Đoạn 4: 'bring a photo ID'. 'Photo ID' được paraphrase thành 'a form of identification' (giấy tờ tùy thân). Bữa trưa công ty lo nên A sai." },
      { q: "Who is Daniel Ortiz?", options: ["Mr. Pham's new manager", "A human resources assistant", "The company's receptionist", "A new employee"], answer: 0, explain: "Đoạn 5: 'your supervisor, Daniel Ortiz'. 'Supervisor' = người quản lý trực tiếp, tức 'manager'." }
    ]
  },
  {
    id: "toeic-late-text", step: 4, stage: 1, level: "B1", topic: "t-travel", style: "Text messages",
    title: "Running Late for the Client Meeting",
    summary: "Chuỗi tin nhắn giữa hai đồng nghiệp. Đây là dạng 'text message chain' trong TOEIC, rất hay hỏi câu 'What does X mean when she writes…'.",
    paragraphs: [
      "Kevin Tran (9:12 a.m.): Hi Sara, my train is delayed because of a signal problem. I don't think I'll get to the office before 10:00.",
      "Sara Lim (9:14 a.m.): Oh no. The meeting with Mr. Duval starts at 9:30. Should I ask him to reschedule?",
      "Kevin Tran (9:15 a.m.): Please don't. He's flying back to Paris this afternoon. Could you start without me? The slides are in the shared folder.",
      "Sara Lim (9:16 a.m.): Sure thing. I'll go over the sales figures first, and you can present the new product line when you arrive.",
      "Kevin Tran (9:17 a.m.): Perfect. Thanks a lot. I'll text you when I'm close."
    ],
    questions: [
      { q: "Why is Mr. Tran going to be late?", options: ["He missed his flight", "His train is not on time", "He forgot about the meeting", "He is meeting another client"], answer: 1, explain: "Tin nhắn 9:12: 'my train is delayed'. 'Delayed' = không đúng giờ. Người bay về Paris là ông Duval chứ không phải Kevin." },
      { q: "Why does Mr. Tran not want to reschedule the meeting?", options: ["Mr. Duval is leaving later that day", "The slides are not ready", "Ms. Lim is busy tomorrow", "The meeting room is booked"], answer: 0, explain: "Tin nhắn 9:15: 'He's flying back to Paris this afternoon', tức khách sẽ rời đi trong ngày nên không dời lịch được." },
      { q: "At 9:16 a.m., what does Ms. Lim mean when she writes, \"Sure thing\"?", options: ["She is sure the client will wait", "She agrees to begin the meeting", "She has found the sales figures", "She will reschedule the meeting"], answer: 1, explain: "'Sure thing' = 'Được thôi / Chắc chắn rồi', trả lời cho câu nhờ 'Could you start without me?'. Dạng câu hỏi ý nghĩa câu nói luôn phải đọc tin nhắn ngay trước đó." }
    ]
  },

  // =================== BẬC 2 · B1+ ===================
  {
    id: "toeic-order-problem", step: 5, stage: 2, level: "B1+", topic: "t-order", style: "Email",
    title: "About Your Recent Order",
    summary: "Email chăm sóc khách hàng xin lỗi vì giao hàng lỗi và đưa ra hướng giải quyết. Từ vựng mua hàng: defective, replacement, refund, tracking number…",
    paragraphs: [
      "To: Rachel Kim | From: Customer Service, OfficeHub Supplies | Subject: Order #4471",
      "Dear Ms. Kim,",
      "Thank you for contacting us about your recent order of office chairs. We are sorry to hear that two of the six chairs arrived damaged. We take the quality of our products very seriously, and we understand how frustrating this must be, especially for a new office.",
      "We have already arranged for two replacement chairs to be sent by express delivery at no extra cost. They should arrive within two business days, and you will receive a tracking number by email once they have been dispatched.",
      "Our courier will collect the damaged chairs when the new ones are delivered, so there is no need for you to return them yourself. Please keep the original boxes if possible.",
      "As a thank-you for your patience, we have also added a voucher for 15% off your next purchase to your account. It is valid until the end of the year.",
      "Sincerely,",
      "Thomas Reed, Customer Service Manager"
    ],
    questions: [
      { q: "What problem did Ms. Kim report?", options: ["She received the wrong color", "Some items were damaged", "Her order arrived late", "She was charged twice"], answer: 1, explain: "Đoạn 3: 'two of the six chairs arrived damaged'. Các đáp án khác không được nhắc tới." },
      { q: "What will happen when the new chairs are delivered?", options: ["Ms. Kim must pay a delivery fee", "The damaged chairs will be picked up", "Ms. Kim will receive a full refund", "A technician will assemble the chairs"], answer: 1, explain: "Đoạn 5: 'Our courier will collect the damaged chairs when the new ones are delivered'. 'Collect' = 'pick up'. Hàng thay thế miễn phí ('at no extra cost') nên A sai." },
      { q: "What has OfficeHub given Ms. Kim?", options: ["A free office chair", "A discount on a future order", "A gift card for a restaurant", "Free delivery for one year"], answer: 1, explain: "Đoạn 6: 'a voucher for 15% off your next purchase', tức giảm giá cho lần mua sau ('a future order')." }
    ]
  },
  {
    id: "toeic-job-ad", step: 6, stage: 2, level: "B1+", topic: "t-hr", style: "Job advertisement",
    title: "Now Hiring: Customer Service Representative",
    summary: "Tin tuyển dụng kiểu TOEIC: yêu cầu công việc, quyền lợi, cách nộp hồ sơ. Câu hỏi hay hỏi 'What is a requirement…' và 'How should applicants apply?'.",
    paragraphs: [
      "Sunrise Travel, one of the region's fastest-growing travel agencies, is looking for a full-time customer service representative to join our team in Da Nang.",
      "Responsibilities include answering customer inquiries by phone and email, helping clients change or cancel bookings, and working with our tour guides to solve problems during trips.",
      "Applicants must have at least one year of experience in customer service and be able to communicate clearly in English. Knowledge of Korean or Japanese is a plus but not required. Some weekend shifts will be necessary during the busy summer season.",
      "We offer a competitive salary, health insurance, and fifteen days of paid leave per year. After six months, employees are also eligible for discounted holiday packages.",
      "To apply, please send your résumé and a cover letter to jobs@sunrisetravel.com by August 15. Only shortlisted candidates will be contacted for an interview."
    ],
    questions: [
      { q: "What is a requirement for the position?", options: ["The ability to speak Japanese", "Previous customer service experience", "A university degree in tourism", "Experience as a tour guide"], answer: 1, explain: "Đoạn 3: 'must have at least one year of experience in customer service'. Tiếng Hàn/Nhật chỉ là 'a plus but not required' (điểm cộng, không bắt buộc). Đây là bẫy kinh điển." },
      { q: "What is mentioned about weekend work?", options: ["It is paid at a higher rate", "It is never required", "It may be needed in summer", "It is only for part-time staff"], answer: 2, explain: "Đoạn 3: 'Some weekend shifts will be necessary during the busy summer season', nghĩa là đôi khi phải làm cuối tuần vào mùa hè." },
      { q: "The word \"eligible\" in paragraph 4 is closest in meaning to", options: ["required", "qualified", "invited", "trained"], answer: 1, explain: "'Eligible for' = đủ điều kiện để hưởng. Gần nghĩa nhất là 'qualified' (đủ tiêu chuẩn). 'Required' (bắt buộc) là bẫy vì sai nghĩa." }
    ]
  },
  {
    id: "toeic-meeting-memo", step: 7, stage: 2, level: "B1+", topic: "t-meet", style: "Memo",
    title: "Changes to Our Weekly Team Meeting",
    summary: "Memo nội bộ thông báo thay đổi lịch họp và cách họp. Từ vựng họp hành: agenda, minutes, action item, attend…",
    paragraphs: [
      "MEMO | To: All Marketing Staff | From: Jenny Park, Marketing Director | Date: September 2",
      "Starting next week, our weekly team meeting will move from Monday morning to Tuesday at 2:00 p.m. Many of you mentioned that Monday mornings are too busy with client calls, so we hope this new time will be more convenient.",
      "We are also making a few changes to how the meetings are run. To keep them short and focused, each meeting will last no longer than 45 minutes. Please send any items you would like to discuss to Kevin by Monday at noon so that he can prepare the agenda.",
      "Team members working from home may attend by videoconference. A link will be included in the calendar invitation.",
      "Finally, we will take turns writing the minutes. A schedule is posted on the bulletin board in the break room. The minutes, including all action items, should be circulated to the team by the end of the day.",
      "Thank you for your cooperation."
    ],
    questions: [
      { q: "Why is the meeting time being changed?", options: ["The director will be traveling on Mondays", "Staff said Monday mornings are busy", "A new meeting room is only free on Tuesdays", "Clients want to attend the meetings"], answer: 1, explain: "Đoạn 2: 'Many of you mentioned that Monday mornings are too busy with client calls'. Đây là lý do được nêu thẳng trong bài." },
      { q: "What should staff do by Monday at noon?", options: ["Send discussion topics to Kevin", "Write the meeting minutes", "Reply to the calendar invitation", "Book a videoconference room"], answer: 0, explain: "Đoạn 3: 'send any items you would like to discuss to Kevin by Monday at noon'. 'Items you would like to discuss' = 'discussion topics'." },
      { q: "Where can staff find out when they must write the minutes?", options: ["In an email from Kevin", "On the company website", "In the break room", "In the calendar invitation"], answer: 2, explain: "Đoạn 5: 'A schedule is posted on the bulletin board in the break room'. Bẫy D: thư mời lịch họp chỉ chứa link họp video." }
    ]
  },
  {
    id: "toeic-food-festival", step: 8, stage: 2, level: "B1+", topic: "t-dining", style: "Web page",
    title: "Riverside Food Festival: Volunteer Information",
    summary: "Trang web tuyển tình nguyện viên cho lễ hội ẩm thực. Luyện đọc dạng web page có nhiều mục nhỏ và thông tin đăng ký.",
    paragraphs: [
      "The Riverside Food Festival returns on October 12 and 13! Every year, more than 20,000 visitors come to enjoy dishes from over 80 local restaurants and food trucks. This year, all profits will be donated to the City Children's Hospital.",
      "We are looking for 150 volunteers to help make the event a success. Volunteers can choose from several roles: welcoming guests at the entrance, selling tickets, giving directions, or helping vendors set up their booths in the morning.",
      "Each shift lasts four hours. Volunteers who complete at least one shift will receive a free festival T-shirt, a meal voucher, and a certificate of appreciation. No previous experience is necessary, but all volunteers must be at least 16 years old.",
      "To register, fill out the online form on this page by September 30. Volunteers will receive their schedules by email one week before the festival. A short training session will be held on October 10 at the Riverside Community Center."
    ],
    questions: [
      { q: "What is indicated about the festival?", options: ["It is held every month", "It will raise money for a hospital", "It is free for all visitors", "It is organized by a restaurant"], answer: 1, explain: "Đoạn 1: 'all profits will be donated to the City Children's Hospital', tức quyên góp tiền cho bệnh viện. 'Raise money' = gây quỹ." },
      { q: "What is NOT a benefit for volunteers?", options: ["A free T-shirt", "A free meal", "A payment of $50", "A certificate"], answer: 2, explain: "Đoạn 3 liệt kê: áo thun, phiếu ăn ('meal voucher'), giấy chứng nhận. Không hề có tiền công, vì đây là tình nguyện." },
      { q: "What will happen on October 10?", options: ["Volunteers will receive their schedules", "Registration will close", "A training session will take place", "The festival will begin"], answer: 2, explain: "Đoạn 4: 'A short training session will be held on October 10'. Hạn đăng ký là 30/9, lịch được gửi trước lễ hội 1 tuần, còn lễ hội bắt đầu 12/10." }
    ]
  },

  // =================== BẬC 3 · B2 ===================
  {
    id: "toeic-renovation-letter", step: 9, stage: 3, level: "B2", topic: "t-property", style: "Letter",
    title: "Notice of Lobby and Parking Renovation",
    summary: "Thư chính thức của ban quản lý gửi người thuê về đợt cải tạo kéo dài 6 tuần. Câu dài hơn, nhiều thông tin thời gian cần đối chiếu.",
    paragraphs: [
      "Dear Tenants,",
      "As part of our ongoing effort to improve the facilities at Maple Court, we are pleased to announce that renovation work on the main lobby and the underground parking garage will begin on Monday, March 4, and is expected to last approximately six weeks.",
      "The work will be completed in two phases. During the first phase, from March 4 to March 22, the lobby will be closed and residents will enter the building through the side entrance on Elm Street. New lighting, flooring, and a security desk will be installed. The second phase, from March 25 to April 12, will focus on the parking garage. During this period, residents may park free of charge at the public parking lot on Cedar Avenue, which is a five-minute walk from the building. Parking permits for the lot will be available at the management office from February 26.",
      "Construction will take place on weekdays between 8:00 a.m. and 5:00 p.m. only, and our contractor has agreed to keep noise to a minimum before 10:00 a.m. Nevertheless, some disruption is unavoidable, and we appreciate your understanding.",
      "Once complete, the renovation will make the building more accessible, secure, and energy-efficient. Rent will not increase as a result of this project.",
      "If you have any concerns, please do not hesitate to contact me directly.",
      "Sincerely,",
      "Andrew Bell, Property Manager"
    ],
    questions: [
      { q: "How should residents enter the building in early March?", options: ["Through the parking garage", "Through the main lobby", "Through a side entrance", "Through the management office"], answer: 2, explain: "Đoạn 3 (giai đoạn 1, 4–22/3): 'residents will enter the building through the side entrance on Elm Street'. Phải đối chiếu đúng mốc thời gian 'early March'." },
      { q: "What are residents asked to do before parking on Cedar Avenue?", options: ["Pay a daily fee", "Get a permit from the office", "Call the contractor", "Move their cars by 8:00 a.m."], answer: 1, explain: "Đoạn 3: 'Parking permits for the lot will be available at the management office'. Bãi xe miễn phí ('free of charge') nên A sai." },
      { q: "What is stated about the rent?", options: ["It will rise slightly in April", "It will stay the same", "It will be reduced during the work", "It must be paid at the side entrance"], answer: 1, explain: "Đoạn 5: 'Rent will not increase as a result of this project'. 'Not increase' được paraphrase thành 'stay the same'." }
    ]
  },
  {
    id: "toeic-digital-payments", step: 10, stage: 3, level: "B2", topic: "t-money", style: "Article",
    title: "Small Businesses Turn to Digital Payments",
    summary: "Bài báo về xu hướng các cửa hàng nhỏ chuyển sang thanh toán điện tử: lợi ích, chi phí và lo ngại. Nối tiếp tốt sang các bài báo tài chính.",
    paragraphs: [
      "Just five years ago, most street-side shops and family-run restaurants in the city accepted only cash. Today, a growing number of them display QR codes at the counter, allowing customers to pay with a quick scan of their phones.",
      "According to a recent survey by the City Business Association, 68 percent of small businesses now accept at least one form of digital payment, up from 25 percent in 2020. Owners say the change has brought several benefits. Transactions are faster, there is less need to handle large amounts of cash, and bookkeeping has become much simpler because every sale is recorded automatically.",
      "\"At the end of the day, I used to spend almost an hour counting money,\" says Linh Vo, who runs a bakery near the train station. \"Now I just check the app. It also makes it easier to apply for a bank loan, because I can show the bank exactly how much I earn.\"",
      "However, not everyone is convinced. Some owners complain about transaction fees, which can reduce already thin profit margins. Others worry about technical glitches. \"When the network goes down, we can't take payments at all,\" explains one café owner, who keeps a cash box as a backup.",
      "Experts expect the trend to continue as younger consumers increasingly leave their wallets at home. Several banks have responded by waiving fees for small merchants during their first year, hoping to attract new customers."
    ],
    questions: [
      { q: "What is the article mainly about?", options: ["A new bank opening in the city", "The rise of digital payments among small shops", "Problems with the city's train network", "How to open a bakery"], answer: 1, explain: "Câu mở đầu và cả bài nói về việc cửa hàng nhỏ chuyển từ tiền mặt sang thanh toán điện tử. Tiệm bánh của Linh Vo chỉ là một ví dụ." },
      { q: "According to Ms. Vo, how has digital payment helped her business?", options: ["It has attracted tourists", "It has made it easier to borrow money", "It has lowered her rent", "It has allowed her to hire more staff"], answer: 1, explain: "Đoạn 3: 'It also makes it easier to apply for a bank loan'. 'Apply for a loan' được paraphrase thành 'borrow money'." },
      { q: "Why do some banks waive fees for small merchants?", options: ["To follow a new government law", "To attract new customers", "To apologize for technical glitches", "To reduce the use of QR codes"], answer: 1, explain: "Đoạn cuối: 'hoping to attract new customers'. 'Waive fees' = miễn phí, là từ trong bộ 600 từ TOEIC." }
    ]
  },
  {
    id: "toeic-plant-press-release", step: 11, stage: 3, level: "B2", topic: "t-factory", style: "Press release",
    title: "Norvex Opens Energy-Efficient Plant in Binh Duong",
    summary: "Thông cáo báo chí về nhà máy mới: công suất, việc làm, công nghệ xanh. Có câu hỏi kiểu 'Where would this sentence best fit?' của TOEIC.",
    paragraphs: [
      "FOR IMMEDIATE RELEASE: Norvex Electronics, a leading manufacturer of household appliances, officially opened its new production plant in Binh Duong Province on Thursday. The $120 million facility will produce up to two million refrigerators and washing machines per year, mainly for export to Southeast Asia and Australia.",
      "The plant is expected to create 1,800 jobs over the next two years. Norvex has partnered with three local technical colleges to provide training for new employees, and around 40 percent of positions will be filled by recent graduates.",
      "Sustainability was a key focus in the plant's design. Solar panels on the roof will supply about a third of the facility's electricity, and a water recycling system will reduce water use by half compared with the company's older factories. In addition, most components will be sourced from suppliers within 100 kilometers, shortening lead times and lowering transport costs.",
      "\"This plant represents our long-term commitment to Vietnam,\" said CEO Margaret Lowe at the opening ceremony. \"By combining automation with a skilled local workforce, we can deliver reliable products while reducing our environmental impact.\"",
      "Production will begin at 60 percent capacity next month and is expected to reach full output by the end of next year. For media inquiries, please contact Norvex's public relations department."
    ],
    questions: [
      { q: "What is the main purpose of the press release?", options: ["To announce the opening of a factory", "To advertise a new refrigerator", "To report a decline in exports", "To introduce a new CEO"], answer: 0, explain: "Câu đầu: 'officially opened its new production plant'. Thông cáo báo chí luôn nêu tin chính ngay câu đầu tiên." },
      { q: "What is NOT mentioned as a feature of the plant?", options: ["Solar panels", "A water recycling system", "Local suppliers", "An on-site training college"], answer: 3, explain: "Bài nói Norvex hợp tác với 3 trường cao đẳng địa phương ('partnered with three local technical colleges'), không nói nhà máy có trường ngay bên trong. Pin mặt trời, tái chế nước và nhà cung cấp gần đều có nhắc." },
      { q: "In which paragraph would this sentence best fit? \"The company says these measures will cut the plant's carbon emissions by 35 percent.\"", options: ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 5"], answer: 2, explain: "Câu này nói về 'these measures' giảm khí thải, nên phải đặt sau đoạn liệt kê các biện pháp xanh (pin mặt trời, tái chế nước), tức đoạn 3. Mẹo: tìm từ nối như 'these', 'this' để biết câu chèn đứng sau ý nào." }
    ]
  },
  {
    id: "toeic-wellness-article", step: 12, stage: 3, level: "B2", topic: "t-health", style: "Article",
    title: "Why More Companies Are Investing in Employee Wellness",
    summary: "Bài báo dài nhất bậc này: doanh nghiệp đầu tư vào sức khỏe nhân viên, có số liệu, ý kiến hai chiều. Làm tốt bài này là sẵn sàng cho bài báo tài chính C1.",
    paragraphs: [
      "When Harmon Logistics introduced a wellness program three years ago, some managers doubted it would make much difference. The company began offering free yoga classes, healthy snacks in the break room, and an annual checkup for every employee. Today, the results have surprised even the program's strongest supporters.",
      "According to the company's human resources department, sick leave has fallen by 22 percent, and staff turnover is at its lowest level in a decade. \"People feel that the company actually cares about them,\" says HR director Nadia Flores. \"That has had a big effect on morale.\"",
      "Harmon is far from alone. A recent report found that nearly 60 percent of mid-sized firms now provide some form of wellness benefit, ranging from gym memberships to mental health counseling. Many employers see these programs as a cost-effective way to attract and keep talented workers in a competitive job market. Some insurers even offer lower premiums to companies that can show their employees are taking part.",
      "Nevertheless, experts warn that wellness programs are not a cure-all. \"A yoga class will not fix an unreasonable workload,\" notes Dr. Samuel Ito, who studies workplace stress. He argues that the most successful programs are combined with practical changes, such as flexible schedules, realistic deadlines, and managers who are trained to recognize signs of burnout.",
      "For employees, the message is clear: take advantage of the benefits on offer, but speak up if the real problem lies elsewhere. As Ms. Flores puts it, \"Wellness isn't just a program. It's part of how we work every day.\""
    ],
    questions: [
      { q: "What happened after Harmon Logistics started its wellness program?", options: ["Employees took fewer sick days", "Some managers left the company", "Insurance costs increased", "The company hired more HR staff"], answer: 0, explain: "Đoạn 2: 'sick leave has fallen by 22 percent', tức nhân viên nghỉ ốm ít hơn. 'Fallen' được paraphrase thành 'took fewer'." },
      { q: "According to the article, why do many employers offer wellness benefits?", options: ["Because the law requires it", "To attract and keep good employees", "To reduce the number of managers", "Because employees asked for gym memberships"], answer: 1, explain: "Đoạn 3: 'a cost-effective way to attract and keep talented workers'. 'Talented workers' = 'good employees'." },
      { q: "What does Dr. Ito suggest?", options: ["Wellness programs are a waste of money", "Yoga is the best way to reduce stress", "Programs work best with changes to working conditions", "Employees should work longer hours"], answer: 2, explain: "Đoạn 4: chương trình thành công nhất là khi đi kèm thay đổi thực tế như lịch linh hoạt, deadline hợp lý ('combined with practical changes'). Ông không nói chương trình là lãng phí (A), chỉ nói 'not a cure-all' (không phải thuốc chữa bách bệnh)." }
    ]
  }
];
