import {
  APIResponse,
  EvaluationResult,
  GitHubUser,
  GitHubRepo,
  AnalysisHistoryItem,
} from "./types";

export type ErrorType =
  | "rate_limit"
  | "server_error"
  | "network_error"
  | "timeout"
  | "repo_too_large"
  | "bad_request"
  | "unknown";

export class ApiError extends Error {
  type: ErrorType;
  status: number;

  constructor(message: string, type: ErrorType, status: number = 0) {
    super(message);
    this.type = type;
    this.status = status;
  }
}

function classifyError(status: number, message: string): ErrorType {
  if (status === 429) return "rate_limit";
  if (status === 400) return "bad_request";
  if (message.toLowerCase().includes("too large")) return "repo_too_large";
  if (status >= 500) return "server_error";
  return "unknown";
}

export async function evaluateRepo(
  githubURL: string,
  signal?: AbortSignal
): Promise<EvaluationResult> {
  let res: Response;
  try {
    res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ githubURL }),
      signal,
      credentials: "include",
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    throw new ApiError(
      "Unable to reach the server. Please check your connection and try again.",
      "network_error"
    );
  }

  if (!res.ok) {
    let message = "An unexpected error occurred. Please try again.";
    try {
      const body = await res.json();
      if (body.message && typeof body.message === "string") {
        message = body.message;
      }
    } catch {
      // Response body wasn't JSON
    }
    throw new ApiError(message, classifyError(res.status, message), res.status);
  }

  const data: APIResponse = await res.json();
  return data.result;
}

export async function submitFeedback(data: {
  rating: number;
  message: string;
  repoUrl: string;
}): Promise<void> {
  let res: Response;
  try {
    res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
  } catch {
    throw new ApiError(
      "Unable to reach the server. Please check your connection.",
      "network_error"
    );
  }

  if (!res.ok) {
    let message = "Failed to submit feedback. Please try again.";
    try {
      const body = await res.json();
      if (body.message && typeof body.message === "string") {
        message = body.message;
      }
    } catch {
      // Response body wasn't JSON
    }
    throw new ApiError(message, classifyError(res.status, message), res.status);
  }
}

export async function fetchCurrentUser(): Promise<GitHubUser | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function fetchUserRepos(
  page: number = 1,
  search?: string
): Promise<{ repos: GitHubRepo[]; hasMore: boolean }> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);

  const res = await fetch(`/api/repos?${params}`, { credentials: "include" });
  if (!res.ok) {
    throw new ApiError("Failed to fetch repositories", "server_error", res.status);
  }
  return res.json();
}

export async function fetchAnalysisHistory(): Promise<AnalysisHistoryItem[]> {
  const res = await fetch("/api/history", { credentials: "include" });
  if (!res.ok) {
    throw new ApiError("Failed to fetch history", "server_error", res.status);
  }
  const data = await res.json();
  return data.history;
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
