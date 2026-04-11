import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysis Results",
  description:
    "View your GitHub repository code quality analysis results — score, lint issues, tech stack breakdown, and improvement suggestions.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Analysis Results | CodeCop",
    description:
      "View your GitHub repository code quality analysis results — score, lint issues, tech stack breakdown, and improvement suggestions.",
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
