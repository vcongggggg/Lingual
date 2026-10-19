-- CreateTable ielts_speaking_topics
CREATE TABLE IF NOT EXISTS "ielts_speaking_topics" (
    "id" TEXT NOT NULL,
    "part" INTEGER NOT NULL DEFAULT 1,
    "question" TEXT NOT NULL,
    "topicVi" TEXT,
    "ideasJson" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_speaking_topics_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ielts_speaking_topics_part_idx" ON "ielts_speaking_topics"("part");

-- CreateTable ielts_writing_topics
CREATE TABLE IF NOT EXISTS "ielts_writing_topics" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'opinion',
    "typeVi" TEXT,
    "outlineJson" TEXT NOT NULL DEFAULT '{}',
    "keyVocabJson" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_writing_topics_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ielts_writing_topics_type_idx" ON "ielts_writing_topics"("type");
