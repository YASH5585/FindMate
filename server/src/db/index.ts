import { Pool } from 'pg';
import type { PoolClient, QueryResult } from 'pg';
import { config } from '../config';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = config.database.url;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required. Copy server/.env.example to server/.env');
    }
    pool = new Pool({
      connectionString,
      ...(config.isProduction ? {} : { ssl: false }),
    });
    pool.on('error', (err: Error) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }
  return pool;
}

/** For testing only: inject a custom pool (e.g. in-memory postgres). */
export function setPool(customPool: Pool): void {
  pool = customPool;
}

export async function testConnection(): Promise<boolean> {
  try {
    const client: PoolClient = await getPool().connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
}

export async function query(text: string, params?: unknown[]): Promise<QueryResult> {
  return getPool().query(text, params);
}
