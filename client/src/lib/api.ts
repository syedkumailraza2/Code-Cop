import { APIResponse, EvaluationResult } from "./types";

export async function evaluateRepo(
  githubURL: string,
  signal?: AbortSignal
): Promise<EvaluationResult> {
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ githubURL }),
    signal,
  });

  if (!res.ok) {
    let message = "An unexpected error occurred. Please try again.";
    try {
      const body = await res.json();
      if (body.message && typeof body.message === "string") {
        message = body.message;
      }
    } catch {
      // Response body wasn't JSON — use fallback message
    }
    throw new Error(message);
  }

  const data: APIResponse = await res.json();
  return data.result;
}
