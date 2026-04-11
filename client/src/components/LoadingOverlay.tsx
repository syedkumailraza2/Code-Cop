"use client";

import { useEffect, useState } from "react";
import { LOADING_MESSAGES } from "../lib/constants";

export default function LoadingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cop-bg/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Pulsing circle */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-cop-primary animate-scan-pulse" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-cop-primary/30 animate-ping" />
        </div>

        {/* Cycling message */}
        <p className="font-mono text-cop-primary text-sm animate-scan-pulse">
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>

      {/* Indeterminate progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-cop-elevated overflow-hidden">
        <div className="h-full w-1/4 bg-cop-primary progress-indeterminate rounded-full" />
      </div>
    </div>
  );
}
