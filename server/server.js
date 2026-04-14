import './env.js';
import express from 'express';
import cors from 'cors';

import { requireAuth } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import driversRouter from './routes/drivers.js';
import loadsRouter from './routes/loads.js';
import assignmentsRouter from './routes/assignments.js';
import quotesRouter from './routes/quotes.js';

const app = express();
const PORT = process.env.PORT || 3001;

const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
const envOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = envOrigins.length ? envOrigins : defaultOrigins;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'FleetFlow API' });
});

/**
 * All /api routes require a valid Clerk session (or dev fallback via x-user-id when secret unset).
 */
app.use('/api', requireAuth);
app.use('/api/drivers', driversRouter);
app.use('/api/loads', loadsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/quotes', quotesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`FleetFlow API listening on http://localhost:${PORT}`);
});
