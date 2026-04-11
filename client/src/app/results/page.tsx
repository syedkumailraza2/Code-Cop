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
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              <span className="text-cop-primary">Code</span>
              <span className="text-cop-text">Cop</span>
            </Link>
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
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              <span className="text-cop-primary">Code</span>
              <span className="text-cop-text">Cop</span>
            </Link>
          </div>
        </nav>
        <ResultsDashboard result={result} onReset="link" />
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
