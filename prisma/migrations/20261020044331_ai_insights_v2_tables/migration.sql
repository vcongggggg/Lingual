-- AlterTable
ALTER TABLE "notification_preferences" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "cow_weekly_reports" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "week_number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "progress_points" JSONB NOT NULL DEFAULT '[]',
    "weaknesses" JSONB NOT NULL DEFAULT '[]',
    "action_plan" JSONB NOT NULL DEFAULT '[]',
    "raw_metrics_json" JSONB,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cow_weekly_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cow_study_plans" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "plan_data" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cow_study_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cow_weekly_reports_user_id_generated_at_idx" ON "cow_weekly_reports"("user_id", "generated_at" DESC);

-- CreateIndex
CREATE INDEX "cow_weekly_reports_user_id_week_number_idx" ON "cow_weekly_reports"("user_id", "week_number");

-- CreateIndex
CREATE UNIQUE INDEX "cow_study_plans_user_id_key" ON "cow_study_plans"("user_id");

-- AddForeignKey
ALTER TABLE "cow_weekly_reports" ADD CONSTRAINT "cow_weekly_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cow_study_plans" ADD CONSTRAINT "cow_study_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
