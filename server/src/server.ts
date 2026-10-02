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

  const server = appInstance.listen(config.port, () => {
    console.log(`FindMate API listening on port ${config.port}`);
    console.log(`CORS origin: ${config.corsOrigin}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received, shutting down gracefully...`);
    server.close(async (err) => {
      if (err) {
        console.error('Error during server shutdown:', err);
        process.exit(1);
      }
      try {
        await getPool().end();
        console.log('Database pool closed.');
      } catch (e) {
        console.error('Error closing database pool:', e);
      }
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Force closing after timeout.');
      process.exit(1);
    }, 30000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  server.on('error', (err: Error) => {
    if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      console.error(`Port ${config.port} is already in use.`);
      process.exit(1);
    }
    throw err;
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
