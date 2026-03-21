import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

import decisionsRouter from './routes/decisions';
import analyticsRouter from './routes/analytics';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// APIs
app.use('/api/decisions', decisionsRouter);
app.use('/api/analytics', analyticsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
