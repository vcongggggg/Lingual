-- CreateTable ielts_reading_passages
CREATE TABLE IF NOT EXISTS "ielts_reading_passages" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL DEFAULT 'reading',
    "cefrLevel" TEXT NOT NULL DEFAULT 'B1',
    "title" TEXT NOT NULL,
    "passageJson" TEXT NOT NULL DEFAULT '[]',
    "questionsJson" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_reading_passages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ielts_reading_passages_cefrLevel_idx" ON "ielts_reading_passages"("cefrLevel");

-- CreateTable ielts_listening_sections
CREATE TABLE IF NOT EXISTS "ielts_listening_sections" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL DEFAULT 'listening',
    "cefrLevel" TEXT NOT NULL DEFAULT 'B1',
    "title" TEXT NOT NULL,
    "titleVi" TEXT,
    "scriptJson" TEXT NOT NULL DEFAULT '[]',
    "questionsJson" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_listening_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ielts_listening_sections_cefrLevel_idx" ON "ielts_listening_sections"("cefrLevel");

-- CreateTable curriculum_units
CREATE TABLE IF NOT EXISTS "curriculum_units" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "cefrLevel" TEXT NOT NULL DEFAULT 'B1',
    "title" TEXT NOT NULL,
    "titleVi" TEXT,
    "description" TEXT NOT NULL,
    "descriptionVi" TEXT,
    "lessonsJson" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curriculum_units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "curriculum_units_cefrLevel_idx" ON "curriculum_units"("cefrLevel");

-- CreateTable diary_prompts
CREATE TABLE IF NOT EXISTS "diary_prompts" (
    "id" TEXT NOT NULL,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "prompt" TEXT NOT NULL,
    "promptVi" TEXT,
    "keywordsJson" TEXT NOT NULL DEFAULT '[]',
    "minSentences" INTEGER NOT NULL DEFAULT 3,
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diary_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "diary_prompts_cefrLevel_idx" ON "diary_prompts"("cefrLevel");
