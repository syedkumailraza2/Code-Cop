import express from "express";
import { getUserRepos } from "../controller/repos.controller.js";
import { getAnalysisHistory } from "../controller/history.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const reposRouter = express.Router();

reposRouter.get("/repos", requireAuth, getUserRepos);
reposRouter.get("/history", requireAuth, getAnalysisHistory);

export default reposRouter;
