"use client";

import { SWOTData, ValidationError } from "@/lib/types";
import { validateSWOT } from "@/lib/validation";

interface SWOTFormProps {
  data: SWOTData;
  onChange: (data: SWOTData) => void;
  onValidation: (errors: ValidationError[]) => void;
}

const quadrants: {
  key: keyof SWOTData;
  label: string;
  color: string;
  placeholder: string;
}[] = [
  {
    key: "strengths",
    label: "Strengths",
    color: "bg-blue-soft/60",
    placeholder: "What are we good at?",
  },
  {
    key: "weaknesses",
    label: "Weaknesses",
    color: "bg-amber-50",
    placeholder: "What needs improvement?",
  },
  {
    key: "opportunities",
    label: "Opportunities",
    color: "bg-emerald-50",
    placeholder: "What can we leverage?",
  },
  {
    key: "threats",
    label: "Threats",
    color: "bg-red-50",
    placeholder: "What risks do we face?",
  },
];

export default function SWOTForm({
  data,
  onChange,
  onValidation,
}: SWOTFormProps) {
  const updateTitle = (value: string) => {
    const updated = { ...data, title: value };
    onChange(updated);
    const result = validateSWOT(updated);
    onValidation(result.valid ? [] : result.errors);
  };

  const updateQuadrant = (
    key: keyof SWOTData,
    index: number,
    value: string
  ) => {
    const arr = [...(data[key] as string[])];
    arr[index] = value;
    const updated = { ...data, [key]: arr };
    onChange(updated);
    const result = validateSWOT(updated);
    onValidation(result.valid ? [] : result.errors);
  };

  const addItem = (key: keyof SWOTData) => {
    const updated = {
      ...data,
      [key]: [...(data[key] as string[]), ""],
    };
    onChange(updated);
  };

  const removeItem = (key: keyof SWOTData, index: number) => {
    const arr = (data[key] as string[]).filter((_, i) => i !== index);
    const updated = { ...data, [key]: arr };
    onChange(updated);
    const result = validateSWOT(updated);
    onValidation(result.valid ? [] : result.errors);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">
          Analysis Title
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="e.g. New Product Launch SWOT Analysis"
          maxLength={200}
          className="w-full p-3 rounded-xl border border-hairline focus:border-blue focus:ring-2 focus:ring-blue-soft outline-none transition-all text-sm"
        />
        <p className="text-xs text-muted mt-1">{data.title.length}/200</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quadrants.map((q) => {
          const items = data[q.key] as string[];
          return (
            <div
              key={q.key}
              className={`p-4 rounded-xl border border-hairline ${q.color}`}
            >
              <h3 className="font-bold text-ink text-sm mb-3">{q.label}</h3>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        updateQuadrant(q.key, idx, e.target.value)
                      }
                      placeholder={q.placeholder}
                      maxLength={200}
                      className="flex-1 p-2 rounded-lg border border-hairline bg-surface focus:border-blue focus:ring-2 focus:ring-blue-soft outline-none text-sm"
                    />
                    <button
                      onClick={() => removeItem(q.key, idx)}
                      className="px-2 text-muted hover:text-red-500 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addItem(q.key)}
                className="mt-3 text-sm text-blue font-semibold hover:text-blue/80 transition-colors"
              >
                + Add item
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
