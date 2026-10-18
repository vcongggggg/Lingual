-- AlterTable vocabularies
ALTER TABLE "vocabularies" ADD COLUMN IF NOT EXISTS "exampleAudioUrl" TEXT;

-- CreateTable grammar_questions
CREATE TABLE IF NOT EXISTS "grammar_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "optionsJson" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanationVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "topic" TEXT,
    "topicVi" TEXT,
    "skillFocus" TEXT NOT NULL DEFAULT 'grammar',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grammar_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "grammar_questions_cefrLevel_idx" ON "grammar_questions"("cefrLevel");

-- CreateTable shadowing_sentences
CREATE TABLE IF NOT EXISTS "shadowing_sentences" (
    "id" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "textVi" TEXT NOT NULL,
    "phonetic" TEXT,
    "audioUrl" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "topic" TEXT,
    "focusWords" TEXT DEFAULT '[]',
    "skillFocus" TEXT NOT NULL DEFAULT 'speaking',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shadowing_sentences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "shadowing_sentences_cefrLevel_idx" ON "shadowing_sentences"("cefrLevel");

-- CreateTable dialogue_scenarios
CREATE TABLE IF NOT EXISTS "dialogue_scenarios" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleVi" TEXT,
    "topic" TEXT,
    "topicVi" TEXT,
    "location" TEXT,
    "locationVi" TEXT,
    "characters" TEXT,
    "contextDesc" TEXT,
    "linesJson" TEXT NOT NULL DEFAULT '[]',
    "questionsJson" TEXT NOT NULL DEFAULT '[]',
    "cefrLevel" TEXT NOT NULL DEFAULT 'B1',
    "skillFocus" TEXT NOT NULL DEFAULT 'listening',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dialogue_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "dialogue_scenarios_cefrLevel_idx" ON "dialogue_scenarios"("cefrLevel");

-- CreateTable story_templates
CREATE TABLE IF NOT EXISTS "story_templates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleVi" TEXT,
    "mascotReaction" TEXT NOT NULL DEFAULT 'storyteller',
    "paragraphsJson" TEXT NOT NULL DEFAULT '[]',
    "slotsJson" TEXT NOT NULL DEFAULT '[]',
    "slotHintsJson" TEXT NOT NULL DEFAULT '[]',
    "quizQuestionsJson" TEXT NOT NULL DEFAULT '[]',
    "cefrLevel" TEXT NOT NULL DEFAULT 'B1',
    "topic" TEXT,
    "skillFocus" TEXT NOT NULL DEFAULT 'reading',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "story_templates_cefrLevel_idx" ON "story_templates"("cefrLevel");
