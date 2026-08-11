"use client";

import { FishboneData, FishboneCategory, ValidationError } from "@/lib/types";
import { validateFishbone } from "@/lib/validation";

interface FishboneFormProps {
  data: FishboneData;
  onChange: (data: FishboneData) => void;
  onValidation: (errors: ValidationError[]) => void;
}

const defaultCategories: FishboneCategory[] = [
  { id: "man", name: "Man", causes: [""] },
  { id: "machine", name: "Machine", causes: [""] },
  { id: "method", name: "Method", causes: [""] },
  { id: "material", name: "Material", causes: [""] },
];

export default function FishboneForm({
  data,
  onChange,
  onValidation,
}: FishboneFormProps) {
  const updateProblem = (value: string) => {
    const updated = { ...data, problemStatement: value };
    onChange(updated);
    const result = validateFishbone(updated);
    onValidation(result.valid ? [] : result.errors);
  };

  const updateCategoryName = (catId: string, name: string) => {
    const updated = {
      ...data,
      categories: data.categories.map((c) =>
        c.id === catId ? { ...c, name } : c
      ),
    };
    onChange(updated);
    const result = validateFishbone(updated);
    onValidation(result.valid ? [] : result.errors);
  };

  const updateCause = (catId: string, causeIdx: number, value: string) => {
    const updated = {
      ...data,
      categories: data.categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              causes: c.causes.map((cause, i) =>
                i === causeIdx ? value : cause
              ),
            }
          : c
      ),
    };
    onChange(updated);
    const result = validateFishbone(updated);
    onValidation(result.valid ? [] : result.errors);
  };

  const addCause = (catId: string) => {
    const updated = {
      ...data,
      categories: data.categories.map((c) =>
        c.id === catId ? { ...c, causes: [...c.causes, ""] } : c
      ),
    };
    onChange(updated);
  };

  const removeCause = (catId: string, causeIdx: number) => {
    const updated = {
      ...data,
      categories: data.categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              causes: c.causes.filter((_, i) => i !== causeIdx),
            }
          : c
      ),
    };
    onChange(updated);
    const result = validateFishbone(updated);
    onValidation(result.valid ? [] : result.errors);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">
          Problem Statement
        </label>
        <input
          type="text"
          value={data.problemStatement}
          onChange={(e) => updateProblem(e.target.value)}
          placeholder="e.g. Customer support response time increased 40%"
          maxLength={200}
          className="w-full p-3 rounded-xl border border-hairline focus:border-blue focus:ring-2 focus:ring-blue-soft outline-none transition-all text-sm"
        />
        <p className="text-xs text-muted mt-1">
          {data.problemStatement.length}/200
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-ink">
          Categories & Causes
        </label>
        {data.categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-xl border border-hairline bg-mist/50"
          >
            <input
              type="text"
              value={cat.name}
              onChange={(e) => updateCategoryName(cat.id, e.target.value)}
              className="w-full p-2 rounded-lg border border-hairline bg-surface focus:border-blue focus:ring-2 focus:ring-blue-soft outline-none text-sm font-semibold mb-3"
              placeholder="Category name"
            />
            <div className="space-y-2">
              {cat.causes.map((cause, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={cause}
                    onChange={(e) => updateCause(cat.id, idx, e.target.value)}
                    placeholder={`Cause ${idx + 1}`}
                    maxLength={200}
                    className="flex-1 p-2 rounded-lg border border-hairline bg-surface focus:border-blue focus:ring-2 focus:ring-blue-soft outline-none text-sm"
                  />
                  <button
                    onClick={() => removeCause(cat.id, idx)}
                    className="px-2 text-muted hover:text-red-500 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => addCause(cat.id)}
              className="mt-3 text-sm text-blue font-semibold hover:text-blue/80 transition-colors"
            >
              + Add cause
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
