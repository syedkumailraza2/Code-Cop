"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { EvaluationResult } from "../lib/types";
import ScoreGauge from "./ScoreGauge";
import IssuePanel from "./IssuePanel";
import TechStackBadges from "./TechStackBadges";
import LintResultsTable from "./LintResultsTable";
import SuggestionsList from "./SuggestionsList";
import RepoStatsCard from "./RepoStatsCard";
import FeedbackModal from "./FeedbackModal";
import ShareButton from "./ShareButton";

interface ResultsDashboardProps {
  result: EvaluationResult;
  repoUrl?: string;
  onReset?: (() => void) | "link";
}

function Card({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="bg-cop-surface border border-cop-border rounded-xl p-6 animate-fade-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      {children}
    </div>
  );
}

export default function ResultsDashboard({
  result,
  repoUrl = "",
  onReset,
}: ResultsDashboardProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={dashboardRef} className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header with reset button */}
      <div className="flex items-center justify-between mb-8 animate-fade-up relative z-50">
        <h1 className="text-2xl font-bold text-cop-text">Analysis Results</h1>
        <div className="flex items-center gap-3">
          <ShareButton
            score={result.score}
            status={result.status}
            repoUrl={repoUrl}
            dashboardRef={dashboardRef}
          />
          <button
            onClick={() => setShowFeedback(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-cop-primary/30 text-cop-primary hover:bg-cop-primary/10 transition-colors cursor-pointer"
          >
            Help us improve CodeCop
          </button>
          {onReset === "link" ? (
            <Link
              href="/analyze"
              className="px-4 py-2 rounded-lg text-sm font-medium border border-cop-border text-cop-subtext hover:bg-cop-elevated hover:text-cop-text transition-colors"
            >
              Analyze Another
            </Link>
          ) : (
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-cop-border text-cop-subtext hover:bg-cop-elevated hover:text-cop-text transition-colors cursor-pointer"
            >
              Analyze Another
            </button>
          )}
        </div>
      </div>

      {/* Feedback modal */}
      {showFeedback && (
        <FeedbackModal
          repoUrl={repoUrl}
          onClose={() => setShowFeedback(false)}
        />
      )}

      {/* Score gauge + repo stats */}
      <div className="flex justify-center mb-8">
        <Card>
          <div className="flex flex-col items-center gap-6">
            <ScoreGauge score={result.score} status={result.status} />
            {result.repoStats && (
              <div className="w-full border-t border-cop-border pt-4">
                <RepoStatsCard repoStats={result.repoStats} />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card delay={100}>
            <IssuePanel issues={result.issues} />
          </Card>
          <Card delay={200}>
            <LintResultsTable lintResults={result.lintResults} />
          </Card>
        </div>
        <div className="space-y-6">
          <Card delay={150}>
            <TechStackBadges techStack={result.techStack} />
          </Card>
          <Card delay={250}>
            <SuggestionsList suggestions={result.suggestions} />
          </Card>
        </div>
      </div>
    </div>
  );
}
