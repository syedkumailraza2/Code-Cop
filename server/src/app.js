import env from 'dotenv';
env.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import evaluatorRouter from './router/evaluation.router.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(evaluatorRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL;
if (MONGO_URL) {
  mongoose
    .connect(MONGO_URL)
    .then(() => console.log('[MongoDB] Connected'))
    .catch((err) => console.error('[MongoDB] Connection error:', err.message));
} else {
  console.warn('[MongoDB] MONGO_URL not set — skipping database connection');
}

export default app;