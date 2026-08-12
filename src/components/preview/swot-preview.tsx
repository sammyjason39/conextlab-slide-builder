"use client";

import { SWOTData, TemplateConfig } from "@/lib/types";
import { IconMode, getSwotQuadrantIcon } from "@/components/icons";

interface SWOTPreviewProps {
  data: SWOTData;
  template: TemplateConfig;
  iconMode: IconMode;
}

const quadrantConfig = [
  {
    key: "strengths" as const,
    label: "Strengths",
    tint: "rgba(220, 229, 254, 0.6)",
    borderColor: "#1652F0",
  },
  {
    key: "weaknesses" as const,
    label: "Weaknesses",
    tint: "rgba(254, 243, 199, 0.6)",
    borderColor: "#D97706",
  },
  {
    key: "opportunities" as const,
    label: "Opportunities",
    tint: "rgba(209, 250, 229, 0.6)",
    borderColor: "#059669",
  },
  {
    key: "threats" as const,
    label: "Threats",
    tint: "rgba(254, 226, 226, 0.6)",
    borderColor: "#DC2626",
  },
];

export default function SWOTPreview({ data, template, iconMode }: SWOTPreviewProps) {
  const { colors } = template;

  const shadowStyle =
    template.shadowDepth === "heavy"
      ? "0 8px 30px rgba(0,0,0,0.12)"
      : template.shadowDepth === "medium"
      ? "0 4px 16px rgba(0,0,0,0.08)"
      : template.shadowDepth === "subtle"
      ? "0 2px 8px rgba(0,0,0,0.04)"
      : "none";

  const isBold = template.chartStyle === "flat" && template.shadowDepth === "heavy";
  const isMinimal = template.chartStyle === "minimal";

  return (
    <div
      className="w-full p-4 rounded-2xl"
      style={{
        backgroundColor: colors.background,
        borderRadius: template.borderRadius * 2,
        boxShadow: shadowStyle,
      }}
    >
      <div className="grid grid-cols-2 gap-3 items-start">
        {quadrantConfig.map((q) => {
          const items = data[q.key].filter((s) => s.trim());
          return (
            <div
              key={q.key}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: isMinimal ? "transparent" : q.tint,
                border: `${isBold ? 2 : 1}px solid ${
                  isMinimal ? colors.border : q.borderColor
                }`,
                borderRadius: template.borderRadius,
                boxShadow:
                  template.shadowDepth === "heavy"
                    ? "0 2px 8px rgba(0,0,0,0.06)"
                    : "none",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: q.borderColor }}>
                  {getSwotQuadrantIcon(q.key, iconMode, 20)}
                </span>
                <h4
                  className="font-bold text-sm"
                  style={{ color: colors.text }}
                >
                  {q.label}
                </h4>
              </div>
              {items.length > 0 ? (
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs flex items-start gap-1.5"
                      style={{ color: colors.muted }}
                    >
                      <span className="mt-0.5 flex-shrink-0">•</span>
                      <span className="break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className="text-xs italic"
                  style={{ color: colors.muted }}
                >
                  No items added
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
