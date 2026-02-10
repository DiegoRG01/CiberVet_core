# API de Especies y Razas

Documentación de los endpoints CRUD para especies y razas.

---

## 📋 Especies (Species)

### Base URL

```
/api/species
```

### Endpoints

#### 1. Obtener todas las especies

```http
GET /api/species
```

**Auth:** Requerida (Token Bearer)

**Query Parameters:**

- `includeInactive` (boolean, opcional): Incluir especies inactivas. Solo para administradores.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Perro",
      "description": "Canis lupus familiaris",
      "isActive": true,
      "createdAt": "2026-01-26T12:00:00.000Z",
      "updatedAt": "2026-01-26T12:00:00.000Z",
      "_count": {
        "breeds": 21,
        "patients": 45
      }
    }
  ]
}
```

---

#### 2. Obtener una especie por ID

```http
GET /api/species/:id
```

**Auth:** Requerida (Token Bearer)

**Parámetros de ruta:**

- `id` (uuid): ID de la especie

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Perro",
    "description": "Canis lupus familiaris",
    "isActive": true,
    "createdAt": "2026-01-26T12:00:00.000Z",
    "updatedAt": "2026-01-26T12:00:00.000Z",
    "breeds": [
      {
        "id": "uuid",
        "speciesId": "uuid",
        "name": "Labrador Retriever",
        "description": null,
        "isActive": true,
        "createdAt": "2026-01-26T12:00:00.000Z",
        "updatedAt": "2026-01-26T12:00:00.000Z"
      }
    ],
    "_count": {
      "breeds": 21,
      "patients": 45
    }
  }
}
```

**Respuesta error (404):**

```json
{
  "success": false,
  "error": "No encontrado",
  "message": "Especie no encontrada"
}
```

---

#### 3. Obtener razas de una especie

```http
GET /api/species/:id/breeds
```

**Auth:** Requerida (Token Bearer)

**Parámetros de ruta:**

- `id` (uuid): ID de la especie

**Query Parameters:**

- `includeInactive` (boolean, opcional): Incluir razas inactivas. Solo para administradores.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "speciesId": "uuid",
      "name": "Labrador Retriever",
      "description": null,
      "isActive": true,
      "createdAt": "2026-01-26T12:00:00.000Z",
      "updatedAt": "2026-01-26T12:00:00.000Z",
      "_count": {
        "patients": 12
      }
    }
  ]
}
```

---

#### 4. Crear una nueva especie

```http
POST /api/species
```

**Auth:** Requerida (Token Bearer + Admin)

**Body:**

```json
{
  "name": "Reptil",
  "description": "Reptilia",
  "isActive": true
}
```

**Campos:**

- `name` (string, requerido): Nombre de la especie (máx. 100 caracteres)
- `description` (string, opcional): Descripción de la especie
- `isActive` (boolean, opcional): Estado activo/inactivo (default: true)

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Reptil",
    "description": "Reptilia",
    "isActive": true,
    "createdAt": "2026-01-26T12:00:00.000Z",
    "updatedAt": "2026-01-26T12:00:00.000Z"
  },
  "message": "Especie creada exitosamente"
}
```

**Respuesta error (400) - Nombre duplicado:**

```json
{
  "success": false,
  "error": "Conflicto",
  "message": "Ya existe una especie con ese nombre"
}
```

---

#### 5. Actualizar una especie

```http
PUT /api/species/:id
```

**Auth:** Requerida (Token Bearer + Admin)

**Parámetros de ruta:**

- `id` (uuid): ID de la especie

**Body (todos los campos son opcionales):**

```json
{
  "name": "Reptil",
  "description": "Reptilia (actualizado)",
  "isActive": false
}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Reptil",
    "description": "Reptilia (actualizado)",
    "isActive": false,
    "createdAt": "2026-01-26T12:00:00.000Z",
    "updatedAt": "2026-01-26T13:00:00.000Z"
  },
  "message": "Especie actualizada exitosamente"
}
```

---

#### 6. Eliminar (desactivar) una especie

```http
DELETE /api/species/:id
```

**Auth:** Requerida (Token Bearer + Admin)

**Parámetros de ruta:**

- `id` (uuid): ID de la especie

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Especie desactivada exitosamente"
}
```

---

## 🐾 Razas (Breeds)

### Base URL

```
/api/breeds
```

### Endpoints

#### 1. Obtener todas las razas

```http
GET /api/breeds
```

**Auth:** Requerida (Token Bearer)

**Query Parameters:**

- `includeInactive` (boolean, opcional): Incluir razas inactivas. Solo para administradores.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "speciesId": "uuid",
      "name": "Labrador Retriever",
      "description": null,
      "isActive": true,
      "createdAt": "2026-01-26T12:00:00.000Z",
      "updatedAt": "2026-01-26T12:00:00.000Z",
      "species": {
        "id": "uuid",
        "name": "Perro"
      },
      "_count": {
        "patients": 12
      }
    }
  ]
}
```

---

#### 2. Obtener una raza por ID

```http
GET /api/breeds/:id
```

**Auth:** Requerida (Token Bearer)

**Parámetros de ruta:**

- `id` (uuid): ID de la raza

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "speciesId": "uuid",
    "name": "Labrador Retriever",
    "description": null,
    "isActive": true,
    "createdAt": "2026-01-26T12:00:00.000Z",
    "updatedAt": "2026-01-26T12:00:00.000Z",
    "species": {
      "id": "uuid",
      "name": "Perro"
    },
    "_count": {
      "patients": 12
    }
  }
}
```

**Respuesta error (404):**

```json
{
  "success": false,
  "error": "No encontrado",
  "message": "Raza no encontrada"
}
```

---

#### 3. Crear una nueva raza

```http
POST /api/breeds
```

**Auth:** Requerida (Token Bearer + Admin)

**Body:**

```json
{
  "speciesId": "uuid",
  "name": "Pitbull",
  "description": "Raza de perro",
  "isActive": true
}
```

**Campos:**

- `speciesId` (uuid, requerido): ID de la especie a la que pertenece
- `name` (string, requerido): Nombre de la raza (máx. 100 caracteres)
- `description` (string, opcional): Descripción de la raza
- `isActive` (boolean, opcional): Estado activo/inactivo (default: true)

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "speciesId": "uuid",
    "name": "Pitbull",
    "description": "Raza de perro",
    "isActive": true,
    "createdAt": "2026-01-26T12:00:00.000Z",
    "updatedAt": "2026-01-26T12:00:00.000Z",
    "species": {
      "id": "uuid",
      "name": "Perro"
    }
  },
  "message": "Raza creada exitosamente"
}
```

**Respuesta error (400) - Nombre duplicado:**

```json
{
  "success": false,
  "error": "Conflicto",
  "message": "Ya existe una raza con ese nombre para esta especie"
}
```

**Respuesta error (400) - Especie no existe:**

```json
{
  "success": false,
  "error": "Validación",
  "message": "La especie especificada no existe"
}
```

---

#### 4. Actualizar una raza

```http
PUT /api/breeds/:id
```

**Auth:** Requerida (Token Bearer + Admin)

**Parámetros de ruta:**

- `id` (uuid): ID de la raza

**Body (todos los campos son opcionales):**

```json
{
  "name": "Pitbull Americano",
  "description": "Raza de perro americana",
  "isActive": false
}
```

**Nota:** No se puede cambiar el `speciesId` de una raza existente.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "speciesId": "uuid",
    "name": "Pitbull Americano",
    "description": "Raza de perro americana",
    "isActive": false,
    "createdAt": "2026-01-26T12:00:00.000Z",
    "updatedAt": "2026-01-26T13:00:00.000Z",
    "species": {
      "id": "uuid",
      "name": "Perro"
    }
  },
  "message": "Raza actualizada exitosamente"
}
```

---

#### 5. Eliminar (desactivar) una raza

```http
DELETE /api/breeds/:id
```

**Auth:** Requerida (Token Bearer + Admin)

**Parámetros de ruta:**

- `id` (uuid): ID de la raza

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Raza desactivada exitosamente"
}
```

---

## 🔐 Autenticación

Todas las rutas requieren autenticación mediante token JWT en el header:

```http
Authorization: Bearer <token>
```

## 👤 Roles y Permisos

- **Lectura (GET)**: Todos los usuarios autenticados
- **Escritura (POST, PUT, DELETE)**: Solo administradores (`admin`)

## ⚠️ Códigos de Error Comunes

| Código | Descripción                                    |
| ------ | ---------------------------------------------- |
| 400    | Datos inválidos o conflicto (nombre duplicado) |
| 401    | No autenticado                                 |
| 403    | No autorizado (sin permisos)                   |
| 404    | Recurso no encontrado                          |
| 500    | Error del servidor                             |

## 📝 Notas Importantes

1. **Soft Delete**: Las operaciones DELETE no eliminan físicamente los registros, solo los marcan como inactivos (`isActive: false`)
2. **Validación de Nombres Únicos**:
   - Las especies deben tener nombres únicos globalmente
   - Las razas deben tener nombres únicos dentro de su especie
3. **Contadores**: Los endpoints incluyen contadores (`_count`) que muestran cuántas razas/pacientes están asociados
4. **Ordenamiento**:
   - Especies: Ordenadas alfabéticamente por nombre
   - Razas: Ordenadas por especie y luego por nombre
