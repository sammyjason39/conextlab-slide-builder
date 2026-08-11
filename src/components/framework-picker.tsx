"use client";

import { FrameworkType } from "@/lib/types";

interface FrameworkPickerProps {
  selected: FrameworkType | null;
  onSelect: (framework: FrameworkType) => void;
}

const frameworks: {
  type: FrameworkType;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    type: "fishbone",
    label: "Fishbone",
    description: "Root cause analysis with cause-and-effect branches",
    icon: "🐟",
  },
  {
    type: "pareto",
    label: "Pareto",
    description: "80/20 rule chart with cumulative percentage",
    icon: "📊",
  },
  {
    type: "swot",
    label: "SWOT",
    description: "Strengths, Weaknesses, Opportunities, Threats",
    icon: "🎯",
  },
];

export default function FrameworkPicker({
  selected,
  onSelect,
}: FrameworkPickerProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">
        Choose a framework
      </h2>
      <p className="text-sm text-muted mb-6">
        Pick the analysis framework for your slide
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            <div className="text-3xl mb-3">{fw.icon}</div>
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
