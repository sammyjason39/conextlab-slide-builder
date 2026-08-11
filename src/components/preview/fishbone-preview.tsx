"use client";

import { FishboneData, TemplateConfig } from "@/lib/types";

interface FishbonePreviewProps {
  data: FishboneData;
  template: TemplateConfig;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getContrastTextColor(bgHex: string): string {
  const hex = bgHex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#0A0A0A" : "#FFFFFF";
}

export default function FishbonePreview({
  data,
  template,
}: FishbonePreviewProps) {
  const { colors } = template;
  const width = 800;
  const height = 500;
  const headX = width - 100;
  const headY = height / 2;
  const spineStartX = 80;
  const spineEndX = headX - 60;

  const activeCategories = data.categories
    .filter(
      (cat) =>
        cat.causes.length > 0 && cat.causes.some((c) => c.trim())
    )
    .slice(0, 6);

  const categoryPositions = activeCategories.map((_, i) => {
    const total = activeCategories.length;
    if (total === 1) return headY;
    return 60 + ((height - 120) / (total - 1)) * i;
  });

  const headTextColor = getContrastTextColor(colors.accent);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      style={{ fontFamily: "Geist, system-ui, sans-serif" }}
    >
      {/* Background */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={colors.background}
        rx={template.borderRadius * 2}
      />

      {/* Main spine */}
      <line
        x1={spineStartX}
        y1={headY}
        x2={spineEndX}
        y2={headY}
        stroke={colors.accent}
        strokeWidth={template.lineWeight + 1}
        strokeLinecap="round"
      />

      {/* Category spines */}
      {activeCategories.map((cat, i) => {
        const y = categoryPositions[i];
        const midX = spineStartX + (spineEndX - spineStartX) * 0.5;
        return (
          <g key={cat.id}>
            <line
              x1={midX}
              y1={headY}
              x2={spineStartX + 20}
              y2={y}
              stroke={colors.secondary}
              strokeWidth={template.lineWeight}
              strokeLinecap="round"
            />
            <text
              x={spineStartX + 10}
              y={y - 8}
              fill={colors.text}
              fontSize={13}
              fontWeight={700}
              textAnchor="start"
            >
              {escapeXml(cat.name)}
            </text>
            {cat.causes
              .filter((c) => c.trim())
              .map((cause, ci) => {
                const trimmedCauses = cat.causes.filter((c) =>
                  c.trim()
                );
                const causeY =
                  y +
                  (ci - (trimmedCauses.length - 1) / 2) * 22;
                const causeX = spineStartX + 30;
                const displayText =
                  cause.length > 30
                    ? cause.slice(0, 30) + "..."
                    : cause;
                return (
                  <g key={ci}>
                    <line
                      x1={causeX}
                      y1={y}
                      x2={causeX + 30}
                      y2={causeY}
                      stroke={colors.muted}
                      strokeWidth={1}
                    />
                    <text
                      x={causeX + 35}
                      y={causeY + 4}
                      fill={colors.muted}
                      fontSize={11}
                    >
                      {escapeXml(displayText)}
                    </text>
                  </g>
                );
              })}
          </g>
        );
      })}

      {/* Problem head */}
      <rect
        x={headX - 40}
        y={headY - 30}
        width={120}
        height={60}
        rx={template.borderRadius}
        fill={colors.accent}
      />
      <text
        x={headX + 20}
        y={headY + 5}
        fill={headTextColor}
        fontSize={12}
        fontWeight={700}
        textAnchor="middle"
      >
        {escapeXml(
          data.problemStatement.length > 25
            ? data.problemStatement.slice(0, 25) + "..."
            : data.problemStatement
        )}
      </text>
    </svg>
  );
}
