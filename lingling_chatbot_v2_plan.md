# LingLing Chatbot v2 — Plan thiết kế "linh động" (icon động, animation, feature riêng)

## 1. Thứ tự ưu tiên (fix nền tảng trước, animation sau)

| Bước | Việc | Vì sao phải làm trước |
|---|---|---|
| 1 | Streaming response (SSE) | Không có cái này thì mọi animation "đang gõ/đang suy nghĩ" đều là giả, không đồng bộ với model thật |
| 2 | Avatar state machine + icon động | Xương sống của "tính cách" LingLing — mọi feature sau đều gắn vào state này |
| 3 | Actionable widget trong chat (vocab card, IELTS card) | Biến chat từ "hỏi-đáp" thành "hành động", đóng vòng lặp quay lại SRS/lesson |
| 4 | TTS + Mic input | Tăng độ sinh động, effort vừa phải vì Web Speech API đã có sẵn trong stack |
| 5 | Context-aware theo trang hiện tại | Cần bước 1+2 ổn định trước, và cần biết user đang ở route nào (FE đã có sẵn) |
| 6 | Cloud sync chat history | Làm sau cùng vì cần schema mới + auth linkage, không cấp thiết cho trải nghiệm "linh động" |

---

## 2. Avatar State Machine — trái tim của sự "linh động"

LingLing cần có **5 trạng thái thị giác rõ rệt**, mỗi trạng thái là 1 animation
riêng (dùng Lottie qua skill `lottiefiles-motion-design` đã có sẵn), không
phải 1 icon tĩnh đổi màu:

| State | Khi nào kích hoạt | Animation đề xuất |
|---|---|---|
| `idle` | Mặc định, widget đóng hoặc chờ input | Breathing loop nhẹ (scale 98%→102%, ~3s/chu kỳ) + chớp mắt ngẫu nhiên mỗi 4-6s |
| `thinking` | Đang gọi API, chờ token đầu tiên | Xoay nhẹ đầu qua lại + 3 chấm pulse (giống typing indicator nhưng gắn vào avatar, không phải bubble riêng) |
| `speaking` | Đang stream token ra (SSE) | Miệng/avatar "rung nhẹ" theo nhịp ký tự xuất hiện — không cần lipsync thật, chỉ cần cảm giác "đang nói" |
| `celebrating` | RAG tìm đúng data, user thêm từ vào SRS, hoặc user nói cảm ơn | Bounce + confetti nhỏ quanh avatar (Lottie), 1 lần duy nhất rồi về `idle` |
| `apologetic` | Fallback kích hoạt (Ollama offline) | Avatar cúi nhẹ đầu, icon đổi tông màu ấm hơn (không dùng đỏ — tránh cảm giác lỗi nghiêm trọng), kèm text nhẹ nhàng giải thích |

**Nguyên tắc**: state đổi phải có transition mượt (200-300ms ease), không
snap cứng. Tôn trọng `prefers-reduced-motion` — khi bật, tất cả animation
trên rút về fade đơn giản, bỏ bounce/rotate.

---

## 3. Bộ icon/badge động (thay cho badge text tĩnh hiện tại)

Badge "Ollama Qwen2.5" / "Lingual RAG" hiện tại là text tĩnh — nâng cấp
thành icon có animation nhỏ khi xuất hiện (stagger fade-in + slight scale):

- 🧠 **Nguồn LLM**: icon não nhỏ, pulse nhẹ khi model đang generate.
- 📚 **Nguồn RAG**: icon sách mở, có hiệu ứng "lật trang" ngắn khi badge xuất hiện — ẩn dụ "đang tra cứu thật".
- ⚡ **Fallback mode**: icon tia sét màu amber (khớp bảng màu duotone đã chốt ở plan v2), không dùng màu đỏ.
- Hover vào badge RAG → tooltip hiện chính xác bản ghi DB đã dùng (từ vựng nào, câu hỏi IELTS nào) — tăng tính minh bạch, đúng tinh thần "never bịa đặt" bạn đã thiết kế.

---

## 4. Actionable Widget trong chat (feature riêng biệt, khác biệt hoá)

Khi LingLing trả lời có nhắc tới 1 từ vựng hoặc 1 đề IELTS cụ thể, chat
không chỉ hiện text mà chèn **mini-card tương tác ngay trong bubble**:

- **Vocab mini-card**: giống flashcard SRS thu nhỏ (tái dùng component từ
  `packages/ui` đã có ở plan gốc, không tạo component mới) — phiên âm, nghĩa,
  nút "➕ Thêm vào SRS" với animation "bay" nhẹ vào icon SRS trên navbar khi
  bấm (feedback trực quan là đã thêm thành công).
- **IELTS question mini-card**: hiển thị preview passage/prompt + band mục
  tiêu, nút "Mở bài này →" chuyển thẳng vào `/ielts/[id]`.
- **Lesson mini-card**: tương tự, nút "Học ngay →".

Đây là điểm khác biệt hoá thật sự — biến chatbot từ "hỏi cho biết" thành
"hỏi rồi hành động luôn", không app học tiếng Anh nào làm chatbot kiểu này
theo hướng gắn trực tiếp vào SRS.

---

## 5. TTS & Mic input

- Nút 🔊 cạnh mỗi tin nhắn LingLing: khi phát, icon đổi thành waveform
  animation nhỏ chạy theo thời lượng audio (không cần chính xác tuyệt đối
  theo âm lượng thật, animation loop đều là đủ).
  Dùng Web Speech API `SpeechSynthesisUtterance`, set `lang` theo ngôn ngữ
  của câu trả lời (tái dùng logic multi-language TTS đã có trong plan gốc).
- Nút 🎙️ ở input: khi bấm giữ, hiện waveform pulse animation quanh nút
  (giống voice message UX quen thuộc), dùng Web Speech API
  `SpeechRecognition` — có fallback báo lỗi rõ ràng nếu trình duyệt không hỗ
  trợ (Safari hạn chế API này).

---

## 6. Context-aware prompting (nâng cấp roadmap item bạn đề xuất)

- Khi mở chat trên `/ielts/[id]` hoặc `/dictionary/[word]`, tự động đính
  kèm `pageContext` (id bài/từ hiện tại) vào request — không cần user copy.
- **Tín hiệu chủ động (subtle, không làm phiền)**: nếu user ở trang IELTS
  hơn 60s không tương tác gì, avatar ở trạng thái `idle` hiện thêm 1 dot
  pulse nhỏ trên floating button (không popup tự động, không sound) —
  gợi ý có thể hỏi, nhưng quyền chủ động vẫn ở user.

---

## 7. Cloud sync chat history — schema bổ sung

```prisma
model ChatSession {                // [MỚI]
  id        String   @id @default(uuid())
  userId    String
  createdAt DateTime @default(now())
  messages  ChatMessage[]
}

model ChatMessage {                // [MỚI]
  id           String   @id @default(uuid())
  sessionId    String
  role         String   // "user" | "assistant"
  content      String
  sourceType   String?  // "llm" | "rag" | "fallback"
  ragRefs      Json?    // các bản ghi Vocabulary/IeltsQuestion/Lesson đã dùng
  pageContext  String?  // route lúc gửi tin nhắn
  createdAt    DateTime @default(now())
}
```

- Migrate dần từ localStorage: khi user đăng nhập, đồng bộ lịch sử
  localStorage lên server 1 lần, sau đó ưu tiên đọc/ghi từ DB.
- Giữ localStorage làm cache tốc độ, DB là nguồn sự thật (source of truth)
  cho đa thiết bị.

---

## 8. Kỹ thuật streaming (bước 1, làm trước tiên)

- Đổi endpoint `chatbot.ts` từ trả JSON 1 lần sang **Server-Sent Events**
  (`Content-Type: text/event-stream`), forward trực tiếp stream từ Ollama
  (`stream: true` trong request tới Ollama API) ra client theo từng token.
- FE dùng `EventSource` hoặc `fetch` + `ReadableStream` để nhận token, render
  dần vào bubble — đây chính là cơ chế khiến state `speaking` ở mục 2 đồng
  bộ thật với model, không phải animation giả.
- Timeout 6s hiện tại nên đổi logic: không timeout toàn bộ response, mà
  timeout cho **token đầu tiên** (nếu Ollama không phản hồi trong ~3-4s thì
  chuyển fallback ngay, nhưng nếu đã bắt đầu stream thì để chạy hết).
