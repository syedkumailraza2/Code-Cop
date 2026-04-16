"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchUserRepos } from "../lib/api";
import { GitHubRepo } from "../lib/types";
import RepoCard from "./RepoCard";

export default function RepoList() {
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRepos = useCallback(async (p: number, q: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserRepos(p, q || undefined);
      setRepos(data.repos);
      setHasMore(data.hasMore);
    } catch {
      setError("Failed to load repositories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRepos(page, search);
  }, [page, search, loadRepos]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  function handleAnalyze(url: string) {
    router.push(`/results?url=${encodeURIComponent(url)}`);
  }

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cop-muted"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search repositories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cop-surface border border-cop-border text-cop-text placeholder:text-cop-muted text-sm focus:outline-none focus:border-cop-primary/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-cop-primary text-white hover:bg-cop-primary-hover transition-colors cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-cop-surface border border-cop-border rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-cop-elevated rounded w-2/3 mb-3" />
              <div className="h-3 bg-cop-elevated rounded w-full mb-2" />
              <div className="h-3 bg-cop-elevated rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-cop-subtext">{error}</p>
          <button
            onClick={() => loadRepos(page, search)}
            className="mt-4 px-5 py-2 rounded-lg text-sm font-medium bg-cop-primary text-white hover:bg-cop-primary-hover transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : repos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-cop-subtext">
            {search ? "No repositories match your search." : "No repositories found."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.map((repo) => (
              <RepoCard key={repo.fullName} repo={repo} onAnalyze={handleAnalyze} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-cop-border text-cop-subtext hover:bg-cop-elevated hover:text-cop-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span className="text-sm text-cop-muted">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-cop-border text-cop-subtext hover:bg-cop-elevated hover:text-cop-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
