-- CreateTable sentence_bank
CREATE TABLE IF NOT EXISTS "sentence_bank" (
    "id" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "en_id" INTEGER,
    "vi" TEXT NOT NULL,
    "vi_id" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'tatoeba',
    "license" TEXT NOT NULL DEFAULT 'CC BY 2.0 FR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sentence_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable word_sentence_links
CREATE TABLE IF NOT EXISTS "word_sentence_links" (
    "id" TEXT NOT NULL,
    "vocabulary_id" TEXT NOT NULL,
    "sentence_bank_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "word_sentence_links_pkey" PRIMARY KEY ("id")
);

-- Indexes for sentence_bank
CREATE INDEX IF NOT EXISTS "sentence_bank_en_idx" ON "sentence_bank"("en");
CREATE INDEX IF NOT EXISTS "sentence_bank_en_id_idx" ON "sentence_bank"("en_id");

-- Indexes and Constraints for word_sentence_links
CREATE UNIQUE INDEX IF NOT EXISTS "word_sentence_links_vocabulary_id_sentence_bank_id_key" ON "word_sentence_links"("vocabulary_id", "sentence_bank_id");
CREATE INDEX IF NOT EXISTS "word_sentence_links_vocabulary_id_idx" ON "word_sentence_links"("vocabulary_id");
CREATE INDEX IF NOT EXISTS "word_sentence_links_sentence_bank_id_idx" ON "word_sentence_links"("sentence_bank_id");

-- Foreign Keys
DO $$ BEGIN
    ALTER TABLE "word_sentence_links" ADD CONSTRAINT "word_sentence_links_vocabulary_id_fkey" FOREIGN KEY ("vocabulary_id") REFERENCES "vocabularies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "word_sentence_links" ADD CONSTRAINT "word_sentence_links_sentence_bank_id_fkey" FOREIGN KEY ("sentence_bank_id") REFERENCES "sentence_bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
