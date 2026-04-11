export interface TechStack {
  languages: string[];
  frameworks: string[];
  packageManager: string | null;
  buildTools: string[];
  hasDocker: boolean;
  hasCI: boolean;
  hasTesting: boolean;
}

export interface Issues {
  critical: string[];
  warnings: string[];
  good: string[];
}

export interface LintResult {
  language: string;
  linter: string;
  errors: number;
  warnings: number;
}

export interface EvaluationResult {
  score: number;
  status: "Clean" | "Needs Improvement" | "Risky Code";
  techStack: TechStack;
  issues: Issues;
  suggestions: string[];
  lintResults: LintResult[];
}

export interface APIResponse {
  result: EvaluationResult;
}

export interface APIError {
  message: string;
}
