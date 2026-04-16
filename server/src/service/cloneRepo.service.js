import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

const git = simpleGit();

export const cloneRepo = async (repoUrl, accessToken = null) => {
  const repoName = `repo-${Date.now()}`;
  const repoPath = path.join("temp", repoName);

  if (!fs.existsSync("temp")) {
    fs.mkdirSync("temp");
    console.log(`[Clone] Created temp directory`);
  }

  let cloneUrl = repoUrl;
  if (accessToken) {
    // Construct authenticated URL for private repo access
    const urlObj = new URL(repoUrl.endsWith(".git") ? repoUrl : `${repoUrl}.git`);
    cloneUrl = `https://x-access-token:${accessToken}@${urlObj.host}${urlObj.pathname}`;
  }

  console.log(`[Clone] Cloning ${repoUrl} into ${repoPath}...`);
  await git.clone(cloneUrl, repoPath, ["--depth", "1"]);
  console.log(`[Clone] Clone successful`);

  return repoPath;
};