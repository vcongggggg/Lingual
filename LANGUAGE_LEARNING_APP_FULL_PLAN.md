# LinguaFlow - Full Product & Technical Plan

> **Version 2.0 - Product, Engineering and Production Delivery Plan**
>
> This document keeps the original ten-section product brief intact and adds
> concrete engineering controls, release gates, and a deployment runbook. The
> goal is not to build every Duolingo feature at once. The goal is to ship a
> small, secure, observable Vietnamese-to-English learning product that can
> safely grow.
>
> Read this file first for product scope, then use
> `LANGUAGE_LEARNING_APP_PRODUCTION_ADDENDUM.md` as the implementation,
> security, testing, CI/CD, and deployment checklist.

## 1. Executive Summary

LinguaFlow là một web app học ngoại ngữ theo hướng cá nhân hóa, kết hợp lesson, vocabulary SRS, game center, reading/listening/speaking/writing practice, dashboard tiến độ và AI conversation partner. Sản phẩm hướng tới người học mọi cặp ngôn ngữ, ví dụ Vietnamese -> English, Vietnamese -> Japanese, beginner đến advanced. Điểm khác biệt cốt lõi là không chỉ học theo bài cố định như Duolingo, cũng không chỉ flashcard như Anki/Quizlet, mà gom learning loop hoàn chỉnh: học từ mới, luyện ngữ cảnh, chơi game, nói/viết với AI, theo dõi tiến bộ và tự động đưa nội dung cần ôn mỗi ngày.

## 2. Feature Inventory

### Priority Legend

| Tier | Meaning |
|---|---|
| P0 | MVP must-have, cần có trong v1.0 |
| P1 | Launch + 1, thêm sau MVP để sản phẩm mạnh hơn |
| P2 | Future, nâng cấp khi đã có nền tảng ổn |

### Feature Matrix

| Feature | What It Does | Why It Matters | Priority | Inspired By |
|---|---|---|---|---|
| User Auth & Profile | Đăng ký, đăng nhập, chọn native language, target language, level, daily goal. | Cần để cá nhân hóa learning path, lưu progress, streak, SRS. | P0 | Duolingo, Babbel |
| Onboarding Placement | Hỏi mục tiêu, trình độ, thời lượng/ngày; optional placement quiz. | Giảm friction, đưa người học vào level phù hợp. | P0 | Duolingo |
| Vocabulary System | Word list, flashcards, examples, tags, CEFR/frequency/topic. | Từ vựng là lõi của language acquisition. | P0 | Anki, Quizlet, Lingvist |
| SRS Review | Tự động lên lịch ôn từ theo trí nhớ người học. | Spaced repetition giúp nhớ lâu hơn học dồn. | P0 | Anki, WaniKani |
| Grammar Lessons | Bài ngữ pháp ngắn, ví dụ song ngữ, mini quiz. | Người học cần hiểu pattern, không chỉ nhớ từ. | P0 | Babbel |
| Reading Practice | Đoạn đọc graded, click từ để tra nghĩa, lưu từ mới. | Tạo input có ngữ cảnh, tăng vocabulary retention. | P1 | LingQ, Readlang |
| Listening Practice | Audio câu/từ/bài hội thoại, tốc độ 0.75x/1x/1.25x, transcript. | Listening là kỹ năng yếu của nhiều learner. | P1 | Duolingo, BBC Learning English |
| Speaking Practice | Shadowing, ghi âm, speech-to-text, pronunciation score. | Giúp luyện phát âm và fluency. | P1 | ELSA Speak |
| Writing Practice | Viết câu/đoạn, AI correction, dictation. | Writing giúp active recall và grammar production. | P1 | Grammarly, Busuu |
| Game Center | Bộ game luyện từ, nghe, spelling, sentence building. | Tăng retention, biến drill thành practice vui. | P0/P1 | Duolingo, Quizlet |
| XP/Streak/Level | XP, streak, level, badges, daily goal. | Gamification giúp quay lại mỗi ngày. | P0 | Duolingo |
| Progress Dashboard | Biểu đồ XP, SRS due, accuracy, weak words, skill breakdown. | Người học thấy tiến bộ và biết nên học gì tiếp. | P0 | Lingvist |
| Dictionary Lookup | Inline lookup word/phrase, example, pronunciation, save to deck. | Giảm ngắt mạch khi đọc/nghe. | P1 | LingQ, Readlang |
| AI Conversation Partner | Chat theo level/chủ đề, sửa lỗi nhẹ, gợi ý câu trả lời. | Tạo môi trường luyện hội thoại khi không có partner. | P1 | ChatGPT, TalkPal |
| AI Grammar Explainer | Giải thích lỗi sai bằng ngôn ngữ native của user. | Feedback cá nhân hóa nhanh hơn bài học tĩnh. | P1 | Grammarly, ChatGPT |
| Social / Community | Leaderboard, friend, study group, language exchange. | Tăng retention nhưng cần kiểm soát moderation. | P2 | Duolingo, HelloTalk |
| Content Import | Import text/article để đọc, auto extract vocabulary. | Hỗ trợ advanced learners và immersion. | P2 | LingQ |
| Immersion Mode | UI target-language optional, daily content in target language. | Tăng exposure, phù hợp intermediate/advanced. | P2 | Clozemaster |
| Subscription / Billing | Free tier, premium tier, usage limits, Stripe integration. | Cần cho freemium business model. | P1 | Duolingo, Babbel |
| Admin CMS | Quản lý languages, lessons, vocabulary, quiz, moderation. | Không thể scale content nếu sửa DB thủ công. | P0 | Internal tooling |

### P0 MVP Feature Set

MVP nên ship các phần sau:

- Auth/profile/onboarding.
- Course/unit/lesson structure.
- Vocabulary + flashcards.
- SRS review queue.
- Quiz engine: multiple choice, typing, fill blank.
- Game Center bản đầu: Word Match, Sentence Scramble, Typing Race.
- XP/streak/level basic.
- Progress dashboard basic.
- Admin CMS basic.
- Responsive web + PWA-ready manifest.

## 3. Game Center - Detailed Breakdown

### Game System Principles

Game Center không chỉ là mini game trang trí. Mỗi game phải lấy dữ liệu từ learned words, due words, weak words hoặc lesson words để tăng retention.

Core data inputs:

- `UserWordState`: từ user đã học, strength, due date, mistakes.
- `Vocabulary`: target text, translation, audio, example sentences.
- `Sentence`: sentence tokens, translation, difficulty, grammar tags.
- `GameSession`: game type, score, duration, accuracy.

Scoring base:

```text
base_score = correct_count * 10
speed_bonus = max(0, time_remaining_seconds * 2)
streak_bonus = consecutive_correct * 3
mistake_penalty = mistakes * 5
final_score = base_score + speed_bonus + streak_bonus - mistake_penalty
```

### Required Games

| Game | How It Works | Skill Trained | Technical Notes | Difficulty Scaling |
|---|---|---|---|---|
| Hangman | User đoán từng chữ cái của target word. Gợi ý là nghĩa tiếng Việt hoặc example sentence. | Spelling, vocabulary recall. | Need word, translation, allowed letters. Use React state machine. Animation: Framer Motion. | Từ ngắn -> dài; có/không có hint; giới hạn lượt sai giảm dần. |
| Word Match / Memory Flip | Lật card để match target word với translation hoặc image. | Recognition, recall. | Generate pairs from due words. Shuffle cards. Store flipped/matched state. | 6 cards -> 12/20 cards; dùng synonyms; giảm thời gian xem trước. |
| Typing Race | Hiện câu tiếng Anh, user type lại trước khi hết giờ. | Typing fluency, spelling, sentence familiarity. | Compare typed text with normalized answer; show WPM, accuracy. | Câu ngắn -> dài; có punctuation; timer ngắn hơn. |
| Fill-in-the-Blank Blitz | Câu bị thiếu 1 từ, user chọn/gõ từ đúng trong timer. | Contextual vocabulary, grammar. | Cloze sentence generation from lesson sentences. Distractors same POS/category. | Blank 1 từ -> nhiều từ; distractors gần nghĩa hơn; timer nhanh. |
| Listening Bomb | Phát audio, user chọn/gõ từ trước countdown. | Listening discrimination. | Need audio URL/TTS. Countdown component. Track replay count. | Audio chậm -> tự nhiên; word -> phrase; giảm replay. |
| Sentence Scramble | Xáo trộn từ trong câu, user kéo thả để sắp xếp đúng. | Syntax, word order. | Use dnd-kit for drag/drop. Tokenize sentence. | 4-5 words -> 12+ words; include clauses; punctuation. |
| Word Chain / Association | User nối từ theo last letter, category, synonym/antonym. | Vocabulary association. | Need category/synonym metadata. Could start with category chain. | Category broad -> narrow; no translation hints; timer. |
| Crossword | Auto-generate crossword from learned word list. Clues are definitions/translations. | Recall, spelling. | Use crossword generation algorithm; fallback simple grid. | More words, longer words, fewer hints, mixed tenses. |
| Spelling Bee | Hear audio, type exact spelling. | Listening + spelling. | TTS/audio; normalize accents carefully per language. | Slow audio -> natural; one word -> phrase; hide translation. |
| Translation Dash | 60s challenge: translate as many words/sentences as possible. | Fast recall. | Queue due/weak words. Accept multiple translations if available. | Word -> phrase -> sentence; stricter matching. |

### Additional Useful Games

| Game | How It Works | Skill Trained | Technical Notes | Difficulty Scaling |
|---|---|---|---|---|
| Minimal Pair Duel | User hears two similar words, chooses which one was spoken, e.g. `ship/sheep`. | Pronunciation/listening discrimination. | Need minimal pair dataset per language. Audio from TTS/human. | Clear audio -> noisy audio; word -> sentence context. |
| Shadowing Arena | App plays sentence; user records themselves; AI/STT compares transcript and timing. | Speaking rhythm, pronunciation, fluency. | Browser MediaRecorder + speech-to-text. Score by transcript similarity and pause timing. | Short sentence -> paragraph; slower -> natural speed. |
| Grammar Rescue | User fixes grammar error in a sentence, e.g. `She go to school` -> `She goes to school`. | Grammar production. | Store grammar error templates and correction. AI can generate P1. | One error -> multiple errors; hints removed. |
| Picture Prompt Sprint | Show image and ask user to describe it in target language. | Writing/speaking production. | Use static image bank; AI evaluates answer. | Simple object -> scene -> story; minimum word count. |
| Dialogue Builder | User picks best next line in a conversation. | Pragmatics, conversation flow. | Dialogue tree data model. | Obvious choices -> subtle tone/formality choices. |

### Game Center MVP

MVP should implement:

- Word Match.
- Sentence Scramble.
- Typing Race.
- Fill-in-the-Blank Blitz.

Reason: no heavy speech/audio dependency, still trains core skills and demonstrates strong frontend state handling.

## 4. System Architecture

### Recommended Tech Stack

| Layer | Recommended | Why | Swappable Alternative |
|---|---|---|---|
| Frontend | Next.js + TypeScript | Modern React, routing, SSR/SEO, Vercel deploy, strong CV value. | Vite React |
| Styling | Tailwind CSS + shadcn/ui | Fast UI build, consistent components, responsive. | Bootstrap, MUI |
| Backend API | NestJS + TypeScript | Structured Node backend, DI, modules, guards, scalable. | Express + TypeScript |
| Database | PostgreSQL | Strong relational data, JSONB, indexes, pgvector option. | MySQL |
| ORM | Prisma | Type-safe schema, migrations, good TS DX. | TypeORM, Drizzle |
| Cache/Queue | Redis + BullMQ | Rate limit, SRS job queue, notification queue. | Upstash Redis, Cloudflare Queues |
| Auth | JWT access + refresh cookie, or Better Auth/Auth.js | Practical web auth, httpOnly cookies. | Clerk, Supabase Auth |
| AI | OpenAI-compatible API abstraction | Swappable LLM provider, supports chat/correction. | Gemini, Claude, local Ollama |
| Speech | Web Speech API MVP, Azure/Google STT later | Free MVP path, upgradeable accuracy. | Whisper API |
| Payments | Stripe | Subscription standard. | Lemon Squeezy, Paddle |
| Storage | S3/R2 | Audio/images/user recordings. | Supabase Storage |
| E2E | Playwright | Strong browser testing. | Cypress |
| Deploy | Vercel frontend + Render/Railway backend | Easy for student portfolio. | Fly.io, VPS |

### Architecture Diagram

```text
                           +----------------------+
                           |      Browser/PWA     |
                           | Next.js UI, Games    |
                           +----------+-----------+
                                      |
                                      | HTTPS
                                      v
+---------------------+      +--------+---------+       +-------------------+
| CDN / Static Assets |<-----| Next.js Frontend |------>| NestJS API Server |
+---------------------+      +------------------+       +---------+---------+
                                                                  |
                       +------------------------------------------+-------------------+
                       |                  |                       |                   |
                       v                  v                       v                   v
              +--------+------+   +-------+------+       +--------+------+   +--------+------+
              | PostgreSQL    |   | Redis/BullMQ |       | AI Provider   |   | Object Storage|
              | Prisma ORM    |   | cache/jobs   |       | LLM/STT/TTS   |   | audio/images  |
              +---------------+   +--------------+       +---------------+   +---------------+
```

### Monorepo Structure

```text
linguaflow/
  apps/
    web/                 # Next.js frontend
    api/                 # NestJS backend
  packages/
    shared/              # shared types, constants, validators
    ui/                  # optional shared UI components
  prisma/
    schema.prisma
    migrations/
    seed.ts
  docs/
    architecture.md
    api.md
```

### Key Data Models

#### User

```text
User
- id
- email
- passwordHash
- displayName
- nativeLanguageCode
- targetLanguageCode
- level: A1/A2/B1/B2/C1/C2
- dailyGoalXp
- timezone
- role: learner/admin/moderator
- createdAt
- updatedAt
```

#### Language

```text
Language
- code: en, vi, ja
- name
- direction
- hasTtsSupport
- hasSttSupport
```

#### Course / Unit / Lesson

```text
Course
- id
- sourceLanguageCode
- targetLanguageCode
- title
- level

Unit
- id
- courseId
- title
- orderIndex
- theme

Lesson
- id
- unitId
- type: vocabulary/grammar/reading/listening/speaking/writing
- title
- estimatedMinutes
- orderIndex
- xpReward
```

#### Vocabulary / Word

```text
Word
- id
- languageCode
- text
- normalizedText
- partOfSpeech
- ipa
- audioUrl
- frequencyRank
- cefrLevel

WordMeaning
- id
- wordId
- sourceLanguageCode
- translation
- definition
- exampleSentence
- exampleTranslation
```

#### UserWordState

```text
UserWordState
- id
- userId
- wordId
- status: new/learning/review/mastered/suspended
- stability
- difficulty
- dueAt
- lastReviewedAt
- reviewCount
- lapseCount
- correctStreak
```

#### ReviewLog

```text
ReviewLog
- id
- userId
- wordId
- rating: again/hard/good/easy
- responseMs
- previousDueAt
- nextDueAt
- createdAt
```

#### Quiz / Question / Answer

```text
Question
- id
- lessonId
- type: multiple_choice/typing/cloze/scramble/listening
- prompt
- correctAnswer
- choicesJson
- explanation
- difficulty
```

#### GameSession / GameScore

```text
GameSession
- id
- userId
- gameType
- startedAt
- endedAt
- score
- accuracy
- durationSeconds
- xpEarned

GameAttempt
- id
- sessionId
- promptId
- userAnswer
- correctAnswer
- isCorrect
- responseMs
```

#### Progress

```text
UserLessonProgress
- id
- userId
- lessonId
- status: not_started/in_progress/completed
- score
- completedAt

DailyProgress
- id
- userId
- date
- xp
- lessonsCompleted
- reviewsCompleted
- gamesPlayed
```

#### Subscription

```text
Subscription
- id
- userId
- provider: stripe
- status: free/trialing/active/past_due/canceled
- plan
- currentPeriodEnd
```

### SRS Algorithm Choice

Recommendation: FSRS-inspired model for long-term direction, SM-2-compatible MVP.

MVP approach:

- Implement SM-2 style ratings: Again, Hard, Good, Easy.
- Store `easeFactor`, `intervalDays`, `dueAt`.
- Later migrate to FSRS fields: `stability`, `difficulty`, `retrievability`.

MVP SM-2 simplified:

```text
Again -> due in 10 minutes, reset correct streak
Hard  -> due in 1 day, slightly reduce ease
Good  -> due in interval * ease
Easy  -> due in interval * ease * 1.3
```

Why not full FSRS immediately:

- FSRS is stronger but more complex.
- MVP needs correctness, explainability, and simple debugging.
- Data can be modeled to support FSRS later.

### AI/LLM Integration Points

| Feature | AI Use | MVP/P1 | Guardrails |
|---|---|---|---|
| Conversation Partner | Role-play chat by level/topic. | P1 | Level-bound prompts, no unsafe content, no secrets. |
| Writing Correction | Correct grammar and explain in native language. | P1 | Store original/correction, user opt-in. |
| Grammar Explainer | Explain why answer is wrong. | P1 | Use lesson grammar tags. |
| Reading Import | Summarize and extract vocabulary. | P2 | Copyright warning, content length limits. |
| Game Content Generation | Generate distractors/cloze variants. | P1 | Human/admin review for official content. |
| Placement Quiz | Adaptive question suggestions. | P2 | Deterministic scoring first. |

Model abstraction:

```text
AiProvider interface:
- chat(messages, options)
- correctWriting(text, languagePair, level)
- generateExamples(word, level)
- extractVocabulary(text, languagePair)
```

### Real-time Features

MVP can avoid real-time complexity. P1/P2 real-time:

- Weekly leaderboard updates via polling every 30-60s.
- Live challenge game using WebSocket.
- Study group room using WebSocket.
- Live voice is P2, likely expensive and technically harder.

## 5. UX & Design Direction

### Design Philosophy

LinguaFlow should feel like a focused study cockpit, not a toy-only app. The UI should combine:

- Duolingo-like daily loop and light gamification.
- Anki-like review seriousness.
- Quizlet-like clean flashcard interaction.
- LingQ-like reading immersion.

Visual direction:

- Calm base colors, high contrast.
- One accent color per language/course.
- Progress visible but not overwhelming.
- Mobile-first practice screens.
- Games can be more expressive than dashboard/admin.

### Onboarding: First 5 Minutes

1. Landing opens with direct CTA: `Start learning`.
2. User selects native language: Vietnamese.
3. User selects target language: English.
4. User selects goal:
   - Travel.
   - School/exam.
   - Work.
   - Conversation.
   - Reading.
5. User selects level:
   - Total beginner.
   - Know basics.
   - Intermediate.
   - Advanced.
6. User chooses daily goal:
   - 5 min.
   - 10 min.
   - 20 min.
   - 30 min.
7. Optional 5-question placement quiz.
8. App creates first daily plan:
   - 5 new words.
   - 1 micro lesson.
   - 1 review/game.
9. User completes first lesson.
10. User sees XP, first badge, next recommended action.

Example for Vietnamese -> English:

```text
Goal: Work
Level: Beginner
First lesson: "Introducing yourself"
Words: name, job, student, university, from
Pattern: "I am ..." / "I am from ..."
```

### Daily Practice Loop

Returning user dashboard:

```text
Today's Plan
- Review 18 due words
- Learn 6 new words
- Complete 1 grammar bite
- Play 1 game for weak words
- Optional: AI conversation 5 minutes
```

Session loop:

1. Warm-up: 3 quick reviews.
2. Main lesson or due SRS.
3. Game reinforcement.
4. Short reflection/progress.
5. Next action CTA.

### Mobile Priorities

- One-thumb practice screens.
- Large tap targets.
- Sticky bottom action button.
- No complex tables in learner UI.
- Offline reader later.
- Fast loading under unstable network.

### Accessibility

Requirements:

- WCAG AA contrast.
- Keyboard navigable cards/games.
- Captions/transcripts for audio.
- Avoid color-only correctness feedback.
- Dyslexia-friendly font toggle.
- Reduced motion mode.
- Screen reader labels for interactive game cards.

## 6. Gamification & Retention System

### XP System

XP earning:

| Action | XP |
|---|---:|
| Complete lesson | 20 |
| Review word correct | 2 |
| Finish SRS session | 15 |
| Play game | 10-40 |
| Writing practice | 25 |
| Speaking practice | 25 |
| Daily goal complete | 30 bonus |

XP display:

- Daily ring.
- Weekly chart.
- Course level progress.
- Leaderboard.

XP spending:

- Streak shield.
- Cosmetic avatar frame.
- Bonus game unlock.
- Hint token.

Avoid pay-to-win. Premium should unlock learning value, not unfair leaderboard advantage.

### Streak System

Rules:

- Streak increments when daily goal met.
- Daily goal minimum: 10 XP.
- Streak freeze can protect one missed day.
- Max 2 freezes stored for free, 5 for premium.
- Grace window respects user timezone.

### Level / Rank System

| Rank | XP Threshold | Perk |
|---|---:|---|
| Seedling | 0 | Basic lessons |
| Explorer | 500 | More games |
| Builder | 1,500 | Custom word lists |
| Converser | 3,500 | AI role-play topics |
| Scholar | 7,000 | Advanced analytics |
| Polyglot | 15,000 | Cosmetic profile badge |

### Badges

At least 15:

1. First Step - complete first lesson.
2. 3-Day Spark - 3-day streak.
3. 7-Day Flame - 7-day streak.
4. 30-Day Discipline - 30-day streak.
5. Word Collector - save 100 words.
6. Review Machine - complete 500 reviews.
7. Perfect Round - 100% in a quiz.
8. Fast Fingers - 50 WPM in Typing Race.
9. Grammar Fixer - correct 50 grammar questions.
10. Listener - complete 50 listening tasks.
11. Speaker - record 30 speaking attempts.
12. Writer - submit 20 writing pieces.
13. Game Champion - win 100 games.
14. Night Owl - study after 10 PM five times.
15. Early Bird - study before 7 AM five times.
16. Comeback - return after 7 inactive days.
17. No Hint Hero - complete lesson without hints.
18. Weak Word Slayer - master 50 previously weak words.

### Leaderboards

- Weekly reset.
- Friend leaderboard.
- League leaderboard with 30 users.
- Anti-cheat: cap XP counted per minute/hour.
- Premium users do not get XP multiplier for leaderboard.

### Notifications

Types:

- Daily reminder.
- Due reviews.
- Streak risk.
- Weekly summary.
- Friend challenge.

Rules:

- User chooses reminder time.
- No more than 1 push/day by default.
- Stop reminders after repeated ignores.
- Use positive tone, not guilt-heavy.

## 7. Content & Curriculum Strategy

### Lesson Structure

```text
Course
  Unit
    Lesson
      Activities
        Vocabulary
        Grammar bite
        Listening
        Quiz
        Game reinforcement
```

Example Vietnamese -> English beginner:

```text
Unit: Introductions
Lesson 1: Name and origin
Words: name, from, student, teacher, city
Grammar: I am / I am from
Practice: choose translation, type answer, scramble sentence
Game: Word Match
```

### Vocabulary Lists

Vocabulary sources:

- Frequency corpora.
- CEFR lists.
- Topic lists: travel, school, work, food.
- User imported text.
- Mistake/weak word history.

Fields:

- Frequency rank.
- CEFR.
- Topic.
- Part of speech.
- Example sentence.
- Audio.

### Audio Strategy

Audio is product content, not a cosmetic asset. Do not rely on the browser's
native voice as the only production source because the available voice and
quality vary by browser and device.

| Language / use case | MVP source | Launch-quality source | Human recording priority | Quality check |
|---|---|---|---|---|
| Vietnamese -> English vocabulary and short sentences | One server-side TTS provider; cache the resulting audio in object storage. | Premium neural English voice with a stable voice ID. | High for the top 1,000 words, minimal pairs, contractions, and core dialogues. | A native/near-native reviewer verifies pronunciation, stress, pace, and transcript. |
| Vietnamese -> Japanese | Neural Japanese TTS only for early prototype. | Curated voice plus human recordings for common dialogue. | Very high for pitch-accent-sensitive vocabulary and polite/casual dialogue. | Japanese reviewer checks mora timing, pitch accent, and formality. |
| Vietnamese -> Korean / Chinese | Defer until the content review pipeline exists. | Neural TTS plus reviewed recordings for high-frequency content. | High for sounds that Vietnamese learners commonly confuse. | Native reviewer validates phonemes, tone or pronunciation rules. |
| User speaking attempts | Browser `MediaRecorder` captures an upload only after consent. | Speech-to-text provider receives a short, signed upload URL. | Not applicable. | Show the transcript and let the learner replay rather than claiming an absolute pronunciation score. |

MVP rules:

- Generate and cache only server-approved word and sentence audio.
- Store `audioUrl`, provider, voice ID, language, transcript, duration, and
  version in the content record.
- Serve audio through CDN/object-storage URLs with a long immutable cache
  policy. Replacing audio creates a new object key instead of overwriting a
  cached file.
- Use browser Web Speech API only as a clearly labelled local fallback, never
  as the canonical content source.

P1 rules:

- Human-record the highest-value 1,000 English words, all core dialogues, and
  minimal-pair exercises before expanding to more language pairs.
- Add a content-review workflow: draft -> linguistic review -> approved ->
  published -> archived.
- Keep a pronunciation issue report link for learners; an admin can replace
  an incorrect asset without editing lesson history.

### Community Content

P2 only.

Model:

- Users can create public decks.
- Decks require automated checks.
- Community rating.
- Moderator approval for featured decks.
- Report system.

Quality gates:

- No offensive content.
- Duplicate detection.
- Language pair correctness.
- Minimum example coverage.

### Launch Language Pairs

MVP:

- Vietnamese -> English.

Launch + 1:

- English -> Vietnamese.
- Vietnamese -> Japanese.

Future:

- Vietnamese -> Korean.
- Vietnamese -> Chinese.
- English -> Japanese.

Reason: Vietnamese -> English is most useful for your own market and easiest to test with real users.

## 8. Monetization & Pricing

### Free Tier

Included:

- Daily lessons.
- Basic SRS.
- Limited games/day.
- Basic progress.
- 1 target language.
- Limited AI messages/day, e.g. 5.

Limits:

- Max 50 new words/day.
- Max 3 Game Center sessions/day.
- Ads optional but not recommended for MVP.

### Premium Tier

Suggested price:

```text
Vietnam market: 59,000-99,000 VND/month
International: $5.99-$9.99/month
```

Unlocks:

- Unlimited SRS reviews.
- Unlimited games.
- Advanced analytics.
- AI conversation/correction quota.
- Custom decks.
- Import own text.
- Extra streak shields.
- Offline/PWA saved lessons.

### Family / Team Plans

Family:

- 5 accounts.
- Shared billing.
- Parent dashboard optional.

Team/school:

- Teacher creates class.
- Assign lessons.
- View class progress.

### Lifetime Deal

Can be used early:

```text
Lifetime Premium: $49-$99 early supporter
```

Use carefully; lifetime deals can hurt long-term revenue.

### Billing Lifecycle and Payment Safety

Subscription billing is P1, not an MVP blocker. When it is introduced, the
server must treat the payment provider webhook as the source of truth; the
browser redirect page is only a confirmation screen.

| Event | Server action | Required safeguard |
|---|---|---|
| User starts checkout | Create provider checkout session using a server-owned price ID. | Never accept a price, plan, or entitlement from browser input. |
| Provider sends signed webhook | Verify raw-body signature, store provider event ID, then update subscription in a DB transaction. | Unique constraint on `providerEventId` makes retries idempotent. |
| Payment succeeds | Activate or renew entitlement and write audit event. | A duplicate webhook must not duplicate entitlement or credits. |
| Payment fails / past due | Keep a grace period, notify the user, and restrict premium-only actions after expiry. | Do not delete learning data or SRS state. |
| Cancellation | Set `cancelAtPeriodEnd`; retain premium until the paid period ends. | Give an explicit confirmation and self-service restore path. |
| Refund / chargeback | Reconcile entitlement from webhook and flag the account for support review. | Never trust client-side claims about a refund. |

Required subscription fields:

```text
Subscription
- id
- userId
- providerCustomerId
- providerSubscriptionId
- providerPriceId
- status
- currentPeriodStart
- currentPeriodEnd
- cancelAtPeriodEnd
- lastProviderEventAt

PaymentWebhookEvent
- providerEventId (unique)
- eventType
- payloadHash
- processedAt
- processingResult
```

### In-app Currency

Use earnable currency only:

- Earn by lessons/streak.
- Spend on hints, cosmetics, streak shield.
- Do not sell power that damages learning fairness.

## 9. MVP Scope & Sprint Plan

### MVP Definition

MVP v1.0 ships when a learner can:

1. Create account.
2. Choose Vietnamese -> English.
3. Complete onboarding.
4. Learn lessons.
5. Review vocabulary with SRS.
6. Play at least 3 useful games.
7. Track XP/streak/progress.
8. Admin can manage core content.
9. App deploys publicly.

### Sprint Plan

Assume 2-week sprints.

| Sprint | Goal | Deliverables | Definition of Done |
|---|---|---|---|
| Sprint 1 | Project foundation | Monorepo, Next.js app, NestJS API, Prisma, PostgreSQL, auth skeleton, Docker compose. | Local `web`, `api`, `db`, `redis` run; health endpoint OK; DB migration OK. |
| Sprint 2 | User onboarding + curriculum | User profile, language pair, daily goal, course/unit/lesson models, seed Vietnamese -> English beginner content. | User can sign up, choose target language, see first learning path. |
| Sprint 3 | Lesson + vocabulary | Lesson activity renderer, word cards, quiz types: multiple choice, typing, cloze, progress save. | User completes lesson and gets XP/progress. |
| Sprint 4 | SRS engine | UserWordState, ReviewLog, due queue, SM-2 scheduler, review UI. | Due words appear, ratings update due date, tests cover scheduler. |
| Sprint 5 | Game Center MVP | Word Match, Sentence Scramble, Typing Race, Fill-in-the-Blank Blitz, GameScore. | Games use real learned/due words; score saved; XP awarded. |
| Sprint 6 | Dashboard + polish + deploy | Progress dashboard, streak, badges basic, admin CMS, responsive polish, Playwright smoke, deploy. | Public demo works; README/screenshots ready; smoke tests pass. |

### Example User Stories

Sprint 2:

- As a new learner, I can select Vietnamese as native language and English as target language.
- As a learner, I can set a daily goal of 10 minutes.
- As a learner, I can see my first recommended lesson.

Sprint 4:

- As a learner, I see words due today.
- As a learner, I can rate a word as Again/Hard/Good/Easy.
- As a system, I update next due date based on rating.

Sprint 5:

- As a learner, I can play Word Match using my weak words.
- As a learner, I can see score, accuracy, XP earned.

### Post-MVP Roadmap

Phase 1, 1-2 months:

- AI writing correction.
- AI conversation partner.
- Listening practice.
- Advanced analytics.

Phase 2, 2-4 months:

- Speaking/shadowing.
- Reading import.
- Custom decks.
- Premium subscription.

Phase 3, 4-8 months:

- Community content.
- Study groups.
- Live challenge.
- More language pairs.

## 10. Risk & Open Questions

### Technical Risks

| Risk | Impact | Mitigation |
|---|---|---|
| SRS complexity grows too fast | Wrong due schedule hurts learning quality. | Start SM-2 simple, log reviews, design fields for FSRS later. |
| AI cost too high | Premium feature can burn budget. | Quotas, caching, cheaper model for simple correction, premium gating. |
| Speech recognition inconsistent | Speaking scores may feel unfair. | Start with transcript similarity, label as beta, allow replay/manual compare. |
| Content quality bottleneck | Bad lessons make app useless. | Seed small high-quality course first, admin CMS, content checklist. |
| Game code becomes messy | Many games duplicate logic. | Shared game engine primitives: timer, scoring, attempts, prompt loader. |

### Product / Market Risks

| Risk | Mitigation |
|---|---|
| Too broad, becomes unfinished clone of Duolingo. | MVP focuses Vietnamese -> English, vocab/SRS/lesson/game loop first. |
| Gamification distracts from learning. | Games use due/weak words and feed SRS results. |
| Users churn after novelty. | Daily plan, streak, weak-word recovery, personalized dashboard. |

### Open Questions With Proposed Decisions

- Which language pair first? Decision: Vietnamese -> English.
- Which SRS algorithm first? Decision: SM-2-compatible MVP, FSRS-ready schema.
- Which backend style? Decision: NestJS for structured product; Express alternative if learning speed is more important.
- Which AI provider? Decision: build provider abstraction, use OpenAI-compatible API first.
- Which payment provider? Decision: Stripe for global demo; local Vietnam payments can be P2.
- How much community/social in MVP? Decision: exclude from MVP except basic leaderboard.
- Should frontend and backend be separate deploys? Decision: yes, Vercel web + Render/Railway API for clearer full-stack learning.

## Appendix A - API Endpoint Draft

```text
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /me
PATCH  /me/profile

GET    /courses
GET    /courses/:id
GET    /lessons/:id
POST   /lessons/:id/complete

GET    /vocabulary
POST   /vocabulary/save
GET    /reviews/due
POST   /reviews/:wordId/rate

GET    /games/config/:gameType
POST   /games/session
POST   /games/session/:id/attempt
POST   /games/session/:id/finish

GET    /dashboard/summary
GET    /dashboard/weak-words

POST   /ai/conversation
POST   /ai/writing-correction

GET    /admin/lessons
POST   /admin/lessons
PATCH  /admin/lessons/:id
```

## Appendix B - First Demo Content

Language pair:

```text
Vietnamese -> English
```

Beginner Unit:

```text
Unit 1: Introductions
Lesson 1: My name is...
Lesson 2: I am from...
Lesson 3: Student life
Lesson 4: Asking simple questions
Lesson 5: Review + Game Center
```

Vocabulary sample:

| English | Vietnamese | Example |
|---|---|---|
| name | tên | My name is Cong. |
| student | sinh viên | I am a student. |
| university | đại học | I study at university. |
| from | đến từ | I am from Da Nang. |
| language | ngôn ngữ | I am learning English. |

## Appendix C - CV Positioning

If completed, this project can be described as:

```text
Built LinguaFlow, a full-stack language-learning platform using Next.js,
TypeScript, NestJS, PostgreSQL and Prisma, featuring SRS flashcards,
interactive language games, progress analytics, gamified retention and
AI-assisted conversation/writing practice.
```

Technical highlights:

- Full-stack TypeScript architecture.
- PostgreSQL schema design for learning progress and SRS.
- Game Center with reusable scoring/session engine.
- AI integration with provider abstraction and safety limits.
- Auth, RBAC admin CMS, rate limiting, secure cookies.
- Dockerized local development and cloud deployment.
