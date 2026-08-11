import { FrameworkType } from "@/lib/types";

export type IconMode = "emoji" | "icon" | "none";

export function FishboneIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="8" y1="8" x2="4" y2="4" />
      <line x1="16" y1="8" x2="20" y2="4" />
      <line x1="8" y1="16" x2="4" y2="20" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <circle cx="21" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function ParetoIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="14" width="3" height="7" rx="0.5" fill="currentColor" opacity="0.3" />
      <rect x="8" y="10" width="3" height="11" rx="0.5" fill="currentColor" opacity="0.5" />
      <rect x="13" y="6" width="3" height="15" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x="18" y="3" width="3" height="18" rx="0.5" fill="currentColor" />
      <polyline points="3,14 8,10 13,6 18,3" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  );
}

export function SWOTIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.15" />
      <rect x="13" y="2" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.15" />
      <rect x="2" y="13" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.15" />
      <rect x="13" y="13" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.15" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" opacity="0.3" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" opacity="0.3" />
    </svg>
  );
}

export function StrengthsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function WeaknessesIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
    </svg>
  );
}

export function OpportunitiesIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.15" />
      <line x1="12" y1="1" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function ThreatsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="currentColor" opacity="0.15" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
    </svg>
  );
}

export function getFrameworkIcon(
  framework: FrameworkType,
  mode: IconMode,
  size = 24
): React.ReactNode {
  if (mode === "none") return null;
  if (mode === "emoji") {
    switch (framework) {
      case "fishbone": return <span style={{ fontSize: size }}>🐟</span>;
      case "pareto": return <span style={{ fontSize: size }}>📊</span>;
      case "swot": return <span style={{ fontSize: size }}>🎯</span>;
    }
  }
  switch (framework) {
    case "fishbone": return <FishboneIcon size={size} />;
    case "pareto": return <ParetoIcon size={size} />;
    case "swot": return <SWOTIcon size={size} />;
  }
}

export function getSwotQuadrantIcon(
  quadrant: "strengths" | "weaknesses" | "opportunities" | "threats",
  mode: IconMode,
  size = 20
): React.ReactNode {
  if (mode === "none") return null;
  if (mode === "emoji") {
    switch (quadrant) {
      case "strengths": return <span style={{ fontSize: size }}>💪</span>;
      case "weaknesses": return <span style={{ fontSize: size }}>⚠️</span>;
      case "opportunities": return <span style={{ fontSize: size }}>🚀</span>;
      case "threats": return <span style={{ fontSize: size }}>🛡️</span>;
    }
  }
  switch (quadrant) {
    case "strengths": return <StrengthsIcon size={size} />;
    case "weaknesses": return <WeaknessesIcon size={size} />;
    case "opportunities": return <OpportunitiesIcon size={size} />;
    case "threats": return <ThreatsIcon size={size} />;
  }
}
