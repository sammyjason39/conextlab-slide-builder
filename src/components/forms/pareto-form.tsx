"use client";

import { ParetoData, ValidationError } from "@/lib/types";
import { validatePareto } from "@/lib/validation";

interface ParetoFormProps {
  data: ParetoData;
  onChange: (data: ParetoData) => void;
  onValidation: (errors: ValidationError[]) => void;
}

let nextId = 0;
function genId(): string {
  return `item-${++nextId}`;
}

export default function ParetoForm({
  data,
  onChange,
  onValidation,
}: ParetoFormProps) {
  const updateTitle = (value: string) => {
    const updated = { ...data, title: value };
    onChange(updated);
    const result = validatePareto(updated);
    onValidation(result.valid ? [] : result.errors);
  };

  const updateItem = (id: string, field: "name" | "count", value: string) => {
    const updated = {
      ...data,
      items: data.items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "count" ? parseFloat(value) || 0 : value,
            }
          : item
      ),
    };
    onChange(updated);
    const result = validatePareto(updated);
    onValidation(result.valid ? [] : result.errors);
  };

  const addItem = () => {
    const updated = {
      ...data,
      items: [...data.items, { id: genId(), name: "", count: 0 }],
    };
    onChange(updated);
  };

  const removeItem = (id: string) => {
    const updated = {
      ...data,
      items: data.items.filter((item) => item.id !== id),
    };
    onChange(updated);
    const result = validatePareto(updated);
    onValidation(result.valid ? [] : result.errors);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">
          Chart Title
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="e.g. Customer Complaints by Category"
          maxLength={200}
          className="w-full p-3 rounded-xl border border-hairline focus:border-blue focus:ring-2 focus:ring-blue-soft outline-none transition-all text-sm"
        />
        <p className="text-xs text-muted mt-1">{data.title.length}/200</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-ink">Items</label>
          <span className="text-xs text-muted">
            {data.items.filter((i) => i.name.trim()).length} items
          </span>
        </div>

        {data.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-2 items-start p-3 rounded-xl border border-hairline bg-mist/50"
          >
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(item.id, "name", e.target.value)}
              placeholder="Item name"
              maxLength={100}
              className="flex-1 p-2 rounded-lg border border-hairline bg-surface focus:border-blue focus:ring-2 focus:ring-blue-soft outline-none text-sm"
            />
            <input
              type="number"
              value={item.count || ""}
              onChange={(e) => updateItem(item.id, "count", e.target.value)}
              placeholder="Count"
              min="1"
              className="w-24 p-2 rounded-lg border border-hairline bg-surface focus:border-blue focus:ring-2 focus:ring-blue-soft outline-none text-sm"
            />
            <button
                onClick={() => removeItem(item.id)}
                className="px-2 py-2 text-muted hover:text-red-500 transition-colors text-sm"
              >
                ✕
              </button>
          </div>
        ))}

        <button
          onClick={addItem}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-hairline-2 text-muted hover:text-ink hover:border-ink transition-colors text-sm font-semibold"
        >
          + Add item
        </button>
      </div>
    </div>
  );
}
