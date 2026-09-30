import { createApp } from './app';
import { config } from './config';
import { testConnection, getPool } from './db';
import { SCHEMA_SQL } from './db/schema';

async function initSchema(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query(SCHEMA_SQL);
    console.log('Schema ready.');
  } catch (err) {
    console.error('Failed to initialize schema:', err);
    process.exit(1);
  } finally {
    client.release();
  }
}

async function startServer(): Promise<void> {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('FATAL: Could not connect to PostgreSQL. Ensure DATABASE_URL is set.');
    process.exit(1);
  }
  console.log('Connected to PostgreSQL database.');
  await initSchema();

  const appInstance = createApp(getPool());

  appInstance.listen(config.port, () => {
    console.log(`FindMate API listening on port ${config.port}`);
    console.log(`CORS origin: ${config.corsOrigin}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
