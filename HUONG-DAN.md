# Hướng dẫn đưa WordStreet lên web (GitHub Pages) cho `huydd14`

> **Lưu ý quan trọng:** Hằng ngày bạn chỉ cần mở link web trên trình duyệt (điện thoại hay máy tính đều được) để học. Còn khi muốn **thêm tính năng, đổi giao diện hay sửa lỗi**, hãy sửa và xem thử trên máy trước (mở file `index.html`), ưng rồi mới `git commit` + `git push` lên GitHub. Đây cũng là cách tự học code dần dần qua chính dự án của mình!

---

## Phần 1: Đưa web lên mạng miễn phí (chỉ làm 1 lần, mất ~5 phút)

Mình thấy tài khoản GitHub của bạn là **`huydd14`**. Sau khi làm xong 4 bước dưới đây, web của bạn sẽ có link riêng:

👉 **`https://huydd14.github.io/WordStreet/`**

### Bước 1: Tạo kho chứa (Repository) mới trên GitHub
1. Đăng nhập GitHub (`huydd14`).
2. Nhìn góc trên bên phải màn hình, bấm dấu **`+`** → chọn **`New repository`**.
3. Điền thông tin:
   - **Repository name**: gõ chính xác `WordStreet`
   - Chọn **`Public`** (bắt buộc để dùng GitHub Pages miễn phí)
   - Các ô khác để mặc định, kéo xuống bấm nút xanh **`Create repository`**.

### Bước 2: Tải toàn bộ file web lên GitHub
1. Ở trang vừa tạo xong, bạn sẽ thấy dòng chữ nhỏ: `...or creating a new file` hoặc **`uploading an existing file`** → bấm vào chữ **`uploading an existing file`**.
2. Giải nén file `WordStreet.zip` trên máy tính của bạn.
3. Mở thư mục `WordStreet` vừa giải nén, chọn **tất cả các file và thư mục bên trong** (`index.html`, `README.md`, `HUONG-DAN.md`, thư mục `css`, `data`, `js`) rồi **kéo thả** vào khung trên GitHub.
   - *(Lưu ý: kéo thả các file/thư mục **bên trong** thư mục `WordStreet`, để file `index.html` nằm ngay ngoài cùng của repo).*
4. Đợi tải lên xong, kéo xuống dưới bấm nút xanh **`Commit changes`**.

### Bước 3: Bật GitHub Pages để có link web
1. Ở trang repo `huydd14/WordStreet`, bấm tab **`Settings`** (thanh menu trên cùng).
2. Nhìn cột bên trái, bấm mục **`Pages`**.
3. Ở phần **Build and deployment** → **Branch**:
   - Đổi `None` thành **`main`**
   - Ô bên cạnh giữ nguyên **`/ (root)`**
   - Bấm **`Save`**.

### Bước 4: Mở web học thôi!
1. Đợi khoảng **1–2 phút** rồi F5 lại trang `Settings → Pages`.
2. Trên đầu trang sẽ hiện dòng: `Your site is live at https://huydd14.github.io/WordStreet/`.
3. Bấm vào link đó — lưu bookmark trên trình duyệt máy tính và **"Thêm vào Màn hình chính"** (Add to Home Screen) trên điện thoại để mở như 1 app riêng!

---

## Phần 2: Khi muốn sửa bài đọc / từ vựng / cấu hình

Bạn **không cần cài bất kỳ phần mềm gì** trên máy:

1. Vào `https://github.com/huydd14/WordStreet`
2. Mở thư mục **`data/`**:
   - `config.js`: Đổi tên web, mục tiêu học mỗi ngày, giọng đọc mặc định (`en-US` / `en-GB`).
   - `terms.js`: Thêm hoặc sửa thuật ngữ tài chính.
   - `articles.js`: Thêm bài đọc mới và 3 câu hỏi đọc hiểu.
   - `quiz.js`: Thêm câu hỏi luyện đề TOEIC / C1.
3. Bấm vào file muốn sửa → bấm biểu tượng **cây bút chì (Edit this file)** ở góc phải.
4. Sửa xong bấm nút xanh **`Commit changes...`** → xác nhận **`Commit changes`**.
5. Đợi ~1 phút rồi F5 web `https://huydd14.github.io/WordStreet/` là thấy nội dung mới.

> **Mẹo cho người chưa biết code:** Nếu muốn thêm nhiều bài báo hoặc muốn đổi tính năng/giao diện, bạn cứ gửi yêu cầu cho Gemini viết sẵn đoạn code/nội dung rồi copy–paste đè vào file trên GitHub là xong!

---

## Phần 3: Lưu ý để không bị mất kho từ đã học

- Toàn bộ từ bạn lưu và tiến độ ôn SRS nằm trong trình duyệt của thiết bị bạn đang dùng.
- Mỗi tuần 1 lần (hoặc trước khi đổi máy / xóa lịch sử trình duyệt), vào mục **Từ của tôi** → bấm **`Tải backup`** để lưu 1 file `.json` về máy/Google Drive.
- Khi cần khôi phục hoặc chép sang máy khác: vào **Từ của tôi** → bấm **`Nhập backup`** → chọn file `.json` đó.
