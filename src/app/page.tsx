"use client";

import { useState, useRef, useCallback } from "react";
import {
  FrameworkType,
  InputMode,
  FishboneData,
  ParetoData,
  SWOTData,
  FrameworkData,
  ValidationError,
  TemplateConfig,
  AIExtractionResult,
} from "@/lib/types";
import { getDefaultTemplate } from "@/lib/templates";
import { validateFrameworkData } from "@/lib/validation";
import { IconMode } from "@/components/icons";
import ErrorBoundary from "@/components/error-boundary";
import FrameworkPicker from "@/components/framework-picker";
import InputModeToggle from "@/components/input-mode-toggle";
import IconModeToggle from "@/components/icon-mode-toggle";
import AIInput from "@/components/ai-input";
import FishboneForm from "@/components/forms/fishbone-form";
import ParetoForm from "@/components/forms/pareto-form";
import SWOTForm from "@/components/forms/swot-form";
import TemplateSelector from "@/components/template-selector";
import ColorCustomizer from "@/components/color-customizer";
import FishbonePreview from "@/components/preview/fishbone-preview";
import ParetoPreview from "@/components/preview/pareto-preview";
import SWOTPreview from "@/components/preview/swot-preview";
import SlideShell from "@/components/slide/slide-shell";
import DownloadButton from "@/components/download-button";

function getEmptyData(framework: FrameworkType): FrameworkData {
  switch (framework) {
    case "fishbone":
      return {
        problemStatement: "",
        categories: [
          { id: "man", name: "Man", causes: [""] },
          { id: "machine", name: "Machine", causes: [""] },
          { id: "method", name: "Method", causes: [""] },
          { id: "material", name: "Material", causes: [""] },
        ],
      } as FishboneData;
    case "pareto":
      return {
        title: "",
        items: [
          { id: "item-1", name: "", count: 0 },
          { id: "item-2", name: "", count: 0 },
          { id: "item-3", name: "", count: 0 },
        ],
      } as ParetoData;
    case "swot":
      return {
        title: "",
        strengths: [""],
        weaknesses: [""],
        opportunities: [""],
        threats: [""],
      } as SWOTData;
  }
}

function getTitle(data: FrameworkData, framework: FrameworkType): string {
  switch (framework) {
    case "fishbone":
      return (data as FishboneData).problemStatement || "Fishbone Diagram";
    case "pareto":
      return (data as ParetoData).title || "Pareto Chart";
    case "swot":
      return (data as SWOTData).title || "SWOT Analysis";
  }
}

function computeSwotWarnings(data: SWOTData): string[] {
  const warnings: string[] = [];
  const quadrants: {
    key: "strengths" | "weaknesses" | "opportunities" | "threats";
    label: string;
  }[] = [
    { key: "strengths", label: "Strengths" },
    { key: "weaknesses", label: "Weaknesses" },
    { key: "opportunities", label: "Opportunities" },
    { key: "threats", label: "Threats" },
  ];
  for (const q of quadrants) {
    const items = data[q.key] as string[];
    if (items.length === 0 || items.every((s) => !s.trim())) {
      warnings.push(
        `${q.label} quadrant is empty — your slide will still generate`
      );
    }
  }
  return warnings;
}

function HomeInner() {
  const [framework, setFramework] = useState<FrameworkType | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("manual");
  const [data, setData] = useState<FrameworkData | null>(null);
  const [template, setTemplate] = useState<TemplateConfig | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [swotWarnings, setSwotWarnings] = useState<string[]>([]);
  const [showDataLossWarning, setShowDataLossWarning] = useState(false);
  const [pendingFramework, setPendingFramework] =
    useState<FrameworkType | null>(null);
  const [iconMode, setIconMode] = useState<IconMode>("emoji");
  const slideRef = useRef<HTMLDivElement>(null);

  const hasUserData = useCallback((): boolean => {
    if (!data || !framework) return false;
    switch (framework) {
      case "fishbone": {
        const fb = data as FishboneData;
        return (
          fb.problemStatement.trim().length > 0 ||
          fb.categories.some(
            (c) => c.causes.length > 0 && c.causes.some((s) => s.trim())
          )
        );
      }
      case "pareto": {
        const p = data as ParetoData;
        return (
          p.title.trim().length > 0 ||
          p.items.some((i) => i.name.trim() || i.count > 0)
        );
      }
      case "swot": {
        const s = data as SWOTData;
        return (
          s.title.trim().length > 0 ||
          [s.strengths, s.weaknesses, s.opportunities, s.threats].some(
            (arr) => arr.length > 0 && arr.some((item) => item.trim())
          )
        );
      }
    }
  }, [data, framework]);

  const switchFramework = useCallback(
    (fw: FrameworkType) => {
      setFramework(fw);
      const empty = getEmptyData(fw);
      setData(empty);
      setTemplate(getDefaultTemplate(fw));
      setValidationErrors([]);
      setSwotWarnings([]);
      setInputMode("manual");
      setShowDataLossWarning(false);
      setPendingFramework(null);
    },
    []
  );

  const handleFrameworkSelect = useCallback(
    (fw: FrameworkType) => {
      if (framework && framework !== fw && hasUserData()) {
        setPendingFramework(fw);
        setShowDataLossWarning(true);
        return;
      }
      switchFramework(fw);
    },
    [framework, hasUserData, switchFramework]
  );

  const handleDataChange = useCallback(
    (newData: FrameworkData) => {
      setData(newData);

      if (framework) {
        const result = validateFrameworkData(framework, newData);
        setValidationErrors(result.valid ? [] : result.errors);

        if (framework === "swot") {
          setSwotWarnings(computeSwotWarnings(newData as SWOTData));
        } else {
          setSwotWarnings([]);
        }
      }
    },
    [framework]
  );

  const handleAIResult = useCallback(
    (result: AIExtractionResult) => {
      if (result.data && framework) {
        setData(result.data);
        setInputMode("manual");
        const validation = validateFrameworkData(framework, result.data);
        setValidationErrors(validation.valid ? [] : validation.errors);

        if (framework === "swot") {
          setSwotWarnings(computeSwotWarnings(result.data as SWOTData));
        } else {
          setSwotWarnings([]);
        }

        if (result.confidence === "low" && result.note) {
          setSwotWarnings((prev) => [...prev, result.note!]);
        }
      }
    },
    [framework]
  );

  const handleTemplateSelect = useCallback((tpl: TemplateConfig) => {
    setTemplate(tpl);
  }, []);

  const handleColorChange = useCallback(
    (newColors: TemplateConfig["colors"]) => {
      if (template) {
        setTemplate({ ...template, colors: newColors });
      }
    },
    [template]
  );

  const hasValidationErrors = validationErrors.length > 0;
  const canDownload = data !== null && !hasValidationErrors;

  return (
    <main className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-hairline">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/conextlab-logo.png"
              alt="ConextLab"
              className="w-7 h-7 rounded-lg"
            />
            <span className="font-bold text-ink tracking-tight text-lg">
              Conext<span className="text-blue">Lab</span>
            </span>
          </div>
          <span className="text-xs font-mono text-muted uppercase tracking-wider">
            Slide Builder
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Data loss warning modal */}
        {showDataLossWarning && (
          <section>
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200">
              <h3 className="font-bold text-amber-900 text-lg mb-2">
                Switch framework?
              </h3>
              <p className="text-amber-800 text-sm mb-4">
                Switching frameworks will discard your current data. Are you
                sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => switchFramework(pendingFramework!)}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors"
                >
                  Yes, switch
                </button>
                <button
                  onClick={() => {
                    setShowDataLossWarning(false);
                    setPendingFramework(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border-2 border-amber-300 text-amber-800 font-semibold text-sm hover:bg-amber-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 1: Framework Picker */}
        <section>
          <FrameworkPicker
            selected={framework}
            onSelect={handleFrameworkSelect}
            iconMode={iconMode}
          />
        </section>

        {framework && (
          <>
            {/* Step 2: Input Mode */}
            <section>
              <InputModeToggle mode={inputMode} onChange={setInputMode} />
            </section>

            {/* Step 3: Input */}
            <section>
              {inputMode === "ai" ? (
                <AIInput
                  framework={framework}
                  onResult={handleAIResult}
                />
              ) : (
                <>
                  {framework === "fishbone" && (
                    <FishboneForm
                      data={data as FishboneData}
                      onChange={handleDataChange}
                      onValidation={setValidationErrors}
                    />
                  )}
                  {framework === "pareto" && (
                    <ParetoForm
                      data={data as ParetoData}
                      onChange={handleDataChange}
                      onValidation={setValidationErrors}
                    />
                  )}
                  {framework === "swot" && (
                    <SWOTForm
                      data={data as SWOTData}
                      onChange={handleDataChange}
                      onValidation={setValidationErrors}
                    />
                  )}
                </>
              )}
            </section>

            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <section>
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <h3 className="font-bold text-red-800 text-sm mb-2">
                    Please fix the following:
                  </h3>
                  <ul className="space-y-1">
                    {validationErrors.map((err, i) => (
                      <li
                        key={i}
                        className="text-sm text-red-700 flex items-start gap-2"
                      >
                        <span className="mt-0.5">•</span>
                        {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* SWOT warnings */}
            {swotWarnings.length > 0 && !hasValidationErrors && (
              <section>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <h3 className="font-bold text-amber-800 text-sm mb-2">
                    Note:
                  </h3>
                  <ul className="space-y-1">
                    {swotWarnings.map((w, i) => (
                      <li
                        key={i}
                        className="text-sm text-amber-700 flex items-start gap-2"
                      >
                        <span className="mt-0.5">•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Step 4: Template & Color */}
            {template && (
              <section className="space-y-6">
                <TemplateSelector
                  framework={framework}
                  selected={template}
                  onSelect={handleTemplateSelect}
                />
                <IconModeToggle mode={iconMode} onChange={setIconMode} />
                <ColorCustomizer
                  colors={template.colors}
                  onChange={handleColorChange}
                />
              </section>
            )}

            {/* Step 5: Preview */}
            {data && template && (
              <section>
                <h2 className="text-xl font-bold text-ink mb-4 tracking-tight">
                  Preview
                </h2>
                <SlideShell
                  ref={slideRef}
                  title={getTitle(data, framework)}
                  template={template}
                >
                  {framework === "fishbone" && (
                    <FishbonePreview
                      data={data as FishboneData}
                      template={template}
                    />
                  )}
                  {framework === "pareto" && (
                    <ParetoPreview
                      data={data as ParetoData}
                      template={template}
                    />
                  )}
                  {framework === "swot" && (
                    <SWOTPreview
                      data={data as SWOTData}
                      template={template}
                      iconMode={iconMode}
                    />
                  )}
                </SlideShell>
              </section>
            )}

            {/* Step 6: Download */}
            <section>
              <DownloadButton
                slideRef={slideRef}
                framework={framework}
                disabled={!canDownload}
              />
            </section>
          </>
        )}

        {/* Empty state */}
        {!framework && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-ink mb-2">
              Select a framework to get started
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Pick Fishbone, Pareto, or SWOT above. Fill in your data manually
              or use AI to extract it from your notes. Customize the look, then
              download as PDF.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-hairline mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-muted-2 font-mono">
            ConextLab Slide Builder
          </span>
          <span className="text-xs font-bold text-ink tracking-tight">
            Conext<span className="text-blue">Lab.</span>
          </span>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <HomeInner />
    </ErrorBoundary>
  );
}
