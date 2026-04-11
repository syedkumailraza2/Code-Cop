"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import URLInput from "../../components/URLInput";

export default function AnalyzePage() {
  const router = useRouter();

  function handleSubmit(url: string) {
    router.push(`/results?url=${encodeURIComponent(url)}`);
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-cop-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            <span className="text-cop-primary">Code</span>
            <span className="text-cop-text">Cop</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Analyze with CodeCop
            </h1>
            <p className="mt-3 text-cop-subtext text-sm sm:text-base">
              Paste a public GitHub repository URL and let CodeCop generate a
              full code quality report.
            </p>
          </div>

          <URLInput onSubmit={handleSubmit} isLoading={false} error={null} />
        </div>
      </div>
    </main>
  );
}
