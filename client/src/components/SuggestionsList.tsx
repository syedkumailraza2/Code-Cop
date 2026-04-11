interface SuggestionsListProps {
  suggestions: string[];
}

export default function SuggestionsList({ suggestions }: SuggestionsListProps) {
  if (suggestions.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-cop-text mb-3">
          Suggestions
        </h2>
        <p className="text-sm text-cop-success">
          No suggestions — your repo looks great!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-cop-text mb-3">Suggestions</h2>
      <div className="border-l-4 border-cop-primary pl-4 space-y-3">
        {suggestions.map((suggestion, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-cop-primary font-mono font-bold text-sm shrink-0">
              {i + 1}.
            </span>
            <p className="text-sm text-cop-text">{suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
