-- AlterTable
ALTER TABLE "lexis_questions" ALTER COLUMN "correctAnswer" DROP NOT NULL;
ALTER TABLE "lexis_questions" ADD COLUMN IF NOT EXISTS "questionNumber" INTEGER;
ALTER TABLE "lexis_questions" ADD COLUMN IF NOT EXISTS "type" TEXT;
ALTER TABLE "lexis_questions" ADD COLUMN IF NOT EXISTS "gapReason" TEXT;
ALTER TABLE "lexis_questions" ADD COLUMN IF NOT EXISTS "scriptJson" TEXT;
ALTER TABLE "lexis_questions" ADD COLUMN IF NOT EXISTS "note" TEXT;

-- AlterTable
ALTER TABLE "collocations" ALTER COLUMN "meaningVi" DROP NOT NULL;
ALTER TABLE "collocations" ADD COLUMN IF NOT EXISTS "meaningEn" TEXT;
ALTER TABLE "collocations" ADD COLUMN IF NOT EXISTS "sourceRef" TEXT;

-- AlterTable
ALTER TABLE "vocabularies" ALTER COLUMN "translation" DROP NOT NULL;
ALTER TABLE "vocabularies" ADD COLUMN IF NOT EXISTS "sourceRef" TEXT;
