# 🔐 Sistema de Autenticación con Supabase - Implementado

## ✅ Archivos Creados

### Configuración

- [src/config/supabase.ts](src/config/supabase.ts) - Cliente de Supabase
- [src/config/prisma.ts](src/config/prisma.ts) - Cliente de Prisma con adapter

### Modelos y Schemas

- [src/models/schemas/auth.schema.ts](src/models/schemas/auth.schema.ts) - Validación con Zod
- [src/models/dto/auth.dto.ts](src/models/dto/auth.dto.ts) - Tipos TypeScript

### Middlewares

- [src/middlewares/auth.middleware.ts](src/middlewares/auth.middleware.ts) - Autenticación y autorización
- [src/middlewares/validateRequest.ts](src/middlewares/validateRequest.ts) - Validación actualizada

### Servicios

- [src/services/auth.service.ts](src/services/auth.service.ts) - Lógica de negocio

### Controladores

- [src/controllers/auth.controller.ts](src/controllers/auth.controller.ts) - Manejo de requests

### Rutas

- [src/routes/auth.routes.ts](src/routes/auth.routes.ts) - Endpoints de autenticación
- [src/routes/index.ts](src/routes/index.ts) - Router principal

### Documentación

- [docs/AUTH_API.md](docs/AUTH_API.md) - Documentación completa de la API
- [test-auth.http](test-auth.http) - Ejemplos de requests

## 📦 Dependencias Instaladas

```bash
@supabase/supabase-js  # Cliente de Supabase
jsonwebtoken           # Manejo de JWT (usado por Supabase)
bcryptjs              # Hashing de contraseñas (usado por Supabase)
@types/jsonwebtoken   # Tipos de TypeScript
```

## ⚙️ Configuración Requerida

### 1. Variables de Entorno

Crea o actualiza tu archivo `.env` con:

```bash
# Supabase
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=tu-supabase-anon-key

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 2. Obtener Credenciales de Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea/abre tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
5. Ve a **Settings** > **Database**
6. Copia la **Connection string** → `DATABASE_URL` y `DIRECT_URL`

### 3. Configurar Autenticación en Supabase

1. En Supabase, ve a **Authentication** > **Providers**
2. Habilita **Email**
3. Configura:
   - ✅ Enable email provider
   - ✅ Confirm email (opcional, recomendado)
   - ✅ Secure email change (opcional)

## 🚀 Endpoints Disponibles

### Públicos (sin autenticación)

- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/refresh` - Refrescar token

### Protegidos (requieren autenticación)

- `POST /api/v1/auth/logout` - Cerrar sesión
- `GET /api/v1/auth/me` - Obtener usuario actual

## 🧪 Probar la API

### Opción 1: Usar el archivo test-auth.http

Si tienes la extensión REST Client en VS Code:

1. Abre [test-auth.http](test-auth.http)
2. Haz clic en "Send Request" sobre cada request

### Opción 2: cURL

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "password123",
    "name": "Usuario Test",
    "role": "owner"
  }'

# Iniciar sesión
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "password123"
  }'

# Obtener usuario actual (reemplaza TOKEN)
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Opción 3: Postman/Insomnia

Importa la colección desde [docs/AUTH_API.md](docs/AUTH_API.md)

## 🔒 Uso en Otros Endpoints

### Proteger rutas con autenticación

```typescript
import { authenticate, authorize } from "./middlewares/auth.middleware";

// Solo usuarios autenticados
router.get("/protected", authenticate, handler);

// Solo administradores
router.delete("/delete", authenticate, authorize("admin"), handler);

// Administradores y operadores
router.get("/staff", authenticate, authorize("admin", "operator"), handler);
```

### Acceder al usuario en el controlador

```typescript
async handler(req: Request, res: Response) {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const userEmail = req.user?.email;

  // Tu lógica aquí
}
```

## 📝 Notas Importantes

### Roles de Usuario

- **owner** - Dueño de mascota (se crea automáticamente en la tabla `owners`)
- **operator** - Operador/Empleado (requiere asignación de `veterinaryId` posteriormente)
- **admin** - Administrador (solo se crea en la tabla `users`)

### Flujo de Autenticación

1. **Registro**: Se crea usuario en Supabase Auth + base de datos
2. **Login**: Se validan credenciales en Supabase
3. **Token**: Se recibe `access_token` y `refresh_token`
4. **Requests**: Incluir `Authorization: Bearer {access_token}` en headers
5. **Refresh**: Usar `refresh_token` antes de que expire el `access_token`

### Seguridad

- Tokens manejados por Supabase (JWT firmados)
- Contraseñas hasheadas automáticamente
- CORS configurado
- Validación de inputs con Zod
- Middleware de autenticación en rutas protegidas

## ✨ Próximos Pasos

1. Configurar las variables de entorno en `.env`
2. Iniciar el servidor: `pnpm dev`
3. Probar los endpoints con [test-auth.http](test-auth.http)
4. Implementar rutas adicionales usando los middlewares de auth

## 🐛 Troubleshooting

### Error: SUPABASE_URL no está definida

Asegúrate de tener el archivo `.env` con las variables correctas.

### Error: Cannot find module '.prisma/client/default'

Ejecuta: `pnpm prisma generate`

### Error: Invalid login credentials

Verifica que:

- El usuario existe en Supabase
- La contraseña es correcta
- El email está confirmado (si tienes esa opción habilitada)

### Token expirado

Usa el endpoint `/api/v1/auth/refresh` con el `refresh_token` para obtener uno nuevo.
