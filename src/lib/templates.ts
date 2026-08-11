import { TemplateConfig } from "./types";

export const fishboneTemplates: TemplateConfig[] = [
  {
    id: "fishbone-modern",
    name: "Modern",
    description: "Clean lines with blue accents",
    framework: "fishbone",
    chartStyle: "flat",
    colors: {
      accent: "#1652F0",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#1E293B",
      muted: "#6B7280",
      border: "#E5E7EB",
    },
    lineWeight: 2,
    borderRadius: 8,
    shadowDepth: "subtle",
  },
  {
    id: "fishbone-3d",
    name: "3D Depth",
    description: "Gradient spines with drop shadows",
    framework: "fishbone",
    chartStyle: "3d",
    colors: {
      accent: "#1652F0",
      background: "#F8FAFC",
      text: "#0A0A0A",
      secondary: "#1E293B",
      muted: "#6B7280",
      border: "#D1D5DB",
    },
    lineWeight: 3,
    borderRadius: 12,
    shadowDepth: "medium",
  },
  {
    id: "fishbone-minimal",
    name: "Minimal",
    description: "Monochrome with subtle accents",
    framework: "fishbone",
    chartStyle: "minimal",
    colors: {
      accent: "#0A0A0A",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#6B7280",
      muted: "#9CA3AF",
      border: "#E5E7EB",
    },
    lineWeight: 1.5,
    borderRadius: 4,
    shadowDepth: "none",
  },
  {
    id: "fishbone-bold",
    name: "Bold",
    description: "High contrast with heavy lines",
    framework: "fishbone",
    chartStyle: "flat",
    colors: {
      accent: "#1652F0",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#0A0A0A",
      muted: "#6B7280",
      border: "#0A0A0A",
    },
    lineWeight: 3.5,
    borderRadius: 6,
    shadowDepth: "heavy",
  },
];

export const paretoTemplates: TemplateConfig[] = [
  {
    id: "pareto-modern",
    name: "Modern",
    description: "Flat bars with clean grid",
    framework: "pareto",
    chartStyle: "flat",
    colors: {
      accent: "#1652F0",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#1E293B",
      muted: "#6B7280",
      border: "#E5E7EB",
    },
    lineWeight: 2,
    borderRadius: 8,
    shadowDepth: "subtle",
  },
  {
    id: "pareto-3d",
    name: "3D Depth",
    description: "Gradient bars with drop shadows",
    framework: "pareto",
    chartStyle: "3d",
    colors: {
      accent: "#1652F0",
      background: "#F8FAFC",
      text: "#0A0A0A",
      secondary: "#1E293B",
      muted: "#6B7280",
      border: "#D1D5DB",
    },
    lineWeight: 2,
    borderRadius: 12,
    shadowDepth: "medium",
  },
  {
    id: "pareto-minimal",
    name: "Minimal",
    description: "Monochrome bars, no grid",
    framework: "pareto",
    chartStyle: "minimal",
    colors: {
      accent: "#0A0A0A",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#6B7280",
      muted: "#9CA3AF",
      border: "#E5E7EB",
    },
    lineWeight: 1.5,
    borderRadius: 4,
    shadowDepth: "none",
  },
  {
    id: "pareto-bold",
    name: "Bold",
    description: "Vibrant bars with strong contrast",
    framework: "pareto",
    chartStyle: "flat",
    colors: {
      accent: "#1652F0",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#0A0A0A",
      muted: "#6B7280",
      border: "#0A0A0A",
    },
    lineWeight: 3,
    borderRadius: 6,
    shadowDepth: "heavy",
  },
];

export const swotTemplates: TemplateConfig[] = [
  {
    id: "swot-modern",
    name: "Modern",
    description: "Soft tints with rounded corners",
    framework: "swot",
    chartStyle: "flat",
    colors: {
      accent: "#1652F0",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#1E293B",
      muted: "#6B7280",
      border: "#E5E7EB",
    },
    lineWeight: 1,
    borderRadius: 16,
    shadowDepth: "subtle",
  },
  {
    id: "swot-3d",
    name: "3D Depth",
    description: "Raised cards with drop shadows",
    framework: "swot",
    chartStyle: "3d",
    colors: {
      accent: "#1652F0",
      background: "#F8FAFC",
      text: "#0A0A0A",
      secondary: "#1E293B",
      muted: "#6B7280",
      border: "#D1D5DB",
    },
    lineWeight: 1,
    borderRadius: 20,
    shadowDepth: "medium",
  },
  {
    id: "swot-minimal",
    name: "Minimal",
    description: "Clean borders, no fills",
    framework: "swot",
    chartStyle: "minimal",
    colors: {
      accent: "#0A0A0A",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#6B7280",
      muted: "#9CA3AF",
      border: "#E5E7EB",
    },
    lineWeight: 1,
    borderRadius: 8,
    shadowDepth: "none",
  },
  {
    id: "swot-bold",
    name: "Bold",
    description: "Vibrant quadrant fills with strong borders",
    framework: "swot",
    chartStyle: "flat",
    colors: {
      accent: "#1652F0",
      background: "#FFFFFF",
      text: "#0A0A0A",
      secondary: "#0A0A0A",
      muted: "#6B7280",
      border: "#0A0A0A",
    },
    lineWeight: 2,
    borderRadius: 12,
    shadowDepth: "heavy",
  },
];

export function getTemplatesForFramework(framework: "fishbone" | "pareto" | "swot"): TemplateConfig[] {
  switch (framework) {
    case "fishbone":
      return fishboneTemplates;
    case "pareto":
      return paretoTemplates;
    case "swot":
      return swotTemplates;
  }
}

export function getDefaultTemplate(framework: "fishbone" | "pareto" | "swot"): TemplateConfig {
  return getTemplatesForFramework(framework)[0];
}
