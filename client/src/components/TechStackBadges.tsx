import { TechStack } from "../lib/types";

interface TechStackBadgesProps {
  techStack: TechStack;
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-full bg-cop-elevated border border-cop-border font-mono text-sm px-3 py-1 text-cop-text">
      {label}
    </span>
  );
}

function BooleanIndicator({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          value ? "bg-cop-success" : "bg-cop-muted"
        }`}
      />
      <span className="text-sm text-cop-subtext">{label}</span>
    </div>
  );
}

export default function TechStackBadges({ techStack }: TechStackBadgesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-cop-text">Tech Stack</h2>

      {techStack.languages.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-cop-subtext mb-2">
            Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack.languages.map((lang) => (
              <Badge key={lang} label={lang} />
            ))}
          </div>
        </div>
      )}

      {techStack.frameworks.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-cop-subtext mb-2">
            Frameworks
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack.frameworks.map((fw) => (
              <Badge key={fw} label={fw} />
            ))}
          </div>
        </div>
      )}

      {techStack.packageManager && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-cop-subtext mb-2">
            Package Manager
          </h3>
          <Badge label={techStack.packageManager} />
        </div>
      )}

      {techStack.buildTools.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-cop-subtext mb-2">
            Build Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack.buildTools.map((tool) => (
              <Badge key={tool} label={tool} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs uppercase tracking-wider text-cop-subtext mb-2">
          Infrastructure
        </h3>
        <div className="flex flex-wrap gap-4">
          <BooleanIndicator label="Docker" value={techStack.hasDocker} />
          <BooleanIndicator label="CI/CD" value={techStack.hasCI} />
          <BooleanIndicator label="Testing" value={techStack.hasTesting} />
        </div>
      </div>
    </div>
  );
}
