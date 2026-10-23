-- AlterTable
ALTER TABLE "grammar_explanations" ADD COLUMN     "ruleEn" TEXT;

-- AlterTable
ALTER TABLE "ielts_reading_passages" ADD COLUMN     "track" TEXT NOT NULL DEFAULT 'academic';

-- AlterTable
ALTER TABLE "ielts_writing_topics" ADD COLUMN     "track" TEXT NOT NULL DEFAULT 'academic';

-- AlterTable
ALTER TABLE "vocabularies" ADD COLUMN     "wordFormsJson" JSONB;

-- CreateTable
CREATE TABLE "lexis_questions" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "topic" TEXT,
    "topicVi" TEXT,
    "prompt" TEXT NOT NULL,
    "optionsJson" JSONB,
    "correctAnswer" TEXT NOT NULL,
    "explanationEn" TEXT,
    "explanationVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'B1',
    "sourceRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lexis_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_guides" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "contentEn" TEXT,
    "contentVi" TEXT,
    "sourceRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_guides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lexis_questions_contentType_cefrLevel_idx" ON "lexis_questions"("contentType", "cefrLevel");

-- CreateIndex
CREATE INDEX "study_guides_category_idx" ON "study_guides"("category");
