-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'CONTENT_EDITOR', 'CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "avatarUrl" TEXT,
    "authProvider" TEXT NOT NULL DEFAULT 'local',
    "displayName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "interfaceLocale" TEXT NOT NULL DEFAULT 'vi',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "dailyGoalMinutes" INTEGER NOT NULL DEFAULT 15,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "streakFreezes" INTEGER NOT NULL DEFAULT 1,
    "lastActiveDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "sourceLanguageCode" TEXT NOT NULL DEFAULT 'vi',
    "targetLanguageCode" TEXT NOT NULL DEFAULT 'en',
    "cefrLevel" TEXT NOT NULL DEFAULT 'A1',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "courseId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "iconName" TEXT NOT NULL DEFAULT 'book',

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 20,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdBy" TEXT,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_exercises" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "optionsJson" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdBy" TEXT,

    CONSTRAINT "quiz_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabularies" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT,
    "subTopicId" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A1',
    "targetText" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "phonetic" TEXT,
    "phoneticUs" TEXT,
    "phoneticUk" TEXT,
    "partOfSpeech" TEXT,
    "audioUrl" TEXT,
    "exampleSentence" TEXT,
    "exampleTranslation" TEXT,
    "collocationsJson" TEXT DEFAULT '[]',
    "synonymsJson" TEXT DEFAULT '[]',
    "antonymsJson" TEXT DEFAULT '[]',
    "frequencyRank" INTEGER,
    "category" TEXT NOT NULL DEFAULT 'general',
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdBy" TEXT,

    CONSTRAINT "vocabularies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_word_states" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "repetition" INTEGER NOT NULL DEFAULT 0,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "efactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "stability" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "difficulty" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "state" TEXT NOT NULL DEFAULT 'review',
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastQuality" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_word_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_lesson_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "attempt_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameType" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "xpBonus" INTEGER NOT NULL DEFAULT 50,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_tracks" (
    "id" TEXT NOT NULL,
    "targetBand" DOUBLE PRECISION NOT NULL DEFAULT 6.5,
    "type" TEXT NOT NULL DEFAULT 'academic',
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "part" TEXT NOT NULL,
    "targetBand" DOUBLE PRECISION NOT NULL DEFAULT 6.0,
    "passageText" TEXT,
    "audioUrl" TEXT,
    "prompt" TEXT,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "beforeState" JSONB,
    "afterState" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_mock_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'academic',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationSec" INTEGER NOT NULL DEFAULT 0,
    "rawScoreJson" TEXT NOT NULL,
    "bandScoreJson" TEXT NOT NULL,

    CONSTRAINT "ielts_mock_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_writing_submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attemptId" TEXT,
    "taskType" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "essayText" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "overallBand" DOUBLE PRECISION NOT NULL,
    "taskAchieveBand" DOUBLE PRECISION NOT NULL,
    "coherenceBand" DOUBLE PRECISION NOT NULL,
    "lexicalBand" DOUBLE PRECISION NOT NULL,
    "grammarBand" DOUBLE PRECISION NOT NULL,
    "feedbackJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_writing_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sourceType" TEXT,
    "ragRefs" TEXT,
    "pageContext" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "writing_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "writing_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "readingTimeSeconds" INTEGER NOT NULL,
    "wpm" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "answersJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "elapsedSeconds" INTEGER NOT NULL DEFAULT 0,
    "answersJson" TEXT NOT NULL DEFAULT '[]',
    "resultJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT 'mascot-scholar',
    "targetLanguage" TEXT NOT NULL DEFAULT 'en',
    "currentLevel" TEXT NOT NULL DEFAULT 'B1 Intermediate',
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "badgesJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendships" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'accepted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_notes" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tagsJson" TEXT NOT NULL DEFAULT '[]',
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_comments" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_reactions" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetLanguage" TEXT NOT NULL DEFAULT 'en',
    "level" TEXT NOT NULL DEFAULT 'Intermediate',
    "ownerId" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetDailyMinutes" INTEGER NOT NULL DEFAULT 30,
    "targetWeeklyXP" INTEGER NOT NULL DEFAULT 500,
    "targetSkill" TEXT NOT NULL DEFAULT 'all',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "activeMinutes" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "reviewsCompleted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL,
    "pronunciationScore" INTEGER NOT NULL,
    "fluencyScore" INTEGER NOT NULL,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speaking_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_folders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'blue',
    "icon" TEXT NOT NULL DEFAULT 'folder',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocabulary_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folder_vocabularies" (
    "id" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "folder_vocabularies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'LinguaFlow Editorial',
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 3,
    "wordCount" INTEGER NOT NULL DEFAULT 150,
    "coverImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_paragraphs" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "english" TEXT NOT NULL,
    "vietnamese" TEXT NOT NULL,
    "audioUrl" TEXT,

    CONSTRAINT "reading_paragraphs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_questions" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "optionsJson" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'A1',
    "relatedParagraph" INTEGER,

    CONSTRAINT "reading_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_user_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "currentParagraph" INTEGER NOT NULL DEFAULT 0,
    "scrollProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "writing_prompts" (
    "id" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instruction" TEXT NOT NULL,
    "imageHint" TEXT,
    "scenario" TEXT,
    "targetWords" TEXT NOT NULL DEFAULT '[]',
    "targetGrammar" TEXT,
    "sampleAnswer" TEXT,
    "category" TEXT NOT NULL DEFAULT 'General',
    "minWords" INTEGER NOT NULL DEFAULT 10,
    "maxWords" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "writing_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guided_writing_steps" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "hint" TEXT,
    "samplePhrase" TEXT,

    CONSTRAINT "guided_writing_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "writing_feedback_reports" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "grammarScore" INTEGER NOT NULL,
    "vocabularyScore" INTEGER NOT NULL,
    "naturalnessScore" INTEGER NOT NULL,
    "relevanceScore" INTEGER NOT NULL,
    "completenessScore" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "correctionsJson" TEXT NOT NULL DEFAULT '[]',
    "strengthsJson" TEXT NOT NULL DEFAULT '[]',
    "suggestionsJson" TEXT NOT NULL DEFAULT '[]',
    "vocabularySuggestionsJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "writing_feedback_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_prompts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'A1',
    "cefr" TEXT NOT NULL DEFAULT 'A1',
    "topic" TEXT NOT NULL DEFAULT 'Daily Life',
    "targetWords" TEXT NOT NULL DEFAULT '[]',
    "targetPhrases" TEXT NOT NULL DEFAULT '[]',
    "sampleAnswer" TEXT,
    "audioSampleUrl" TEXT,
    "durationSeconds" INTEGER NOT NULL DEFAULT 30,
    "minWords" INTEGER NOT NULL DEFAULT 5,
    "maxWords" INTEGER NOT NULL DEFAULT 50,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "imagePrompt" TEXT,
    "scenario" TEXT,
    "stepsJson" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speaking_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_phoneme_feedbacks" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "phonemesJson" TEXT NOT NULL DEFAULT '[]',
    "pronunciationScore" INTEGER NOT NULL,
    "fluencyScore" INTEGER NOT NULL,
    "grammarScore" INTEGER NOT NULL,
    "vocabularyScore" INTEGER NOT NULL,
    "coherenceScore" INTEGER NOT NULL,
    "audioRecordingUrl" TEXT,
    "suggestionsJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speaking_phoneme_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standardized_exams" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'Intermediate',
    "durationMinutes" INTEGER NOT NULL DEFAULT 120,
    "totalQuestions" INTEGER NOT NULL DEFAULT 200,
    "passingScore" INTEGER NOT NULL DEFAULT 600,
    "instructions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "standardized_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_sections" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "sectionType" TEXT NOT NULL,
    "partNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT,
    "audioUrl" TEXT,
    "passageText" TEXT,
    "totalQuestions" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "exam_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_questions" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "questionText" TEXT,
    "passageText" TEXT,
    "audioUrl" TEXT,
    "imageUrl" TEXT,
    "optionsJson" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "points" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor_context_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cefrEstimate" TEXT NOT NULL DEFAULT 'B2',
    "overallScore" INTEGER NOT NULL DEFAULT 75,
    "weaknesses" TEXT NOT NULL DEFAULT '[]',
    "skillScoresJson" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutor_context_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adaptive_learning_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "daysCount" INTEGER NOT NULL DEFAULT 7,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adaptive_learning_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adaptive_plan_items" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "skill" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "focusTopic" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 15,
    "targetDrillUrl" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "score" INTEGER,

    CONSTRAINT "adaptive_plan_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor_recommendations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "actionUrl" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutor_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "major_topics" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "levelBadge" TEXT NOT NULL DEFAULT 'Standard',
    "categoryGroup" TEXT NOT NULL DEFAULT 'cefr',
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "major_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_topics" (
    "id" TEXT NOT NULL,
    "majorTopicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sub_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "srs_review_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER NOT NULL,
    "scheduledDays" INTEGER NOT NULL,
    "elapsedDays" INTEGER NOT NULL,
    "lastInterval" INTEGER NOT NULL,
    "newInterval" INTEGER NOT NULL,
    "responseTimeMs" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "srs_review_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_quests" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "questType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetCount" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "daily_quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_quest_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedAt" TIMESTAMP(3),

    CONSTRAINT "user_quest_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_leagues" (
    "id" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "weeklyXP" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_leagues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_word_states_userId_wordId_key" ON "user_word_states"("userId", "wordId");

-- CreateIndex
CREATE UNIQUE INDEX "user_lesson_progress_userId_lessonId_key" ON "user_lesson_progress"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "game_sessions_attemptId_key" ON "game_sessions"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_code_key" ON "achievements"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_userId_achievementId_key" ON "user_achievements"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "writing_attempts_userId_createdAt_idx" ON "writing_attempts"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "reading_attempts_userId_createdAt_idx" ON "reading_attempts"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "exam_attempts_userId_status_idx" ON "exam_attempts"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "community_profiles_userId_key" ON "community_profiles"("userId");

-- CreateIndex
CREATE INDEX "friendships_requesterId_idx" ON "friendships"("requesterId");

-- CreateIndex
CREATE INDEX "friendships_addresseeId_idx" ON "friendships"("addresseeId");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_requesterId_addresseeId_key" ON "friendships"("requesterId", "addresseeId");

-- CreateIndex
CREATE INDEX "study_notes_authorId_createdAt_idx" ON "study_notes"("authorId", "createdAt");

-- CreateIndex
CREATE INDEX "note_comments_noteId_idx" ON "note_comments"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "note_reactions_noteId_userId_type_key" ON "note_reactions"("noteId", "userId", "type");

-- CreateIndex
CREATE INDEX "group_members_userId_idx" ON "group_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_groupId_userId_key" ON "group_members"("groupId", "userId");

-- CreateIndex
CREATE INDEX "learning_goals_userId_idx" ON "learning_goals"("userId");

-- CreateIndex
CREATE INDEX "daily_activity_logs_userId_date_idx" ON "daily_activity_logs"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_activity_logs_userId_date_key" ON "daily_activity_logs"("userId", "date");

-- CreateIndex
CREATE INDEX "speaking_attempts_userId_createdAt_idx" ON "speaking_attempts"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "vocabulary_folders_userId_idx" ON "vocabulary_folders"("userId");

-- CreateIndex
CREATE INDEX "folder_vocabularies_folderId_idx" ON "folder_vocabularies"("folderId");

-- CreateIndex
CREATE UNIQUE INDEX "folder_vocabularies_folderId_wordId_key" ON "folder_vocabularies"("folderId", "wordId");

-- CreateIndex
CREATE INDEX "reading_paragraphs_articleId_order_idx" ON "reading_paragraphs"("articleId", "order");

-- CreateIndex
CREATE INDEX "reading_questions_articleId_order_idx" ON "reading_questions"("articleId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "reading_user_progress_userId_articleId_key" ON "reading_user_progress"("userId", "articleId");

-- CreateIndex
CREATE INDEX "guided_writing_steps_promptId_stepNumber_idx" ON "guided_writing_steps"("promptId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "writing_feedback_reports_attemptId_key" ON "writing_feedback_reports"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "speaking_phoneme_feedbacks_attemptId_key" ON "speaking_phoneme_feedbacks"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "standardized_exams_code_key" ON "standardized_exams"("code");

-- CreateIndex
CREATE INDEX "exam_sections_examId_order_idx" ON "exam_sections"("examId", "order");

-- CreateIndex
CREATE INDEX "exam_questions_sectionId_order_idx" ON "exam_questions"("sectionId", "order");

-- CreateIndex
CREATE INDEX "tutor_context_snapshots_userId_idx" ON "tutor_context_snapshots"("userId");

-- CreateIndex
CREATE INDEX "adaptive_learning_plans_userId_status_idx" ON "adaptive_learning_plans"("userId", "status");

-- CreateIndex
CREATE INDEX "adaptive_plan_items_planId_dayNumber_idx" ON "adaptive_plan_items"("planId", "dayNumber");

-- CreateIndex
CREATE INDEX "tutor_recommendations_userId_isDismissed_idx" ON "tutor_recommendations"("userId", "isDismissed");

-- CreateIndex
CREATE INDEX "sub_topics_majorTopicId_order_idx" ON "sub_topics"("majorTopicId", "order");

-- CreateIndex
CREATE INDEX "srs_review_logs_userId_wordId_idx" ON "srs_review_logs"("userId", "wordId");

-- CreateIndex
CREATE INDEX "srs_review_logs_reviewedAt_idx" ON "srs_review_logs"("reviewedAt");

-- CreateIndex
CREATE INDEX "daily_quests_date_idx" ON "daily_quests"("date");

-- CreateIndex
CREATE UNIQUE INDEX "user_quest_progress_userId_questId_key" ON "user_quest_progress"("userId", "questId");

-- CreateIndex
CREATE INDEX "weekly_leagues_tier_weekNumber_year_rank_idx" ON "weekly_leagues"("tier", "weekNumber", "year", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_leagues_tier_weekNumber_year_userId_key" ON "weekly_leagues"("tier", "weekNumber", "year", "userId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_exercises" ADD CONSTRAINT "quiz_exercises_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabularies" ADD CONSTRAINT "vocabularies_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabularies" ADD CONSTRAINT "vocabularies_subTopicId_fkey" FOREIGN KEY ("subTopicId") REFERENCES "sub_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word_states" ADD CONSTRAINT "user_word_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word_states" ADD CONSTRAINT "user_word_states_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "vocabularies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_sessions" ADD CONSTRAINT "attempt_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_mock_attempts" ADD CONSTRAINT "ielts_mock_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_writing_submissions" ADD CONSTRAINT "ielts_writing_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_writing_submissions" ADD CONSTRAINT "ielts_writing_submissions_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ielts_mock_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_attempts" ADD CONSTRAINT "writing_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_attempts" ADD CONSTRAINT "reading_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_profiles" ADD CONSTRAINT "community_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_notes" ADD CONSTRAINT "study_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_comments" ADD CONSTRAINT "note_comments_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "study_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_reactions" ADD CONSTRAINT "note_reactions_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "study_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "study_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_goals" ADD CONSTRAINT "learning_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_activity_logs" ADD CONSTRAINT "daily_activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_attempts" ADD CONSTRAINT "speaking_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_folders" ADD CONSTRAINT "vocabulary_folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder_vocabularies" ADD CONSTRAINT "folder_vocabularies_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "vocabulary_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_paragraphs" ADD CONSTRAINT "reading_paragraphs_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "reading_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_questions" ADD CONSTRAINT "reading_questions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "reading_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_user_progress" ADD CONSTRAINT "reading_user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_user_progress" ADD CONSTRAINT "reading_user_progress_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "reading_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guided_writing_steps" ADD CONSTRAINT "guided_writing_steps_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "writing_prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_sections" ADD CONSTRAINT "exam_sections_examId_fkey" FOREIGN KEY ("examId") REFERENCES "standardized_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "exam_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_context_snapshots" ADD CONSTRAINT "tutor_context_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptive_learning_plans" ADD CONSTRAINT "adaptive_learning_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptive_plan_items" ADD CONSTRAINT "adaptive_plan_items_planId_fkey" FOREIGN KEY ("planId") REFERENCES "adaptive_learning_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_recommendations" ADD CONSTRAINT "tutor_recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_topics" ADD CONSTRAINT "sub_topics_majorTopicId_fkey" FOREIGN KEY ("majorTopicId") REFERENCES "major_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srs_review_logs" ADD CONSTRAINT "srs_review_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srs_review_logs" ADD CONSTRAINT "srs_review_logs_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "vocabularies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_progress" ADD CONSTRAINT "user_quest_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_progress" ADD CONSTRAINT "user_quest_progress_questId_fkey" FOREIGN KEY ("questId") REFERENCES "daily_quests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

