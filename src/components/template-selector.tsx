"use client";

import { FrameworkType, TemplateConfig } from "@/lib/types";
import { getTemplatesForFramework } from "@/lib/templates";

interface TemplateSelectorProps {
  framework: FrameworkType;
  selected: TemplateConfig;
  onSelect: (template: TemplateConfig) => void;
}

const styleLabels: Record<string, string> = {
  flat: "Flat",
  gradient: "Gradient",
  "3d": "3D",
  minimal: "Minimal",
};

export default function TemplateSelector({
  framework,
  selected,
  onSelect,
}: TemplateSelectorProps) {
  const templates = getTemplatesForFramework(framework);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">
        Choose a style
      </h2>
      <p className="text-sm text-muted mb-4">
        Pick a visual template for your slide
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl)}
            className={`flex-shrink-0 w-36 p-4 rounded-xl border-2 text-left transition-all ${
              selected.id === tpl.id
                ? "border-blue bg-blue-soft/30 shadow-md"
                : "border-hairline hover:border-hairline-2"
            }`}
          >
            <div
              className="w-full h-16 rounded-lg mb-3 flex items-center justify-center text-xs font-mono font-semibold"
              style={{
                backgroundColor: tpl.colors.background,
                border: `1px solid ${tpl.colors.border}`,
                color: tpl.colors.accent,
                boxShadow:
                  tpl.shadowDepth === "heavy"
                    ? "0 4px 12px rgba(0,0,0,0.1)"
                    : tpl.shadowDepth === "medium"
                    ? "0 2px 8px rgba(0,0,0,0.06)"
                    : "none",
              }}
            >
              {styleLabels[tpl.chartStyle] || tpl.chartStyle}
            </div>
            <h4 className="font-bold text-ink text-sm">{tpl.name}</h4>
            <p className="text-xs text-muted mt-0.5 leading-tight">
              {tpl.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
