# Cambios en la Estructura de Base de Datos

## Fecha: 26 de enero de 2026

## Resumen

Se modificó la estructura de la base de datos para que `species` (especies) y `breed` (razas) sean tablas independientes en lugar de campos de texto en la tabla `patients`.

## Cambios Realizados

### 1. Nuevas Tablas Creadas

#### Tabla `species`

- **id**: UUID (Primary Key)
- **name**: VARCHAR(100) UNIQUE NOT NULL
- **description**: TEXT
- **is_active**: BOOLEAN DEFAULT TRUE
- **created_at**: TIMESTAMPTZ
- **updated_at**: TIMESTAMPTZ

#### Tabla `breeds`

- **id**: UUID (Primary Key)
- **species_id**: UUID (Foreign Key → species.id) NOT NULL
- **name**: VARCHAR(100) NOT NULL
- **description**: TEXT
- **is_active**: BOOLEAN DEFAULT TRUE
- **created_at**: TIMESTAMPTZ
- **updated_at**: TIMESTAMPTZ
- **UNIQUE constraint**: (species_id, name) - Una raza no puede repetirse dentro de la misma especie

### 2. Modificaciones en la Tabla `patients`

**Campos Eliminados:**

- `species` (VARCHAR)
- `breed` (VARCHAR)

**Campos Agregados:**

- `species_id` (UUID, NOT NULL) - Foreign Key → species.id
- `breed_id` (UUID, NULLABLE) - Foreign Key → breeds.id

**Índices Agregados:**

- `idx_patients_species` sobre `species_id`
- `idx_patients_breed` sobre `breed_id`

### 3. Relaciones

- **Species → Breeds**: Un especie puede tener múltiples razas (1:N)
- **Species → Patients**: Una especie puede tener múltiples pacientes (1:N)
- **Breed → Patients**: Una raza puede tener múltiples pacientes (1:N)
- **Patient → Species**: Cada paciente debe tener una especie (N:1, REQUIRED)
- **Patient → Breed**: Cada paciente puede tener una raza (N:1, OPTIONAL)

### 4. Datos Iniciales (Seed)

Se creó un script de seed que popula la base de datos con:

**Especies (8):**

- Perro
- Gato
- Ave
- Conejo
- Hámster
- Cobayo
- Reptil
- Pez

**Razas por Especie:**

- **Perros (21)**: Labrador Retriever, Pastor Alemán, Golden Retriever, Bulldog Francés, Beagle, Poodle, etc.
- **Gatos (13)**: Persa, Siamés, Maine Coon, Bengalí, Ragdoll, British Shorthair, etc.
- **Aves (8)**: Periquito, Canario, Loro, Cacatúa, Agapornis, etc.
- **Conejos (7)**: Holandés, Cabeza de León, Belier, Gigante de Flandes, etc.

### 5. Archivos Modificados

1. **`server/prisma/schema.prisma`**
   - Agregados modelos `Species` y `Breed`
   - Modificado modelo `Patient` para usar relaciones

2. **`server/prisma/migrations/20260126154651_add_species_and_breeds_tables/migration.sql`**
   - Migración automática generada por Prisma

3. **`Context/db_definition.sql`**
   - Agregadas definiciones SQL de las nuevas tablas
   - Actualizada tabla patients

4. **`server/Context/db_definition.sql`**
   - Sincronizado con los cambios del archivo principal

5. **`server/prisma/seed.ts`** (NUEVO)
   - Script de seed para poblar especies y razas

6. **`server/package.json`**
   - Agregado script `prisma:seed`

## Ejecución de Comandos

```bash
# Generar cliente de Prisma
pnpm prisma generate

# Crear y aplicar migración
pnpm prisma migrate dev --name add_species_and_breeds_tables

# Ejecutar seed
pnpm prisma:seed
```

## Ventajas de este Cambio

1. **Datos Normalizados**: Evita errores de tipeo y inconsistencias en nombres de especies/razas
2. **Integridad Referencial**: Las foreign keys garantizan que solo se usen especies y razas válidas
3. **Mantenibilidad**: Es más fácil agregar, modificar o eliminar especies y razas
4. **Consultas Optimizadas**: Los índices mejoran el rendimiento de búsquedas
5. **Escalabilidad**: Facilita agregar información adicional sobre especies y razas (descripciones, imágenes, etc.)
6. **Reportes**: Más fácil generar estadísticas por especie o raza

## Consideraciones Importantes

- **Datos Existentes**: Si hay pacientes en la base de datos, necesitarás migrar los datos de `species` y `breed` (texto) a las nuevas tablas antes de eliminar las columnas antiguas
- **API**: Los endpoints que crean o actualizan pacientes deberán modificarse para aceptar `speciesId` y `breedId` en lugar de texto
- **Frontend**: Los formularios deberán mostrar selects/autocompletes con las especies y razas disponibles

## Próximos Pasos Recomendados

1. Actualizar DTOs y schemas de validación en el backend
2. Crear endpoints para:
   - Listar especies: `GET /api/species`
   - Listar razas por especie: `GET /api/species/:id/breeds`
   - (Opcional) CRUD de especies y razas para administradores
3. Actualizar componentes del frontend para usar los nuevos campos
4. Migrar datos existentes si los hay
