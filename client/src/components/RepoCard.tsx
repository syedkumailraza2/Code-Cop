"use client";

import { GitHubRepo } from "../lib/types";

interface RepoCardProps {
  repo: GitHubRepo;
  onAnalyze: (url: string) => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  Dart: "#00B4AB",
  Java: "#b07219",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  "C#": "#178600",
  C: "#555555",
  "C++": "#f34b7d",
};

export default function RepoCard({ repo, onAnalyze }: RepoCardProps) {
  return (
    <div className="bg-cop-surface border border-cop-border rounded-xl p-5 hover:border-cop-primary/40 transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-cop-text font-semibold truncate">{repo.name}</h3>
            {repo.private && (
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cop-warning/10 text-cop-warning border border-cop-warning/20">
                Private
              </span>
            )}
          </div>
          {repo.description && (
            <p className="mt-1.5 text-sm text-cop-subtext line-clamp-2">
              {repo.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-cop-muted">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: LANGUAGE_COLORS[repo.language] || "#8b8b8b",
                }}
              />
              {repo.language}
            </span>
          )}
          {repo.stars > 0 && (
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
              </svg>
              {repo.stars}
            </span>
          )}
          <span>
            {new Date(repo.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <button
          onClick={() => onAnalyze(repo.htmlUrl)}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-cop-primary text-white hover:bg-cop-primary-hover transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          Analyze
        </button>
      </div>
    </div>
  );
}
