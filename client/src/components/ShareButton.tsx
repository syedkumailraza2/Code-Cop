"use client";

import { useState, useRef, useEffect, RefObject } from "react";

interface ShareButtonProps {
  score: number;
  status: string;
  repoUrl: string;
  dashboardRef: RefObject<HTMLDivElement | null>;
}

export default function ShareButton({
  score,
  status,
  repoUrl,
  dashboardRef,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const resultsUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  const shareText = [
    `My repository scored ${score}/100 (${status}) on CodeCop!`,
    "",
    `Check your code quality: ${resultsUrl}`,
  ].join("\n");

  async function captureScreenshot(): Promise<Blob | null> {
    if (!dashboardRef.current) return null;
    setCapturing(true);
    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(dashboardRef.current, {
        backgroundColor: "#1a1614",
        pixelRatio: 2,
        filter: (node: HTMLElement) => {
          // Hide the share dropdown from the screenshot
          return !node?.dataset?.shareDropdown;
        },
      });
      return blob;
    } finally {
      setCapturing(false);
    }
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleTwitter() {
    const blob = await captureScreenshot();
    if (blob) downloadBlob(blob, "codecop-report.png");
    setOpen(false);
    showToast("Image saved! Attach it to your tweet.");
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    setTimeout(() => {
      window.open(tweetUrl, "_blank", "noopener,noreferrer");
    }, 1500);
  }

  async function handleLinkedIn() {
    const blob = await captureScreenshot();
    if (blob) downloadBlob(blob, "codecop-report.png");
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // clipboard may not be available
    }
    setOpen(false);
    showToast("Image saved & text copied! Paste into your post.");
    const title = `My repository scored ${score}/100 (${status}) on CodeCop!`;
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(resultsUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(shareText)}`;
    setTimeout(() => {
      window.open(linkedInUrl, "_blank", "noopener,noreferrer");
    }, 1500);
  }

  async function handleDownload() {
    const blob = await captureScreenshot();
    if (blob) downloadBlob(blob, "codecop-report.png");
    setOpen(false);
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded-lg text-sm font-medium border border-cop-primary/30 text-cop-primary hover:bg-cop-primary/10 transition-colors cursor-pointer flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share
      </button>

      {open && (
        <div data-share-dropdown className="absolute right-0 top-full mt-2 w-56 bg-cop-surface border border-cop-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-up">
          {capturing && (
            <div className="px-4 py-2 text-xs text-cop-subtext text-center border-b border-cop-border">
              Capturing screenshot...
            </div>
          )}

          <button
            onClick={handleTwitter}
            disabled={capturing}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-cop-text hover:bg-cop-elevated transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter / X
          </button>

          <button
            onClick={handleLinkedIn}
            disabled={capturing}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-cop-text hover:bg-cop-elevated transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </button>

          <button
            onClick={handleDownload}
            disabled={capturing}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-cop-text hover:bg-cop-elevated transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Image
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-cop-text hover:bg-cop-elevated transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-cop-elevated border border-cop-border rounded-lg shadow-lg text-sm text-cop-text animate-fade-up">
          <svg className="w-4 h-4 text-cop-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}
