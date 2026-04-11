import { SCORE_THRESHOLDS } from "../lib/constants";

interface ScoreGaugeProps {
  score: number;
  status: string;
}

function getScoreColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.CLEAN) return "var(--color-cop-success)";
  if (score >= SCORE_THRESHOLDS.NEEDS_IMPROVEMENT)
    return "var(--color-cop-warning)";
  return "var(--color-cop-critical)";
}

export default function ScoreGauge({ score, status }: ScoreGaugeProps) {
  const circumference = 2 * Math.PI * 45; // ~283
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--color-cop-elevated)"
            strokeWidth="8"
          />
          {/* Foreground arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-gauge-fill"
            style={{ "--tw-animate-gauge-fill-to": offset } as React.CSSProperties}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <span className="text-4xl font-mono font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-cop-subtext mt-1">{status}</span>
        </div>
      </div>
    </div>
  );
}
