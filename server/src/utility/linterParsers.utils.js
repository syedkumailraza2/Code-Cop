/**
 * Parse ruff JSON output.
 * E/F prefix codes = error, everything else = warning.
 */
export const parseRuff = (stdout) => {
  try {
    const issues = JSON.parse(stdout);
    let errors = 0;
    let warnings = 0;
    for (const issue of issues) {
      const code = issue.code || "";
      if (code.startsWith("E") || code.startsWith("F")) {
        errors++;
      } else {
        warnings++;
      }
    }
    return { errors, warnings };
  } catch {
    return { errors: 0, warnings: 0 };
  }
};

/**
 * Parse golangci-lint JSON output.
 * Checks .Severity — "error" counts as error, everything else as warning.
 */
export const parseGolangciLint = (stdout) => {
  try {
    const data = JSON.parse(stdout);
    const issues = data.Issues || [];
    let errors = 0;
    let warnings = 0;
    for (const issue of issues) {
      if (issue.Severity === "error") {
        errors++;
      } else {
        warnings++;
      }
    }
    return { errors, warnings };
  } catch {
    return { errors: 0, warnings: 0 };
  }
};

/**
 * Parse `dart analyze --format machine` output.
 * Lines: SEVERITY|TYPE|CODE|FILE|LINE|COL|MSG
 */
export const parseDartAnalyze = (stdout) => {
  try {
    let errors = 0;
    let warnings = 0;
    const lines = stdout.split("\n").filter((l) => l.includes("|"));
    for (const line of lines) {
      const severity = line.split("|")[0].trim();
      if (severity === "ERROR") {
        errors++;
      } else if (severity === "WARNING" || severity === "INFO") {
        warnings++;
      }
    }
    return { errors, warnings };
  } catch {
    return { errors: 0, warnings: 0 };
  }
};
