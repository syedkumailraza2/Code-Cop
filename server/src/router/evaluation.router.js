import express from 'express';
import Evaluation from '../controller/evaluator.controller.js';

const evaluatorRouter = express.Router();

evaluatorRouter.post('/evaluate', Evaluation)

export default evaluatorRouter;