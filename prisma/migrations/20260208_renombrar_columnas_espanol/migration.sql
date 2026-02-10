-- Migración para renombrar todas las columnas de inglés a español
-- Esta migración renombra las columnas en la base de datos para que coincidan con los nombres en el código

-- =====================================================
-- TABLA: users
-- =====================================================
ALTER TABLE "users" RENAME COLUMN "email" TO "correo";
ALTER TABLE "users" RENAME COLUMN "full_name" TO "nombreCompleto";
ALTER TABLE "users" RENAME COLUMN "phone" TO "telefono";
ALTER TABLE "users" RENAME COLUMN "role" TO "rol";
ALTER TABLE "users" RENAME COLUMN "veterinary_id" TO "veterinariaId";
ALTER TABLE "users" RENAME COLUMN "is_active" TO "estaActivo";
ALTER TABLE "users" RENAME COLUMN "created_at" TO "creadoEn";
ALTER TABLE "users" RENAME COLUMN "updated_at" TO "actualizadoEn";

-- =====================================================
-- TABLA: veterinaries
-- =====================================================
ALTER TABLE "veterinaries" RENAME COLUMN "name" TO "nombre";
ALTER TABLE "veterinaries" RENAME COLUMN "email" TO "correo";
ALTER TABLE "veterinaries" RENAME COLUMN "phone" TO "telefono";
ALTER TABLE "veterinaries" RENAME COLUMN "address" TO "direccion";
ALTER TABLE "veterinaries" RENAME COLUMN "city" TO "ciudad";
ALTER TABLE "veterinaries" RENAME COLUMN "state" TO "estado";
ALTER TABLE "veterinaries" RENAME COLUMN "country" TO "pais";
ALTER TABLE "veterinaries" RENAME COLUMN "postal_code" TO "codigoPostal";
ALTER TABLE "veterinaries" RENAME COLUMN "logo_url" TO "urlLogo";
ALTER TABLE "veterinaries" RENAME COLUMN "business_hours" TO "horarioNegocio";
ALTER TABLE "veterinaries" RENAME COLUMN "is_active" TO "estaActivo";
ALTER TABLE "veterinaries" RENAME COLUMN "created_at" TO "creadoEn";
ALTER TABLE "veterinaries" RENAME COLUMN "updated_at" TO "actualizadoEn";

-- =====================================================
-- TABLA: owners
-- =====================================================
ALTER TABLE "owners" RENAME COLUMN "user_id" TO "usuarioId";
ALTER TABLE "owners" RENAME COLUMN "veterinary_id" TO "veterinariaId";
ALTER TABLE "owners" RENAME COLUMN "address" TO "direccion";
ALTER TABLE "owners" RENAME COLUMN "city" TO "ciudad";
ALTER TABLE "owners" RENAME COLUMN "emergency_contact_name" TO "nombreContactoEmergencia";
ALTER TABLE "owners" RENAME COLUMN "emergency_contact_phone" TO "telefonoContactoEmergencia";
ALTER TABLE "owners" RENAME COLUMN "notes" TO "notas";
ALTER TABLE "owners" RENAME COLUMN "created_at" TO "creadoEn";
ALTER TABLE "owners" RENAME COLUMN "updated_at" TO "actualizadoEn";

-- =====================================================
-- TABLA: operators
-- =====================================================
ALTER TABLE "operators" RENAME COLUMN "user_id" TO "usuarioId";
ALTER TABLE "operators" RENAME COLUMN "veterinary_id" TO "veterinariaId";
ALTER TABLE "operators" RENAME COLUMN "position" TO "posicion";
ALTER TABLE "operators" RENAME COLUMN "hire_date" TO "fechaContratacion";
ALTER TABLE "operators" RENAME COLUMN "is_active" TO "estaActivo";
ALTER TABLE "operators" RENAME COLUMN "permissions" TO "permisos";
ALTER TABLE "operators" RENAME COLUMN "created_at" TO "creadoEn";
ALTER TABLE "operators" RENAME COLUMN "updated_at" TO "actualizadoEn";

-- =====================================================
-- TABLA: species
-- =====================================================
ALTER TABLE "species" RENAME COLUMN "name" TO "nombre";
ALTER TABLE "species" RENAME COLUMN "description" TO "descripcion";
ALTER TABLE "species" RENAME COLUMN "is_active" TO "estaActivo";
ALTER TABLE "species" RENAME COLUMN "created_at" TO "creadoEn";
ALTER TABLE "species" RENAME COLUMN "updated_at" TO "actualizadoEn";

-- =====================================================
-- TABLA: breeds
-- =====================================================
ALTER TABLE "breeds" RENAME COLUMN "species_id" TO "especieId";
ALTER TABLE "breeds" RENAME COLUMN "name" TO "nombre";
ALTER TABLE "breeds" RENAME COLUMN "description" TO "descripcion";
ALTER TABLE "breeds" RENAME COLUMN "is_active" TO "estaActivo";
ALTER TABLE "breeds" RENAME COLUMN "created_at" TO "creadoEn";
ALTER TABLE "breeds" RENAME COLUMN "updated_at" TO "actualizadoEn";

-- =====================================================
-- TABLA: patients
-- =====================================================
ALTER TABLE "patients" RENAME COLUMN "owner_id" TO "propietarioId";
ALTER TABLE "patients" RENAME COLUMN "veterinary_id" TO "veterinariaId";
ALTER TABLE "patients" RENAME COLUMN "name" TO "nombre";
ALTER TABLE "patients" RENAME COLUMN "species_id" TO "especieId";
ALTER TABLE "patients" RENAME COLUMN "breed_id" TO "razaId";
ALTER TABLE "patients" RENAME COLUMN "birth_date" TO "fechaNacimiento";
ALTER TABLE "patients" RENAME COLUMN "gender" TO "genero";
ALTER TABLE "patients" RENAME COLUMN "weight" TO "peso";
ALTER TABLE "patients" RENAME COLUMN "photo_url" TO "urlFoto";
ALTER TABLE "patients" RENAME COLUMN "microchip_number" TO "numeroMicrochip";
ALTER TABLE "patients" RENAME COLUMN "is_neutered" TO "estaCastrado";
ALTER TABLE "patients" RENAME COLUMN "allergies" TO "alergias";
ALTER TABLE "patients" RENAME COLUMN "special_conditions" TO "condicionesEspeciales";
ALTER TABLE "patients" RENAME COLUMN "is_active" TO "estaActivo";
ALTER TABLE "patients" RENAME COLUMN "created_at" TO "creadoEn";
ALTER TABLE "patients" RENAME COLUMN "updated_at" TO "actualizadoEn";

-- =====================================================
-- TABLA: appointments
-- =====================================================
ALTER TABLE "appointments" RENAME COLUMN "patient_id" TO "pacienteId";
ALTER TABLE "appointments" RENAME COLUMN "owner_id" TO "propietarioId";
ALTER TABLE "appointments" RENAME COLUMN "veterinary_id" TO "veterinariaId";
ALTER TABLE "appointments" RENAME COLUMN "operator_id" TO "operadorId";
ALTER TABLE "appointments" RENAME COLUMN "date_time" TO "fechaHora";
ALTER TABLE "appointments" RENAME COLUMN "duration_minutes" TO "duracionMinutos";
ALTER TABLE "appointments" RENAME COLUMN "status" TO "estado";
ALTER TABLE "appointments" RENAME COLUMN "appointment_type" TO "tipoCita";
ALTER TABLE "appointments" RENAME COLUMN "reason" TO "motivo";
ALTER TABLE "appointments" RENAME COLUMN "notes" TO "notas";
ALTER TABLE "appointments" RENAME COLUMN "google_calendar_event_id" TO "idEventoGoogleCalendar";
ALTER TABLE "appointments" RENAME COLUMN "reminder_sent" TO "recordatorioEnviado";
ALTER TABLE "appointments" RENAME COLUMN "reminder_sent_at" TO "recordatorioEnviadoEn";
ALTER TABLE "appointments" RENAME COLUMN "cancelled_at" TO "canceladoEn";
ALTER TABLE "appointments" RENAME COLUMN "cancellation_reason" TO "motivoCancelacion";
ALTER TABLE "appointments" RENAME COLUMN "created_by" TO "creadoPor";
ALTER TABLE "appointments" RENAME COLUMN "created_at" TO "creadoEn";
ALTER TABLE "appointments" RENAME COLUMN "updated_at" TO "actualizadoEn";

-- =====================================================
-- TABLA: procedures
-- =====================================================
ALTER TABLE "procedures" RENAME COLUMN "appointment_id" TO "citaId";
ALTER TABLE "procedures" RENAME COLUMN "name" TO "nombre";
ALTER TABLE "procedures" RENAME COLUMN "description" TO "descripcion";
ALTER TABLE "procedures" RENAME COLUMN "cost" TO "costo";
ALTER TABLE "procedures" RENAME COLUMN "duration_minutes" TO "duracionMinutos";
ALTER TABLE "procedures" RENAME COLUMN "performed_by" TO "realizadoPor";
ALTER TABLE "procedures" RENAME COLUMN "performed_at" TO "realizadoEn";
ALTER TABLE "procedures" RENAME COLUMN "created_at" TO "creadoEn";

-- =====================================================
-- TABLA: clinical_records
-- =====================================================
ALTER TABLE "clinical_records" RENAME COLUMN "patient_id" TO "pacienteId";
ALTER TABLE "clinical_records" RENAME COLUMN "appointment_id" TO "citaId";
ALTER TABLE "clinical_records" RENAME COLUMN "veterinary_id" TO "veterinariaId";
ALTER TABLE "clinical_records" RENAME COLUMN "recorded_by" TO "registradoPor";
ALTER TABLE "clinical_records" RENAME COLUMN "record_type" TO "tipoRegistro";
ALTER TABLE "clinical_records" RENAME COLUMN "diagnosis" TO "diagnostico";
ALTER TABLE "clinical_records" RENAME COLUMN "symptoms" TO "sintomas";
ALTER TABLE "clinical_records" RENAME COLUMN "treatment" TO "tratamiento";
ALTER TABLE "clinical_records" RENAME COLUMN "medications" TO "medicamentos";
ALTER TABLE "clinical_records" RENAME COLUMN "lab_results" TO "resultadosLaboratorio";
ALTER TABLE "clinical_records" RENAME COLUMN "images" TO "imagenes";
ALTER TABLE "clinical_records" RENAME COLUMN "observations" TO "observaciones";
ALTER TABLE "clinical_records" RENAME COLUMN "follow_up_date" TO "fechaSeguimiento";
ALTER TABLE "clinical_records" RENAME COLUMN "created_at" TO "creadoEn";
ALTER TABLE "clinical_records" RENAME COLUMN "updated_at" TO "actualizadoEn";

-- =====================================================
-- TABLA: vaccinations
-- =====================================================
ALTER TABLE "vaccinations" RENAME COLUMN "patient_id" TO "pacienteId";
ALTER TABLE "vaccinations" RENAME COLUMN "clinical_record_id" TO "registroClinicoId";
ALTER TABLE "vaccinations" RENAME COLUMN "vaccine_name" TO "nombreVacuna";
ALTER TABLE "vaccinations" RENAME COLUMN "vaccine_type" TO "tipoVacuna";
ALTER TABLE "vaccinations" RENAME COLUMN "batch_number" TO "numeroLote";
ALTER TABLE "vaccinations" RENAME COLUMN "administered_date" TO "fechaAdministracion";
ALTER TABLE "vaccinations" RENAME COLUMN "next_due_date" TO "proximaFechaVencimiento";
ALTER TABLE "vaccinations" RENAME COLUMN "administered_by" TO "administradoPor";
ALTER TABLE "vaccinations" RENAME COLUMN "notes" TO "notas";
ALTER TABLE "vaccinations" RENAME COLUMN "created_at" TO "creadoEn";

-- =====================================================
-- TABLA: email_reminders
-- =====================================================
ALTER TABLE "email_reminders" RENAME COLUMN "appointment_id" TO "citaId";
ALTER TABLE "email_reminders" RENAME COLUMN "owner_id" TO "propietarioId";
ALTER TABLE "email_reminders" RENAME COLUMN "email_to" TO "correoDestino";
ALTER TABLE "email_reminders" RENAME COLUMN "subject" TO "asunto";
ALTER TABLE "email_reminders" RENAME COLUMN "body" TO "cuerpo";
ALTER TABLE "email_reminders" RENAME COLUMN "scheduled_for" TO "programadoPara";
ALTER TABLE "email_reminders" RENAME COLUMN "sent_at" TO "enviadoEn";
ALTER TABLE "email_reminders" RENAME COLUMN "status" TO "estado";
ALTER TABLE "email_reminders" RENAME COLUMN "error_message" TO "mensajeError";
ALTER TABLE "email_reminders" RENAME COLUMN "created_at" TO "creadoEn";

-- =====================================================
-- TABLA: activity_log
-- =====================================================
ALTER TABLE "activity_log" RENAME COLUMN "veterinary_id" TO "veterinariaId";
ALTER TABLE "activity_log" RENAME COLUMN "user_id" TO "usuarioId";
ALTER TABLE "activity_log" RENAME COLUMN "action_type" TO "tipoAccion";
ALTER TABLE "activity_log" RENAME COLUMN "entity_type" TO "tipoEntidad";
ALTER TABLE "activity_log" RENAME COLUMN "entity_id" TO "entidadId";
ALTER TABLE "activity_log" RENAME COLUMN "description" TO "descripcion";
ALTER TABLE "activity_log" RENAME COLUMN "metadata" TO "metadatos";
ALTER TABLE "activity_log" RENAME COLUMN "created_at" TO "creadoEn";
