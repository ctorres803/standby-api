# Guía de Despliegue

## Despliegue en Producción

### 1. Preparación

1. Asegúrate de tener una base de datos PostgreSQL disponible
2. Configura las variables de entorno en tu servidor

### 2. Variables de Entorno de Producción

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
PORT=3000
NODE_ENV=production
JWT_SECRET=<genera-un-secret-seguro>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://tu-dominio.com
```

### 3. Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd standby-api

# Instalar dependencias de producción
npm ci --production

# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate deploy

# Compilar TypeScript
npm run build
```

### 4. Iniciar Servidor

```bash
npm start
```

### 5. Con PM2 (Recomendado)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start dist/index.js --name standby-api

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

## Despliegue con Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/standby_db
      - NODE_ENV=production
      - JWT_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=standby_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Comandos Docker

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## Monitoreo y Logs

### Con PM2

```bash
# Ver logs
pm2 logs standby-api

# Monitorear
pm2 monit

# Reiniciar
pm2 restart standby-api
```

## Backup de Base de Datos

```bash
# Backup
pg_dump -U user -h host -d standby_db > backup.sql

# Restaurar
psql -U user -h host -d standby_db < backup.sql
```

## Seguridad

1. Cambiar JWT_SECRET a un valor seguro y único
2. Configurar CORS correctamente
3. Usar HTTPS en producción
4. Mantener dependencias actualizadas
5. Configurar rate limiting
6. Implementar logging adecuado
