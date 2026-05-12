# GMV — API y frontend (monorepo)

Aplicación de ejemplo con **NestJS + Prisma + PostgreSQL** (`gmv-api/hello-prisma`) y **React + Vite** (`gmv-api-front`): autenticación con JWT en cookie httpOnly, roles USER/ADMIN, tareas por usuario y auditoría para administradores.

## Requisitos

- Node.js LTS
- PostgreSQL en ejecución y una base de datos creada

## API — `gmv-api/hello-prisma`

1. Entra a la carpeta del backend:

   ```bash
   cd gmv-api/hello-prisma
   ```

2. Copia el ejemplo de variables y edítalo (URL de base de datos, secreto JWT, puerto y origen del front):

   ```bash
   copy .env.example .env
   ```

   En Linux o macOS: `cp .env.example .env`

3. Instala dependencias, aplica migraciones, genera el cliente de Prisma, siembra datos de prueba y arranca en modo desarrollo:

   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   npm run start:dev
   ```

   La API queda por defecto en `http://localhost:3000` (ajustable con `PORT` en `.env`).

## Frontend — `gmv-api-front`

1. En otra terminal:

   ```bash
   cd gmv-api-front
   ```

2. Variables de entorno (URL del backend):

   ```bash
   copy .env.example .env
   ```

3. Instalación y servidor de desarrollo:

   ```bash
   npm install
   npm run dev
   ```

   Vite suele servir en `http://localhost:5173`.

## Notas

- **CORS**: el backend usa `FRONTEND_ORIGIN` en `.env` para permitir credenciales desde el front.
- **Primer administrador**: si la tabla de usuarios está vacía, el **primer usuario que se registre** recibe el rol **ADMIN**; los siguientes serán **USER** salvo que un admin cambie el rol.

## Estructura del repositorio

| Ruta | Descripción |
|------|-------------|
| `gmv-api/hello-prisma/` | API NestJS, esquema Prisma y semilla |
| `gmv-api-front/` | SPA React (Vite) |
