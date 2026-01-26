/*
  Warnings:

  - Made the column `duration_minutes` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reminder_sent` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `clinical_records` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `clinical_records` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `email_reminders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `email_reminders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `operators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `operators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `operators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `operators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `owners` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `owners` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `owners` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_neutered` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `patients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `performed_at` on table `procedures` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `procedures` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `vaccinations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `veterinaries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `veterinaries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `veterinaries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `veterinaries` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_created_by_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_operator_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_veterinary_id_fkey";

-- DropForeignKey
ALTER TABLE "clinical_records" DROP CONSTRAINT "clinical_records_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "clinical_records" DROP CONSTRAINT "clinical_records_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "clinical_records" DROP CONSTRAINT "clinical_records_recorded_by_fkey";

-- DropForeignKey
ALTER TABLE "clinical_records" DROP CONSTRAINT "clinical_records_veterinary_id_fkey";

-- DropForeignKey
ALTER TABLE "email_reminders" DROP CONSTRAINT "email_reminders_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "email_reminders" DROP CONSTRAINT "email_reminders_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "operators" DROP CONSTRAINT "operators_user_id_fkey";

-- DropForeignKey
ALTER TABLE "operators" DROP CONSTRAINT "operators_veterinary_id_fkey";

-- DropForeignKey
ALTER TABLE "owners" DROP CONSTRAINT "owners_user_id_fkey";

-- DropForeignKey
ALTER TABLE "owners" DROP CONSTRAINT "owners_veterinary_id_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_veterinary_id_fkey";

-- DropForeignKey
ALTER TABLE "procedures" DROP CONSTRAINT "procedures_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "procedures" DROP CONSTRAINT "procedures_performed_by_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_veterinary_id_fkey";

-- DropForeignKey
ALTER TABLE "vaccinations" DROP CONSTRAINT "vaccinations_administered_by_fkey";

-- DropForeignKey
ALTER TABLE "vaccinations" DROP CONSTRAINT "vaccinations_clinical_record_id_fkey";

-- DropForeignKey
ALTER TABLE "vaccinations" DROP CONSTRAINT "vaccinations_patient_id_fkey";

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "duration_minutes" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "reminder_sent" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "clinical_records" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "email_reminders" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "operators" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "owners" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "is_neutered" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "procedures" ALTER COLUMN "performed_at" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "vaccinations" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "veterinaries" ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_veterinary_id_fkey" FOREIGN KEY ("veterinary_id") REFERENCES "veterinaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owners" ADD CONSTRAINT "owners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owners" ADD CONSTRAINT "owners_veterinary_id_fkey" FOREIGN KEY ("veterinary_id") REFERENCES "veterinaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operators" ADD CONSTRAINT "operators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operators" ADD CONSTRAINT "operators_veterinary_id_fkey" FOREIGN KEY ("veterinary_id") REFERENCES "veterinaries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_veterinary_id_fkey" FOREIGN KEY ("veterinary_id") REFERENCES "veterinaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_veterinary_id_fkey" FOREIGN KEY ("veterinary_id") REFERENCES "veterinaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedures" ADD CONSTRAINT "procedures_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedures" ADD CONSTRAINT "procedures_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_records" ADD CONSTRAINT "clinical_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_records" ADD CONSTRAINT "clinical_records_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_records" ADD CONSTRAINT "clinical_records_veterinary_id_fkey" FOREIGN KEY ("veterinary_id") REFERENCES "veterinaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_records" ADD CONSTRAINT "clinical_records_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_clinical_record_id_fkey" FOREIGN KEY ("clinical_record_id") REFERENCES "clinical_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_administered_by_fkey" FOREIGN KEY ("administered_by") REFERENCES "operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_reminders" ADD CONSTRAINT "email_reminders_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_reminders" ADD CONSTRAINT "email_reminders_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
