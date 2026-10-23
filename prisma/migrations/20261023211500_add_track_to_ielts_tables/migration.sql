-- AlterTable
ALTER TABLE "ielts_listening_sections" ADD COLUMN IF NOT EXISTS "track" TEXT NOT NULL DEFAULT 'academic';

-- AlterTable
ALTER TABLE "ielts_writing_models" ADD COLUMN IF NOT EXISTS "track" TEXT NOT NULL DEFAULT 'academic';

-- AlterTable
ALTER TABLE "ielts_speaking_topics" ADD COLUMN IF NOT EXISTS "track" TEXT NOT NULL DEFAULT 'academic';
