"use client";

import { useState } from "react";
import { submitFeedback } from "../lib/api";

interface FeedbackModalProps {
  repoUrl: string;
  onClose: () => void;
}

export default function FeedbackModal({ repoUrl, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setStatus("submitting");
    try {
      await submitFeedback({ rating, message, repoUrl });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-cop-surface border border-cop-border rounded-xl w-full max-w-md shadow-2xl shadow-black/40 animate-fade-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cop-muted hover:text-cop-text transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          {status === "success" ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-cop-success/10 border border-cop-success/30 flex items-center justify-center mx-auto">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-cop-success">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-cop-text">
                Thanks for your feedback!
              </h3>
              <p className="text-sm text-cop-subtext">
                Your input helps us make CodeCop better for everyone.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 rounded-lg text-sm font-medium bg-cop-primary text-white hover:bg-cop-primary-hover transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-cop-text mb-1">
                Help us improve CodeCop
              </h3>
              <p className="text-sm text-cop-subtext mb-6">
                How was your experience? Your feedback shapes the future of CodeCop.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Star rating */}
                <div>
                  <label className="block text-sm font-medium text-cop-text mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-transform hover:scale-110 cursor-pointer"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-8 h-8"
                          fill={star <= (hoveredRating || rating) ? "#E8772E" : "none"}
                          stroke={star <= (hoveredRating || rating) ? "#E8772E" : "#6B5E56"}
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {rating === 0 && status === "idle" && (
                    <p className="mt-1 text-xs text-cop-muted">Select a rating to continue</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="feedback-message"
                    className="block text-sm font-medium text-cop-text mb-2"
                  >
                    Feedback <span className="text-cop-muted font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What went well? What could be better?"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-cop-bg border border-cop-border text-cop-text text-sm placeholder:text-cop-muted focus:outline-none focus:border-cop-primary/50 focus:ring-1 focus:ring-cop-primary/25 resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-cop-critical">
                    Something went wrong. Please try again.
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={rating === 0 || status === "submitting"}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold bg-cop-primary text-white hover:bg-cop-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "submitting" ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
