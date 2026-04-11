import { LintResult } from "../lib/types";

interface LintResultsTableProps {
  lintResults: LintResult[];
}

export default function LintResultsTable({
  lintResults,
}: LintResultsTableProps) {
  if (lintResults.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-cop-text mb-3">
          Lint Results
        </h2>
        <p className="text-sm text-cop-muted italic">
          No lint results available
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-cop-text mb-3">
        Lint Results
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cop-border text-left">
              <th className="pb-2 text-cop-subtext font-medium">Language</th>
              <th className="pb-2 text-cop-subtext font-medium">Linter</th>
              <th className="pb-2 text-cop-subtext font-medium">Errors</th>
              <th className="pb-2 text-cop-subtext font-medium">Warnings</th>
            </tr>
          </thead>
          <tbody>
            {lintResults.map((result, i) => (
              <tr key={i} className="border-b border-cop-border/50">
                <td className="py-2 font-mono text-cop-text">
                  {result.language}
                </td>
                <td className="py-2 font-mono text-cop-subtext">
                  {result.linter}
                </td>
                <td
                  className={`py-2 font-mono ${
                    result.errors > 0
                      ? "text-cop-critical font-bold"
                      : "text-cop-success"
                  }`}
                >
                  {result.errors}
                </td>
                <td
                  className={`py-2 font-mono ${
                    result.warnings > 0
                      ? "text-cop-warning"
                      : "text-cop-success"
                  }`}
                >
                  {result.warnings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
