-- AlterTable
ALTER TABLE "users" ADD COLUMN "cefrLevel" TEXT;

-- CreateTable
CREATE TABLE "placement_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" TEXT NOT NULL,
    "bandEstimate" TEXT NOT NULL,
    "sectionScoresJson" TEXT NOT NULL,
    "answersJson" TEXT NOT NULL,
    "questionIdsJson" TEXT NOT NULL,

    CONSTRAINT "placement_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "placement_attempts_userId_idx" ON "placement_attempts"("userId");

-- AddForeignKey
ALTER TABLE "placement_attempts" ADD CONSTRAINT "placement_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
