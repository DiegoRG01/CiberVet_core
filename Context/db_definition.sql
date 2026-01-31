-- =====================================================
-- TABLA DE ROLES
-- =====================================================
CREATE TYPE user_role AS ENUM ('owner', 'operator', 'admin');

-- =====================================================
-- TABLA DE USUARIOS
-- =====================================================
-- Esta tabla extiende la tabla auth.users de Supabase
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role user_role NOT NULL DEFAULT 'owner',
  veterinary_id UUID REFERENCES veterinaries(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VETERINARIAS
-- =====================================================
CREATE TABLE veterinaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'República Dominicana',
  postal_code VARCHAR(20),
  logo_url TEXT,
  business_hours JSONB, -- Horario de atención
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DUEÑOS/PROPIETARIOS (Extensión de usuarios con rol owner)
-- =====================================================
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  veterinary_id UUID REFERENCES veterinaries(id),
  address TEXT,
  city VARCHAR(100),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- OPERADORES (Extensión de usuarios con rol operator)
-- =====================================================
CREATE TABLE operators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  veterinary_id UUID REFERENCES veterinaries(id) NOT NULL,
  position VARCHAR(100), -- Ej: Recepcionista, Veterinario, Asistente
  hire_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  permissions JSONB, -- Permisos específicos si se requiere granularidad
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ESPECIES
-- =====================================================
CREATE TABLE species (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RAZAS
-- =====================================================
CREATE TABLE breeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  species_id UUID REFERENCES species(id) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(species_id, name)
);

CREATE INDEX idx_breeds_species_id ON breeds(species_id);

-- =====================================================
-- PACIENTES (MASCOTAS)
-- =====================================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  veterinary_id UUID REFERENCES veterinaries(id),
  name VARCHAR(255) NOT NULL,
  species_id UUID REFERENCES species(id) NOT NULL,
  breed_id UUID REFERENCES breeds(id),
  color VARCHAR(100),
  birth_date DATE,
  gender VARCHAR(20), -- Macho, Hembra
  weight DECIMAL(10,2),
  photo_url TEXT,
  microchip_number VARCHAR(50),
  is_neutered BOOLEAN DEFAULT FALSE,
  allergies TEXT,
  special_conditions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CITAS
-- =====================================================
CREATE TYPE appointment_status AS ENUM (
  'scheduled',    -- Agendada
  'confirmed',    -- Confirmada
  'in_progress',  -- En progreso
  'completed',    -- Completada
  'cancelled',    -- Cancelada
  'no_show'       -- No asistió
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id),
  veterinary_id UUID REFERENCES veterinaries(id),
  operator_id UUID REFERENCES operators(id), -- Quien atenderá
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status appointment_status DEFAULT 'scheduled',
  appointment_type VARCHAR(100), -- Consulta, Vacunación, Cirugía, etc.
  reason TEXT NOT NULL,
  notes TEXT,
  google_calendar_event_id VARCHAR(255),
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROCEDIMIENTOS/SERVICIOS
-- =====================================================
CREATE TABLE procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cost DECIMAL(10,2),
  duration_minutes INTEGER,
  performed_by UUID REFERENCES operators(id),
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- HISTORIAL CLÍNICO
-- =====================================================
CREATE TABLE clinical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id),
  veterinary_id UUID REFERENCES veterinaries(id),
  recorded_by UUID REFERENCES operators(id), -- Operador que registró
  record_type VARCHAR(50), -- Consulta, Vacunación, Cirugía, etc.
  diagnosis TEXT,
  symptoms TEXT,
  treatment TEXT,
  medications JSONB, -- [{name, dosage, frequency, duration}]
  lab_results JSONB,
  images JSONB, -- URLs de imágenes (radiografías, etc.)
  observations TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VACUNAS
-- =====================================================
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  clinical_record_id UUID REFERENCES clinical_records(id),
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_type VARCHAR(100),
  batch_number VARCHAR(100),
  administered_date DATE NOT NULL,
  next_due_date DATE,
  administered_by UUID REFERENCES operators(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RECORDATORIOS DE EMAIL
-- =====================================================
CREATE TABLE email_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id),
  email_to VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  body TEXT,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REGISTRO DE ACTIVIDAD
-- =====================================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  veterinary_id UUID REFERENCES veterinaries(id),
  user_id UUID REFERENCES auth.users(id),
  action_type VARCHAR(50) NOT NULL, -- create, update, delete, login, etc.
  entity_type VARCHAR(50), -- appointment, patient, owner, etc.
  entity_id UUID,
  description TEXT NOT NULL,
  metadata JSONB, -- Datos adicionales del evento
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_veterinary ON users(veterinary_id);
CREATE INDEX idx_owners_user ON owners(user_id);
CREATE INDEX idx_operators_user ON operators(user_id);
CREATE INDEX idx_patients_owner ON patients(owner_id);
CREATE INDEX idx_patients_species ON patients(species_id);
CREATE INDEX idx_patients_breed ON patients(breed_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_owner ON appointments(owner_id);
CREATE INDEX idx_appointments_datetime ON appointments(date_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_clinical_records_patient ON clinical_records(patient_id);
CREATE INDEX idx_vaccinations_patient ON vaccinations(patient_id);
CREATE INDEX idx_activity_log_veterinary ON activity_log(veterinary_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - POLÍTICAS DE SEGURIDAD
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA OWNERS (Solo ven sus datos)
-- =====================================================

-- Owners pueden ver solo su propia información
CREATE POLICY "Owners can view own data" ON owners
  FOR SELECT
  USING (user_id = auth.uid());

-- Owners pueden actualizar solo su propia información
CREATE POLICY "Owners can update own data" ON owners
  FOR UPDATE
  USING (user_id = auth.uid());

-- Owners pueden ver solo sus propias mascotas
CREATE POLICY "Owners can view own patients" ON patients
  FOR SELECT
  USING (
    owner_id IN (
      SELECT id FROM owners WHERE user_id = auth.uid()
    )
  );

-- Owners pueden crear mascotas para sí mismos
CREATE POLICY "Owners can create own patients" ON patients
  FOR INSERT
  WITH CHECK (
    owner_id IN (
      SELECT id FROM owners WHERE user_id = auth.uid()
    )
  );

-- Owners pueden ver solo sus propias citas
CREATE POLICY "Owners can view own appointments" ON appointments
  FOR SELECT
  USING (
    owner_id IN (
      SELECT id FROM owners WHERE user_id = auth.uid()
    )
  );

-- Owners pueden crear citas para sus mascotas
CREATE POLICY "Owners can create appointments" ON appointments
  FOR INSERT
  WITH CHECK (
    owner_id IN (
      SELECT id FROM owners WHERE user_id = auth.uid()
    )
  );

-- Owners pueden ver el historial clínico de sus mascotas
CREATE POLICY "Owners can view patient clinical records" ON clinical_records
  FOR SELECT
  USING (
    patient_id IN (
      SELECT p.id FROM patients p
      INNER JOIN owners o ON p.owner_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS PARA OPERATORS (Acceso completo a su veterinaria)
-- =====================================================

-- Operators pueden ver todos los owners de su veterinaria
CREATE POLICY "Operators can view veterinary owners" ON owners
  FOR SELECT
  USING (
    veterinary_id IN (
      SELECT veterinary_id FROM operators 
      WHERE user_id = auth.uid()
    )
  );

-- Operators pueden ver todas las mascotas de su veterinaria
CREATE POLICY "Operators can view veterinary patients" ON patients
  FOR ALL
  USING (
    veterinary_id IN (
      SELECT veterinary_id FROM operators 
      WHERE user_id = auth.uid()
    )
  );

-- Operators pueden gestionar todas las citas de su veterinaria
CREATE POLICY "Operators can manage veterinary appointments" ON appointments
  FOR ALL
  USING (
    veterinary_id IN (
      SELECT veterinary_id FROM operators 
      WHERE user_id = auth.uid()
    )
  );

-- Operators pueden gestionar procedimientos
CREATE POLICY "Operators can manage procedures" ON procedures
  FOR ALL
  USING (
    appointment_id IN (
      SELECT a.id FROM appointments a
      INNER JOIN operators op ON a.veterinary_id = op.veterinary_id
      WHERE op.user_id = auth.uid()
    )
  );

-- Operators pueden gestionar historiales clínicos
CREATE POLICY "Operators can manage clinical records" ON clinical_records
  FOR ALL
  USING (
    veterinary_id IN (
      SELECT veterinary_id FROM operators 
      WHERE user_id = auth.uid()
    )
  );

-- Operators pueden gestionar vacunaciones
CREATE POLICY "Operators can manage vaccinations" ON vaccinations
  FOR ALL
  USING (
    patient_id IN (
      SELECT p.id FROM patients p
      INNER JOIN operators op ON p.veterinary_id = op.veterinary_id
      WHERE op.user_id = auth.uid()
    )
  );

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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON owners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_operators_updated_at BEFORE UPDATE ON operators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'owner')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear usuario automáticamente al registrarse
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- POLÍTICAS DE SEGURIDAD PARA ACTIVITY_LOG
-- =====================================================

-- Operators pueden ver el log de actividad de su veterinaria
CREATE POLICY "Operators can view veterinary activity log" ON activity_log
  FOR SELECT
  USING (
    veterinary_id IN (
      SELECT veterinary_id FROM operators 
      WHERE user_id = auth.uid()
    )
  );

-- Admins pueden ver todo el log de actividad
CREATE POLICY "Admins can view all activity log" ON activity_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- TRIGGERS PARA REGISTRO AUTOMÁTICO DE ACTIVIDAD
-- =====================================================

-- Función para registrar actividad en appointments
CREATE OR REPLACE FUNCTION log_appointment_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_veterinary_id UUID;
  v_action_type VARCHAR(50);
  v_description TEXT;
BEGIN
  -- Determinar el tipo de acción
  IF TG_OP = 'INSERT' THEN
    v_action_type := 'create';
    v_description := 'Nueva cita creada';
    v_veterinary_id := NEW.veterinary_id;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action_type := 'update';
    v_description := 'Cita actualizada';
    v_veterinary_id := NEW.veterinary_id;
  ELSIF TG_OP = 'DELETE' THEN
    v_action_type := 'delete';
    v_description := 'Cita eliminada';
    v_veterinary_id := OLD.veterinary_id;
  END IF;

  -- Insertar log de actividad
  INSERT INTO activity_log (
    veterinary_id,
    user_id,
    action_type,
    entity_type,
    entity_id,
    description,
    metadata
  ) VALUES (
    v_veterinary_id,
    auth.uid(),
    v_action_type,
    'appointment',
    COALESCE(NEW.id, OLD.id),
    v_description,
    jsonb_build_object(
      'patient_id', COALESCE(NEW.patient_id, OLD.patient_id),
      'status', COALESCE(NEW.status::text, OLD.status::text)
    )
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para registrar actividad en patients
CREATE OR REPLACE FUNCTION log_patient_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_action_type VARCHAR(50);
  v_description TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action_type := 'create';
    v_description := 'Nuevo paciente registrado: ' || NEW.name;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action_type := 'update';
    v_description := 'Paciente actualizado: ' || NEW.name;
  ELSIF TG_OP = 'DELETE' THEN
    v_action_type := 'delete';
    v_description := 'Paciente eliminado: ' || OLD.name;
  END IF;

  INSERT INTO activity_log (
    veterinary_id,
    user_id,
    action_type,
    entity_type,
    entity_id,
    description
  ) VALUES (
    COALESCE(NEW.veterinary_id, OLD.veterinary_id),
    auth.uid(),
    v_action_type,
    'patient',
    COALESCE(NEW.id, OLD.id),
    v_description
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para registrar actividad en procedures
CREATE OR REPLACE FUNCTION log_procedure_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_veterinary_id UUID;
  v_description TEXT;
BEGIN
  -- Obtener veterinary_id del appointment
  SELECT a.veterinary_id INTO v_veterinary_id
  FROM appointments a
  WHERE a.id = NEW.appointment_id;

  v_description := 'Procedimiento realizado: ' || NEW.name;

  INSERT INTO activity_log (
    veterinary_id,
    user_id,
    action_type,
    entity_type,
    entity_id,
    description,
    metadata
  ) VALUES (
    v_veterinary_id,
    auth.uid(),
    'create',
    'procedure',
    NEW.id,
    v_description,
    jsonb_build_object('cost', NEW.cost)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar triggers
CREATE TRIGGER appointment_activity_log
  AFTER INSERT OR UPDATE OR DELETE ON appointments
  FOR EACH ROW EXECUTE FUNCTION log_appointment_activity();

CREATE TRIGGER patient_activity_log
  AFTER INSERT OR UPDATE OR DELETE ON patients
  FOR EACH ROW EXECUTE FUNCTION log_patient_activity();

CREATE TRIGGER procedure_activity_log
  AFTER INSERT ON procedures
  FOR EACH ROW EXECUTE FUNCTION log_procedure_activity();