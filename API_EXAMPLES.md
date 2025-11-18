# Ejemplos de Uso de la API

Esta guía proporciona ejemplos prácticos de cómo usar la API.

## 1. Registro y Autenticación

### Registrar un nuevo usuario administrador

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "phone": "+1234567890",
    "role": "ADMIN"
  }'
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@example.com",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Importante:** Guarda el token para usarlo en las siguientes peticiones.

## 2. Crear Líneas de Servicio

```bash
TOKEN="tu-token-aqui"

# Crear varias líneas de servicio
curl -X POST http://localhost:3000/api/v1/service-lines \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Consultoría IT",
    "description": "Servicios de consultoría tecnológica"
  }'

curl -X POST http://localhost:3000/api/v1/service-lines \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Desarrollo de Software",
    "description": "Desarrollo de aplicaciones personalizadas"
  }'
```

## 3. Crear Especialidades

```bash
# Crear especialidades
curl -X POST http://localhost:3000/api/v1/specialties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend Development",
    "description": "Especialización en desarrollo frontend con React, Vue, Angular"
  }'

curl -X POST http://localhost:3000/api/v1/specialties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Backend Development",
    "description": "Especialización en desarrollo backend con Node.js, Python, Java"
  }'
```

## 4. Crear Clientes

```bash
# Crear cliente
curl -X POST http://localhost:3000/api/v1/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Empresa ABC",
    "email": "contacto@empresaabc.com",
    "phone": "+1234567890",
    "address": "Calle Principal 123, Ciudad"
  }'

curl -X POST http://localhost:3000/api/v1/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Corporación XYZ",
    "email": "info@corporacionxyz.com",
    "phone": "+0987654321",
    "address": "Avenida Comercial 456, Ciudad"
  }'
```

## 5. Crear Usuarios para el Equipo

```bash
# Registrar varios usuarios
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "User123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1111111111",
    "role": "USER"
  }'

curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "User123!",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+2222222222",
    "role": "USER"
  }'
```

## 6. Crear un Equipo Completo

```bash
# Primero obtén los IDs de usuarios, líneas de servicio, especialidades y clientes
# Luego crea el equipo

curl -X POST http://localhost:3000/api/v1/teams \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Equipo Alpha",
    "description": "Equipo especializado en desarrollo web full-stack",
    "memberIds": ["user-id-1", "user-id-2"],
    "serviceLineIds": ["service-line-id-1"],
    "specialtyIds": ["specialty-id-1", "specialty-id-2"],
    "clientIds": ["client-id-1"]
  }'
```

## 7. Gestionar Miembros del Equipo

```bash
TEAM_ID="id-del-equipo"

# Agregar un miembro
curl -X POST http://localhost:3000/api/v1/teams/$TEAM_ID/members \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id-3",
    "role": "LEADER"
  }'

# Remover un miembro
curl -X DELETE http://localhost:3000/api/v1/teams/$TEAM_ID/members/user-id-1 \
  -H "Authorization: Bearer $TOKEN"
```

## 8. Gestionar Líneas de Servicio del Equipo

```bash
# Asignar línea de servicio
curl -X POST http://localhost:3000/api/v1/teams/$TEAM_ID/service-lines \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceLineId": "service-line-id-2"
  }'

# Remover línea de servicio
curl -X DELETE http://localhost:3000/api/v1/teams/$TEAM_ID/service-lines/service-line-id-2 \
  -H "Authorization: Bearer $TOKEN"
```

## 9. Gestionar Especialidades del Equipo

```bash
# Asignar especialidad
curl -X POST http://localhost:3000/api/v1/teams/$TEAM_ID/specialties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "specialtyId": "specialty-id-3"
  }'

# Remover especialidad
curl -X DELETE http://localhost:3000/api/v1/teams/$TEAM_ID/specialties/specialty-id-3 \
  -H "Authorization: Bearer $TOKEN"
```

## 10. Gestionar Clientes del Equipo

```bash
# Asignar cliente
curl -X POST http://localhost:3000/api/v1/teams/$TEAM_ID/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client-id-2"
  }'

# Remover cliente
curl -X DELETE http://localhost:3000/api/v1/teams/$TEAM_ID/clients/client-id-2 \
  -H "Authorization: Bearer $TOKEN"
```

## 11. Consultar Información

### Listar equipos con paginación

```bash
curl -X GET "http://localhost:3000/api/v1/teams?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Buscar equipos

```bash
curl -X GET "http://localhost:3000/api/v1/teams?search=alpha" \
  -H "Authorization: Bearer $TOKEN"
```

### Obtener detalles completos de un equipo

```bash
curl -X GET http://localhost:3000/api/v1/teams/$TEAM_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Listar usuarios

```bash
curl -X GET "http://localhost:3000/api/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Obtener detalles de un usuario (incluye sus equipos)

```bash
curl -X GET http://localhost:3000/api/v1/users/user-id \
  -H "Authorization: Bearer $TOKEN"
```

### Listar clientes

```bash
curl -X GET "http://localhost:3000/api/v1/clients?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Obtener detalles de un cliente (incluye equipos asignados)

```bash
curl -X GET http://localhost:3000/api/v1/clients/client-id \
  -H "Authorization: Bearer $TOKEN"
```

## 12. Actualizar Información

### Actualizar equipo

```bash
curl -X PUT http://localhost:3000/api/v1/teams/$TEAM_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Equipo Alpha Actualizado",
    "description": "Nueva descripción del equipo"
  }'
```

### Actualizar usuario

```bash
curl -X PUT http://localhost:3000/api/v1/users/user-id \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John Updated",
    "phone": "+9999999999"
  }'
```

### Cambiar contraseña

```bash
curl -X POST http://localhost:3000/api/v1/users/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "User123!",
    "newPassword": "NewPassword123!"
  }'
```

## Flujo de Trabajo Completo: Ejemplo

Este es un flujo de trabajo típico para configurar un nuevo equipo:

```bash
# 1. Registrar y hacer login como admin
# 2. Crear líneas de servicio necesarias
# 3. Crear especialidades necesarias
# 4. Crear clientes
# 5. Registrar usuarios que formarán parte del equipo
# 6. Crear el equipo con todas las relaciones
# 7. Agregar/remover miembros, líneas de servicio, especialidades o clientes según sea necesario
# 8. Consultar la información del equipo para verificar
```

## Notas Importantes

- Todos los endpoints (excepto registro y login) requieren el token de autenticación
- Los roles ADMIN y MANAGER tienen permisos para crear y actualizar recursos
- Solo ADMIN puede eliminar recursos
- Las búsquedas son case-insensitive
- La paginación por defecto es 10 elementos por página
- Los IDs son UUIDs generados automáticamente
