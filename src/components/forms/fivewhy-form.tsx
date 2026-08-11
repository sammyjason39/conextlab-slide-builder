"use client";

import { FiveWhyData, ValidationError } from "@/lib/types";
import { validateFiveWhy } from "@/lib/validation";
import { useEffect } from "react";

interface FiveWhyFormProps {
  data: FiveWhyData;
  onChange: (data: FiveWhyData) => void;
  onValidation: (errors: ValidationError[]) => void;
}

export default function FiveWhyForm({ data, onChange, onValidation }: FiveWhyFormProps) {
  useEffect(() => {
    const result = validateFiveWhy(data);
    onValidation(result.valid ? [] : result.errors);
  }, [data, onValidation]);

  const updateProblem = (val: string) => {
    onChange({ ...data, problemStatement: val });
  };

  const updateWhy = (idx: number, field: "question" | "answer", val: string) => {
    const whys = [...data.whys];
    whys[idx] = { ...whys[idx], [field]: val };
    onChange({ ...data, whys });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-ink mb-1.5">
          Problem Statement
        </label>
        <input
          type="text"
          value={data.problemStatement}
          onChange={(e) => updateProblem(e.target.value)}
          placeholder="e.g. Customer churn increased 30% this quarter"
          maxLength={200}
          className="w-full px-4 py-3 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
        />
        <p className="text-xs text-muted mt-1">
          {data.problemStatement.length}/200
        </p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-ink mb-3">5-Why Analysis</h3>
        <div className="space-y-4">
          {data.whys.map((why, idx) => (
            <div
              key={why.id}
              className="p-4 rounded-xl border-2 border-hairline bg-surface"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-full bg-blue text-white text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-ink">
                  Why #{idx + 1}
                </span>
              </div>
              <input
                type="text"
                value={why.question}
                onChange={(e) => updateWhy(idx, "question", e.target.value)}
                placeholder={`Why? (level ${idx + 1})`}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm mb-2"
              />
              <input
                type="text"
                value={why.answer}
                onChange={(e) => updateWhy(idx, "answer", e.target.value)}
                placeholder="Because..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
