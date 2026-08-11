"use client";

import { ParetoData, TemplateConfig } from "@/lib/types";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ParetoPreviewProps {
  data: ParetoData;
  template: TemplateConfig;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length >= 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return null;
}

export default function ParetoPreview({
  data,
  template,
}: ParetoPreviewProps) {
  const { colors } = template;

  const sorted = [...data.items]
    .filter((item) => item.name.trim() && item.count > 0)
    .sort((a, b) => b.count - a.count);

  const total = sorted.reduce((sum, item) => sum + item.count, 0);

  let runningCumulative = 0;
  const chartData = sorted.map((item) => {
    const percentage = total > 0 ? (item.count / total) * 100 : 0;
    runningCumulative += percentage;
    return {
      name:
        item.name.length > 20
          ? item.name.slice(0, 20) + "..."
          : item.name,
      count: item.count,
      percentage: Math.round(percentage * 10) / 10,
      cumulative: Math.round(runningCumulative * 10) / 10,
    };
  });

  const rgb = hexToRgb(colors.accent);
  const barColors = chartData.map((_, i) => {
    if (!rgb) return colors.accent;
    const opacity = Math.max(1 - i * 0.1, 0.25);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  });

  const is3D = template.chartStyle === "3d";
  const xInterval =
    chartData.length > 10
      ? Math.floor(chartData.length / 8)
      : 0;

  if (chartData.length === 0) {
    return (
      <div
        className="w-full p-4 rounded-2xl flex items-center justify-center"
        style={{
          backgroundColor: colors.background,
          borderRadius: template.borderRadius * 2,
          minHeight: 350,
        }}
      >
        <p style={{ color: colors.muted, fontSize: 14 }}>
          No data to display
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full p-4 rounded-2xl"
      style={{
        backgroundColor: colors.background,
        borderRadius: template.borderRadius * 2,
        boxShadow:
          template.shadowDepth === "heavy"
            ? "0 8px 30px rgba(0,0,0,0.12)"
            : template.shadowDepth === "medium"
            ? "0 4px 16px rgba(0,0,0,0.08)"
            : template.shadowDepth === "subtle"
            ? "0 2px 8px rgba(0,0,0,0.04)"
            : "none",
      }}
    >
      <h3
        className="text-center font-bold mb-4"
        style={{ color: colors.text, fontSize: 16 }}
      >
        {data.title}
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          {template.chartStyle !== "minimal" && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.border}
            />
          )}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: colors.muted }}
            axisLine={{ stroke: colors.border }}
            tickLine={false}
            interval={xInterval}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: colors.muted }}
            axisLine={{ stroke: colors.border }}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: colors.muted }}
            axisLine={{ stroke: colors.border }}
            tickLine={false}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.background,
              fontSize: 12,
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="count"
            radius={
              is3D
                ? [0, 0, 0, 0]
                : [template.borderRadius, template.borderRadius, 0, 0]
            }
            barSize={40}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={barColors[index]} />
            ))}
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulative"
            stroke={colors.text}
            strokeWidth={2}
            dot={{ r: 3, fill: colors.text }}
          />
          <ReferenceLine
            yAxisId="right"
            y={80}
            stroke={colors.muted}
            strokeDasharray="6 4"
            label={{
              value: "80%",
              position: "right",
              fill: colors.muted,
              fontSize: 11,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
