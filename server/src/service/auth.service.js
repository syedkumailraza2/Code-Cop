import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { encryptToken } from "../utility/crypto.utils.js";

export async function exchangeCodeForToken(code) {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
  }
  return data.access_token;
}

export async function fetchGitHubUser(accessToken) {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch GitHub user profile");
  }

  return res.json();
}

export async function findOrCreateUser(profile, encryptedTokenData) {
  const user = await User.findOneAndUpdate(
    { githubId: profile.id },
    {
      githubId: profile.id,
      username: profile.login,
      displayName: profile.name || profile.login,
      avatarUrl: profile.avatar_url,
      email: profile.email,
      accessToken: encryptedTokenData.encrypted,
      accessTokenIv: encryptedTokenData.iv,
      accessTokenTag: encryptedTokenData.tag,
      updatedAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return user;
}

export function generateJWT(user) {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function encryptAccessToken(plaintext) {
  return encryptToken(plaintext);
}
