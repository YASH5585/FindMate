import app from './app';
import { config } from './config';
import { testConnection } from './db';

async function startServer(): Promise<void> {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('FATAL: Could not connect to PostgreSQL. Ensure DATABASE_URL is set.');
    process.exit(1);
  }
  console.log('Connected to PostgreSQL database.');

  app.listen(config.port, () => {
    console.log(`FindMate API listening on port ${config.port}`);
    console.log(`CORS origin: ${config.corsOrigin}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
