import express from 'express';
import Evaluation from '../controller/evaluator.controller.js';
import submitFeedback from '../controller/feedback.controller.js';

const evaluatorRouter = express.Router();

evaluatorRouter.post('/evaluate', Evaluation);
evaluatorRouter.post('/feedback', submitFeedback);

export default evaluatorRouter;