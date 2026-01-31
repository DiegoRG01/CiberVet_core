/*
  Warnings:

  - You are about to drop the column `breed` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `species` on the `patients` table. All the data in the column will be lost.
  - Added the required column `species_id` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "breed",
DROP COLUMN "species",
ADD COLUMN     "breed_id" UUID,
ADD COLUMN     "species_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "species" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "breeds" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "species_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "breeds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "species_name_key" ON "species"("name");

-- CreateIndex
CREATE INDEX "breeds_species_id_idx" ON "breeds"("species_id");

-- CreateIndex
CREATE UNIQUE INDEX "breeds_species_id_name_key" ON "breeds"("species_id", "name");

-- CreateIndex
CREATE INDEX "patients_species_id_idx" ON "patients"("species_id");

-- CreateIndex
CREATE INDEX "patients_breed_id_idx" ON "patients"("breed_id");

-- AddForeignKey
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_breed_id_fkey" FOREIGN KEY ("breed_id") REFERENCES "breeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;
