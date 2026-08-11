"use client";

import { useState } from "react";
import { FrameworkType, AIExtractionResult } from "@/lib/types";

interface AIInputProps {
  framework: FrameworkType;
  onResult: (result: AIExtractionResult) => void;
}

const MAX_CHARS = 10000;

export default function AIInput({ framework, onResult }: AIInputProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generatingRef = { current: false };

  const placeholders: Record<FrameworkType, string> = {
    fishbone:
      "Paste your problem description here...\n\nExample:\nOur customer support response time has increased by 40% this quarter. The team is understaffed, the ticketing system is outdated, and there's no standard process for escalations.",
    pareto:
      "Paste your data here...\n\nExample:\nCustomer complaints this month:\n- Late delivery: 45 cases\n- Wrong item: 23 cases\n- Damaged package: 15 cases\n- Poor communication: 8 cases\n- Billing error: 5 cases",
    swot:
      "Paste your analysis notes here...\n\nExample:\nOur new product launch:\nStrengths: strong brand, experienced team, unique features\nWeaknesses: limited budget, short timeline\nOpportunities: growing market, competitor gaps\nThreats: economic uncertainty, new regulations",
    "5why":
      "Paste your problem description here...\n\nExample:\nCustomer churn increased 30% this quarter. We noticed most churning customers cite poor onboarding experience. The onboarding team was recently reduced, and the new hire training program was cut.",
    scurve:
      "Paste your project progress data here...\n\nExample:\nProject Alpha 6-month plan: Jan 5%, Feb 15%, Mar 30%, Apr 55%, May 80%, Jun 100%. Actual progress: Jan 3%, Feb 12%, Mar 25%, Apr 45%.",
    matrix:
      "Paste your initiatives list here...\n\nExample:\nQ3 priorities:\n- Redesign landing page (high impact, medium effort)\n- Fix checkout bug (high impact, low effort)\n- Update FAQ page (low impact, low effort)\n- Migrate database (high impact, high effort)",
    flowchart:
      "Paste your process description here...\n\nExample:\nCustomer onboarding: Start with signup form, then verify email. If email verified, create account and send welcome email. If not verified, send reminder and wait 24h.",
  };

  const handleGenerate = async () => {
    if (!text.trim() || generatingRef.current) return;
    generatingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ framework, text }),
      });

      const result: AIExtractionResult = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.error ||
            "AI generation unavailable right now. You can still fill the form manually."
        );
        return;
      }

      onResult(result);
    } catch {
      setError(
        "AI generation unavailable right now. You can still fill the form manually."
      );
    } finally {
      setLoading(false);
      generatingRef.current = false;
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">
        AI Assist
      </h2>
      <p className="text-sm text-muted mb-4">
        Paste your notes or raw data and let AI extract the structure
      </p>

      <textarea
        value={text}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CHARS) {
            setText(e.target.value);
          }
        }}
        placeholder={placeholders[framework]}
        rows={8}
        className="w-full p-4 rounded-xl border border-hairline focus:border-blue focus:ring-2 focus:ring-blue-soft outline-none transition-all text-sm resize-y font-sans"
      />
      <p className="text-xs text-muted mt-1">
        {text.length}/{MAX_CHARS}
      </p>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !text.trim()}
        className={`mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all ${
          loading || !text.trim()
            ? "bg-hairline text-muted-2 cursor-not-allowed"
            : "bg-ink text-surface hover:bg-slate active:scale-[0.98]"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating...
          </span>
        ) : (
          "Generate with AI"
        )}
      </button>
    </div>
  );
}
