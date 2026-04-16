import {
  exchangeCodeForToken,
  fetchGitHubUser,
  findOrCreateUser,
  generateJWT,
  encryptAccessToken,
} from "../service/auth.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

export async function githubCallback(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: "Missing authorization code" });
    }

    const accessToken = await exchangeCodeForToken(code);
    const profile = await fetchGitHubUser(accessToken);
    const encryptedTokenData = encryptAccessToken(accessToken);
    const user = await findOrCreateUser(profile, encryptedTokenData);
    const jwt = generateJWT(user);

    res.cookie("codecop_token", jwt, COOKIE_OPTIONS);

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    res.redirect(`${clientUrl}/dashboard`);
  } catch (error) {
    console.error("[Auth] GitHub callback error:", error.message);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    res.redirect(`${clientUrl}/?auth_error=1`);
  }
}

export async function getMe(req, res) {
  try {
    const { default: User } = await import("../model/user.model.js");
    const user = await User.findById(req.user.userId).select(
      "githubId username displayName avatarUrl email createdAt"
    );
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("[Auth] getMe error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function logout(req, res) {
  res.clearCookie("codecop_token", { path: "/" });
  res.json({ message: "Logged out" });
}
