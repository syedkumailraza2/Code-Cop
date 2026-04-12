import fs from "fs";
import path from "path";
import { runLint } from "./lint.service.js";
import { runMultiLint } from "./lintRunner.service.js";
import { detectTechStack } from "./techStack.service.js";
import { generateSuggestions } from "./suggestions.service.js";
import { getRepoSize, getRepoStats } from "../utility/spawnWithTimeout.utils.js";

const MAX_REPO_SIZE = 25 * 1024 * 1024; // 25MB

const SKIP_DIRS = new Set(["node_modules", ".git", "vendor", "build", "dist", ".next", "__pycache__", ".dart_tool"]);

// Patterns built from fragments to avoid the scanner flagging its own source code
const SECRET_PATTERNS = [
  "API", "SECRET", "PRIVATE", "ACCESS", "AWS",
].map((prefix) => new RegExp(`${prefix}_(?:KEY|TOKEN|SECRET)`, "i"))
  .concat(new RegExp("pass" + "word\\s*=", "i"));

const isBinary = (filePath) => {
  try {
    const stat = fs.statSync(filePath);
    if (stat.size > 1_000_000) return true;
    const buffer = Buffer.alloc(512);
    const fd = fs.openSync(filePath, "r");
    const bytesRead = fs.readSync(fd, buffer, 0, 512, 0);
    fs.closeSync(fd);
    for (let i = 0; i < bytesRead; i++) {
      if (buffer[i] === 0) return true;
    }
    return false;
  } catch {
    return true;
  }
};

const scanForSecrets = (dir, depth = 0, maxDepth = 4) => {
  const found = [];
  if (depth > maxDepth) return found;
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry)) continue;
      const fullPath = path.join(dir, entry);
      const stat = fs.lstatSync(fullPath);
      if (stat.isFile()) {
        if (isBinary(fullPath)) continue;
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          for (const pattern of SECRET_PATTERNS) {
            if (pattern.test(content)) {
              found.push(entry);
              break;
            }
          }
        } catch {}
      } else if (stat.isDirectory()) {
        found.push(...scanForSecrets(fullPath, depth + 1, maxDepth));
      }
    }
  } catch {}
  return found;
};

export const evaluateProject = async (repoPath) => {
  // Repo size guard
  const repoSize = getRepoSize(repoPath);
  if (repoSize > MAX_REPO_SIZE) {
    throw new Error("Repository too large to analyze");
  }

  let score = 100;
  let issues = { critical: [], warnings: [], good: [] };

  // Detect tech stack
  const techStack = detectTechStack(repoPath);

  // Check README
  console.log(`[Evaluate] Checking README...`);
  if (fs.existsSync(path.join(repoPath, "README.md"))) {
    issues.good.push("README file present");
  } else {
    score -= 10;
    issues.warnings.push("Missing README file");
  }

  // Check .gitignore
  console.log(`[Evaluate] Checking .gitignore...`);
  if (fs.existsSync(path.join(repoPath, ".gitignore"))) {
    issues.good.push(".gitignore present");
  } else {
    score -= 5;
    issues.warnings.push("Missing .gitignore");
  }

  // Structure check based on detected tech stack
  console.log(`[Evaluate] Checking project structure...`);
  if (techStack.languages.length > 0) {
    const langLabel = techStack.frameworks.length > 0
      ? `${techStack.frameworks[0]} project detected`
      : `${techStack.languages[0]} project detected`;
    issues.good.push(langLabel);
    console.log(`[Evaluate] ${langLabel}`);
  }

  // Linting (JS/TS via ESLint)
  let lintPenalty = 0;
  const lintResults = [];
  const hasJs = techStack.languages.includes("JavaScript");
  const hasTs = techStack.languages.includes("TypeScript");
  if (hasJs || hasTs) {
    console.log(`[Lint] Running JavaScript linter (ESLint)...`);
    try {
      const { errors, warnings, details, skipped } = await runLint(repoPath);
      if (skipped) {
        if (hasTs && !hasJs) {
          // Pure TS repo — ESLint without TS parser can't lint these
          console.log(`[Lint] TypeScript-only repo — ESLint requires typescript-eslint for TS files`);
        } else {
          issues.warnings.push("No JavaScript files found — linting skipped");
        }
      } else {
        console.log(`[Lint] Results — errors: ${errors}, warnings: ${warnings}`);
        lintPenalty += errors * 2 + warnings * 1;
        if (errors > 0) issues.critical.push(`${errors} JavaScript lint errors found`);
        if (warnings > 0) issues.warnings.push(`${warnings} JavaScript lint warnings`);
        if (errors === 0 && warnings === 0) issues.good.push("No JavaScript lint issues found");

        lintResults.push({
          language: "JavaScript",
          linter: "eslint",
          errors,
          warnings,
          details: details || [],
        });
      }
    } catch (err) {
      console.error(`[Lint] Failed: ${err.message || err}`);
      issues.warnings.push("JavaScript linting failed");
    }
  } else {
    console.log(`[Lint] No JS/TS detected, skipping ESLint`);
  }

  // Multi-language linting (Python, Go, Dart)
  try {
    const multiLint = await runMultiLint(techStack.languages, repoPath);
    lintResults.push(...multiLint.results);
    lintPenalty += multiLint.totalErrors * 2 + multiLint.totalWarnings * 1;

    for (const result of multiLint.results) {
      if (result.errors > 0) {
        issues.critical.push(`${result.errors} ${result.language} lint errors (${result.linter})`);
      }
      if (result.warnings > 0) {
        issues.warnings.push(`${result.warnings} ${result.language} lint warnings (${result.linter})`);
      }
      if (result.errors === 0 && result.warnings === 0) {
        issues.good.push(`No ${result.language} lint issues`);
      }
    }
  } catch (err) {
    console.error(`[CodeCop] Multi-lint failed: ${err.message || err}`);
  }

  // Cap total lint penalty at 50
  lintPenalty = Math.min(lintPenalty, 50);
  score -= lintPenalty;

  // Secret detection (recursive)
  console.log(`[Evaluate] Scanning for secrets...`);
  const secretFiles = scanForSecrets(repoPath);
  if (secretFiles.length > 0) {
    score -= secretFiles.length * 20;
    for (const file of secretFiles) {
      issues.critical.push(`Possible secret/key in ${file}`);
    }
  }
  console.log(`[Evaluate] Secret scan done — ${secretFiles.length} issue(s) found`);

  // Normalize score
  score = Math.max(0, Math.min(100, score));

  // Generate suggestions
  const suggestions = generateSuggestions(repoPath, techStack, issues);

  // Repo stats
  console.log(`[Evaluate] Collecting repo stats...`);
  const repoStats = getRepoStats(repoPath);
  console.log(`[Evaluate] Stats — files: ${repoStats.totalFiles}, lines: ${repoStats.totalLines}, size: ${repoStats.totalSize}`);

  console.log(`[Evaluate] Final score: ${score}`);
  return {
    score,
    status: score > 80 ? "Clean" : score > 50 ? "Needs Improvement" : "Risky Code",
    techStack,
    issues,
    suggestions,
    lintResults,
    repoStats,
  };
};
