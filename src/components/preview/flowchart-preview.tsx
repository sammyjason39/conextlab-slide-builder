"use client";

import { FlowchartData, FlowchartEdge, TemplateConfig } from "@/lib/types";

interface FlowchartPreviewProps {
  data: FlowchartData;
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

function wrapText(text: string, maxChars: number, maxLines = 8): string[] {
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

function branchOrder(label?: string): number {
  const l = (label || "").trim().toLowerCase();
  if (["no", "false", "n", "tidak", "reject"].includes(l)) return -1;
  if (["yes", "true", "y", "ya", "ok"].includes(l)) return 1;
  return 0;
}

function arrowHead(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  size = 9
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const bx = x2 - ux * size;
  const by = y2 - uy * size;
  return `${x2},${y2} ${bx + px * size * 0.55},${by + py * size * 0.55} ${bx - px * size * 0.55},${by - py * size * 0.55}`;
}

export default function FlowchartPreview({
  data,
  template,
}: FlowchartPreviewProps) {
  const { colors } = template;
  const validNodes = data.nodes.filter((n) => n.label.trim());
  const validIds = new Set(validNodes.map((n) => n.id));
  const validEdges = data.edges.filter(
    (e) => validIds.has(e.from) && validIds.has(e.to)
  );

  if (validNodes.length === 0) {
    return (
      <div
        className="w-full p-4 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <p className="text-xs italic" style={{ color: colors.muted }}>
          Add nodes to see the flowchart
        </p>
      </div>
    );
  }

  const outgoing = new Map<string, FlowchartEdge[]>();
  const incomingCount = new Map<string, number>();
  for (const n of validNodes) {
    outgoing.set(n.id, []);
    incomingCount.set(n.id, 0);
  }
  for (const e of validEdges) {
    outgoing.get(e.from)!.push(e);
    incomingCount.set(e.to, (incomingCount.get(e.to) || 0) + 1);
  }
  Array.from(outgoing.values()).forEach((edges) => {
    edges.sort((a, b) => branchOrder(a.label) - branchOrder(b.label));
  });

  const roots = validNodes.filter(
    (n) => n.type === "start" || (incomingCount.get(n.id) || 0) === 0
  );
  if (roots.length === 0) roots.push(validNodes[0]);

  const grid = new Map<string, { col: number; row: number }>();
  const occupied = new Set<string>();
  const cell = (c: number, r: number) => `${c},${r}`;

  const place = (id: string, col: number, row: number) => {
    if (grid.has(id)) return;
    let c = col;
    while (occupied.has(cell(c, row))) c += 1;
    grid.set(id, { col: c, row });
    occupied.add(cell(c, row));
  };

  const walk = (id: string, col: number, row: number, visiting: Set<string>) => {
    if (visiting.has(id) || grid.has(id)) return;
    visiting.add(id);
    place(id, col, row);
    const placedCol = grid.get(id)!.col;
    const outs = outgoing.get(id) || [];
    if (outs.length === 0) return;
    if (outs.length === 1) {
      walk(outs[0].to, placedCol, row + 1, visiting);
      return;
    }
    if (outs.length === 2) {
      walk(outs[0].to, placedCol - 1, row + 1, visiting);
      walk(outs[1].to, placedCol, row + 1, visiting);
      return;
    }
    outs.forEach((edge, i) => {
      const offset = i - Math.floor((outs.length - 1) / 2);
      walk(edge.to, placedCol + offset, row + 1, visiting);
    });
  };

  let rootCol = 0;
  for (const root of roots) {
    walk(root.id, rootCol, 0, new Set());
    rootCol += 2;
  }

  let extraRow =
    (grid.size ? Math.max(...Array.from(grid.values()).map((p) => p.row)) : 0) + 1;
  for (const n of validNodes) {
    if (!grid.has(n.id)) place(n.id, 0, extraRow++);
  }

  const cols = Array.from(grid.values()).map((p) => p.col);
  const rows = Array.from(grid.values()).map((p) => p.row);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);
  const maxRow = Math.max(...rows);

  const NODE_W = 148;
  const BASE_H = 46;
  const H_GAP = 200;
  const PAD_X = 48;
  const PAD_Y = 28;

  const labelLines = new Map<string, string[]>();
  const nodeHeights = new Map<string, number>();
  let maxNodeH = BASE_H;
  for (const n of validNodes) {
    const lines = wrapText(n.label, n.type === "decision" ? 14 : 18, 8);
    labelLines.set(n.id, lines);
    const h =
      n.type === "decision"
        ? Math.max(72, lines.length * 14 + 28)
        : Math.max(BASE_H, lines.length * 14 + 20);
    nodeHeights.set(n.id, h);
    maxNodeH = Math.max(maxNodeH, h);
  }
  const V_GAP = maxNodeH + 52;

  const svgW = Math.max(420, (maxCol - minCol + 1) * H_GAP + PAD_X * 2);
  const svgH = Math.max(240, (maxRow + 1) * V_GAP + PAD_Y * 2);

  const positions = new Map<
    string,
    { x: number; y: number; w: number; h: number }
  >();
  for (const n of validNodes) {
    const g = grid.get(n.id)!;
    const isDecision = n.type === "decision";
    const h = nodeHeights.get(n.id) || BASE_H;
    positions.set(n.id, {
      x: PAD_X + (g.col - minCol) * H_GAP + H_GAP / 2,
      y: PAD_Y + g.row * V_GAP + h / 2,
      w: isDecision ? Math.max(120, h * 1.35) : NODE_W,
      h,
    });
  }

  const nodeColor = (type: string) => {
    switch (type) {
      case "start":
        return "#059669";
      case "end":
        return "#DC2626";
      case "decision":
        return "#D97706";
      default:
        return colors.accent || "#1652F0";
    }
  };

  const shadowStyle =
    template.shadowDepth === "heavy"
      ? "0 8px 30px rgba(0,0,0,0.12)"
      : template.shadowDepth === "medium"
        ? "0 4px 16px rgba(0,0,0,0.08)"
        : template.shadowDepth === "subtle"
          ? "0 2px 8px rgba(0,0,0,0.04)"
          : "none";

  const strokeW = Math.max(1.75, template.lineWeight);

  return (
    <div
      className="w-full p-3 rounded-2xl"
      style={{
        backgroundColor: colors.background,
        borderRadius: template.borderRadius * 2,
        boxShadow: shadowStyle,
      }}
    >
      <h3
        className="text-center font-bold mb-2"
        style={{ color: colors.text, fontSize: 15 }}
      >
        {data.title || "Flowchart"}
      </h3>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full"
        style={{ fontFamily: "Geist, system-ui, sans-serif" }}
      >
        {validEdges.map((edge, i) => {
          const a = positions.get(edge.from);
          const b = positions.get(edge.to);
          if (!a || !b) return null;

          const startX = a.x;
          const startY = a.y + a.h / 2 - 1;
          const endX = b.x;
          const endY = b.y - b.h / 2 + 1;
          const sameCol = Math.abs(a.x - b.x) < 6;
          const midY = startY + Math.max(16, (endY - startY) * 0.38);
          const d = sameCol
            ? `M ${startX} ${startY} L ${endX} ${endY}`
            : `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
          const ah = sameCol
            ? arrowHead(startX, startY, endX, endY)
            : arrowHead(endX, midY, endX, endY);
          const labelX = sameCol ? startX + 16 : (startX + endX) / 2;
          const labelY = sameCol ? (startY + endY) / 2 : midY - 8;

          return (
            <g key={`edge-${i}`}>
              <path
                d={d}
                fill="none"
                stroke={colors.secondary || "#4B5563"}
                strokeWidth={strokeW}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polygon
                points={ah}
                fill={colors.secondary || "#4B5563"}
              />
              {edge.label ? (
                <g>
                  <rect
                    x={labelX - 16}
                    y={labelY - 10}
                    width={32}
                    height={16}
                    rx={8}
                    fill={colors.background}
                    stroke={colors.border}
                    strokeWidth={1}
                  />
                  <text
                    x={labelX}
                    y={labelY + 2}
                    textAnchor="middle"
                    fill={colors.text}
                    fontSize={9}
                    fontWeight={700}
                  >
                    {escapeXml(edge.label)}
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}

        {validNodes.map((node) => {
          const p = positions.get(node.id)!;
          const color = nodeColor(node.type);
          const lines = labelLines.get(node.id) || wrapText(node.label, 18, 8);

          if (node.type === "decision") {
            const dx = p.w / 2;
            const dy = p.h / 2;
            return (
              <g key={node.id}>
                <polygon
                  points={`${p.x},${p.y - dy} ${p.x + dx},${p.y} ${p.x},${p.y + dy} ${p.x - dx},${p.y}`}
                  fill={color}
                  fillOpacity={0.12}
                  stroke={color}
                  strokeWidth={2}
                />
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={p.x}
                    y={p.y + (li - (lines.length - 1) / 2) * 12 + 4}
                    textAnchor="middle"
                    fill={color}
                    fontSize={10}
                    fontWeight={700}
                  >
                    {escapeXml(line)}
                  </text>
                ))}
              </g>
            );
          }

          const radius =
            node.type === "start" || node.type === "end" ? p.h / 2 : 8;
          return (
            <g key={node.id}>
              <rect
                x={p.x - p.w / 2}
                y={p.y - p.h / 2}
                width={p.w}
                height={p.h}
                rx={radius}
                fill={color}
                fillOpacity={0.12}
                stroke={color}
                strokeWidth={2}
              />
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={p.x}
                  y={p.y + (li - (lines.length - 1) / 2) * 13 + 4}
                  textAnchor="middle"
                  fill={color}
                  fontSize={11}
                  fontWeight={700}
                >
                  {escapeXml(line)}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
