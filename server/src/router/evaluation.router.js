import express from 'express';
import rateLimit from 'express-rate-limit';
import Evaluation from '../controller/evaluator.controller.js';
import submitFeedback from '../controller/feedback.controller.js';

// 5 analyses per IP per 15 minutes
const evaluateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many analysis requests. Please try again in 15 minutes.' },
});

// 10 feedback submissions per IP per 15 minutes
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many feedback submissions. Please try again later.' },
});

const evaluatorRouter = express.Router();

evaluatorRouter.post('/evaluate', evaluateLimiter, Evaluation);
evaluatorRouter.post('/feedback', feedbackLimiter, submitFeedback);

export default evaluatorRouter;