// ============================================================
// FinFluent - BÀI ĐỌC
// Cách thêm bài mới:
//   1. Sao chép (copy) nguyên một khối { ... } trong mảng bên dưới, dán vào cuối mảng
//      và nhớ thêm dấu phẩy giữa các khối.
//   2. "id" phải là DUY NHẤT (không trùng với bài khác), viết thường, nối bằng dấu gạch ngang.
//   3. "topic" phải là một trong: macro, monetary, stocks, corporate, news, fx.
//   4. Mỗi câu hỏi có 4 lựa chọn trong "options"; "answer" là chỉ số (0-3) của đáp án đúng
//      (0 = lựa chọn thứ nhất, 1 = thứ hai, 2 = thứ ba, 3 = thứ tư).
//   5. "summary" và "explain" viết bằng tiếng Việt có dấu.
// ============================================================
window.FF_ARTICLES = [
  // ---------------------------- MACRO ----------------------------
  {
    id: "eurozone-soft-landing",
    topic: "macro",
    level: "C1",
    style: "Explainer",
    title: "Can the Economy Still Pull Off a Soft Landing?",
    summary: "Bài giải thích vì sao khả năng 'hạ cánh mềm' vẫn còn dù tăng trưởng chậm lại, và những rủi ro như cú sốc nguồn cung hay thâm hụt tài khóa có thể đẩy nền kinh tế vào suy thoái.",
    paragraphs: [
      "For much of the past two years, economists have argued about whether a recession was inevitable. Inflation surged after a series of supply shocks, and central banks responded with the most aggressive tightening in a generation. Yet the widely predicted contraction has not arrived. GDP has grown at a sluggish but positive pace, and the unemployment rate remains close to historic lows.",
      "Optimists point to disinflation as evidence that a soft landing is within reach. Price pressures have eased as energy costs fell and supply chains recovered, while the labor market has cooled without collapsing. Job vacancies have declined, but layoffs remain rare. Crucially, consumer spending has held up, supported by savings built up during the pandemic and by wages that are finally rising faster than prices, restoring some lost purchasing power.",
      "Sceptics, however, warn that the business cycle has merely been delayed rather than defeated. Household savings are running low, and higher borrowing costs typically take eighteen months or more to feed through to the real economy. Governments, meanwhile, have little room for fiscal stimulus: public debt is elevated and fiscal deficits remain wide, so any downturn could prompt calls for austerity rather than support.",
      "The most likely outcome may be something in between. Many forecasters have trimmed their growth forecast for next year to around 1 percent, a pace that would leave the output gap slightly negative but avoid outright stagflation. Whether that counts as a soft landing depends largely on who is asked."
    ],
    questions: [
      { q: "What is the main purpose of the article?", options: ["To argue that a recession will begin next year", "To weigh the evidence for and against a soft landing", "To criticise central banks for raising rates too quickly", "To explain how governments should reduce public debt"], answer: 1, explain: "Bài trình bày cả quan điểm lạc quan (đoạn 2) và hoài nghi (đoạn 3), rồi kết luận 'something in between'. Vậy mục đích là cân nhắc bằng chứng hai phía, không khẳng định chắc chắn suy thoái (A) hay chỉ trích ngân hàng trung ương (C)." },
      { q: "According to the article, why might governments struggle to support the economy in a downturn?", options: ["Because unemployment is already very high", "Because inflation has risen again", "Because debt levels and deficits are already high", "Because consumer spending has collapsed"], answer: 2, explain: "Đoạn 3: 'public debt is elevated and fiscal deficits remain wide' nên chính phủ ít dư địa kích thích tài khóa. Các đáp án khác trái với bài: thất nghiệp thấp, lạm phát đang giảm, chi tiêu tiêu dùng vẫn vững." },
      { q: "The word \"sluggish\" in paragraph 1 is closest in meaning to", options: ["negative", "unpredictable", "rapid", "slow"], answer: 3, explain: "'Sluggish' nghĩa là chậm chạp, uể oải. Câu nói GDP tăng 'sluggish but positive' — chậm nhưng vẫn dương, nên 'negative' (A) là bẫy vì mâu thuẫn với 'positive'." }
    ]
  },
  {
    id: "tariff-trade-deficit-notice",
    topic: "macro",
    level: "B2",
    style: "Analyst note",
    title: "Analyst Note: New Tariffs Unlikely to Close the Trade Deficit",
    summary: "Ghi chú của chuyên viên phân tích cho rằng thuế quan mới khó thu hẹp thâm hụt thương mại, thậm chí có thể làm tăng lạm phát và giảm sức mua.",
    paragraphs: [
      "Last week the government announced a 15 percent tariff on imported machinery and electronic components, arguing that the measure would narrow the country's record trade deficit and protect domestic manufacturers. In our view, the policy is unlikely to achieve its stated goal and may create new risks for growth.",
      "First, a trade deficit largely reflects the gap between national saving and investment, not unfair competition. As long as the fiscal deficit remains around 5 percent of GDP, the economy will continue to absorb more than it produces, and imports will simply shift to other suppliers. Second, many of the targeted goods are inputs for local factories. Higher import costs will squeeze margins and could reduce productivity if firms delay upgrading their equipment.",
      "Third, the tariff acts as a small supply shock. We estimate that it will add 0.3 percentage points to inflation over the next twelve months, eroding household purchasing power at a time when consumer spending is already sluggish. Retaliation from trading partners is also a real possibility.",
      "Taking these factors into account, we are lowering our growth forecast for next year from 2.1 percent to 1.7 percent. We do not expect a recession, but the balance of risks has clearly shifted to the downside."
    ],
    questions: [
      { q: "What is the analyst's main view of the new tariff?", options: ["It will significantly reduce the trade deficit", "It will mainly help consumers by lowering prices", "It is unlikely to work and may harm growth", "It will cause an immediate recession"], answer: 2, explain: "Đoạn 1: 'unlikely to achieve its stated goal and may create new risks for growth'. Đoạn cuối nói rõ 'We do not expect a recession', nên D sai." },
      { q: "What can be inferred about the country's trade deficit?", options: ["It is closely linked to government borrowing", "It is caused mainly by unfair foreign competition", "It will disappear once imports become more expensive", "It has been shrinking for several years"], answer: 0, explain: "Đoạn 2 cho rằng thâm hụt thương mại phản ánh chênh lệch tiết kiệm – đầu tư, và chừng nào thâm hụt tài khóa còn 5% GDP thì vẫn tiếp diễn → liên quan đến vay nợ của chính phủ. B bị bài phủ nhận ('not unfair competition')." },
      { q: "The word \"eroding\" in paragraph 3 is closest in meaning to", options: ["protecting", "gradually reducing", "measuring", "suddenly increasing"], answer: 1, explain: "'Erode purchasing power' = bào mòn, làm giảm dần sức mua. Lạm phát làm sức mua giảm, nên 'protecting' và 'increasing' ngược nghĩa." }
    ]
  },
  // ---------------------------- MONETARY ----------------------------
  {
    id: "fed-holds-rates",
    topic: "monetary",
    level: "C1",
    style: "News report",
    title: "Fed Holds Rates Steady but Keeps a Hawkish Edge",
    summary: "Fed giữ nguyên lãi suất cơ bản nhưng phát tín hiệu 'diều hâu', cho thấy chưa vội cắt giảm lãi suất cho đến khi lạm phát tiến gần mục tiêu 2%.",
    paragraphs: [
      "WASHINGTON - The Federal Reserve left its benchmark rate unchanged at 5.25-5.50 percent on Wednesday, as expected, but policymakers signalled that they were in no hurry to start cutting. In its statement, the central bank said it would need \"greater confidence\" that inflation was moving sustainably toward its 2 percent inflation target before easing policy.",
      "The decision disappointed investors who had hoped for a clearer dovish pivot. Updated projections showed officials now expect only two rate cuts next year, down from three in September, and several members indicated that a further rate hike could not be ruled out if price pressures re-emerge. Two-year bond yields rose 12 basis points after the announcement, while the yield curve, which has been inverted for more than a year, flattened slightly.",
      "The Fed also confirmed that quantitative tightening would continue at its current pace, with up to $60 billion in Treasury securities allowed to roll off the balance sheet each month. Some analysts warn that shrinking the money supply while credit conditions are already tight could drain liquidity from funding markets.",
      "\"The forward guidance is basically: higher for longer,\" said one strategist at a fictional asset manager, Northgate Capital. \"They want to tighten financial conditions a bit more by talking tough, even if they don't actually move.\""
    ],
    questions: [
      { q: "What is the article mainly about?", options: ["A surprise interest rate cut by the Federal Reserve", "The Fed's decision to keep rates unchanged while sounding cautious about easing", "A sharp fall in US bond yields", "The end of quantitative tightening"], answer: 1, explain: "Tiêu đề và đoạn 1: Fed giữ nguyên lãi suất nhưng 'in no hurry to start cutting' – giọng diều hâu. Đoạn 3 nói QT tiếp tục, nên D sai; lợi suất tăng chứ không giảm (C)." },
      { q: "Why did two-year bond yields rise?", options: ["Because the Fed raised its benchmark rate", "Because investors expected more rate cuts than before", "Because the Fed signalled fewer rate cuts than previously projected", "Because quantitative tightening was stopped"], answer: 2, explain: "Đoạn 2: dự báo chỉ còn 2 lần cắt giảm thay vì 3 → kỳ vọng lãi suất cao hơn lâu hơn → lợi suất trái phiếu ngắn hạn tăng. Fed không tăng lãi suất (A) — họ giữ nguyên." },
      { q: "The phrase \"higher for longer\" in paragraph 4 is closest in meaning to", options: ["rates will stay elevated for an extended period", "rates will rise every month", "inflation will remain high permanently", "bond prices will keep rising"], answer: 0, explain: "'Higher for longer' là cách nói quen thuộc: lãi suất giữ ở mức cao trong thời gian dài. B sai vì không phải tăng liên tục; đây nói về lãi suất, không phải lạm phát (C)." }
    ]
  },
  {
    id: "qe-explainer",
    topic: "monetary",
    level: "B2",
    style: "Explainer",
    title: "Explainer: How Quantitative Easing Works - and Why It Is Reversed",
    summary: "Bài giải thích cơ chế nới lỏng định lượng (QE) và thắt chặt định lượng (QT), cũng như tác động lên lợi suất trái phiếu và thanh khoản.",
    paragraphs: [
      "When a central bank has already cut its benchmark rate close to zero, it cannot easily lower borrowing costs any further. This is where quantitative easing, or QE, comes in. Under QE, the bank creates new reserves and uses them to buy large amounts of government bonds and sometimes other assets from the market.",
      "These purchases push bond prices up and bond yields down, which in turn lowers interest rates on mortgages and corporate loans. QE also injects liquidity into the financial system and expands the money supply, encouraging banks to lend and investors to move into riskier assets. Policymakers often combine it with forward guidance, promising to keep rates low for a long time.",
      "Critics argue that QE inflates asset prices and benefits wealthy households who own shares and property. It may also make it harder for markets to price risk accurately. When inflation rises well above the inflation target, a central bank will usually want to tighten policy, and that means reversing QE.",
      "The reverse process is called quantitative tightening. Instead of buying bonds, the bank lets them mature without reinvesting the proceeds, or even sells them. This gradually removes liquidity and can push long-term yields higher. Because nobody has much experience with QT, policymakers tend to move slowly and announce their plans well in advance to avoid disrupting credit conditions."
    ],
    questions: [
      { q: "What is the primary purpose of the article?", options: ["To recommend that central banks stop using QE", "To report on a recent central bank decision", "To explain how QE and QT work", "To compare different countries' interest rates"], answer: 2, explain: "Đây là bài 'Explainer', mô tả cơ chế QE (đoạn 1-2), phê bình (đoạn 3) và QT (đoạn 4). Bài không đưa khuyến nghị (A) hay đưa tin một quyết định cụ thể (B)." },
      { q: "According to the article, why do central banks implement QT slowly?", options: ["Because they have limited experience with it", "Because it is illegal to sell bonds quickly", "Because it always causes a recession", "Because inflation is below target"], answer: 0, explain: "Đoạn 4: 'Because nobody has much experience with QT, policymakers tend to move slowly'. Các đáp án khác không có trong bài." },
      { q: "The word \"injects\" in paragraph 2 is closest in meaning to", options: ["removes", "adds", "measures", "delays"], answer: 1, explain: "'Inject liquidity' = bơm thêm thanh khoản vào hệ thống. 'Removes' là nghĩa ngược, dùng cho QT ở đoạn 4." }
    ]
  },
  // ---------------------------- STOCKS ----------------------------
  {
    id: "tech-rally-valuation",
    topic: "stocks",
    level: "C1",
    style: "News report",
    title: "Tech Rally Lifts Benchmark Index to Record, Stoking Valuation Fears",
    summary: "Đợt tăng giá cổ phiếu công nghệ đẩy chỉ số chuẩn lên kỷ lục, nhưng các chuyên gia lo ngại định giá quá cao và rủi ro điều chỉnh.",
    paragraphs: [
      "NEW YORK - A powerful rally in technology shares pushed the benchmark index to an all-time high on Thursday, extending a bull market that has now lasted more than eighteen months. The gains were led by Vantor Systems, a fictional chipmaker whose market capitalization briefly topped $900 billion after it reported earnings per share well above forecasts.",
      "Investor sentiment has been buoyed by expectations of lower interest rates and enthusiasm about artificial intelligence. Risk appetite has also returned to smaller companies: two IPOs priced above their marketed ranges this week, and trading volumes in speculative stocks have climbed sharply.",
      "Not everyone is convinced the momentum can last. The index now trades at roughly 23 times forward earnings, well above its ten-year average price-to-earnings ratio of 18. \"Large parts of the market look overvalued,\" said a portfolio manager at Harbourline Funds, also fictional. \"When valuation is this stretched, even a modest disappointment can trigger a sharp sell-off.\" He noted that the index's dividend yield has fallen below 1.5 percent, its lowest level in two decades.",
      "Strategists are advising clients to diversify rather than chase the winners. Defensive blue-chip names in healthcare and utilities have lagged this year, but some analysts expect them to outperform if volatility returns. Historically, a correction of 10 percent or more has occurred roughly once every eighteen months."
    ],
    questions: [
      { q: "What is the main topic of the article?", options: ["A stock market crash caused by weak tech earnings", "Record gains in stocks alongside concerns about high valuations", "The poor performance of recent IPOs", "Rising dividend payments by blue-chip companies"], answer: 1, explain: "Tiêu đề và cả bài: thị trường lập đỉnh nhờ cổ phiếu công nghệ, nhưng đoạn 3-4 bày tỏ lo ngại định giá cao. Các IPO thực ra 'priced above' – thành công, nên C sai." },
      { q: "What does the portfolio manager suggest about the market?", options: ["A small negative surprise could cause prices to fall quickly", "Dividend yields are at a record high", "Small companies are too risky to buy", "Interest rates will rise soon"], answer: 0, explain: "Đoạn 3: 'even a modest disappointment can trigger a sharp sell-off' – paraphrase: một bất ngờ tiêu cực nhỏ có thể khiến giá giảm mạnh. Lợi tức cổ tức đang ở mức thấp nhất, nên B sai." },
      { q: "The word \"stretched\" in paragraph 3 is closest in meaning to", options: ["attractive", "flexible", "excessively high", "carefully calculated"], answer: 2, explain: "'Stretched valuation' nghĩa là định giá bị kéo lên quá mức, quá cao. Ngữ cảnh 'overvalued' trước đó xác nhận nghĩa này; 'attractive' là bẫy ngược nghĩa." }
    ]
  },
  {
    id: "investment-email-rebalance",
    topic: "stocks",
    level: "B2",
    style: "Internal investment email",
    title: "Internal Email: Rebalancing the Growth Portfolio",
    summary: "Email nội bộ đề xuất tái cân bằng danh mục: chốt lời một phần cổ phiếu công nghệ đã tăng mạnh và đa dạng hóa sang cổ phiếu trả cổ tức.",
    paragraphs: [
      "To: Investment Committee\nFrom: Laura Chen, Senior Equity Analyst\nSubject: Proposed rebalancing of the Growth Portfolio\n\nFollowing the strong rally in the first half of the year, technology equity now makes up 41 percent of the Growth Portfolio, well above our 30 percent limit. While these holdings have helped us outperform the benchmark index by 4.2 percentage points, the concentration leaves us exposed if investor sentiment turns.",
      "I propose that we sell roughly a quarter of our position in the three largest tech names and reinvest the proceeds in two areas. First, I suggest adding blue-chip consumer staples companies with a dividend yield above 3 percent and stable earnings per share. Second, I recommend a small allocation to European industrial shares, which trade at a price-to-earnings ratio of about 13, compared with 27 for our tech holdings.",
      "This would help us diversify without abandoning our growth focus. Our models suggest the changes would reduce expected volatility by around 15 percent while giving up only a modest amount of upside. If a correction or broader bear market does occur, the portfolio should hold up considerably better.",
      "Please review the attached spreadsheet before Thursday's meeting, where I would like the committee to vote on the proposal."
    ],
    questions: [
      { q: "Why did Laura Chen write the email?", options: ["To report a loss in the Growth Portfolio", "To propose changes that reduce the portfolio's concentration risk", "To recommend buying more technology shares", "To announce her resignation from the committee"], answer: 1, explain: "Email đề xuất bán bớt cổ phiếu công nghệ (chiếm 41%, vượt giới hạn 30%) để giảm rủi ro tập trung. Danh mục đang vượt chỉ số chuẩn, không thua lỗ (A)." },
      { q: "What is indicated about European industrial shares?", options: ["They are cheaper relative to earnings than the tech holdings", "They pay no dividends", "They make up 41 percent of the portfolio", "They have been more volatile than tech stocks"], answer: 0, explain: "Đoạn 2: P/E khoảng 13 so với 27 của cổ phiếu công nghệ → rẻ hơn so với lợi nhuận. 41% là tỷ trọng cổ phiếu công nghệ, không phải châu Âu (C)." },
      { q: "The phrase \"hold up\" in paragraph 3 is closest in meaning to", options: ["delay", "rob", "remain resilient", "lift"], answer: 2, explain: "'Hold up better' trong ngữ cảnh thị trường giảm = chống chịu tốt hơn, giữ giá trị tốt hơn. 'Delay' và 'rob' là nghĩa khác của 'hold up' nhưng không hợp ngữ cảnh." }
    ]
  },
  // ---------------------------- CORPORATE ----------------------------
  {
    id: "meridian-q3-earnings",
    topic: "corporate",
    level: "B2",
    style: "Earnings press release",
    title: "Meridian Foods Reports Third-Quarter Results and Raises Full-Year Guidance",
    summary: "Thông cáo báo chí: doanh thu và lợi nhuận quý 3 của Meridian Foods tăng, biên lợi nhuận cải thiện nhờ cắt giảm chi phí, công ty nâng dự báo cả năm.",
    paragraphs: [
      "LYON - Meridian Foods Group (fictional) today announced its quarterly earnings for the three months ended September 30. Revenue rose 8 percent year-on-year to EUR 2.4 billion, driven by higher volumes in its frozen foods division and price increases in key markets. Net income climbed 14 percent to EUR 186 million.",
      "The company's operating profit margin improved to 11.2 percent from 10.1 percent a year earlier, reflecting the benefits of the cost-cutting programme launched in January. The restructuring, which included the closure of two older plants, has now delivered EUR 95 million in annual savings, ahead of target. EBITDA for the quarter reached EUR 340 million.",
      "Free cash flow was strong at EUR 210 million, allowing the group to reduce net debt and lower its leverage ratio to 1.9 times EBITDA. Capital expenditure is expected to total EUR 420 million for the fiscal year as the company expands production capacity in Poland.",
      "\"These results show that our strategy is working,\" said Chief Executive Anne Moreau. \"Our balance sheet is healthier than at any time in the past decade.\" Meridian raised its full-year guidance and now expects revenue growth of 6 to 7 percent. The board will propose a 5 percent increase in the dividend to shareholders."
    ],
    questions: [
      { q: "What is the main purpose of the press release?", options: ["To announce a merger with a competitor", "To report quarterly results and an improved outlook", "To explain why two plants will be closed next year", "To warn investors about rising debt"], answer: 1, explain: "Thông cáo báo cáo kết quả quý 3 và 'raised its full-year guidance'. Việc đóng cửa nhà máy đã diễn ra (A, C sai); nợ đang giảm chứ không tăng (D)." },
      { q: "What is indicated about Meridian's cost-cutting programme?", options: ["It has saved more than originally planned", "It was cancelled in September", "It reduced revenue by 8 percent", "It will begin next January"], answer: 0, explain: "Đoạn 2: tiết kiệm 95 triệu euro 'ahead of target' – vượt mục tiêu. Chương trình bắt đầu từ tháng 1 năm nay, không phải năm sau (D)." },
      { q: "The word \"healthier\" in paragraph 4 is closest in meaning to", options: ["more profitable", "financially stronger", "more cautious", "larger"], answer: 1, explain: "'A healthier balance sheet' = bảng cân đối kế toán lành mạnh hơn, tức tài chính vững hơn (ít nợ, nhiều tiền mặt). 'More profitable' là bẫy vì lợi nhuận thuộc báo cáo kết quả kinh doanh, không phải bảng cân đối." }
    ]
  },
  {
    id: "acquisition-write-down",
    topic: "corporate",
    level: "C1",
    style: "News report",
    title: "Halden Industries Takes $1.2bn Write-Down on Ill-Fated Acquisition",
    summary: "Halden Industries ghi giảm 1,2 tỷ USD giá trị một thương vụ mua lại thất bại, khiến công ty lỗ ròng và làm dấy lên lo ngại về đòn bẩy tài chính.",
    paragraphs: [
      "Halden Industries, a fictional US maker of industrial pumps, swung to a net loss in the fourth quarter after recording a $1.2 billion impairment charge on Arcwell Robotics, the automation start-up it bought for $2 billion just three years ago. The write-down effectively admits that the acquisition has failed to deliver the growth management promised shareholders at the time.",
      "Excluding the charge, results were broadly in line with forecasts. Revenue edged down 2 percent and the adjusted profit margin slipped to 9.4 percent. But the headline loss of $870 million for the quarter wiped out the company's net income for the entire fiscal year.",
      "The impairment does not affect cash flow directly, yet analysts are concerned about the balance sheet. Halden borrowed heavily to fund the deal, and total liabilities now exceed $5 billion. With earnings shrinking, leverage has risen to 3.8 times EBITDA, close to the limits set in its loan agreements. One rating agency said it was reviewing the company's credit rating, although it saw no immediate threat to solvency.",
      "Management announced a fresh restructuring plan, including 1,100 job cuts and a 30 percent reduction in capital expenditure. It also hinted that Arcwell could be sold. The company's auditors have been asked to complete an additional audit of the unit's accounts before the annual report is published."
    ],
    questions: [
      { q: "What is the article mainly about?", options: ["A successful merger between two robotics firms", "A large loss caused by reducing the value of a past acquisition", "Halden's plan to borrow $2 billion", "A rise in Halden's quarterly revenue"], answer: 1, explain: "Bài tập trung vào khoản ghi giảm (impairment) 1,2 tỷ USD đối với Arcwell khiến công ty lỗ ròng. Doanh thu giảm 2%, không tăng (D)." },
      { q: "What can be inferred about Halden's financial position?", options: ["It is at immediate risk of bankruptcy", "It has no debt", "Its debt level is approaching the maximum allowed by its lenders", "Its cash flow fell by $1.2 billion"], answer: 2, explain: "Đoạn 3: đòn bẩy 3,8 lần EBITDA 'close to the limits set in its loan agreements'. A sai vì 'no immediate threat to solvency'; D sai vì khoản ghi giảm 'does not affect cash flow directly'." },
      { q: "The phrase \"wiped out\" in paragraph 2 is closest in meaning to", options: ["completely eliminated", "slightly reduced", "postponed", "cleaned up"], answer: 0, explain: "'Wipe out' = xóa sạch hoàn toàn. Khoản lỗ quý đã xóa sạch lợi nhuận ròng cả năm. 'Slightly reduced' quá nhẹ; 'cleaned up' là nghĩa đen dễ gây nhầm." }
    ]
  },
  // ---------------------------- NEWS ----------------------------
  {
    id: "retail-sales-beat",
    topic: "news",
    level: "B2",
    style: "News report",
    title: "Retail Sales Beat Expectations, Buoying Stocks",
    summary: "Doanh số bán lẻ vượt kỳ vọng nhờ tiêu dùng mạnh, giúp thị trường chứng khoán tăng, dù vẫn còn những trở ngại như lãi suất cao.",
    paragraphs: [
      "Retail sales surged 0.9 percent in October, the government reported on Tuesday, comfortably beating expectations and easing fears that consumers were running out of steam. The consensus forecast among economists had called for a gain of just 0.3 percent. Compared with a year earlier, sales were up 4.6 percent year-on-year.",
      "The robust figures buoyed financial markets. The main stock index edged up 0.6 percent, led by retailers and restaurant chains, while the shares of Brightwell Stores, a fictional department-store operator, soared 11 percent after it raised its holiday-season outlook. Bond yields also rose as traders scaled back bets on early rate cuts.",
      "Economists cautioned that the strength may not last. Some of the jump reflected early holiday shopping, and spending on furniture and electronics remained subdued. \"There are still significant headwinds, from high borrowing costs to slowing job growth,\" said one economist. \"We expect consumption to slump somewhat in the first quarter.\"",
      "Still, the data add to evidence that the economy has bounced back from a weak summer. Lower gasoline prices have provided a tailwind for household budgets, and several analysts said that the risk of a downgrade to fourth-quarter growth estimates had receded."
    ],
    questions: [
      { q: "What is the main point of the article?", options: ["Retail sales fell sharply in October", "Stronger-than-expected retail sales lifted markets, though risks remain", "Brightwell Stores has filed for bankruptcy", "Economists predict a recession in the first quarter"], answer: 1, explain: "Doanh số bán lẻ tăng 0,9% vượt dự báo 0,3%, chứng khoán tăng; đoạn 3 nêu rủi ro. D quá mạnh: chỉ dự đoán tiêu dùng giảm 'somewhat', không phải suy thoái." },
      { q: "Why did bond yields rise?", options: ["Investors expected interest rate cuts to come later", "Inflation data were weaker than expected", "Gasoline prices increased", "Retail sales missed estimates"], answer: 0, explain: "Đoạn 2: 'traders scaled back bets on early rate cuts' – nhà đầu tư giảm kỳ vọng cắt lãi suất sớm, nghĩa là lãi suất sẽ cắt muộn hơn → lợi suất tăng. Giá xăng giảm chứ không tăng (C)." },
      { q: "The word \"subdued\" in paragraph 3 is closest in meaning to", options: ["defeated", "weak", "hidden", "rising"], answer: 1, explain: "'Subdued spending' = chi tiêu yếu, trầm lắng. 'Defeated' là nghĩa gốc của động từ 'subdue' (chế ngự) nhưng không hợp ngữ cảnh kinh tế." }
    ]
  },
  {
    id: "airline-downgrade-notice",
    topic: "news",
    level: "B2",
    style: "TOEIC Part 7 notice",
    title: "Notice to Shareholders: Updated Outlook from SkyBridge Airways",
    summary: "Thông báo kiểu TOEIC Part 7: hãng hàng không SkyBridge (hư cấu) hạ dự báo lợi nhuận vì giá nhiên liệu và chi phí tăng, nhưng kỳ vọng nhu cầu phục hồi.",
    paragraphs: [
      "NOTICE TO SHAREHOLDERS - SkyBridge Airways (fictional) wishes to inform shareholders that it has revised its full-year outlook. Operating profit is now expected to be between $310 million and $340 million, compared with previous guidance of $420 million. This means results are likely to miss estimates published by most analysts covering the company.",
      "The revision reflects several headwinds. Jet fuel prices have soared by nearly 25 percent since July, and a strike by ground staff at two major hubs led to more than 1,800 cancelled flights in September. In addition, uncertainty over new environmental taxes in Europe continues to weigh on bookings for next spring.",
      "Despite these challenges, demand remains robust on long-haul routes, where revenue per passenger rose 7 percent year-on-year in the third quarter. The company expects its premium cabins to continue performing strongly and believes that profits will rebound next year as new fuel-efficient aircraft enter service.",
      "Following the announcement, one credit agency issued a downgrade of its outlook on the company's bonds from \"stable\" to \"negative.\" Shareholders with questions are invited to attend an online briefing on November 14 at 10:00 a.m. Registration is available through the Investor Relations page of our website until November 12."
    ],
    questions: [
      { q: "What is the purpose of the notice?", options: ["To announce new flight routes", "To inform shareholders of a lower profit forecast", "To invite staff to a training session", "To report a record annual profit"], answer: 1, explain: "Đoạn 1: công ty 'revised its full-year outlook' xuống 310-340 triệu USD từ 420 triệu USD – thông báo dự báo lợi nhuận thấp hơn." },
      { q: "What is NOT mentioned as a reason for the revision?", options: ["Higher fuel costs", "A labor strike", "Uncertainty about taxes", "A shortage of pilots"], answer: 3, explain: "Đoạn 2 nêu giá nhiên liệu tăng, đình công nhân viên mặt đất và thuế môi trường. Thiếu phi công (D) không được nhắc tới – dạng câu hỏi NOT thường gặp trong TOEIC Part 7." },
      { q: "The phrase \"weigh on\" in paragraph 2 is closest in meaning to", options: ["have a negative effect on", "measure", "support", "consider carefully"], answer: 0, explain: "'Weigh on' trong tin tài chính = đè nặng lên, gây tác động tiêu cực. 'Consider carefully' là nghĩa của 'weigh up'/'weigh' (cân nhắc) – bẫy thường gặp." }
    ]
  },
  // ---------------------------- FX ----------------------------
  {
    id: "dollar-emerging-markets",
    topic: "fx",
    level: "C1",
    style: "News report",
    title: "Strong Dollar Squeezes Emerging Market Currencies",
    summary: "Đồng USD mạnh lên khiến nhiều đồng tiền thị trường mới nổi mất giá, dòng vốn tháo chạy và các ngân hàng trung ương phải can thiệp.",
    paragraphs: [
      "The US dollar climbed to a six-month high this week as investors sought safety amid rising geopolitical tensions, putting renewed pressure on emerging market currencies. The fictional republic of Valdoria saw its currency depreciate by more than 6 percent against the dollar in five trading days, its sharpest fall since a devaluation two years ago.",
      "Analysts said the dollar's role as the world's main reserve currency makes it a natural safe-haven during periods of stress, alongside gold, which also hit a record. As the exchange rate moves against them, countries with large dollar-denominated debts face higher repayment costs, which can trigger capital outflows as foreign investors exit local bond markets.",
      "Popular carry trade strategies, in which investors borrow in low-yielding currencies to buy higher-yielding emerging market assets, have also been unwound. \"When volatility spikes, the carry trade is the first thing to go,\" said one currency strategist. \"Speculation that had built up over months is being reversed in days.\"",
      "Several central banks have stepped in. Valdoria's monetary authority sold reserves to slow the slide, and a neighbouring state reaffirmed its currency peg to the dollar. Commodity exporters have fared better, as higher crude oil prices have supported their currencies, but most strategists expect the dollar to appreciate further until tensions ease."
    ],
    questions: [
      { q: "What is the article mainly about?", options: ["The dollar's rise and its impact on emerging market currencies", "Valdoria's decision to adopt the US dollar", "Falling gold prices", "A new trade agreement between emerging markets"], answer: 0, explain: "Toàn bài nói về USD tăng giá và áp lực lên các đồng tiền mới nổi. Vàng lập kỷ lục chứ không giảm (C); Valdoria bán dự trữ chứ không dùng USD (B)." },
      { q: "Why have commodity exporters performed better than other emerging markets?", options: ["Their currencies are pegged to gold", "Higher oil prices have supported their currencies", "They have no foreign debt", "They raised interest rates"], answer: 1, explain: "Đoạn 4: 'higher crude oil prices have supported their currencies'. Các lựa chọn khác không được đề cập." },
      { q: "The word \"unwound\" in paragraph 3 is closest in meaning to", options: ["relaxed", "expanded", "reversed or closed", "explained"], answer: 2, explain: "'Unwind a trade' = đóng/đảo ngược vị thế giao dịch. Câu tiếp theo xác nhận: 'Speculation... is being reversed in days.' 'Relaxed' là nghĩa đời thường (thư giãn) – bẫy." }
    ]
  },
  {
    id: "oil-glut-opec",
    topic: "fx",
    level: "B2",
    style: "Analyst note",
    title: "Commodities Note: Supply Glut Tests OPEC's Resolve",
    summary: "Ghi chú phân tích hàng hóa: dư cung dầu khiến giá dầu thô giảm, OPEC cân nhắc cắt giảm sản lượng; nhà đầu tư dùng hợp đồng tương lai để phòng ngừa rủi ro.",
    paragraphs: [
      "Crude oil prices have fallen almost 18 percent since April, and the spot price of the international benchmark slipped below $68 a barrel on Monday. The main driver is a growing supply glut: production from non-OPEC countries has reached record levels, while demand growth in Asia has slowed more than expected.",
      "All eyes are now on OPEC's meeting next month. Members could agree to extend or deepen output cuts, but several producers are reluctant to give up market share. In our view, a cut of at least one million barrels per day would be needed to balance the market. Anything smaller would likely be seen as a disappointment, and futures markets are already pricing in further weakness, with contracts for delivery next year trading below current prices.",
      "Lower oil prices are a mixed blessing. They ease inflation for importers but hurt the currencies of producers. Airlines and shipping companies, meanwhile, have been using the dip to hedge their fuel costs for the next eighteen months.",
      "We also note a rise in speculation from short-term funds. Some analysts compare the recent swings to a bubble in reverse, warning that prices could overshoot on the downside. We maintain our forecast of $70 for the fourth quarter but see risks skewed to the downside. Gold, by contrast, should remain supported as a safe-haven asset."
    ],
    questions: [
      { q: "What is the main focus of the note?", options: ["The causes of falling oil prices and OPEC's possible response", "Rising demand for oil in Asia", "Airlines' plans to buy new aircraft", "Why gold prices have collapsed"], answer: 0, explain: "Bài phân tích nguyên nhân giá dầu giảm (dư cung) và cuộc họp OPEC sắp tới. Nhu cầu châu Á đang chậm lại (B sai); vàng được dự báo vẫn vững (D sai)." },
      { q: "What do airlines and shipping companies appear to be doing?", options: ["Selling their oil reserves", "Locking in fuel prices while they are low", "Reducing the number of flights", "Investing in gold"], answer: 1, explain: "Đoạn 3: họ 'hedge their fuel costs' khi giá giảm – nghĩa là khóa giá nhiên liệu ở mức thấp. Đây là cách paraphrase của 'hedge'." },
      { q: "The phrase \"a mixed blessing\" in paragraph 3 is closest in meaning to", options: ["a complete disaster", "something with both advantages and disadvantages", "an unexpected gift", "a religious event"], answer: 1, explain: "'A mixed blessing' = điều vừa có lợi vừa có hại. Câu sau giải thích: giảm lạm phát cho nước nhập khẩu nhưng làm yếu tiền tệ nước sản xuất." }
    ]
  }
];
