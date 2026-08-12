"use client";

import { FiveWhyData, TemplateConfig } from "@/lib/types";

interface FiveWhyPreviewProps {
  data: FiveWhyData;
  template: TemplateConfig;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  if (h.length < 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function FiveWhyPreview({ data, template }: FiveWhyPreviewProps) {
  const { colors } = template;
  const filledWhys = data.whys.filter(
    (w) => w.question.trim() || w.answer.trim()
  );

  const shadowStyle =
    template.shadowDepth === "heavy"
      ? "0 8px 30px rgba(0,0,0,0.12)"
      : template.shadowDepth === "medium"
        ? "0 4px 16px rgba(0,0,0,0.08)"
        : template.shadowDepth === "subtle"
          ? "0 2px 8px rgba(0,0,0,0.04)"
          : "none";

  if (filledWhys.length === 0) {
    return (
      <div
        className="w-full p-4 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <p className="text-xs italic" style={{ color: colors.muted }}>
          No why levels filled yet
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full p-2 rounded-2xl"
      style={{
        backgroundColor: colors.background,
        borderRadius: template.borderRadius * 2,
        boxShadow: shadowStyle,
      }}
    >
      <div className="flex flex-col items-stretch gap-0 max-w-2xl mx-auto">
        {filledWhys.map((why, idx) => {
          const isRoot = idx === filledWhys.length - 1 && filledWhys.length >= 2;
          return (
            <div key={why.id} className="flex flex-col items-center">
              <div
                className="w-full p-3"
                style={{
                  backgroundColor: isRoot
                    ? hexToRgba(colors.accent, 0.1)
                    : "transparent",
                  border: `1.5px solid ${isRoot ? colors.accent : colors.border}`,
                  borderRadius: template.borderRadius,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isRoot ? colors.accent : colors.secondary,
                      color: "#FFFFFF",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className="text-[11px] font-bold uppercase tracking-wide"
                    style={{ color: isRoot ? colors.accent : colors.muted }}
                  >
                    {isRoot ? "Root Cause" : `Why #${idx + 1}`}
                  </span>
                </div>
                {why.question.trim() ? (
                  <p
                    className="text-xs font-semibold leading-snug break-words"
                    style={{ color: colors.text }}
                  >
                    {why.question}
                  </p>
                ) : null}
                {why.answer.trim() ? (
                  <p
                    className="text-xs leading-snug mt-1 break-words"
                    style={{ color: colors.muted }}
                  >
                    {why.answer}
                  </p>
                ) : null}
              </div>

              {idx < filledWhys.length - 1 && (
                <div className="flex flex-col items-center py-1">
                  <div
                    style={{
                      width: 2,
                      height: 12,
                      backgroundColor: colors.accent,
                      opacity: 0.45,
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderTop: `6px solid ${colors.accent}`,
                      opacity: 0.45,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
