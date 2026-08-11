export type FrameworkType = "fishbone" | "pareto" | "swot" | "5why" | "scurve" | "matrix" | "flowchart";

export type InputMode = "manual" | "ai";

// ---- Fishbone ----
export interface FishboneCategory {
  id: string;
  name: string;
  causes: string[];
}

export interface FishboneData {
  problemStatement: string;
  categories: FishboneCategory[];
}

// ---- Pareto ----
export interface ParetoItem {
  id: string;
  name: string;
  count: number;
}

export interface ParetoData {
  title: string;
  items: ParetoItem[];
}

// ---- SWOT ----
export interface SWOTData {
  title: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// ---- 5-Why ----
export interface FiveWhyStep {
  id: string;
  question: string;
  answer: string;
}

export interface FiveWhyData {
  problemStatement: string;
  whys: FiveWhyStep[];
}

// ---- S-Curve ----
export interface SCurvePoint {
  month: string;
  value: number;
}

export interface SCurveData {
  title: string;
  plan: SCurvePoint[];
  actual: SCurvePoint[];
}

// ---- Impact-Effort Matrix ----
export interface MatrixItem {
  id: string;
  name: string;
  impact: number; // 1-10
  effort: number; // 1-10
}

export interface MatrixData {
  title: string;
  items: MatrixItem[];
}

// ---- Flowchart ----
export interface FlowchartNode {
  id: string;
  label: string;
  type: "start" | "process" | "decision" | "end";
}

export interface FlowchartEdge {
  from: string;
  to: string;
  label?: string;
}

export interface FlowchartData {
  title: string;
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

// ---- Union ----
export type FrameworkData =
  | FishboneData
  | ParetoData
  | SWOTData
  | FiveWhyData
  | SCurveData
  | MatrixData
  | FlowchartData;

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
