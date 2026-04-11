import env from 'dotenv';
env.config();

import express from 'express';
import cors from 'cors';
import evaluatorRouter from './router/evaluation.router.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(evaluatorRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

export default app;