"use client";

import { FiveWhyData, TemplateConfig } from "@/lib/types";

interface FiveWhyPreviewProps {
  data: FiveWhyData;
  template: TemplateConfig;
}

export default function FiveWhyPreview({ data, template }: FiveWhyPreviewProps) {
  const { colors } = template;
  const filledWhys = data.whys.filter((w) => w.answer.trim());

  const shadowStyle =
    template.shadowDepth === "heavy"
      ? "0 8px 30px rgba(0,0,0,0.12)"
      : template.shadowDepth === "medium"
      ? "0 4px 16px rgba(0,0,0,0.08)"
      : template.shadowDepth === "subtle"
      ? "0 2px 8px rgba(0,0,0,0.04)"
      : "none";

  return (
    <div
      className="w-full p-4 rounded-2xl"
      style={{
        backgroundColor: colors.background,
        borderRadius: template.borderRadius * 2,
        boxShadow: shadowStyle,
      }}
    >
      <h3
        className="text-center font-bold mb-4"
        style={{ color: colors.text, fontSize: 16 }}
      >
        {data.problemStatement || "5-Why Analysis"}
      </h3>

      <div className="flex flex-col items-center gap-0">
        {filledWhys.map((why, idx) => (
          <div key={why.id} className="flex flex-col items-center w-full max-w-md">
            {/* Why box */}
            <div
              className="w-full p-3 rounded-xl text-center"
              style={{
                backgroundColor: idx === filledWhys.length - 1
                  ? `${colors.accent}15`
                  : "transparent",
                border: `1.5px solid ${
                  idx === filledWhys.length - 1 ? colors.accent : colors.border
                }`,
                borderRadius: template.borderRadius,
              }}
            >
              <p
                className="text-xs font-bold mb-1"
                style={{ color: colors.accent }}
              >
                Why #{idx + 1}
              </p>
              <p
                className="text-xs font-semibold"
                style={{ color: colors.text }}
              >
                {why.question}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: colors.muted }}
              >
                {why.answer}
              </p>
            </div>

            {/* Connector arrow */}
            {idx < filledWhys.length - 1 && (
              <div className="flex flex-col items-center py-1">
                <div
                  style={{
                    width: 2,
                    height: 16,
                    backgroundColor: colors.accent,
                    opacity: 0.4,
                  }}
                />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: `6px solid ${colors.accent}`,
                    opacity: 0.4,
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {filledWhys.length === 0 && (
          <p className="text-xs italic" style={{ color: colors.muted }}>
            No why levels filled yet
          </p>
        )}
      </div>

      {filledWhys.length > 0 && (
        <div
          className="mt-4 p-3 rounded-xl text-center"
          style={{
            backgroundColor: `${colors.accent}10`,
            border: `1px solid ${colors.accent}30`,
            borderRadius: template.borderRadius,
          }}
        >
          <p className="text-xs font-bold" style={{ color: colors.accent }}>
            Root Cause
          </p>
          <p className="text-xs mt-0.5" style={{ color: colors.text }}>
            {filledWhys[filledWhys.length - 1].answer}
          </p>
        </div>
      )}
    </div>
  );
}
