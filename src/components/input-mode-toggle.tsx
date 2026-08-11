"use client";

import { InputMode } from "@/lib/types";

interface InputModeToggleProps {
  mode: InputMode;
  onChange: (mode: InputMode) => void;
}

export default function InputModeToggle({ mode, onChange }: InputModeToggleProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">
        How would you like to input data?
      </h2>
      <p className="text-sm text-muted mb-4">
        Fill manually or let AI extract from your notes
      </p>
      <div className="inline-flex rounded-xl border border-hairline p-1 bg-mist">
        <button
          onClick={() => onChange("manual")}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === "manual"
              ? "bg-surface text-ink shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          Manual
        </button>
        <button
          onClick={() => onChange("ai")}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === "ai"
              ? "bg-surface text-ink shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          AI Assist
        </button>
      </div>
    </div>
  );
}
