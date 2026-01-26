-- CreateTable
CREATE TABLE "activity_log" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "veterinary_id" UUID,
    "user_id" UUID,
    "action_type" VARCHAR(50) NOT NULL,
    "entity_type" VARCHAR(50),
    "entity_id" UUID,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_log_veterinary_id_idx" ON "activity_log"("veterinary_id");

-- CreateIndex
CREATE INDEX "activity_log_user_id_idx" ON "activity_log"("user_id");

-- CreateIndex
CREATE INDEX "activity_log_created_at_idx" ON "activity_log"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_veterinary_id_fkey" FOREIGN KEY ("veterinary_id") REFERENCES "veterinaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
