# Standby API

API REST para gestión de usuarios y equipos de trabajo con segmentación por líneas de servicio, especialidades y clientes.

## Características

- Gestión completa de usuarios con autenticación JWT
- Gestión de equipos de trabajo
- Segmentación de equipos por líneas de servicio
- Segmentación de equipos por especialidades
- Asignación de equipos a múltiples clientes
- Control de acceso basado en roles (ADMIN, MANAGER, USER)
- Validación de datos con Zod
- Base de datos PostgreSQL con Prisma ORM

## Tecnologías

- **Node.js** con **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Zod** - Validación de esquemas

## Requisitos Previos

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd standby-api
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/standby_db?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

4. Generar cliente de Prisma:
```bash
npm run prisma:generate
```

5. Ejecutar migraciones:
```bash
npm run prisma:migrate
```

6. Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor en producción
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:migrate` - Ejecuta migraciones de base de datos
- `npm run prisma:studio` - Abre Prisma Studio (GUI para base de datos)

## Estructura del Proyecto

```
standby-api/
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── src/
│   ├── config/
│   │   ├── database.ts        # Configuración de Prisma
│   │   └── env.ts             # Variables de entorno
│   ├── controllers/           # Controladores de la API
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── team.controller.ts
│   │   ├── serviceLine.controller.ts
│   │   ├── specialty.controller.ts
│   │   └── client.controller.ts
│   ├── middleware/            # Middleware personalizado
│   │   ├── auth.ts
│   │   ├── errorMiddleware.ts
│   │   └── validation.ts
│   ├── routes/                # Rutas de la API
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── team.routes.ts
│   │   ├── serviceLine.routes.ts
│   │   ├── specialty.routes.ts
│   │   ├── client.routes.ts
│   │   └── index.ts
│   ├── types/                 # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/                 # Utilidades
│   │   ├── errorHandler.ts
│   │   └── jwt.ts
│   ├── app.ts                 # Configuración de Express
│   └── index.ts               # Punto de entrada
├── .env.example               # Ejemplo de variables de entorno
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Modelo de Datos

### User (Usuario)
- Información personal (email, nombre, teléfono)
- Roles: ADMIN, MANAGER, USER
- Pertenencia a equipos

### Team (Equipo)
- Información del equipo
- Miembros del equipo
- Líneas de servicio asignadas
- Especialidades asignadas
- Clientes asignados

### ServiceLine (Línea de Servicio)
- Nombre y descripción
- Equipos asociados

### Specialty (Especialidad)
- Nombre y descripción
- Equipos asociados

### Client (Cliente)
- Información de contacto
- Equipos que prestan servicio

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Autenticación

#### Registrar usuario
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "USER"
}
```

#### Iniciar sesión
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Usuarios

Todas las rutas requieren autenticación (Bearer token).

#### Listar usuarios
```http
GET /api/v1/users?page=1&limit=10&search=john
Authorization: Bearer <token>
```

#### Obtener usuario por ID
```http
GET /api/v1/users/:id
Authorization: Bearer <token>
```

#### Actualizar usuario (ADMIN, MANAGER)
```http
PUT /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "isActive": true
}
```

#### Eliminar usuario (ADMIN)
```http
DELETE /api/v1/users/:id
Authorization: Bearer <token>
```

#### Cambiar contraseña
```http
POST /api/v1/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

### Líneas de Servicio

#### Crear línea de servicio (ADMIN, MANAGER)
```http
POST /api/v1/service-lines
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Consultoría IT",
  "description": "Servicios de consultoría tecnológica"
}
```

#### Listar líneas de servicio
```http
GET /api/v1/service-lines?page=1&limit=10&search=IT&isActive=true
Authorization: Bearer <token>
```

#### Obtener línea de servicio por ID
```http
GET /api/v1/service-lines/:id
Authorization: Bearer <token>
```

#### Actualizar línea de servicio (ADMIN, MANAGER)
```http
PUT /api/v1/service-lines/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Consultoría IT Avanzada",
  "isActive": true
}
```

#### Eliminar línea de servicio (ADMIN)
```http
DELETE /api/v1/service-lines/:id
Authorization: Bearer <token>
```

### Especialidades

#### Crear especialidad (ADMIN, MANAGER)
```http
POST /api/v1/specialties
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Desarrollo Web",
  "description": "Especialización en desarrollo web"
}
```

#### Listar especialidades
```http
GET /api/v1/specialties?page=1&limit=10
Authorization: Bearer <token>
```

#### Obtener especialidad por ID
```http
GET /api/v1/specialties/:id
Authorization: Bearer <token>
```

#### Actualizar especialidad (ADMIN, MANAGER)
```http
PUT /api/v1/specialties/:id
Authorization: Bearer <token>
```

#### Eliminar especialidad (ADMIN)
```http
DELETE /api/v1/specialties/:id
Authorization: Bearer <token>
```

### Clientes

#### Crear cliente (ADMIN, MANAGER)
```http
POST /api/v1/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Empresa XYZ",
  "email": "contact@xyz.com",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

#### Listar clientes
```http
GET /api/v1/clients?page=1&limit=10&search=xyz
Authorization: Bearer <token>
```

#### Obtener cliente por ID
```http
GET /api/v1/clients/:id
Authorization: Bearer <token>
```

#### Actualizar cliente (ADMIN, MANAGER)
```http
PUT /api/v1/clients/:id
Authorization: Bearer <token>
```

#### Eliminar cliente (ADMIN)
```http
DELETE /api/v1/clients/:id
Authorization: Bearer <token>
```

### Equipos

#### Crear equipo (ADMIN, MANAGER)
```http
POST /api/v1/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Equipo Alpha",
  "description": "Equipo de desarrollo principal",
  "memberIds": ["user-id-1", "user-id-2"],
  "serviceLineIds": ["service-line-id"],
  "specialtyIds": ["specialty-id"],
  "clientIds": ["client-id"]
}
```

#### Listar equipos
```http
GET /api/v1/teams?page=1&limit=10&search=alpha
Authorization: Bearer <token>
```

#### Obtener equipo por ID
```http
GET /api/v1/teams/:id
Authorization: Bearer <token>
```

#### Actualizar equipo (ADMIN, MANAGER)
```http
PUT /api/v1/teams/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Equipo Alpha Updated",
  "description": "Nueva descripción"
}
```

#### Eliminar equipo (ADMIN)
```http
DELETE /api/v1/teams/:id
Authorization: Bearer <token>
```

#### Agregar miembro al equipo (ADMIN, MANAGER)
```http
POST /api/v1/teams/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-id",
  "role": "MEMBER"
}
```

#### Remover miembro del equipo (ADMIN, MANAGER)
```http
DELETE /api/v1/teams/:id/members/:userId
Authorization: Bearer <token>
```

#### Asignar línea de servicio (ADMIN, MANAGER)
```http
POST /api/v1/teams/:id/service-lines
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceLineId": "service-line-id"
}
```

#### Remover línea de servicio (ADMIN, MANAGER)
```http
DELETE /api/v1/teams/:id/service-lines/:serviceLineId
Authorization: Bearer <token>
```

#### Asignar especialidad (ADMIN, MANAGER)
```http
POST /api/v1/teams/:id/specialties
Authorization: Bearer <token>
Content-Type: application/json

{
  "specialtyId": "specialty-id"
}
```

#### Remover especialidad (ADMIN, MANAGER)
```http
DELETE /api/v1/teams/:id/specialties/:specialtyId
Authorization: Bearer <token>
```

#### Asignar cliente (ADMIN, MANAGER)
```http
POST /api/v1/teams/:id/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientId": "client-id"
}
```

#### Remover cliente (ADMIN, MANAGER)
```http
DELETE /api/v1/teams/:id/clients/:clientId
Authorization: Bearer <token>
```

## Roles y Permisos

### ADMIN
- Acceso completo a todas las operaciones
- Puede crear, leer, actualizar y eliminar todos los recursos

### MANAGER
- Puede crear y actualizar la mayoría de recursos
- No puede eliminar usuarios ni recursos principales

### USER
- Solo lectura en la mayoría de endpoints
- Puede actualizar su propio perfil
- Puede cambiar su propia contraseña

## Manejo de Errores

La API devuelve errores en el siguiente formato:

```json
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}
```

Códigos de estado HTTP:
- `200` - Éxito
- `201` - Recurso creado
- `400` - Error de validación
- `401` - No autenticado
- `403` - Sin permisos
- `404` - Recurso no encontrado
- `500` - Error del servidor

## Paginación

Todos los endpoints de listado soportan paginación:

```http
GET /api/v1/users?page=1&limit=10
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

## Búsqueda

Los endpoints de listado soportan búsqueda por texto:

```http
GET /api/v1/users?search=john
```

## Licencia

MIT
