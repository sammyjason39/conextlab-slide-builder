"use client";

import { MatrixData, TemplateConfig } from "@/lib/types";

interface MatrixPreviewProps {
  data: MatrixData;
  template: TemplateConfig;
}

export default function MatrixPreview({ data, template }: MatrixPreviewProps) {
  const { colors } = template;
  const validItems = data.items.filter((i) => i.name.trim());

  const shadowStyle =
    template.shadowDepth === "heavy"
      ? "0 8px 30px rgba(0,0,0,0.12)"
      : template.shadowDepth === "medium"
      ? "0 4px 16px rgba(0,0,0,0.08)"
      : template.shadowDepth === "subtle"
      ? "0 2px 8px rgba(0,0,0,0.04)"
      : "none";

  const getQuadrant = (impact: number, effort: number) => {
    if (impact >= 5.5 && effort <= 5.5) return "quick-win";
    if (impact >= 5.5 && effort > 5.5) return "major-project";
    if (impact < 5.5 && effort <= 5.5) return "fill-in";
    return "thankless";
  };

  const quadrantColors: Record<string, { bg: string; label: string; text: string }> = {
    "quick-win": { bg: "rgba(209,250,229,0.5)", label: "Quick Wins", text: "#059669" },
    "major-project": { bg: "rgba(220,229,254,0.5)", label: "Major Projects", text: "#1652F0" },
    "fill-in": { bg: "rgba(254,243,199,0.5)", label: "Fill-ins", text: "#D97706" },
    thankless: { bg: "rgba(254,226,226,0.5)", label: "Thankless", text: "#DC2626" },
  };

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
        {data.title || "Impact-Effort Matrix"}
      </h3>

      <div className="relative" style={{ paddingBottom: "60%" }}>
        <svg
          viewBox="0 0 400 240"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Quadrant backgrounds */}
          <rect x="0" y="0" width="200" height="120" fill="rgba(209,250,229,0.3)" rx="4" />
          <rect x="200" y="0" width="200" height="120" fill="rgba(220,229,254,0.3)" rx="4" />
          <rect x="0" y="120" width="200" height="120" fill="rgba(254,243,199,0.3)" rx="4" />
          <rect x="200" y="120" width="200" height="120" fill="rgba(254,226,226,0.3)" rx="4" />

          {/* Quadrant labels */}
          <text x="100" y="20" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="bold">Quick Wins</text>
          <text x="300" y="20" textAnchor="middle" fill="#1652F0" fontSize="10" fontWeight="bold">Major Projects</text>
          <text x="100" y="235" textAnchor="middle" fill="#D97706" fontSize="10" fontWeight="bold">Fill-ins</text>
          <text x="300" y="235" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold">Thankless</text>

          {/* Axes */}
          <line x1="200" y1="0" x2="200" y2="240" stroke={colors.border} strokeWidth="1" />
          <line x1="0" y1="120" x2="400" y2="120" stroke={colors.border} strokeWidth="1" />

          {/* Axis labels */}
          <text x="200" y="248" textAnchor="middle" fill={colors.muted} fontSize="9">Effort →</text>
          <text x="6" y="124" textAnchor="start" fill={colors.muted} fontSize="9" transform="rotate(-90, 6, 124)">Impact →</text>
          <text x="10" y="248" textAnchor="start" fill={colors.muted} fontSize="8">Low</text>
          <text x="380" y="248" textAnchor="end" fill={colors.muted} fontSize="8">High</text>
          <text x="6" y="20" textAnchor="start" fill={colors.muted} fontSize="8">High</text>
          <text x="6" y="235" textAnchor="start" fill={colors.muted} fontSize="8">Low</text>

          {/* Items as bubbles */}
          {validItems.map((item) => {
            const q = getQuadrant(item.impact, item.effort);
            const qc = quadrantColors[q];
            const x = (item.effort / 10) * 400;
            const y = 240 - (item.impact / 10) * 240;
            const r = Math.max(12, Math.min(22, item.impact + item.effort + 4));

            return (
              <g key={item.id}>
                <circle cx={x} cy={y} r={r} fill={qc.text} opacity="0.15" />
                <circle cx={x} cy={y} r={r} fill="none" stroke={qc.text} strokeWidth="1.5" />
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={qc.text}
                  fontSize={Math.max(7, Math.min(10, r - 4))}
                  fontWeight="bold"
                >
                  {item.name.length > 12 ? item.name.slice(0, 10) + ".." : item.name}
                </text>
              </g>
            );
          })}

          {validItems.length === 0 && (
            <text x="200" y="120" textAnchor="middle" fill={colors.muted} fontSize="11">
              Add initiatives to see the matrix
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
