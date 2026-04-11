import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://codecop.kumailrazas.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "CodeCop | GitHub Code Quality Analyzer",
    template: "%s | CodeCop",
  },
  description:
    "Analyze your GitHub repositories for code quality, lint issues, and best practices. Get instant reports with scores, linting results, and actionable suggestions.",
  keywords: [
    "code quality",
    "GitHub analyzer",
    "lint analysis",
    "code review",
    "static analysis",
    "ESLint",
    "Ruff",
    "golangci-lint",
    "JavaScript",
    "TypeScript",
    "Python",
    "Go",
    "Dart",
    "Flutter",
    "code health",
    "repository analyzer",
  ],
  authors: [{ name: "CodeCop" }],
  creator: "CodeCop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "CodeCop",
    title: "CodeCop | GitHub Code Quality Analyzer",
    description:
      "Paste a GitHub repo URL and get an instant quality report — lint errors, tech stack breakdown, actionable suggestions, and an overall health score.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeCop | GitHub Code Quality Analyzer",
    description:
      "Paste a GitHub repo URL and get an instant quality report — lint errors, tech stack breakdown, actionable suggestions, and an overall health score.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SZZSH27R8X"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SZZSH27R8X');
          `}
        </Script>
      </head>
      <body className="bg-cop-bg text-cop-text font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
