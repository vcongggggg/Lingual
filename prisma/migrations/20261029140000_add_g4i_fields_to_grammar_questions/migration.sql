-- AlterTable
ALTER TABLE "grammar_questions" ALTER COLUMN "correctAnswer" DROP NOT NULL;
ALTER TABLE "grammar_questions" ADD COLUMN IF NOT EXISTS "questionNumber" INTEGER;
ALTER TABLE "grammar_questions" ADD COLUMN IF NOT EXISTS "type" TEXT;
ALTER TABLE "grammar_questions" ADD COLUMN IF NOT EXISTS "sourceRef" TEXT;
ALTER TABLE "grammar_questions" ADD COLUMN IF NOT EXISTS "gapReason" TEXT;
ALTER TABLE "grammar_questions" ADD COLUMN IF NOT EXISTS "derived" BOOLEAN DEFAULT false;
ALTER TABLE "grammar_questions" ADD COLUMN IF NOT EXISTS "keyTypo" TEXT;
ALTER TABLE "grammar_questions" ADD COLUMN IF NOT EXISTS "weakMatch" BOOLEAN DEFAULT false;
