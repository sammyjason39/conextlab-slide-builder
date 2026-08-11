"use client";

import { FrameworkType } from "@/lib/types";
import { IconMode, getFrameworkIcon } from "@/components/icons";

interface FrameworkPickerProps {
  selected: FrameworkType | null;
  onSelect: (framework: FrameworkType) => void;
  iconMode: IconMode;
}

const frameworks: {
  type: FrameworkType;
  label: string;
  description: string;
}[] = [
  {
    type: "fishbone",
    label: "Fishbone",
    description: "Root cause analysis with cause-and-effect branches",
  },
  {
    type: "5why",
    label: "5-Why",
    description: "Drill down to root cause with five why questions",
  },
  {
    type: "pareto",
    label: "Pareto",
    description: "80/20 rule chart with cumulative percentage",
  },
  {
    type: "swot",
    label: "SWOT",
    description: "Strengths, Weaknesses, Opportunities, Threats",
  },
  {
    type: "scurve",
    label: "S-Curve",
    description: "Plan vs actual progress tracking over time",
  },
  {
    type: "matrix",
    label: "Impact-Effort",
    description: "2x2 prioritization matrix for initiatives",
  },
  {
    type: "flowchart",
    label: "Flowchart",
    description: "Process map with nodes and decision branches",
  },
];

export default function FrameworkPicker({
  selected,
  onSelect,
  iconMode,
}: FrameworkPickerProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">
        Choose a framework
      </h2>
      <p className="text-sm text-muted mb-6">
        Pick the analysis framework for your slide
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {frameworks.map((fw) => (
          <button
            key={fw.type}
            onClick={() => onSelect(fw.type)}
            className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
              selected === fw.type
                ? "border-blue bg-blue-soft/50 shadow-md"
                : "border-hairline hover:border-hairline-2 hover:shadow-sm"
            }`}
          >
            <div className="mb-3" style={{ color: selected === fw.type ? "#1652F0" : "#6B7280" }}>
              {getFrameworkIcon(fw.type, iconMode, 32)}
            </div>
            <h3 className="font-bold text-ink text-lg mb-1">{fw.label}</h3>
            <p className="text-sm text-muted leading-relaxed">
              {fw.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
