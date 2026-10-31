-- AlterTable
ALTER TABLE "ielts_listening_sections" 
ADD COLUMN IF NOT EXISTS "audio_url" TEXT,
ADD COLUMN IF NOT EXISTS "audio_start_sec" INTEGER,
ADD COLUMN IF NOT EXISTS "audio_end_sec" INTEGER;
