/**
 * Local development entrypoint.
 * Starts the Express server backed by an in-memory PostgreSQL-compatible
 * database (pg-mem). This is for LOCAL DEVELOPMENT ONLY and is never used in
 * production. Production requires a real PostgreSQL instance via DATABASE_URL.
 */
import 'dotenv/config';
import { newDb } from 'pg-mem';
import type { Pool } from 'pg';
import { setPool, getPool } from './db';
import { SCHEMA_SQL } from './db/schema';
import { registerExtensions } from './db/pg-mem-helpers';
import { createApp } from './app';
import { config } from './config';

async function main(): Promise<void> {
  const memDb: any = newDb();
  registerExtensions(memDb);
  const { Pool } = memDb.adapters.createPg();
  const pool = new Pool(memDb.connectionParameters) as unknown as Pool;
  setPool(pool);

  const client = await getPool().connect();
  try {
    await client.query(SCHEMA_SQL);
  } finally {
    client.release();
  }

  const app = createApp(pool, true);

  app.listen(config.port, () => {
    console.log(`FindMate API (dev, in-memory) listening on port ${config.port}`);
    console.log(`Health: http://localhost:${config.port}/health`);
    console.log(`API:    http://localhost:${config.port}/api/items`);
  });
}

main().catch((err) => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});
