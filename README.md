# GMV â€” App segura (API + front)

## API (gmv-api/hello-prisma)
- Copia .env.example a .env (DATABASE_URL, JWT_SECRET, PORT, FRONTEND_ORIGIN).
- 
pm install Â· 
px prisma migrate deploy Â· 
px prisma db seed Â· 
pm run start:dev

## Front (gmv-api-front)
- Copia .env.example a .env (VITE_API_URL).
- 
pm install Â· 
pm run dev

El primer usuario registrado recibe rol ADMIN si la tabla de usuarios esta vacia.
