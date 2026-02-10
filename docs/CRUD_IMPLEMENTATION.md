# CRUD de Especies y Razas - Resumen de Implementación

## 📅 Fecha: 26 de enero de 2026

## 🎯 Objetivo Completado

Se ha implementado el CRUD completo para las entidades **Species** (Especies) y **Breeds** (Razas), siguiendo el patrón establecido por el CRUD de usuarios.

---

## 📁 Archivos Creados

### 1. Schemas de Validación

**Archivo:** [`server/src/models/schemas/species.schema.ts`](../src/models/schemas/species.schema.ts)

Contiene:

- `createSpeciesSchema` - Validación para crear especies
- `updateSpeciesSchema` - Validación para actualizar especies
- `createBreedSchema` - Validación para crear razas
- `updateBreedSchema` - Validación para actualizar razas
- DTOs TypeScript exportados

### 2. Servicios (Business Logic)

**Archivos:**

- [`server/src/services/species.service.ts`](../src/services/species.service.ts)
- [`server/src/services/breed.service.ts`](../src/services/breed.service.ts)

**SpeciesService:**

- `getAllSpecies()` - Obtener todas las especies con contador de razas y pacientes
- `getSpeciesById()` - Obtener una especie con sus razas
- `createSpecies()` - Crear nueva especie
- `updateSpecies()` - Actualizar especie
- `deleteSpecies()` - Desactivar especie (soft delete)
- `getBreedsBySpecies()` - Obtener razas de una especie específica

**BreedService:**

- `getAllBreeds()` - Obtener todas las razas con información de especies
- `getBreedById()` - Obtener una raza específica
- `createBreed()` - Crear nueva raza (valida que la especie exista)
- `updateBreed()` - Actualizar raza
- `deleteBreed()` - Desactivar raza (soft delete)

### 3. Controladores (HTTP Handlers)

**Archivos:**

- [`server/src/controllers/species.controller.ts`](../src/controllers/species.controller.ts)
- [`server/src/controllers/breed.controller.ts`](../src/controllers/breed.controller.ts)

Manejan:

- Validación de parámetros
- Llamadas a servicios
- Respuestas HTTP estandarizadas
- Manejo de errores de Prisma (códigos P2002, P2025, etc.)

### 4. Rutas (API Endpoints)

**Archivos:**

- [`server/src/routes/species.routes.ts`](../src/routes/species.routes.ts)
- [`server/src/routes/breed.routes.ts`](../src/routes/breed.routes.ts)

**Rutas configuradas:**

```
GET    /api/species              - Listar especies
GET    /api/species/:id          - Obtener especie por ID
GET    /api/species/:id/breeds   - Listar razas de una especie
POST   /api/species              - Crear especie (admin)
PUT    /api/species/:id          - Actualizar especie (admin)
DELETE /api/species/:id          - Desactivar especie (admin)

GET    /api/breeds               - Listar razas
GET    /api/breeds/:id           - Obtener raza por ID
POST   /api/breeds               - Crear raza (admin)
PUT    /api/breeds/:id           - Actualizar raza (admin)
DELETE /api/breeds/:id           - Desactivar raza (admin)
```

### 5. Documentación

**Archivos:**

- [`server/docs/SPECIES_BREEDS_API.md`](SPECIES_BREEDS_API.md) - Documentación completa de la API
- [`server/test-species-breeds.http`](../test-species-breeds.http) - Archivo de tests HTTP

### 6. Actualizaciones

- [`server/src/routes/index.ts`](../src/routes/index.ts) - Agregadas rutas de species y breeds
- [`server/src/models/schemas/index.ts`](../src/models/schemas/index.ts) - Exportados nuevos schemas

---

## 🔐 Seguridad y Permisos

### Autenticación

Todas las rutas requieren token JWT válido.

### Autorización

- **Lectura (GET)**: Todos los usuarios autenticados
- **Escritura (POST, PUT, DELETE)**: Solo administradores (`role: admin`)

### Middlewares Aplicados

1. `authenticate` - Verifica token JWT
2. `authorize('admin')` - Verifica rol de administrador
3. `validateRequest(schema)` - Valida datos de entrada con Zod

---

## ✨ Características Implementadas

### 1. Soft Delete

Las operaciones DELETE no eliminan físicamente los registros, solo los marcan como inactivos:

```typescript
isActive: false;
```

### 2. Validación de Nombres Únicos

- **Especies**: Nombre único global
- **Razas**: Nombre único por especie (constraint `UNIQUE(speciesId, name)`)

### 3. Contadores Automáticos

Los endpoints incluyen contadores usando `_count`:

```typescript
_count: {
  breeds: 21,    // Número de razas
  patients: 45   // Número de pacientes
}
```

### 4. Relaciones en Respuestas

Las razas incluyen información de su especie:

```typescript
species: {
  id: "uuid",
  name: "Perro"
}
```

### 5. Filtros Opcionales

Query parameter `includeInactive=true` para incluir registros inactivos (solo admin).

### 6. Ordenamiento Inteligente

- Especies: Alfabético por nombre
- Razas: Por especie y luego alfabético

---

## 🧪 Testing

### Archivo de Tests HTTP

[`test-species-breeds.http`](../test-species-breeds.http)

Incluye tests para:

- ✅ Operaciones CRUD completas
- ✅ Casos de error (validación)
- ✅ Duplicados
- ✅ Datos inválidos

### Cómo Usar

1. Instalar extensión REST Client en VS Code
2. Actualizar variable `@token` con un token válido
3. Ejecutar requests individualmente

---

## 🔄 Flujo de Datos Típico

```
Cliente HTTP
    ↓
Router (species.routes.ts)
    ↓
Middlewares (authenticate → authorize → validateRequest)
    ↓
Controller (species.controller.ts)
    ↓
Service (species.service.ts)
    ↓
Prisma Client
    ↓
Base de Datos PostgreSQL
```

---

## 📊 Estructura de Respuestas

### Éxito

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### Error

```json
{
  "success": false,
  "error": "Tipo de error",
  "message": "Descripción del error"
}
```

---

## 🚀 Próximos Pasos Recomendados

1. **Actualizar schema de pacientes**
   - Modificar `patient.schema.ts` para usar `speciesId` y `breedId`
   - Actualizar validaciones

2. **Crear servicios helper en el frontend**
   - `species.service.ts` - Consumir API de especies
   - `breed.service.ts` - Consumir API de razas

3. **Componentes UI**
   - Selector de especies (dropdown/autocomplete)
   - Selector de razas (filtrado por especie)
   - Gestión de especies y razas (admin panel)

4. **Sincronización Frontend-Backend**
   - Actualizar formularios de pacientes
   - Cache de especies y razas en el frontend

5. **Seeders adicionales**
   - Agregar más especies si es necesario
   - Agregar más razas por especie

---

## 📝 Notas Técnicas

### Manejo de Errores Prisma

```typescript
// Duplicado (unique constraint)
if (error.code === 'P2002') { ... }

// Registro no encontrado
if (error.code === 'P2025') { ... }
```

### TypeScript Types

Todos los servicios y controladores están completamente tipados usando:

- Tipos generados por Prisma
- DTOs de Zod
- Types de Express

### Performance

- Índices en `speciesId` y `breedId` en tabla patients
- Índice único compuesto en tabla breeds
- Uso de `select` y `include` para optimizar queries

---

## ✅ Checklist de Implementación

- [x] Schemas de validación con Zod
- [x] Servicios con lógica de negocio
- [x] Controladores HTTP
- [x] Rutas con autenticación y autorización
- [x] Manejo de errores
- [x] Validación de datos de entrada
- [x] Soft delete
- [x] Relaciones y contadores
- [x] Documentación de API
- [x] Archivo de tests HTTP
- [x] Tipos TypeScript
- [x] Sin errores de compilación

---

**Implementación completada con éxito** ✨
