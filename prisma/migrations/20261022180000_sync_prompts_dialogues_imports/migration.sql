-- AlterTable: dialogue_scenarios
ALTER TABLE "dialogue_scenarios" ADD COLUMN IF NOT EXISTS "level" TEXT;
ALTER TABLE "dialogue_scenarios" ADD COLUMN IF NOT EXISTS "speakers" TEXT;
ALTER TABLE "dialogue_scenarios" ADD COLUMN IF NOT EXISTS "vi_summary" TEXT;

-- AlterTable: diary_prompts
ALTER TABLE "diary_prompts" ADD COLUMN IF NOT EXISTS "hint_vi" TEXT;
ALTER TABLE "diary_prompts" ADD COLUMN IF NOT EXISTS "theme" TEXT;

-- AlterTable: ielts_listening_sections
ALTER TABLE "ielts_listening_sections" ADD COLUMN IF NOT EXISTS "difficulty_band" TEXT;
ALTER TABLE "ielts_listening_sections" ADD COLUMN IF NOT EXISTS "license" TEXT DEFAULT 'n/a (original)';

-- AlterTable: ielts_reading_passages
ALTER TABLE "ielts_reading_passages" ADD COLUMN IF NOT EXISTS "difficulty_band" TEXT;
ALTER TABLE "ielts_reading_passages" ADD COLUMN IF NOT EXISTS "license" TEXT DEFAULT 'n/a (original)';
ALTER TABLE "ielts_reading_passages" ADD COLUMN IF NOT EXISTS "module" TEXT;
ALTER TABLE "ielts_reading_passages" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "ielts_reading_passages" ADD COLUMN IF NOT EXISTS "source_url" TEXT;

-- AlterTable: ielts_speaking_topics
ALTER TABLE "ielts_speaking_topics" ADD COLUMN IF NOT EXISTS "follow_up_questions" TEXT;
ALTER TABLE "ielts_speaking_topics" ADD COLUMN IF NOT EXISTS "topic" TEXT;

-- AlterTable: ielts_writing_topics
ALTER TABLE "ielts_writing_topics" ADD COLUMN IF NOT EXISTS "band_range" TEXT;

-- AlterTable: notification_preferences
ALTER TABLE IF EXISTS "notification_preferences" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable: vocabularies
ALTER TABLE "vocabularies" ADD COLUMN IF NOT EXISTS "license" TEXT;
ALTER TABLE "vocabularies" ADD COLUMN IF NOT EXISTS "meaning_en" TEXT;
ALTER TABLE "vocabularies" ADD COLUMN IF NOT EXISTS "meaning_vi_source" TEXT;
ALTER TABLE "vocabularies" ADD COLUMN IF NOT EXISTS "source" TEXT;
ALTER TABLE "vocabularies" ADD COLUMN IF NOT EXISTS "word_family_json" TEXT DEFAULT '[]';

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ielts_listening_sections_difficulty_band_idx" ON "ielts_listening_sections"("difficulty_band");
CREATE INDEX IF NOT EXISTS "ielts_reading_passages_difficulty_band_idx" ON "ielts_reading_passages"("difficulty_band");
