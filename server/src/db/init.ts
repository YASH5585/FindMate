import 'dotenv/config';
import { getPool, testConnection } from './index';
import { SCHEMA_SQL } from './schema';

export async function initDatabase(): Promise<void> {
  const connected = await testConnection();
  if (!connected) {
    console.error('Could not connect to database. Aborting schema init.');
    process.exit(1);
  }

  const client = await getPool().connect();
  try {
    await client.query(SCHEMA_SQL);
    console.log('Schema initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize schema:', err);
    process.exit(1);
  } finally {
    client.release();
  }

  await getPool().end();
}

initDatabase();
