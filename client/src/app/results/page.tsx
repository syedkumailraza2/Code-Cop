"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LoadingOverlay from "../../components/LoadingOverlay";
import ResultsDashboard from "../../components/ResultsDashboard";
import { evaluateRepo } from "../../lib/api";
import { EvaluationResult } from "../../lib/types";

type PageState = "loading" | "results" | "error";

function ResultsContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const [pageState, setPageState] = useState<PageState>("loading");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setError("No repository URL provided.");
      setPageState("error");
      return;
    }

    // Prevent duplicate calls from React Strict Mode
    if (pageState !== "loading") return;

    const controller = new AbortController();

    async function run() {
      try {
        const data = await evaluateRepo(url!, controller.signal);
        if (!controller.signal.aborted) {
          setResult(data);
          setPageState("results");
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "An unexpected error occurred."
          );
          setPageState("error");
        }
      }
    }

    run();
    return () => {
      controller.abort();
    };
  }, [url, pageState]);

  if (pageState === "loading") {
    return <LoadingOverlay />;
  }

  if (pageState === "error") {
    return (
      <main className="min-h-screen flex flex-col">
        <nav className="border-b border-cop-border/50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              <span className="text-cop-primary">Code</span>
              <span className="text-cop-text">Cop</span>
            </Link>
            <a
              href="https://github.com/syedkumailraza2/Code-Cop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-cop-subtext hover:text-cop-text transition-colors"
              title="Star CodeCop on GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="max-w-md text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-cop-critical/10 border border-cop-critical/30 flex items-center justify-center mx-auto">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6 text-cop-critical"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-cop-text">
              CodeCop Analysis Failed
            </h1>
            <p className="text-sm text-cop-subtext">{error}</p>
            <Link
              href="/analyze"
              className="inline-block mt-2 px-6 py-2.5 rounded-lg font-semibold text-sm bg-cop-primary text-white hover:bg-cop-primary-hover transition-colors"
            >
              Try Again
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen">
        <nav className="border-b border-cop-border/50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              <span className="text-cop-primary">Code</span>
              <span className="text-cop-text">Cop</span>
            </Link>
            <a
              href="https://github.com/syedkumailraza2/Code-Cop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-cop-subtext hover:text-cop-text transition-colors"
              title="Star CodeCop on GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </nav>
        <ResultsDashboard result={result} repoUrl={url || ""} onReset="link" />
      </div>
    );
  }

  return null;
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <ResultsContent />
    </Suspense>
  );
}
