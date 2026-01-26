-- =====================================================
-- EXTENSIONES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA DE ROLES
-- =====================================================
CREATE TYPE "UserRole" AS ENUM ('owner', 'operator', 'admin');

-- =====================================================
-- TABLA DE APPOINTMENT STATUS
-- =====================================================
CREATE TYPE "AppointmentStatus" AS ENUM (
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

-- =====================================================
-- VETERINARIAS
-- =====================================================
CREATE TABLE "veterinaries" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "phone" VARCHAR(20),
  "address" TEXT,
  "city" VARCHAR(100),
  "state" VARCHAR(100),
  "country" VARCHAR(100) DEFAULT 'República Dominicana',
  "postal_code" VARCHAR(20),
  "logo_url" TEXT,
  "business_hours" JSONB,
  "is_active" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) DEFAULT NOW()
);

-- =====================================================
-- TABLA DE USUARIOS
-- =====================================================
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "full_name" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(20),
  "role" "UserRole" NOT NULL DEFAULT 'owner',
  "veterinary_id" UUID REFERENCES "veterinaries"("id"),
  "is_active" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) DEFAULT NOW()
);

-- =====================================================
-- DUEÑOS/PROPIETARIOS
-- =====================================================
CREATE TABLE "owners" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "veterinary_id" UUID REFERENCES "veterinaries"("id"),
  "address" TEXT,
  "city" VARCHAR(100),
  "emergency_contact_name" VARCHAR(255),
  "emergency_contact_phone" VARCHAR(20),
  "notes" TEXT,
  "created_at" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) DEFAULT NOW()
);

-- =====================================================
-- OPERADORES
-- =====================================================
CREATE TABLE "operators" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "veterinary_id" UUID NOT NULL REFERENCES "veterinaries"("id"),
  "position" VARCHAR(100),
  "hire_date" DATE,
  "is_active" BOOLEAN DEFAULT TRUE,
  "permissions" JSONB,
  "created_at" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) DEFAULT NOW()
);

-- =====================================================
-- PACIENTES (MASCOTAS)
-- =====================================================
CREATE TABLE "patients" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "owner_id" UUID NOT NULL REFERENCES "owners"("id") ON DELETE CASCADE,
  "veterinary_id" UUID REFERENCES "veterinaries"("id"),
  "name" VARCHAR(255) NOT NULL,
  "species" VARCHAR(100) NOT NULL,
  "breed" VARCHAR(100),
  "color" VARCHAR(100),
  "birth_date" DATE,
  "gender" VARCHAR(20),
  "weight" DECIMAL(10,2),
  "photo_url" TEXT,
  "microchip_number" VARCHAR(50),
  "is_neutered" BOOLEAN DEFAULT FALSE,
  "allergies" TEXT,
  "special_conditions" TEXT,
  "is_active" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) DEFAULT NOW()
);

-- =====================================================
-- CITAS
-- =====================================================
CREATE TABLE "appointments" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "patient_id" UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "owner_id" UUID REFERENCES "owners"("id"),
  "veterinary_id" UUID REFERENCES "veterinaries"("id"),
  "operator_id" UUID REFERENCES "operators"("id"),
  "date_time" TIMESTAMPTZ(6) NOT NULL,
  "duration_minutes" INTEGER DEFAULT 30,
  "status" "AppointmentStatus" DEFAULT 'scheduled',
  "appointment_type" VARCHAR(100),
  "reason" TEXT NOT NULL,
  "notes" TEXT,
  "google_calendar_event_id" VARCHAR(255),
  "reminder_sent" BOOLEAN DEFAULT FALSE,
  "reminder_sent_at" TIMESTAMPTZ(6),
  "cancelled_at" TIMESTAMPTZ(6),
  "cancellation_reason" TEXT,
  "created_by" UUID REFERENCES "users"("id"),
  "created_at" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) DEFAULT NOW()
);

-- =====================================================
-- PROCEDIMIENTOS/SERVICIOS
-- =====================================================
CREATE TABLE "procedures" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "appointment_id" UUID NOT NULL REFERENCES "appointments"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "cost" DECIMAL(10,2),
  "duration_minutes" INTEGER,
  "performed_by" UUID REFERENCES "operators"("id"),
  "performed_at" TIMESTAMPTZ(6) DEFAULT NOW(),
  "created_at" TIMESTAMPTZ(6) DEFAULT NOW()
);

-- =====================================================
-- HISTORIAL CLÍNICO
-- =====================================================
CREATE TABLE "clinical_records" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "patient_id" UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "appointment_id" UUID REFERENCES "appointments"("id"),
  "veterinary_id" UUID REFERENCES "veterinaries"("id"),
  "recorded_by" UUID REFERENCES "operators"("id"),
  "record_type" VARCHAR(50),
  "diagnosis" TEXT,
  "symptoms" TEXT,
  "treatment" TEXT,
  "medications" JSONB,
  "lab_results" JSONB,
  "images" JSONB,
  "observations" TEXT,
  "follow_up_date" DATE,
  "created_at" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) DEFAULT NOW()
);

-- =====================================================
-- VACUNAS
-- =====================================================
CREATE TABLE "vaccinations" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "patient_id" UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "clinical_record_id" UUID REFERENCES "clinical_records"("id"),
  "vaccine_name" VARCHAR(255) NOT NULL,
  "vaccine_type" VARCHAR(100),
  "batch_number" VARCHAR(100),
  "administered_date" DATE NOT NULL,
  "next_due_date" DATE,
  "administered_by" UUID REFERENCES "operators"("id"),
  "notes" TEXT,
  "created_at" TIMESTAMPTZ(6) DEFAULT NOW()
);

-- =====================================================
-- RECORDATORIOS DE EMAIL
-- =====================================================
CREATE TABLE "email_reminders" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "appointment_id" UUID NOT NULL REFERENCES "appointments"("id") ON DELETE CASCADE,
  "owner_id" UUID REFERENCES "owners"("id"),
  "email_to" VARCHAR(255) NOT NULL,
  "subject" VARCHAR(255),
  "body" TEXT,
  "scheduled_for" TIMESTAMPTZ(6) NOT NULL,
  "sent_at" TIMESTAMPTZ(6),
  "status" VARCHAR(50) DEFAULT 'pending',
  "error_message" TEXT,
  "created_at" TIMESTAMPTZ(6) DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_veterinary_id_idx" ON "users"("veterinary_id");
CREATE INDEX "owners_user_id_idx" ON "owners"("user_id");
CREATE INDEX "operators_user_id_idx" ON "operators"("user_id");
CREATE INDEX "patients_owner_id_idx" ON "patients"("owner_id");
CREATE INDEX "appointments_patient_id_idx" ON "appointments"("patient_id");
CREATE INDEX "appointments_owner_id_idx" ON "appointments"("owner_id");
CREATE INDEX "appointments_date_time_idx" ON "appointments"("date_time");
CREATE INDEX "appointments_status_idx" ON "appointments"("status");
CREATE INDEX "clinical_records_patient_id_idx" ON "clinical_records"("patient_id");
CREATE INDEX "vaccinations_patient_id_idx" ON "vaccinations"("patient_id");

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON "owners"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_operators_updated_at BEFORE UPDATE ON "operators"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON "patients"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON "appointments"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinical_records_updated_at BEFORE UPDATE ON "clinical_records"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_veterinaries_updated_at BEFORE UPDATE ON "veterinaries"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
