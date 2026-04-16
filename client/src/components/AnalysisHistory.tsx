"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAnalysisHistory } from "../lib/api";
import { AnalysisHistoryItem } from "../lib/types";

const STATUS_STYLES: Record<string, string> = {
  Clean: "text-cop-success bg-cop-success/10",
  "Needs Improvement": "text-cop-warning bg-cop-warning/10",
  "Risky Code": "text-cop-critical bg-cop-critical/10",
};

export default function AnalysisHistory() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalysisHistory()
      .then((h) => setHistory(h))
      .catch(() => setError("Failed to load analysis history."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-cop-surface border border-cop-border rounded-lg p-4 animate-pulse"
          >
            <div className="h-4 bg-cop-elevated rounded w-1/2 mb-2" />
            <div className="h-3 bg-cop-elevated rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-cop-subtext py-8">{error}</p>;
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-cop-subtext">No analyses yet. Analyze a repo to get started!</p>
        <Link
          href="/analyze"
          className="inline-block mt-4 px-5 py-2 rounded-lg text-sm font-medium bg-cop-primary text-white hover:bg-cop-primary-hover transition-colors"
        >
          Analyze a Repo
        </Link>
      </div>
    );
  }

  function repoNameFromUrl(url: string): string {
    try {
      const parts = url.replace(/\.git$/, "").split("/");
      return parts.slice(-2).join("/");
    } catch {
      return url;
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cop-border text-left text-cop-muted">
            <th className="pb-3 font-medium">Repository</th>
            <th className="pb-3 font-medium">Score</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium hidden sm:table-cell">Duration</th>
            <th className="pb-3 font-medium hidden md:table-cell">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cop-border/50">
          {history.map((item) => (
            <tr key={item._id} className="hover:bg-cop-elevated/30 transition-colors">
              <td className="py-3 pr-4">
                <Link
                  href={`/results?url=${encodeURIComponent(item.repoUrl)}`}
                  className="text-cop-text hover:text-cop-primary transition-colors font-medium"
                >
                  {repoNameFromUrl(item.repoUrl)}
                </Link>
              </td>
              <td className="py-3 pr-4">
                <span className="font-bold text-cop-text">{item.score}</span>
                <span className="text-cop-muted">/100</span>
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[item.status] || ""}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-3 pr-4 text-cop-muted hidden sm:table-cell">
                {(item.duration / 1000).toFixed(1)}s
              </td>
              <td className="py-3 text-cop-muted hidden md:table-cell">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
