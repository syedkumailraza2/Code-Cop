import Link from "next/link";
import { EvaluationResult } from "../lib/types";
import ScoreGauge from "./ScoreGauge";
import IssuePanel from "./IssuePanel";
import TechStackBadges from "./TechStackBadges";
import LintResultsTable from "./LintResultsTable";
import SuggestionsList from "./SuggestionsList";

interface ResultsDashboardProps {
  result: EvaluationResult;
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
  onReset,
}: ResultsDashboardProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header with reset button */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <h1 className="text-2xl font-bold text-cop-text">Analysis Results</h1>
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

      {/* Score gauge centered */}
      <div className="flex justify-center mb-8">
        <Card>
          <ScoreGauge score={result.score} status={result.status} />
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
