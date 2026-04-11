"use client";

import { useState } from "react";
import { GITHUB_URL_REGEX } from "../lib/constants";

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function URLInput({ onSubmit, isLoading, error }: URLInputProps) {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      setValidationError("Please enter a GitHub URL");
      return;
    }
    if (!GITHUB_URL_REGEX.test(url.trim())) {
      setValidationError("Please enter a valid GitHub repository URL");
      return;
    }
    setValidationError(null);
    onSubmit(url.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (validationError) setValidationError(null);
          }}
          placeholder="https://github.com/owner/repo"
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-lg font-mono text-sm bg-cop-surface border border-cop-border text-cop-text placeholder-cop-muted focus:border-cop-primary focus:outline-none focus:ring-1 focus:ring-cop-primary transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-lg font-semibold text-sm bg-cop-primary text-white hover:bg-cop-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
        >
          {isLoading ? "Analyzing..." : "Analyze Repo"}
        </button>
      </div>
      {(validationError || error) && (
        <p className="mt-2 text-sm text-cop-critical">
          {validationError || error}
        </p>
      )}
    </form>
  );
}
