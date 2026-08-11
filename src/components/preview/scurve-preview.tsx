"use client";

import { SCurveData, TemplateConfig } from "@/lib/types";

interface SCurvePreviewProps {
  data: SCurveData;
  template: TemplateConfig;
}

export default function SCurvePreview({ data, template }: SCurvePreviewProps) {
  const { colors } = template;
  const planPoints = data.plan.filter((p) => p.month.trim());
  const actualPoints = data.actual.filter((a) => a.month.trim());

  if (planPoints.length === 0) {
    return (
      <div
        className="w-full p-4 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <p className="text-xs italic" style={{ color: colors.muted }}>
          Add plan data points to see the S-Curve
        </p>
      </div>
    );
  }

  const allMonths = planPoints.map((p) => p.month);
  const maxVal = Math.max(
    ...planPoints.map((p) => p.value),
    ...actualPoints.map((a) => a.value),
    100
  );

  const svgW = 600;
  const svgH = 280;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotW = svgW - pad.left - pad.right;
  const plotH = svgH - pad.top - pad.bottom;

  const xScale = (i: number) => pad.left + (i / (allMonths.length - 1 || 1)) * plotW;
  const yScale = (v: number) => pad.top + plotH - (v / maxVal) * plotH;

  const planPath = planPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(p.value)}`)
    .join(" ");

  const actualPath = actualPoints
    .map((a, i) => {
      const idx = allMonths.indexOf(a.month);
      return `${i === 0 ? "M" : "L"} ${xScale(idx >= 0 ? idx : i)} ${yScale(a.value)}`;
    })
    .join(" ");

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
        className="text-center font-bold mb-3"
        style={{ color: colors.text, fontSize: 16 }}
      >
        {data.title || "S-Curve"}
      </h3>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: 280 }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line
              x1={pad.left}
              y1={yScale(v)}
              x2={svgW - pad.right}
              y2={yScale(v)}
              stroke={colors.border}
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
            <text
              x={pad.left - 8}
              y={yScale(v) + 4}
              textAnchor="end"
              fill={colors.muted}
              fontSize={10}
            >
              {v}%
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {allMonths.map((m, i) => (
          <text
            key={m}
            x={xScale(i)}
            y={svgH - 8}
            textAnchor="middle"
            fill={colors.muted}
            fontSize={10}
          >
            {m}
          </text>
        ))}

        {/* Plan line */}
        <path
          d={planPath}
          fill="none"
          stroke={colors.accent}
          strokeWidth={template.lineWeight}
          strokeDasharray="6 3"
          opacity={0.7}
        />
        {planPoints.map((p, i) => (
          <circle
            key={`plan-${i}`}
            cx={xScale(i)}
            cy={yScale(p.value)}
            r={3}
            fill={colors.accent}
            opacity={0.7}
          />
        ))}

        {/* Actual line */}
        {actualPoints.length > 0 && (
          <>
            <path
              d={actualPath}
              fill="none"
              stroke={colors.secondary}
              strokeWidth={template.lineWeight + 1}
            />
            {actualPoints.map((a, i) => {
              const idx = allMonths.indexOf(a.month);
              return (
                <circle
                  key={`actual-${i}`}
                  cx={xScale(idx >= 0 ? idx : i)}
                  cy={yScale(a.value)}
                  r={4}
                  fill={colors.secondary}
                />
              );
            })}
          </>
        )}
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 20,
              height: 2,
              backgroundColor: colors.accent,
              borderTop: `2px dashed ${colors.accent}`,
              opacity: 0.7,
            }}
          />
          <span className="text-xs" style={{ color: colors.muted }}>
            Plan
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 20,
              height: 3,
              backgroundColor: colors.secondary,
            }}
          />
          <span className="text-xs" style={{ color: colors.muted }}>
            Actual
          </span>
        </div>
      </div>
    </div>
  );
}
