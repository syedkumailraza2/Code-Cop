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
export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.next/**", "**/vendor/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        global: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        URL: "readonly",
        fetch: "readonly",
        Response: "readonly",
        Request: "readonly",
        AbortController: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        HTMLElement: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "eqeqeq": "error",
      "no-var": "error",
      "no-eval": "error",
      "no-debugger": "error",
    },
  },
];
`);

  const eslint = new ESLint({
    cwd: absolutePath,
    overrideConfigFile: tempConfigPath,
  });

  let results;
  try {
    results = await eslint.lintFiles(["**/*.{js,jsx,mjs,cjs}"]);
  } catch (err) {
    if (err.message?.includes("All files matched") || err.message?.includes("No files matching")) {
      console.log(`[Lint] No JavaScript files found in repo, skipping lint`);
      return { errors: 0, warnings: 0, details: [], skipped: true };
    }
    throw err;
  } finally {
    fs.rmSync(tempConfigDir, { recursive: true, force: true });
  }

  console.log(`[Lint] Linted ${results.length} file(s)`);

  let errors = 0;
  let warnings = 0;
  const details = [];

  results.forEach((file) => {
    errors += file.errorCount;
    warnings += file.warningCount;

    const relPath = path.relative(absolutePath, file.filePath);
    for (const msg of file.messages) {
      details.push({
        file: relPath,
        line: msg.line || 0,
        column: msg.column || 0,
        severity: msg.severity === 2 ? "error" : "warning",
        message: msg.message,
        rule: msg.ruleId || "",
      });
    }
  });

  console.log(`[Lint] Total — errors: ${errors}, warnings: ${warnings}`);
  return { errors, warnings, details, skipped: false };
};