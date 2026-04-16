"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import Navbar from "../../components/Navbar";
import RepoList from "../../components/RepoList";
import AnalysisHistory from "../../components/AnalysisHistory";

type Tab = "repos" | "history";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("repos");

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cop-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-cop-text">
            Welcome back, <span className="text-cop-primary">{user?.displayName || user?.username}</span>
          </h1>
          <p className="mt-2 text-cop-subtext">
            Select a repository to analyze or view your past analyses.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-cop-border">
          <button
            onClick={() => setActiveTab("repos")}
            className={`px-5 py-3 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === "repos"
                ? "text-cop-primary"
                : "text-cop-muted hover:text-cop-subtext"
            }`}
          >
            My Repositories
            {activeTab === "repos" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cop-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-3 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === "history"
                ? "text-cop-primary"
                : "text-cop-muted hover:text-cop-subtext"
            }`}
          >
            Analysis History
            {activeTab === "history" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cop-primary" />
            )}
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "repos" ? <RepoList /> : <AnalysisHistory />}
      </div>
    </main>
  );
}
