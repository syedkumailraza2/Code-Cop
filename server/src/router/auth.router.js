import express from "express";
import { githubCallback, getMe, logout } from "../controller/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.get("/auth/github/callback", githubCallback);
authRouter.get("/auth/me", requireAuth, getMe);
authRouter.post("/auth/logout", logout);

export default authRouter;
