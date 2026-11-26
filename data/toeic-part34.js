// ============================================================
// WordStreet - TOEIC PART 3 (HỘI THOẠI) & PART 4 (BÀI NÓI)
// ------------------------------------------------------------
// Trong đề thật: nghe 1 đoạn hội thoại (Part 3) hoặc 1 người nói (Part 4),
// rồi trả lời 3 câu hỏi IN SẴN trong đề, mỗi câu 4 lựa chọn.
// Mẹo: đọc lướt 3 câu hỏi TRƯỚC khi nghe để biết cần bắt thông tin gì.
//
// Cách thêm bài mới: chép 1 khối { ... } rồi sửa.
//   part  : 3 (hội thoại) hoặc 4 (bài nói)
//   lines : các câu thoại. s = người nói: "M" (nam), "W" (nữ), "M2" (nam thứ 2), "N" (người dẫn / bài nói)
//   qs    : 3 câu hỏi { q, options (4), answer (0–3), explain }
// ============================================================
window.WS_TOEIC_PART34 = [
  // =================== PART 3 · HỘI THOẠI ===================
  {
    id: "p3-printer", part: 3, level: "B1", title: "Máy in hỏng trước cuộc họp",
    lines: [
      { s: "W", t: "Hi, Tom. Do you know what's wrong with the printer on our floor? It keeps saying there's a paper jam." },
      { s: "M", t: "Yes, it's been doing that all morning. I already called the technician, but he can't come until three o'clock." },
      { s: "W", t: "That's a problem. I need to print twenty copies of the sales report for the meeting at one." },
      { s: "M", t: "Why don't you use the printer in the marketing department on the second floor? I'm sure they won't mind." },
      { s: "W", t: "Good idea. I'll send the file there now and go down to pick it up." }
    ],
    qs: [
      { q: "What problem are the speakers discussing?", options: ["A meeting has been canceled.", "A printer is not working.", "A report has errors.", "A technician is late."], answer: 1, explain: "Ngay câu đầu: 'what's wrong with the printer… paper jam' (kẹt giấy). Câu hỏi về vấn đề (problem) thường có đáp án ở đầu đoạn." },
      { q: "When will the technician arrive?", options: ["At one o'clock", "At two o'clock", "At three o'clock", "Tomorrow morning"], answer: 2, explain: "Người đàn ông nói 'he can't come until three o'clock'. Bẫy: 1 giờ là giờ họp." },
      { q: "What will the woman probably do next?", options: ["Cancel the meeting", "Call the technician again", "Send a file to another printer", "Ask Tom to make copies"], answer: 2, explain: "Câu cuối: 'I'll send the file there now'. Câu hỏi 'do next' thường nằm ở câu cuối cùng." }
    ]
  },
  {
    id: "p3-hotel", part: 3, level: "B1", title: "Đặt phòng khách sạn",
    lines: [
      { s: "M", t: "Good afternoon, Lakeside Hotel. How can I help you?" },
      { s: "W", t: "Hi, I'd like to book a room for two nights, from Friday the twelfth. Do you have anything available?" },
      { s: "M", t: "Let me check. We have a standard room for one hundred and twenty dollars a night, or a room with a lake view for one hundred and fifty." },
      { s: "W", t: "I'll take the lake view. I'm here for a conference, so I'll also need a quiet room to work in the evenings." },
      { s: "M", t: "No problem. All our lake view rooms have a desk, and breakfast is included. Could I have your name and a credit card number, please?" }
    ],
    qs: [
      { q: "Why is the woman calling?", options: ["To cancel a booking", "To make a reservation", "To complain about a room", "To ask for directions"], answer: 1, explain: "'I'd like to book a room' = đặt phòng → make a reservation (paraphrase)." },
      { q: "How much will the woman pay per night?", options: ["$100", "$120", "$150", "$200"], answer: 2, explain: "Cô ấy chọn phòng nhìn ra hồ ('I'll take the lake view') giá 150 đô. 120 là phòng thường, là bẫy." },
      { q: "What does the man say is included?", options: ["Airport transfer", "Breakfast", "Parking", "Conference tickets"], answer: 1, explain: "'breakfast is included'. Các đáp án khác không được nhắc tới." }
    ]
  },
  {
    id: "p3-delivery", part: 3, level: "B1", title: "Đơn hàng giao trễ",
    lines: [
      { s: "W", t: "Hello, I'm calling about an order I placed last week. The order number is 4-5-7-2. It was supposed to arrive on Monday, but I still haven't received it." },
      { s: "M", t: "I'm sorry about that. Let me look it up. It seems there was a problem at our warehouse, and your package was sent out only yesterday." },
      { s: "W", t: "I see. When can I expect it? I need those office chairs for our new employees next week." },
      { s: "M", t: "It should arrive by Thursday. And because of the delay, we'll refund your shipping fee." },
      { s: "W", t: "Thank you, I appreciate that." }
    ],
    qs: [
      { q: "What did the woman order?", options: ["Computers", "Office chairs", "Uniforms", "Printer paper"], answer: 1, explain: "'I need those office chairs for our new employees'. Thông tin nằm giữa đoạn, phải nghe kỹ." },
      { q: "What caused the delay?", options: ["Bad weather", "A wrong address", "A warehouse problem", "A payment error"], answer: 2, explain: "'there was a problem at our warehouse'." },
      { q: "What does the man offer to do?", options: ["Send a different product", "Give a discount on the next order", "Return the shipping cost", "Deliver the package today"], answer: 2, explain: "'we'll refund your shipping fee' → trả lại phí vận chuyển = return the shipping cost." }
    ]
  },
  {
    id: "p3-interview", part: 3, level: "B1", title: "Sắp xếp lịch phỏng vấn",
    lines: [
      { s: "M", t: "Hi, Sarah. We've received a lot of applications for the accountant position. Can you help me schedule the interviews?" },
      { s: "W", t: "Sure. How many candidates do you want to meet?" },
      { s: "M", t: "Five. I'd like to do them all on Wednesday, if possible, because I'll be away at a training on Thursday and Friday." },
      { s: "W", t: "Wednesday works. I'll book the small meeting room for the whole day and send each candidate a time by email this afternoon." },
      { s: "M", t: "Great. Please also ask them to bring a copy of their certificates." }
    ],
    qs: [
      { q: "What job are the speakers hiring for?", options: ["Sales manager", "Receptionist", "Accountant", "Trainer"], answer: 2, explain: "'applications for the accountant position'." },
      { q: "Why does the man want the interviews on Wednesday?", options: ["The meeting room is free only then.", "He will be away later in the week.", "The candidates prefer that day.", "His manager asked him to."], answer: 1, explain: "'I'll be away at a training on Thursday and Friday' → vắng mặt cuối tuần." },
      { q: "What should the candidates bring?", options: ["A reference letter", "A photo ID", "Copies of their certificates", "A laptop"], answer: 2, explain: "Câu cuối: 'bring a copy of their certificates'." }
    ]
  },
  {
    id: "p3-launch", part: 3, level: "B2", title: "Chuẩn bị ra mắt sản phẩm (3 người)",
    lines: [
      { s: "W", t: "Okay, the product launch is only two weeks away. Daniel, how are the advertisements coming along?" },
      { s: "M", t: "The online ads are ready, but the TV commercial is behind schedule. The production company needs a few more days to finish editing." },
      { s: "W", t: "Hmm. Kevin, can we move some of the budget from TV to social media in case the commercial isn't ready?" },
      { s: "M2", t: "We could, but I'd rather wait until Friday. If the editing still isn't done by then, I'll shift the money." },
      { s: "W", t: "Fine. Let's check again at Friday's meeting. Daniel, please call the production company today and get a firm date." }
    ],
    qs: [
      { q: "What are the speakers mainly discussing?", options: ["Hiring a production company", "Preparing for a product launch", "Reducing the marketing budget", "Reviewing customer feedback"], answer: 1, explain: "Câu đầu: 'the product launch is only two weeks away'. Câu hỏi 'mainly discussing' → nghe phần mở đầu." },
      { q: "What problem does Daniel mention?", options: ["The online ads contain errors.", "A commercial is not finished.", "The budget has been cut.", "A meeting was canceled."], answer: 1, explain: "'the TV commercial is behind schedule' = chưa xong đúng hạn → not finished." },
      { q: "What does Kevin suggest?", options: ["Canceling the TV commercial", "Hiring a new company", "Waiting a few days before deciding", "Moving the launch date"], answer: 2, explain: "'I'd rather wait until Friday' → chờ vài ngày rồi mới quyết. Bẫy: chuyển ngân sách chỉ xảy ra NẾU tới thứ Sáu vẫn chưa xong." }
    ]
  },
  {
    id: "p3-office-move", part: 3, level: "B2", title: "Chuyển văn phòng",
    lines: [
      { s: "M", t: "Have you heard that our team is moving to the new building on Grant Street next month?" },
      { s: "W", t: "Yes, I saw the e-mail. I'm happy about it. The offices there are much bigger, and it's right next to the subway station." },
      { s: "M", t: "That's true, but parking is going to be a problem. The new building only has thirty spaces for over a hundred employees." },
      { s: "W", t: "I heard the company is going to give us a monthly transit pass to encourage people to take the subway." },
      { s: "M", t: "Really? That would make a big difference. I'll ask human resources about it this afternoon." }
    ],
    qs: [
      { q: "What does the woman like about the new building?", options: ["It has a large parking garage.", "It is close to public transportation.", "It has a new cafeteria.", "It is cheaper to rent."], answer: 1, explain: "'right next to the subway station' → gần phương tiện công cộng (public transportation)." },
      { q: "What is the man concerned about?", options: ["The size of the offices", "The moving date", "A lack of parking", "The cost of the move"], answer: 2, explain: "'parking is going to be a problem… only thirty spaces'." },
      { q: "What will the man probably do this afternoon?", options: ["Contact human resources", "Visit the new building", "Buy a transit pass", "Write an e-mail to his team"], answer: 0, explain: "'I'll ask human resources about it this afternoon'." }
    ]
  },
  {
    id: "p3-budget", part: 3, level: "B2", title: "Vượt ngân sách sự kiện",
    lines: [
      { s: "W", t: "Mark, I just got the final bill from the caterer for the client dinner. It's about fifteen percent higher than we planned." },
      { s: "M", t: "Fifteen percent? Did they explain why?" },
      { s: "W", t: "Apparently, more guests came than we told them, so they had to prepare extra food at the last minute." },
      { s: "M", t: "Well, that's partly our fault, then. We didn't update the guest list after the sales team invited more people." },
      { s: "W", t: "Right. For the next event, I'll make sure we send the caterer a final number two days in advance." }
    ],
    qs: [
      { q: "What is the problem?", options: ["The caterer canceled.", "A bill is higher than expected.", "The food was not good.", "A client did not attend."], answer: 1, explain: "'fifteen percent higher than we planned' → cao hơn dự tính." },
      { q: "Why did the cost increase?", options: ["Food prices went up.", "The dinner lasted longer.", "There were more guests than planned.", "The venue was changed."], answer: 2, explain: "'more guests came than we told them'." },
      { q: "What does the woman plan to do in the future?", options: ["Use a different caterer", "Invite fewer guests", "Confirm the number of guests earlier", "Ask the sales team to pay"], answer: 2, explain: "'send the caterer a final number two days in advance' → xác nhận số khách sớm hơn." }
    ]
  },
  {
    id: "p3-software", part: 3, level: "B2", title: "Phần mềm mới khó dùng",
    lines: [
      { s: "M", t: "Lisa, how are you finding the new accounting software? I'm having a hard time with it." },
      { s: "W", t: "Honestly, me too. It's much faster than the old system, but I can't figure out how to create monthly reports." },
      { s: "M", t: "Same here. I spent an hour on it yesterday. Do you think we should ask IT for help?" },
      { s: "W", t: "Actually, I just saw a notice that the software company is holding an online training session on Thursday morning. Anyone can sign up on the intranet." },
      { s: "M", t: "Perfect. I'll register right now, and I'll tell the rest of the team, too." }
    ],
    qs: [
      { q: "What does the woman say about the new software?", options: ["It is too expensive.", "It is faster than the old one.", "It often stops working.", "It is easy to learn."], answer: 1, explain: "'It's much faster than the old system'." },
      { q: "What is scheduled for Thursday?", options: ["A software update", "A team meeting", "An online training session", "A visit from IT"], answer: 2, explain: "'holding an online training session on Thursday morning'." },
      { q: "What will the man do next?", options: ["Call the IT department", "Sign up for a session", "Write a monthly report", "Install the software"], answer: 1, explain: "'I'll register right now' → register = sign up." }
    ]
  },

  // =================== PART 4 · BÀI NÓI ===================
  {
    id: "p4-airport", part: 4, level: "B1", title: "Thông báo ở sân bay",
    lines: [
      { s: "N", t: "Attention, passengers on Sky Air flight 2-0-6 to Singapore. Due to heavy rain, this flight has been delayed by approximately forty-five minutes. The new departure time is ten fifteen. Boarding will now take place at gate twelve instead of gate eight. Passengers who need help with connecting flights should speak to a staff member at the service desk next to gate ten. We apologize for the inconvenience and thank you for your patience." }
    ],
    qs: [
      { q: "Why has the flight been delayed?", options: ["A mechanical problem", "Bad weather", "A late crew", "Heavy traffic"], answer: 1, explain: "'Due to heavy rain' → thời tiết xấu (bad weather)." },
      { q: "Where will passengers board the plane?", options: ["Gate 8", "Gate 10", "Gate 12", "Gate 15"], answer: 2, explain: "'at gate twelve instead of gate eight'. Cổng 8 là cổng cũ, cổng 10 là quầy dịch vụ: đều là bẫy." },
      { q: "What should passengers with connecting flights do?", options: ["Call the airline", "Go to a service desk", "Wait at the gate", "Check the website"], answer: 1, explain: "'should speak to a staff member at the service desk'." }
    ]
  },
  {
    id: "p4-voicemail", part: 4, level: "B1", title: "Tin nhắn thoại từ phòng khám",
    lines: [
      { s: "N", t: "Hello, this message is for Mr. Robert Chen. This is Amy calling from Green Valley Dental Clinic. I'm calling to remind you of your appointment with Dr. Patel tomorrow at nine thirty a.m. Please arrive ten minutes early to fill out a short form, because we have updated our patient records system. If you need to change your appointment, please call us back at 5-5-5, 0-1-8-2 before five p.m. today. Thank you, and have a nice day." }
    ],
    qs: [
      { q: "What is the purpose of the message?", options: ["To cancel an appointment", "To remind someone of an appointment", "To introduce a new doctor", "To ask for a payment"], answer: 1, explain: "'I'm calling to remind you of your appointment'." },
      { q: "Why should Mr. Chen arrive early?", options: ["To pay a bill", "To meet a new dentist", "To complete a form", "To find parking"], answer: 2, explain: "'arrive ten minutes early to fill out a short form' → fill out = complete." },
      { q: "What should Mr. Chen do if he wants to change the time?", options: ["Send an e-mail", "Visit the clinic", "Call before 5 p.m.", "Call tomorrow morning"], answer: 2, explain: "'call us back… before five p.m. today'." }
    ]
  },
  {
    id: "p4-tour", part: 4, level: "B1", title: "Hướng dẫn viên tham quan nhà máy",
    lines: [
      { s: "N", t: "Good morning, everyone, and welcome to the Fresh Farm juice factory. My name is Carlos, and I'll be your guide today. The tour will last about one hour. First, we'll see where the fruit is washed and sorted. Then we'll visit the bottling area. For safety reasons, please wear the hairnet and gloves you were given at the entrance, and don't touch any of the machines. At the end of the tour, you can try our new mango juice in the visitor center. Okay, please follow me." }
    ],
    qs: [
      { q: "Where is the talk taking place?", options: ["At a farm", "At a factory", "At a supermarket", "At a restaurant"], answer: 1, explain: "'welcome to the Fresh Farm juice factory'. Bẫy: chữ 'Farm' nằm trong tên công ty." },
      { q: "What are listeners asked to do?", options: ["Take photos", "Wear safety items", "Buy tickets", "Sign a form"], answer: 1, explain: "'please wear the hairnet and gloves' → đồ bảo hộ (safety items)." },
      { q: "What will happen at the end of the tour?", options: ["Listeners will taste a drink.", "Listeners will watch a video.", "Listeners will receive a gift.", "Listeners will meet the owner."], answer: 0, explain: "'you can try our new mango juice' → try = taste (nếm thử)." }
    ]
  },
  {
    id: "p4-meeting", part: 4, level: "B2", title: "Trưởng phòng mở đầu cuộc họp",
    lines: [
      { s: "N", t: "Thanks for coming, everyone. Before we start, I have some good news. Our online sales increased by twenty percent last quarter, mainly because of the new mobile app. However, we've also received more complaints about slow delivery, especially in rural areas. So today, I'd like us to focus on ways to improve our delivery times. I've invited Ms. Ford from our shipping partner to join us. She'll explain some of the options her company can offer. After her presentation, I'll ask each team to share one idea." }
    ],
    qs: [
      { q: "What caused the increase in sales?", options: ["Lower prices", "A new mobile app", "A TV campaign", "New stores"], answer: 1, explain: "'mainly because of the new mobile app'." },
      { q: "What problem does the speaker mention?", options: ["Products are too expensive.", "Customers dislike the app.", "Deliveries are slow.", "Staff are leaving."], answer: 2, explain: "'complaints about slow delivery'." },
      { q: "Who is Ms. Ford?", options: ["A new manager", "A customer", "A representative of a shipping company", "An app designer"], answer: 2, explain: "'Ms. Ford from our shipping partner' → đại diện công ty vận chuyển." }
    ]
  },
  {
    id: "p4-radio", part: 4, level: "B2", title: "Bản tin giao thông trên radio",
    lines: [
      { s: "N", t: "You're listening to City Radio, and here's your morning traffic update. If you're driving downtown, expect delays on Main Street, where road repairs began this morning. The work is expected to continue until the end of the month. Drivers are advised to use Park Avenue instead. Also, because of the marathon this Sunday, several roads near the river will be closed from six a.m. to two p.m. More details are available on the city's website. Coming up next, we'll have the weather forecast for the weekend." }
    ],
    qs: [
      { q: "What is causing delays on Main Street?", options: ["An accident", "Road repairs", "A parade", "Heavy snow"], answer: 1, explain: "'road repairs began this morning'." },
      { q: "What will happen on Sunday?", options: ["A marathon will take place.", "A new road will open.", "Park Avenue will close.", "A festival will begin."], answer: 0, explain: "'because of the marathon this Sunday'." },
      { q: "What will listeners hear next?", options: ["Sports news", "An interview", "A weather report", "Music"], answer: 2, explain: "Câu cuối: 'we'll have the weather forecast' → weather report. Câu hỏi 'hear next' luôn nằm ở cuối bài." }
    ]
  },
  {
    id: "p4-award", part: 4, level: "B2", title: "Phát biểu trao giải nhân viên",
    lines: [
      { s: "N", t: "Good evening, everyone. It's my pleasure to present this year's Employee of the Year award to Ms. Hana Sato from our customer service department. In the past twelve months, Hana trained six new team members and helped reduce customer waiting times by almost half. Many of our clients have written to thank her personally. Next month, she will move to our Tokyo office to lead the new customer service team there. Please join me in congratulating Hana." }
    ],
    qs: [
      { q: "What is the purpose of the speech?", options: ["To introduce a new client", "To present an award", "To announce a retirement", "To explain a new policy"], answer: 1, explain: "'present this year's Employee of the Year award'." },
      { q: "What did Ms. Sato achieve?", options: ["She opened a new office.", "She increased sales by half.", "She reduced customer waiting times.", "She designed a training program."], answer: 2, explain: "'helped reduce customer waiting times by almost half'. Bẫy: 'half' ở đáp án B gắn sai với doanh số." },
      { q: "What will Ms. Sato do next month?", options: ["Start a new position in another city", "Take a long vacation", "Train new staff in this office", "Retire from the company"], answer: 0, explain: "'move to our Tokyo office to lead the new… team' → vị trí mới ở thành phố khác." }
    ]
  }
];
