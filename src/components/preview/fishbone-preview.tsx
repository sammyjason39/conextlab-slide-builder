"use client";

import { FishboneData, TemplateConfig } from "@/lib/types";

interface FishbonePreviewProps {
  data: FishboneData;
  template: TemplateConfig;
}

const CATEGORY_PALETTE = [
  "#E8A317",
  "#E83E8C",
  "#9B1B30",
  "#7C3AED",
  "#22B8CF",
  "#3FA034",
];

const MINIMAL_PALETTE = [
  "#1F2937",
  "#374151",
  "#4B5563",
  "#374151",
  "#4B5563",
  "#1F2937",
];

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
  return luminance > 0.55 ? "#0A0A0A" : "#FFFFFF";
}

function wrapText(text: string, maxChars: number, maxLines = 6): string[] {
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
  kept.push(lines.slice(maxLines - 1).join(" "));
  return kept;
}

function elongatedHex(cx: number, cy: number, w: number, h: number): string {
  const tip = Math.min(h * 0.55, w * 0.22);
  const hw = w / 2;
  const hh = h / 2;
  return [
    `${cx - hw},${cy}`,
    `${cx - hw + tip},${cy - hh}`,
    `${cx + hw - tip},${cy - hh}`,
    `${cx + hw},${cy}`,
    `${cx + hw - tip},${cy + hh}`,
    `${cx - hw + tip},${cy + hh}`,
  ].join(" ");
}

function regularHex(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 30);
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
}

export default function FishbonePreview({
  data,
  template,
}: FishbonePreviewProps) {
  const { colors } = template;
  const width = 960;
  const height = 430;
  const spineY = height / 2;
  const spineStartX = 58;
  const spineEndX = width - 148;
  const structure =
    template.chartStyle === "minimal" ? colors.secondary : "#4B5563";
  const palette =
    template.chartStyle === "minimal" ? MINIMAL_PALETTE : CATEGORY_PALETTE;
  const lineW = Math.max(1.25, Math.min(template.lineWeight, 2.25));

  const categories = data.categories
    .filter((cat) => cat.name.trim())
    .slice(0, 6);

  const mid = Math.ceil(categories.length / 2) || 0;
  const topCats = categories.slice(0, mid);
  const bottomCats = categories.slice(mid);
  const slotCount = Math.max(topCats.length, bottomCats.length, 1);

  const hexXs = (count: number): number[] => {
    if (count <= 0) return [];
    const left = 196;
    const right = 640;
    if (count === 1) return [(left + right) / 2];
    if (count === 2) return [250, 540];
    return Array.from(
      { length: count },
      (_, i) => left + ((right - left) * i) / (count - 1)
    );
  };

  const topXs = hexXs(topCats.length || slotCount);
  const bottomXs = hexXs(bottomCats.length || slotCount);
  const hexW = 128;
  const hexH = 32;
  const topHexY = 38;
  const bottomHexY = height - 38;
  const boneRun = 110;
  const leftMargin = 10;

  const renderBone = (
    cat: (typeof categories)[number],
    hexX: number,
    hexY: number,
    color: string,
    side: "top" | "bottom"
  ) => {
    const attachX = hexX + hexW / 2 + boneRun * 0.55;
    const hexRightX = hexX + hexW / 2;
    const causes = cat.causes.map((c) => c.trim()).filter(Boolean);
    const slots = Math.max(causes.length, 1);
    const shown = Math.min(Math.max(slots, causes.length ? 1 : 3), 4);
    const labelColor = getContrastTextColor(color);
    const catLines = wrapText(cat.name, 14, 2);

    return (
      <g key={cat.id}>
        <line
          x1={attachX}
          y1={spineY}
          x2={hexRightX}
          y2={hexY}
          stroke={structure}
          strokeWidth={lineW}
          strokeLinecap="round"
        />
        <polygon points={elongatedHex(hexX, hexY, hexW, hexH)} fill={color} />
        {catLines.map((line, li) => (
          <text
            key={li}
            x={hexX}
            y={hexY + (li - (catLines.length - 1) / 2) * 11 + 4}
            textAnchor="middle"
            fill={labelColor}
            fontSize={11}
            fontWeight={700}
          >
            {escapeXml(line)}
          </text>
        ))}
        {Array.from({ length: shown }).map((_, ci) => {
          const t = (ci + 1) / (shown + 1);
          const px = hexRightX + (attachX - hexRightX) * t;
          const py = hexY + (spineY - hexY) * t;
          const cause = causes[ci] || "";
          const available = Math.max(80, px - leftMargin - 12);
          const charW = 5.15;
          const maxChars = Math.max(16, Math.floor(available / charW));
          const lines = cause ? wrapText(cause, maxChars, 3) : [];
          const lineLen = Math.min(
            available,
            Math.max(88, (lines[0]?.length || 12) * charW + 8)
          );
          const lineHeight = 10.5;
          const blockH = Math.max(0, (lines.length - 1) * lineHeight);
          const textStartY =
            side === "top" ? py - 7 - blockH : py + 13;

          return (
            <g key={`${cat.id}-c-${ci}`}>
              <line
                x1={px}
                y1={py}
                x2={px - lineLen}
                y2={py}
                stroke={structure}
                strokeWidth={1.25}
                strokeLinecap="round"
              />
              <polygon
                points={regularHex(px, py, 5.5)}
                fill={color}
                stroke={colors.background}
                strokeWidth={1}
              />
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={px - 9}
                  y={textStartY + li * lineHeight}
                  textAnchor="end"
                  fill={colors.text}
                  fontSize={9.5}
                >
                  {escapeXml(line)}
                </text>
              ))}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      style={{ fontFamily: "Geist, system-ui, sans-serif" }}
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={colors.background}
        rx={template.borderRadius * 2}
      />

      <polygon
        points={`${spineStartX},${spineY} 18,${spineY - 32} 8,${spineY} 18,${spineY + 32}`}
        fill={structure}
      />

      <line
        x1={spineStartX}
        y1={spineY}
        x2={spineEndX}
        y2={spineY}
        stroke={structure}
        strokeWidth={lineW + 0.5}
        strokeLinecap="round"
      />

      {topCats.map((cat, i) =>
        renderBone(
          cat,
          topXs[i] ?? topXs[0],
          topHexY,
          palette[i % palette.length],
          "top"
        )
      )}
      {bottomCats.map((cat, i) =>
        renderBone(
          cat,
          bottomXs[i] ?? bottomXs[0],
          bottomHexY,
          palette[(mid + i) % palette.length],
          "bottom"
        )
      )}

      <path
        d={`M ${spineEndX} ${spineY - 7}
            L ${spineEndX + 18} ${spineY - 48}
            Q ${width - 70} ${spineY - 58}, ${width - 34} ${spineY - 18}
            L ${width - 18} ${spineY - 8}
            L ${width - 36} ${spineY}
            L ${width - 18} ${spineY + 8}
            Q ${width - 34} ${spineY + 18}, ${width - 70} ${spineY + 58}
            L ${spineEndX + 18} ${spineY + 48}
            L ${spineEndX} ${spineY + 7}
            Z`}
        fill={structure}
      />
      <circle cx={width - 78} cy={spineY - 14} r={7} fill="#FFFFFF" />
      <circle cx={width - 76} cy={spineY - 14} r={3.2} fill={structure} />
    </svg>
  );
}
