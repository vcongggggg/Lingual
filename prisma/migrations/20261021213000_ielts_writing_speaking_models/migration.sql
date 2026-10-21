-- CreateTable ielts_writing_models
CREATE TABLE IF NOT EXISTS "ielts_writing_models" (
    "id" TEXT NOT NULL,
    "task" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "chart_type" TEXT,
    "chart_description" TEXT,
    "prompt" TEXT NOT NULL,
    "model_answer" TEXT NOT NULL,
    "key_vocab_json" TEXT NOT NULL DEFAULT '[]',
    "examiner_notes_vi" TEXT,
    "band_estimate" DOUBLE PRECISION NOT NULL DEFAULT 8.0,
    "source" TEXT NOT NULL DEFAULT 'authored',
    "license" TEXT DEFAULT 'n/a (original)',
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_writing_models_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ielts_writing_models_task_idx" ON "ielts_writing_models"("task");
CREATE INDEX IF NOT EXISTS "ielts_writing_models_topic_idx" ON "ielts_writing_models"("topic");

-- CreateTable ielts_speaking_models
CREATE TABLE IF NOT EXISTS "ielts_speaking_models" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "cue_card" TEXT NOT NULL,
    "model_answer_part2" TEXT NOT NULL,
    "part3_json" TEXT NOT NULL DEFAULT '[]',
    "key_vocab_json" TEXT NOT NULL DEFAULT '[]',
    "notes_vi" TEXT,
    "band_estimate" DOUBLE PRECISION NOT NULL DEFAULT 8.0,
    "source" TEXT NOT NULL DEFAULT 'authored',
    "license" TEXT DEFAULT 'n/a (original)',
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_speaking_models_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ielts_speaking_models_topic_idx" ON "ielts_speaking_models"("topic");
