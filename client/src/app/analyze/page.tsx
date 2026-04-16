"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import URLInput from "../../components/URLInput";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../lib/auth-context";

export default function AnalyzePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  function handleSubmit(url: string) {
    router.push(`/results?url=${encodeURIComponent(url)}`);
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Analyze with CodeCop
            </h1>
            <p className="mt-3 text-cop-subtext text-sm sm:text-base">
              Paste a GitHub repository URL and let CodeCop generate a
              full code quality report.
            </p>
          </div>

          <URLInput onSubmit={handleSubmit} isLoading={false} error={null} />

          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="text-sm text-cop-primary hover:text-cop-primary-hover transition-colors"
            >
              Or pick from your repos &rarr;
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
