/**
 * Seed sin Prisma Client (evita conflictos ESM/CJS con ts-node).
 * Inserta roles USER y ADMIN si no existen.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL no está definida');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function ensureRole(description) {
  await pool.query(
    `INSERT INTO "Rol" ("description", "status")
     SELECT $1::varchar(200), true
     WHERE NOT EXISTS (
       SELECT 1 FROM "Rol" WHERE "description" = $1::varchar(200)
     )`,
    [description],
  );
}

async function main() {
  await ensureRole('USER');
  await ensureRole('ADMIN');
  console.log('Seed OK: roles USER y ADMIN listos.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => pool.end());
