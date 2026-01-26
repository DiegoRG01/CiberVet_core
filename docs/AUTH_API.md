# API de Autenticación - Tu Veterinaria

## Configuración

### Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```bash
# Supabase
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Iniciar el Servidor

```bash
pnpm install
pnpm prisma generate
pnpm dev
```

## Endpoints de Autenticación

### 1. Registro de Usuario

**POST** `/api/v1/auth/register`

Registra un nuevo usuario en el sistema.

**Body:**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "name": "Juan Pérez",
  "role": "owner"
}
```

**Roles disponibles:**

- `owner` - Dueño de mascota (default)
- `operator` - Operador/Empleado
- `admin` - Administrador

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "role": "owner"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "v1.MRjz...",
      "expires_in": 3600,
      "expires_at": 1706198400
    }
  }
}
```

### 2. Inicio de Sesión

**POST** `/api/v1/auth/login`

Inicia sesión con un usuario existente.

**Body:**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "role": "owner"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "v1.MRjz...",
      "expires_in": 3600,
      "expires_at": 1706198400
    }
  }
}
```

### 3. Refrescar Token

**POST** `/api/v1/auth/refresh`

Refresca el token de acceso usando el refresh token.

**Body:**

```json
{
  "refreshToken": "v1.MRjz..."
}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Token refrescado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "role": "owner"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "v1.MRjz...",
      "expires_in": 3600,
      "expires_at": 1706198400
    }
  }
}
```

### 4. Cerrar Sesión

**POST** `/api/v1/auth/logout`

Cierra la sesión del usuario actual.

**Headers:**

```
Authorization: Bearer eyJhbGc...
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

### 5. Obtener Usuario Actual

**GET** `/api/v1/auth/me`

Obtiene la información del usuario autenticado.

**Headers:**

```
Authorization: Bearer eyJhbGc...
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "role": "owner",
    "createdAt": "2026-01-25T10:30:00.000Z"
  }
}
```

## Autenticación en Requests

Para endpoints protegidos, incluye el token de acceso en el header Authorization:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Middleware de Autorización

Usa el middleware `authorize` para proteger rutas por rol:

```typescript
import { authenticate, authorize } from "./middlewares/auth.middleware";

// Solo administradores
router.get("/admin-only", authenticate, authorize("admin"), handler);

// Administradores y operadores
router.get(
  "/staff-only",
  authenticate,
  authorize("admin", "operator"),
  handler,
);
```

## Manejo de Errores

Todos los endpoints pueden devolver los siguientes códigos de error:

- **400** - Error de validación
- **401** - No autorizado (token inválido/expirado)
- **403** - Prohibido (sin permisos)
- **404** - No encontrado
- **500** - Error del servidor

Formato de error:

```json
{
  "success": false,
  "error": "Mensaje de error",
  "message": "Detalles adicionales",
  "details": [
    {
      "field": "email",
      "message": "Debe ser un email válido"
    }
  ]
}
```
