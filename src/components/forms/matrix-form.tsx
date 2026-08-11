"use client";

import { MatrixData, ValidationError } from "@/lib/types";
import { validateMatrix } from "@/lib/validation";
import { useEffect } from "react";

interface MatrixFormProps {
  data: MatrixData;
  onChange: (data: MatrixData) => void;
  onValidation: (errors: ValidationError[]) => void;
}

let nextId = 100;

export default function MatrixForm({ data, onChange, onValidation }: MatrixFormProps) {
  useEffect(() => {
    const result = validateMatrix(data);
    onValidation(result.valid ? [] : result.errors);
  }, [data, onValidation]);

  const updateTitle = (val: string) => {
    onChange({ ...data, title: val });
  };

  const updateItem = (idx: number, field: string, val: string) => {
    const items = [...data.items];
    items[idx] = {
      ...items[idx],
      [field]: field === "impact" || field === "effort" ? Number(val) || 0 : val,
    };
    onChange({ ...data, items });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { id: `m-${nextId++}`, name: "", impact: 5, effort: 5 }],
    });
  };

  const removeItem = (idx: number) => {
    onChange({ ...data, items: data.items.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-ink mb-1.5">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="e.g. Q3 Initiative Prioritization"
          maxLength={200}
          className="w-full px-4 py-3 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
        />
        <p className="text-xs text-muted mt-1">{data.title.length}/200</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-ink mb-3">Initiatives</h3>
        <div className="space-y-3">
          {data.items.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border-2 border-hairline bg-surface space-y-3"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(idx, "name", e.target.value)}
                  placeholder="Initiative name"
                  className="flex-1 px-3 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
                />
                <button
                  onClick={() => removeItem(idx)}
                  className="px-2 text-muted hover:text-red-500 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-muted mb-1">
                    Impact (1-10)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={item.impact}
                    onChange={(e) => updateItem(idx, "impact", e.target.value)}
                    className="w-full accent-blue"
                  />
                  <span className="text-xs text-muted">{item.impact}</span>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-muted mb-1">
                    Effort (1-10)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={item.effort}
                    onChange={(e) => updateItem(idx, "effort", e.target.value)}
                    className="w-full accent-blue"
                  />
                  <span className="text-xs text-muted">{item.effort}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-3 text-sm text-blue font-semibold hover:underline"
        >
          + Add initiative
        </button>
      </div>
    </div>
  );
}
