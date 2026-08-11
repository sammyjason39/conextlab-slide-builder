"use client";

import { ColorScheme } from "@/lib/types";

interface ColorCustomizerProps {
  colors: ColorScheme;
  onChange: (colors: ColorScheme) => void;
}

const presets: { name: string; colors: ColorScheme }[] = [
  {
    name: "ConextLab",
    colors: {
      accent: "#1652F0",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#1E293B",
      muted: "#6B7280",
      border: "#E5E7EB",
    },
  },
  {
    name: "Dark Mode",
    colors: {
      accent: "#1652F0",
      background: "#0A0A0A",
      text: "#FFFFFF",
      secondary: "#D1D5DB",
      muted: "#9CA3AF",
      border: "#374151",
    },
  },
  {
    name: "Warm",
    colors: {
      accent: "#EA580C",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#431407",
      muted: "#6B7280",
      border: "#E5E7EB",
    },
  },
  {
    name: "Forest",
    colors: {
      accent: "#059669",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#064E3B",
      muted: "#6B7280",
      border: "#E5E7EB",
    },
  },
  {
    name: "Violet",
    colors: {
      accent: "#7C3AED",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#4C1D95",
      muted: "#6B7280",
      border: "#E5E7EB",
    },
  },
];

function getLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ColorCustomizer({
  colors,
  onChange,
}: ColorCustomizerProps) {
  const bgLuminance = getLuminance(colors.background);
  const accentLuminance = getLuminance(colors.accent);
  const contrastRatio = getContrastRatio(bgLuminance, accentLuminance);
  const lowContrast = contrastRatio < 3;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">
        Customize colors
      </h2>
      <p className="text-sm text-muted mb-4">
        Pick a preset palette or set a custom accent
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onChange(preset.colors)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
              colors.accent === preset.colors.accent &&
              colors.background === preset.colors.background
                ? "border-blue bg-blue-soft/30"
                : "border-hairline hover:border-hairline-2"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full inline-block"
                style={{ backgroundColor: preset.colors.accent }}
              />
              {preset.name}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-ink">Accent:</label>
        <input
          type="color"
          value={colors.accent}
          onChange={(e) =>
            onChange({ ...colors, accent: e.target.value })
          }
          className="w-10 h-10 rounded-lg border border-hairline cursor-pointer"
        />
        <span className="text-xs text-muted font-mono">
          {colors.accent}
        </span>
      </div>

      {lowContrast && (
        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          Low contrast between accent and background. Chart elements may be
          hard to read.
        </div>
      )}
    </div>
  );
}
