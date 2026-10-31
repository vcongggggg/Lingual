-- CreateTable
CREATE TABLE "study_templates" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title_vi" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "description_vi" TEXT NOT NULL,
    "structure" JSONB NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'authored',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "study_templates_type_key" ON "study_templates"("type");
