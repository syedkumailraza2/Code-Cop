import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

const git = simpleGit();

export const cloneRepo = async (repoUrl) => {
  const repoName = `repo-${Date.now()}`;
  const repoPath = path.join("temp", repoName);

  if (!fs.existsSync("temp")) {
    fs.mkdirSync("temp");
    console.log(`[Clone] Created temp directory`);
  }

  console.log(`[Clone] Cloning ${repoUrl} into ${repoPath}...`);
  await git.clone(repoUrl, repoPath, ["--depth", "1"]);
  console.log(`[Clone] Clone successful`);

  return repoPath;
};