"use client";

import { FlowchartData, TemplateConfig } from "@/lib/types";

interface FlowchartPreviewProps {
  data: FlowchartData;
  template: TemplateConfig;
}

export default function FlowchartPreview({ data, template }: FlowchartPreviewProps) {
  const { colors } = template;
  const validNodes = data.nodes.filter((n) => n.label.trim());

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

  const shadowStyle =
    template.shadowDepth === "heavy"
      ? "0 8px 30px rgba(0,0,0,0.12)"
      : template.shadowDepth === "medium"
      ? "0 4px 16px rgba(0,0,0,0.08)"
      : template.shadowDepth === "subtle"
      ? "0 2px 8px rgba(0,0,0,0.04)"
      : "none";

  const nodeW = 100;
  const nodeH = 40;
  const gapY = 60;
  const svgW = 400;
  const svgH = Math.max(200, validNodes.length * gapY + 40);

  const getNodeShape = (type: string) => {
    switch (type) {
      case "start":
      case "end":
        return "rounded";
      case "decision":
        return "diamond";
      default:
        return "rect";
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "start":
        return "#059669";
      case "end":
        return "#DC2626";
      case "decision":
        return "#D97706";
      default:
        return colors.accent;
    }
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
        {data.title || "Flowchart"}
      </h3>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full"
        style={{ maxHeight: svgH }}
      >
        {/* Edges */}
        {data.edges.map((edge, i) => {
          const fromIdx = validNodes.findIndex((n) => n.id === edge.from);
          const toIdx = validNodes.findIndex((n) => n.id === edge.to);
          if (fromIdx < 0 || toIdx < 0) return null;

          const x1 = svgW / 2;
          const y1 = fromIdx * gapY + nodeH + 10;
          const x2 = svgW / 2;
          const y2 = toIdx * gapY + 10;

          return (
            <g key={`edge-${i}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={colors.border}
                strokeWidth={1.5}
                markerEnd="url(#arrowhead)"
              />
              {edge.label && (
                <text
                  x={x1 + 12}
                  y={(y1 + y2) / 2}
                  fill={colors.muted}
                  fontSize={9}
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Arrow marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={colors.border} />
          </marker>
        </defs>

        {/* Nodes */}
        {validNodes.map((node, idx) => {
          const shape = getNodeShape(node.type);
          const nodeColor = getNodeColor(node.type);
          const cx = svgW / 2;
          const cy = idx * gapY + 20;

          if (shape === "diamond") {
            const d = 36;
            return (
              <g key={node.id}>
                <polygon
                  points={`${cx},${cy - d} ${cx + d * 1.3},${cy} ${cx},${cy + d} ${cx - d * 1.3},${cy}`}
                  fill={`${nodeColor}15`}
                  stroke={nodeColor}
                  strokeWidth={1.5}
                />
                <text
                  x={cx}
                  y={cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={nodeColor}
                  fontSize={9}
                  fontWeight="bold"
                >
                  {node.label.length > 14 ? node.label.slice(0, 12) + ".." : node.label}
                </text>
              </g>
            );
          }

          return (
            <g key={node.id}>
              <rect
                x={cx - nodeW / 2}
                y={cy - nodeH / 2}
                width={nodeW}
                height={nodeH}
                rx={shape === "rounded" ? nodeH / 2 : 6}
                fill={`${nodeColor}15`}
                stroke={nodeColor}
                strokeWidth={1.5}
              />
              <text
                x={cx}
                y={cy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={nodeColor}
                fontSize={9}
                fontWeight="bold"
              >
                {node.label.length > 16 ? node.label.slice(0, 14) + ".." : node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
