"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../lib/auth-context";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-b border-cop-border/50 sticky top-0 z-40 bg-cop-bg/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="text-cop-primary">Code</span>
          <span className="text-cop-text">Cop</span>
        </Link>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/syedkumailraza2/Code-Cop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-cop-subtext hover:text-cop-text transition-colors"
            title="Star CodeCop on GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-cop-surface animate-pulse" />
          ) : isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border border-cop-border"
                />
                <span className="text-sm text-cop-text hidden sm:inline">
                  {user.username}
                </span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-4 h-4 text-cop-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-cop-surface border border-cop-border shadow-xl shadow-black/30 py-1 z-50">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-cop-subtext hover:bg-cop-elevated hover:text-cop-text transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/analyze"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-cop-subtext hover:bg-cop-elevated hover:text-cop-text transition-colors"
                  >
                    Analyze Repo
                  </Link>
                  <div className="border-t border-cop-border my-1" />
                  <button
                    onClick={async () => {
                      setDropdownOpen(false);
                      await logout();
                      window.location.href = "/";
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-cop-subtext hover:bg-cop-elevated hover:text-cop-text transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-cop-surface border border-cop-border text-cop-text hover:bg-cop-elevated transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Sign in with GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
