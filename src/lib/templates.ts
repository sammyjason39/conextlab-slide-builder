import { TemplateConfig } from "./types";

function makeTemplates(
  prefix: string,
  framework: TemplateConfig["framework"]
): TemplateConfig[] {
  return [
    {
      id: `${prefix}-modern`,
      name: "Modern",
      description: "Clean lines with blue accents",
      framework,
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
      id: `${prefix}-3d`,
      name: "3D Depth",
      description: "Gradient with drop shadows",
      framework,
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
      id: `${prefix}-minimal`,
      name: "Minimal",
      description: "Monochrome with subtle accents",
      framework,
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
      id: `${prefix}-bold`,
      name: "Bold",
      description: "High contrast with heavy lines",
      framework,
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
}

export const fishboneTemplates = makeTemplates("fishbone", "fishbone");
export const paretoTemplates = makeTemplates("pareto", "pareto");
export const swotTemplates = makeTemplates("swot", "swot");
export const fiveWhyTemplates = makeTemplates("5why", "5why");
export const sCurveTemplates = makeTemplates("scurve", "scurve");
export const matrixTemplates = makeTemplates("matrix", "matrix");
export const flowchartTemplates = makeTemplates("flowchart", "flowchart");

const templateMap: Record<string, TemplateConfig[]> = {
  fishbone: fishboneTemplates,
  pareto: paretoTemplates,
  swot: swotTemplates,
  "5why": fiveWhyTemplates,
  scurve: sCurveTemplates,
  matrix: matrixTemplates,
  flowchart: flowchartTemplates,
};

export function getTemplatesForFramework(
  framework: string
): TemplateConfig[] {
  return templateMap[framework] || [];
}

export function getDefaultTemplate(
  framework: string
): TemplateConfig {
  return getTemplatesForFramework(framework)[0];
}
