import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import itemRoutes from './routes/itemRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/items', itemRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
