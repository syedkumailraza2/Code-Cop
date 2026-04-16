import env from 'dotenv';
env.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import evaluatorRouter from './router/evaluation.router.js';
import authRouter from './router/auth.router.js';
import reposRouter from './router/repos.router.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(authRouter);
app.use(reposRouter);
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