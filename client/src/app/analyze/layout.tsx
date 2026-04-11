import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyze with CodeCop",
  description:
    "Paste a public GitHub repository URL and let CodeCop generate a full code quality report with lint analysis, tech stack detection, and actionable suggestions.",
  alternates: {
    canonical: "/analyze",
  },
  openGraph: {
    title: "Analyze with CodeCop",
    description:
      "Paste a public GitHub repository URL and let CodeCop generate a full code quality report with lint analysis, tech stack detection, and actionable suggestions.",
    url: "/analyze",
  },
};

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
