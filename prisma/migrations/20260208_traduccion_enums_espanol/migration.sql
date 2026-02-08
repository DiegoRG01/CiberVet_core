-- Migración para traducir valores de enums de inglés a español
-- Esta migración actualiza los valores existentes en la base de datos antes de modificar los enums

-- Paso 1: Crear nuevos tipos enum temporales con los valores en español
CREATE TYPE "UserRole_new" AS ENUM ('propietario', 'operador', 'admin');
CREATE TYPE "AppointmentStatus_new" AS ENUM ('programada', 'confirmada', 'en_progreso', 'completada', 'cancelada', 'no_asistio');

-- Paso 2: Actualizar la tabla users
-- Primero agregar una columna temporal
ALTER TABLE "users" ADD COLUMN "role_new" "UserRole_new";

-- Mapear los valores antiguos a los nuevos
UPDATE "users" SET "role_new" = 
  CASE 
    WHEN "role" = 'owner' THEN 'propietario'::"UserRole_new"
    WHEN "role" = 'operator' THEN 'operador'::"UserRole_new"
    WHEN "role" = 'admin' THEN 'admin'::"UserRole_new"
  END;

-- Eliminar la columna antigua y renombrar la nueva
ALTER TABLE "users" DROP COLUMN "role";
ALTER TABLE "users" RENAME COLUMN "role_new" TO "role";

-- Paso 3: Actualizar la tabla appointments
-- Primero agregar una columna temporal
ALTER TABLE "appointments" ADD COLUMN "status_new" "AppointmentStatus_new";

-- Mapear los valores antiguos a los nuevos
UPDATE "appointments" SET "status_new" = 
  CASE 
    WHEN "status" = 'scheduled' THEN 'programada'::"AppointmentStatus_new"
    WHEN "status" = 'confirmed' THEN 'confirmada'::"AppointmentStatus_new"
    WHEN "status" = 'in_progress' THEN 'en_progreso'::"AppointmentStatus_new"
    WHEN "status" = 'completed' THEN 'completada'::"AppointmentStatus_new"
    WHEN "status" = 'cancelled' THEN 'cancelada'::"AppointmentStatus_new"
    WHEN "status" = 'no_show' THEN 'no_asistio'::"AppointmentStatus_new"
  END;

-- Eliminar la columna antigua y renombrar la nueva
ALTER TABLE "appointments" DROP COLUMN "status";
ALTER TABLE "appointments" RENAME COLUMN "status_new" TO "status";

-- Paso 4: Eliminar los tipos enum antiguos
DROP TYPE "UserRole";
DROP TYPE "AppointmentStatus";

-- Paso 5: Renombrar los nuevos tipos enum
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";

-- Paso 6: Establecer valores por defecto
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'propietario'::"UserRole";
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'programada'::"AppointmentStatus";
