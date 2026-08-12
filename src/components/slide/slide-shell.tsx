"use client";

import { ReactNode, forwardRef } from "react";
import { TemplateConfig } from "@/lib/types";

interface SlideShellProps {
  title: string;
  children: ReactNode;
  template?: TemplateConfig;
}

const SlideShell = forwardRef<HTMLDivElement, SlideShellProps>(
  function SlideShell({ title, children, template }, ref) {
    const bg = template?.colors?.background ?? "#FFFFFF";
    const text = template?.colors?.text ?? "#0A0A0A";

    return (
      <div
        ref={ref}
        className="w-full rounded-2xl overflow-hidden border border-hairline flex flex-col [min-aspect-ratio:16/9]"
        style={{
          maxWidth: 960,
          height: "auto",
          backgroundColor: bg,
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{ backgroundColor: bg }}
        >
          <div className="flex items-center gap-2.5">
            <img
              src="/conextlab-logo.png"
              alt="ConextLab"
              className="w-6 h-6 rounded-md"
            />
            <span
              className="text-xs font-mono font-semibold uppercase tracking-wider"
              style={{ color: "#6B7280" }}
            >
              ConextLab
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: "#9CA3AF" }}>
            Training Slide
          </span>
        </div>

        <div
          className="w-full flex-shrink-0"
          style={{ height: 2, backgroundColor: "#0A0A0A" }}
        />

        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          <h2
            className="text-lg font-bold tracking-tight"
            style={{ color: text }}
          >
            {title}
          </h2>
        </div>

        <div className="px-6 pb-4 flex-1">{children}</div>

        <div
          className="px-6 py-2 flex justify-between items-center flex-shrink-0"
          style={{ borderTop: "1px solid #E5E7EB" }}
        >
          <span
            className="text-[10px] font-mono"
            style={{ color: "#9CA3AF" }}
          >
            Generated with ConextLab Slide Builder
          </span>
          <span
            className="text-[10px] font-extrabold tracking-tight"
            style={{ color: text }}
          >
            Conext<span style={{ color: "#1652F0" }}>Lab.</span>
          </span>
        </div>
      </div>
    );
  }
);

export default SlideShell;
