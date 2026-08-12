"use client";

import { FiveWhyData, TemplateConfig } from "@/lib/types";

interface FiveWhyPreviewProps {
  data: FiveWhyData;
  template: TemplateConfig;
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (!current || next.length <= maxChars) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines - 1);
  const rest = lines.slice(maxLines - 1).join(" ");
  kept.push(
    rest.length > maxChars ? `${rest.slice(0, Math.max(1, maxChars - 1))}…` : rest
  );
  return kept;
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
      className="w-full px-1 py-1 rounded-2xl"
      style={{
        backgroundColor: colors.background,
        borderRadius: template.borderRadius * 2,
        boxShadow: shadowStyle,
      }}
    >
      <div className="flex items-stretch w-full gap-1">
        {filledWhys.map((why, idx) => {
          const isRoot = idx === filledWhys.length - 1 && filledWhys.length >= 2;
          const questionLines = wrapText(why.question, 22, 2);
          const answerLines = wrapText(why.answer, 22, 4);

          return (
            <div key={why.id} className="flex items-stretch flex-1 min-w-0">
              <div
                className="flex-1 min-w-0 px-2 py-2 flex flex-col"
                style={{
                  backgroundColor: isRoot
                    ? hexToRgba(colors.accent, 0.1)
                    : hexToRgba(colors.border, 0.35),
                  border: `1.5px solid ${isRoot ? colors.accent : colors.border}`,
                  borderRadius: template.borderRadius,
                }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isRoot ? colors.accent : colors.secondary,
                      color: "#FFFFFF",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: isRoot ? colors.accent : colors.muted }}
                  >
                    {isRoot ? "Root Cause" : `Why #${idx + 1}`}
                  </span>
                </div>

                {questionLines.map((line, li) => (
                  <p
                    key={`q-${li}`}
                    className="text-[10px] font-semibold leading-tight"
                    style={{ color: colors.text }}
                  >
                    {line}
                  </p>
                ))}

                {answerLines.map((line, li) => (
                  <p
                    key={`a-${li}`}
                    className="text-[10px] leading-tight mt-0.5"
                    style={{ color: colors.muted }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {idx < filledWhys.length - 1 && (
                <div className="flex items-center px-0.5 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h8M8 3l4 4-4 4"
                      stroke={colors.accent}
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
