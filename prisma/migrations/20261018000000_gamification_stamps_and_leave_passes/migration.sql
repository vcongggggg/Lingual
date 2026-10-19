-- AlterTable users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "leave_passes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastLeavePassGrantWeek" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastLeavePassUsedDate" TEXT;

-- CreateTable stamp_ledgers
CREATE TABLE IF NOT EXISTS "stamp_ledgers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stamp_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "stamp_ledgers_userId_createdAt_idx" ON "stamp_ledgers"("userId", "createdAt");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'stamp_ledgers_userId_fkey'
    ) THEN
        ALTER TABLE "stamp_ledgers" ADD CONSTRAINT "stamp_ledgers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
