import { ESLint } from "eslint";
import path from "path";
import fs from "fs";
import os from "os";

export const runLint = async (repoPath) => {
  const absolutePath = path.resolve(repoPath);
  console.log(`[Lint] Linting path: ${absolutePath}`);

  // Write a temp config file to avoid picking up the repo's own ESLint config
  const tempConfigDir = fs.mkdtempSync(path.join(os.tmpdir(), "codecop-lint-"));
  const tempConfigPath = path.join(tempConfigDir, "eslint.config.mjs");
  fs.writeFileSync(tempConfigPath, `
export default [{
  files: ["**/*.{js,ts,jsx,tsx}"],
  ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.next/**", "**/vendor/**"],
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "error",
    "no-console": "warn",
    "eqeqeq": "error",
    "no-var": "error",
    "no-eval": "error",
    "no-debugger": "error",
  },
}];
`);

  const eslint = new ESLint({
    cwd: absolutePath,
    overrideConfigFile: tempConfigPath,
  });

  let results;
  try {
    results = await eslint.lintFiles(["**/*.{js,ts,jsx,tsx}"]);
  } catch (err) {
    if (err.message?.includes("All files matched") || err.message?.includes("No files matching")) {
      console.log(`[Lint] No JS/TS files found in repo, skipping lint`);
      return { errors: 0, warnings: 0, skipped: true };
    }
    throw err;
  } finally {
    fs.rmSync(tempConfigDir, { recursive: true, force: true });
  }

  console.log(`[Lint] Linted ${results.length} file(s)`);

  let errors = 0;
  let warnings = 0;

  results.forEach((file) => {
    errors += file.errorCount;
    warnings += file.warningCount;
  });

  console.log(`[Lint] Total — errors: ${errors}, warnings: ${warnings}`);
  return { errors, warnings, skipped: false };
};