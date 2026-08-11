export type FrameworkType = "fishbone" | "pareto" | "swot";

export type InputMode = "manual" | "ai";

export interface FishboneCategory {
  id: string;
  name: string;
  causes: string[];
}

export interface FishboneData {
  problemStatement: string;
  categories: FishboneCategory[];
}

export interface ParetoItem {
  id: string;
  name: string;
  count: number;
}

export interface ParetoData {
  title: string;
  items: ParetoItem[];
}

export interface SWOTData {
  title: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export type FrameworkData = FishboneData | ParetoData | SWOTData;

export interface ValidationError {
  field: string;
  message: string;
}

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: ValidationError[] };

export interface ColorScheme {
  accent: string;
  background: string;
  text: string;
  secondary: string;
  muted: string;
  border: string;
}

export type ChartStyle = "flat" | "gradient" | "3d" | "minimal";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  framework: FrameworkType;
  chartStyle: ChartStyle;
  colors: ColorScheme;
  lineWeight: number;
  borderRadius: number;
  shadowDepth: "none" | "subtle" | "medium" | "heavy";
}

export interface AIExtractionResult {
  success: boolean;
  data?: FrameworkData;
  confidence: "high" | "medium" | "low";
  note?: string;
  error?: string;
}
