-- CreateTable
CREATE TABLE "game_questions" (
    "id" TEXT NOT NULL,
    "game_type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "choices" JSONB,
    "answer" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'A2',
    "source" TEXT NOT NULL DEFAULT 'script-derived',
    "source_ref" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "game_questions_game_type_idx" ON "game_questions"("game_type");

-- CreateIndex
CREATE INDEX "game_questions_level_idx" ON "game_questions"("level");
