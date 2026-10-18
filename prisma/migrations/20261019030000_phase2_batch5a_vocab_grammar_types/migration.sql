-- CreateTable daily_vocab_questions
CREATE TABLE IF NOT EXISTS "daily_vocab_questions" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'en_to_vi',
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "question" TEXT NOT NULL,
    "optionsJson" TEXT NOT NULL DEFAULT '[]',
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_vocab_questions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "daily_vocab_questions_cefrLevel_idx" ON "daily_vocab_questions"("cefrLevel");

-- CreateTable idioms
CREATE TABLE IF NOT EXISTS "idioms" (
    "id" TEXT NOT NULL,
    "idiom" TEXT NOT NULL,
    "meaningVi" TEXT NOT NULL,
    "exampleEn" TEXT,
    "exampleVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'B2',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idioms_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "idioms_cefrLevel_idx" ON "idioms"("cefrLevel");

-- CreateTable phrasal_verbs
CREATE TABLE IF NOT EXISTS "phrasal_verbs" (
    "id" TEXT NOT NULL,
    "verb" TEXT NOT NULL,
    "meaningVi" TEXT NOT NULL,
    "exampleEn" TEXT,
    "exampleVi" TEXT,
    "separable" BOOLEAN NOT NULL DEFAULT false,
    "cefrLevel" TEXT NOT NULL DEFAULT 'B1',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phrasal_verbs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "phrasal_verbs_cefrLevel_idx" ON "phrasal_verbs"("cefrLevel");

-- CreateTable collocations
CREATE TABLE IF NOT EXISTS "collocations" (
    "id" TEXT NOT NULL,
    "collocation" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'verb+noun',
    "meaningVi" TEXT NOT NULL,
    "exampleEn" TEXT,
    "exampleVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'B1',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collocations_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "collocations_cefrLevel_idx" ON "collocations"("cefrLevel");

-- CreateTable synonyms_antonyms
CREATE TABLE IF NOT EXISTS "synonyms_antonyms" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "meaningVi" TEXT NOT NULL,
    "synonymsJson" TEXT NOT NULL DEFAULT '[]',
    "antonymsJson" TEXT NOT NULL DEFAULT '[]',
    "exampleEn" TEXT,
    "exampleVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'B1',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "synonyms_antonyms_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "synonyms_antonyms_cefrLevel_idx" ON "synonyms_antonyms"("cefrLevel");

-- CreateTable minimal_pairs
CREATE TABLE IF NOT EXISTS "minimal_pairs" (
    "id" TEXT NOT NULL,
    "word1" TEXT NOT NULL,
    "word2" TEXT NOT NULL,
    "phonetic1" TEXT,
    "phonetic2" TEXT,
    "differenceVi" TEXT,
    "exampleEn" TEXT,
    "exampleVi" TEXT,
    "audioUrl1" TEXT,
    "audioUrl2" TEXT,
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "minimal_pairs_pkey" PRIMARY KEY ("id")
);

-- CreateTable tongue_twisters
CREATE TABLE IF NOT EXISTS "tongue_twisters" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'easy',
    "focusSounds" TEXT,
    "guideVi" TEXT,
    "audioUrl" TEXT,
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tongue_twisters_pkey" PRIMARY KEY ("id")
);

-- CreateTable proverbs
CREATE TABLE IF NOT EXISTS "proverbs" (
    "id" TEXT NOT NULL,
    "proverb" TEXT NOT NULL,
    "meaningVi" TEXT NOT NULL,
    "vietnameseEquivalent" TEXT,
    "exampleEn" TEXT,
    "exampleVi" TEXT,
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proverbs_pkey" PRIMARY KEY ("id")
);

-- CreateTable game_word_pools
CREATE TABLE IF NOT EXISTS "game_word_pools" (
    "id" TEXT NOT NULL,
    "targetText" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "phonetic" TEXT,
    "topic" TEXT NOT NULL,
    "topicVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A1',
    "exampleSentence" TEXT,
    "exampleTranslation" TEXT,
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_word_pools_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "game_word_pools_topic_idx" ON "game_word_pools"("topic");
CREATE INDEX IF NOT EXISTS "game_word_pools_cefrLevel_idx" ON "game_word_pools"("cefrLevel");

-- CreateTable grammar_explanations
CREATE TABLE IF NOT EXISTS "grammar_explanations" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "topicVi" TEXT,
    "cefrLevel" TEXT NOT NULL DEFAULT 'A2',
    "ruleVi" TEXT NOT NULL,
    "examplesJson" TEXT NOT NULL DEFAULT '[]',
    "commonMistakesJson" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'ai-generated',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grammar_explanations_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "grammar_explanations_cefrLevel_idx" ON "grammar_explanations"("cefrLevel");
