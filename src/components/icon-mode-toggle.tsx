"use client";

import { IconMode } from "@/components/icons";

interface IconModeToggleProps {
  mode: IconMode;
  onChange: (mode: IconMode) => void;
}

export default function IconModeToggle({ mode, onChange }: IconModeToggleProps) {
  const options: { value: IconMode; label: string }[] = [
    { value: "emoji", label: "Emoji" },
    { value: "icon", label: "Icon" },
    { value: "none", label: "None" },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">
        Icon style
      </h2>
      <p className="text-sm text-muted mb-4">
        Choose how icons appear in your slide
      </p>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
              mode === opt.value
                ? "border-blue bg-blue-soft/30 text-blue"
                : "border-hairline text-muted hover:border-hairline-2"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
