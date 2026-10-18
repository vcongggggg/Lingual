-- CreateTable content_packages
CREATE TABLE IF NOT EXISTS "content_packages" (
    "id" TEXT NOT NULL,
    "topic" TEXT,
    "topicVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "dialogueJson" TEXT NOT NULL DEFAULT '{}',
    "dictationJson" TEXT NOT NULL DEFAULT '{}',
    "shadowingJson" TEXT NOT NULL DEFAULT '{}',
    "wordOrderJson" TEXT NOT NULL DEFAULT '[]',
    "quizJson" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "content_packages_cefrLevel_idx" ON "content_packages"("cefrLevel");

-- CreateTable bilingual_articles
CREATE TABLE IF NOT EXISTS "bilingual_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "topic" TEXT,
    "topicVi" TEXT,
    "paragraphsJson" TEXT NOT NULL DEFAULT '[]',
    "quizJson" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bilingual_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bilingual_articles_cefrLevel_idx" ON "bilingual_articles"("cefrLevel");

-- CreateTable bilingual_stories
CREATE TABLE IF NOT EXISTS "bilingual_stories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "topic" TEXT,
    "topicVi" TEXT,
    "pagesJson" TEXT NOT NULL DEFAULT '[]',
    "quizJson" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bilingual_stories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "bilingual_stories_cefrLevel_idx" ON "bilingual_stories"("cefrLevel");
