-- CreateTable listening_monologues
CREATE TABLE IF NOT EXISTS "listening_monologues" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "scriptJson" TEXT NOT NULL DEFAULT '[]',
    "questionsJson" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listening_monologues_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "listening_monologues_cefrLevel_idx" ON "listening_monologues"("cefrLevel");

-- CreateTable dictation_sentences
CREATE TABLE IF NOT EXISTS "dictation_sentences" (
    "id" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "textVi" TEXT NOT NULL,
    "trickyWordsJson" TEXT NOT NULL DEFAULT '[]',
    "audioUrl" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dictation_sentences_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "dictation_sentences_cefrLevel_idx" ON "dictation_sentences"("cefrLevel");

-- CreateTable situational_phrases
CREATE TABLE IF NOT EXISTS "situational_phrases" (
    "id" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "situationVi" TEXT,
    "en" TEXT NOT NULL,
    "vi" TEXT NOT NULL,
    "audioUrl" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "situational_phrases_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "situational_phrases_situation_idx" ON "situational_phrases"("situation");
CREATE INDEX IF NOT EXISTS "situational_phrases_cefrLevel_idx" ON "situational_phrases"("cefrLevel");

-- CreateTable business_phrases
CREATE TABLE IF NOT EXISTS "business_phrases" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categoryVi" TEXT,
    "en" TEXT NOT NULL,
    "vi" TEXT NOT NULL,
    "exampleEn" TEXT,
    "audioUrl" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'B2',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_phrases_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "business_phrases_category_idx" ON "business_phrases"("category");
CREATE INDEX IF NOT EXISTS "business_phrases_cefrLevel_idx" ON "business_phrases"("cefrLevel");

-- CreateTable travel_phrases
CREATE TABLE IF NOT EXISTS "travel_phrases" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categoryVi" TEXT,
    "en" TEXT NOT NULL,
    "vi" TEXT NOT NULL,
    "exampleEn" TEXT,
    "audioUrl" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "travel_phrases_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "travel_phrases_category_idx" ON "travel_phrases"("category");
CREATE INDEX IF NOT EXISTS "travel_phrases_cefrLevel_idx" ON "travel_phrases"("cefrLevel");
