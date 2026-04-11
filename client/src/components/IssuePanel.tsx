import { Issues } from "../lib/types";

interface IssuePanelProps {
  issues: Issues;
}

function IssueSection({
  title,
  items,
  borderColor,
  textColor,
}: {
  title: string;
  items: string[];
  borderColor: string;
  textColor: string;
}) {
  return (
    <div className={`border-l-4 ${borderColor} pl-4 py-2`}>
      <h3 className={`text-sm font-semibold mb-2 ${textColor}`}>{title}</h3>
      {items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="font-mono text-sm text-cop-text">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm italic text-cop-muted">None found</p>
      )}
    </div>
  );
}

export default function IssuePanel({ issues }: IssuePanelProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-cop-text">Issues</h2>
      <IssueSection
        title="Critical"
        items={issues.critical}
        borderColor="border-cop-critical"
        textColor="text-cop-critical"
      />
      <IssueSection
        title="Warnings"
        items={issues.warnings}
        borderColor="border-cop-warning"
        textColor="text-cop-warning"
      />
      <IssueSection
        title="Good Practices"
        items={issues.good}
        borderColor="border-cop-success"
        textColor="text-cop-success"
      />
    </div>
  );
}
