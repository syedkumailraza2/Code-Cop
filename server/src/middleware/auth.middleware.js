import { verifyJWT } from "../service/auth.service.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.codecop_token;
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = verifyJWT(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function optionalAuth(req, res, next) {
  const token = req.cookies?.codecop_token;
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyJWT(token);
    req.user = payload;
  } catch {
    req.user = null;
  }
  next();
}
