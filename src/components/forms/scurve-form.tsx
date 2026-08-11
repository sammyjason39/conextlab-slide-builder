"use client";

import { SCurveData, ValidationError } from "@/lib/types";
import { validateSCurve } from "@/lib/validation";
import { useEffect } from "react";

interface SCurveFormProps {
  data: SCurveData;
  onChange: (data: SCurveData) => void;
  onValidation: (errors: ValidationError[]) => void;
}

export default function SCurveForm({ data, onChange, onValidation }: SCurveFormProps) {
  useEffect(() => {
    const result = validateSCurve(data);
    onValidation(result.valid ? [] : result.errors);
  }, [data, onValidation]);

  const updateTitle = (val: string) => {
    onChange({ ...data, title: val });
  };

  const updatePoint = (
    arr: "plan" | "actual",
    idx: number,
    field: "month" | "value",
    val: string
  ) => {
    const points = [...data[arr]];
    points[idx] = {
      ...points[idx],
      [field]: field === "value" ? Number(val) || 0 : val,
    };
    onChange({ ...data, [arr]: points });
  };

  const addPoint = (arr: "plan" | "actual") => {
    const points = [...data[arr]];
    const next = points.length + 1;
    points.push({ month: `M${next}`, value: 0 });
    onChange({ ...data, [arr]: points });
  };

  const removePoint = (arr: "plan" | "actual", idx: number) => {
    const points = data[arr].filter((_, i) => i !== idx);
    onChange({ ...data, [arr]: points });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-ink mb-1.5">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="e.g. Project Alpha — S-Curve Progress"
          maxLength={200}
          className="w-full px-4 py-3 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
        />
        <p className="text-xs text-muted mt-1">{data.title.length}/200</p>
      </div>

      {(["plan", "actual"] as const).map((arr) => (
        <div key={arr}>
          <h3 className="text-lg font-bold text-ink mb-3 capitalize">
            {arr} Data
          </h3>
          <div className="space-y-2">
            {data[arr].map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={pt.month}
                  onChange={(e) => updatePoint(arr, idx, "month", e.target.value)}
                  placeholder="Month"
                  className="flex-1 px-3 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
                />
                <input
                  type="number"
                  value={pt.value || ""}
                  onChange={(e) => updatePoint(arr, idx, "value", e.target.value)}
                  placeholder="Value"
                  min={0}
                  max={100}
                  className="w-24 px-3 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
                />
                <button
                  onClick={() => removePoint(arr, idx)}
                  className="px-2 text-muted hover:text-red-500 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => addPoint(arr)}
            className="mt-2 text-sm text-blue font-semibold hover:underline"
          >
            + Add {arr} point
          </button>
        </div>
      ))}
    </div>
  );
}
