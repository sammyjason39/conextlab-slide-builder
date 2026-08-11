"use client";

import { useState, useRef, useCallback } from "react";
import {
  FrameworkType,
  InputMode,
  FishboneData,
  ParetoData,
  SWOTData,
  FiveWhyData,
  SCurveData,
  MatrixData,
  FlowchartData,
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
import FiveWhyForm from "@/components/forms/fivewhy-form";
import SCurveForm from "@/components/forms/scurve-form";
import MatrixForm from "@/components/forms/matrix-form";
import FlowchartForm from "@/components/forms/flowchart-form";
import TemplateSelector from "@/components/template-selector";
import ColorCustomizer from "@/components/color-customizer";
import FishbonePreview from "@/components/preview/fishbone-preview";
import ParetoPreview from "@/components/preview/pareto-preview";
import SWOTPreview from "@/components/preview/swot-preview";
import FiveWhyPreview from "@/components/preview/fivewhy-preview";
import SCurvePreview from "@/components/preview/scurve-preview";
import MatrixPreview from "@/components/preview/matrix-preview";
import FlowchartPreview from "@/components/preview/flowchart-preview";
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
    case "5why":
      return {
        problemStatement: "",
        whys: [
          { id: "why-1", question: "", answer: "" },
          { id: "why-2", question: "", answer: "" },
          { id: "why-3", question: "", answer: "" },
          { id: "why-4", question: "", answer: "" },
          { id: "why-5", question: "", answer: "" },
        ],
      } as FiveWhyData;
    case "scurve":
      return {
        title: "",
        plan: [
          { month: "Jan", value: 0 },
          { month: "Feb", value: 0 },
          { month: "Mar", value: 0 },
          { month: "Apr", value: 0 },
          { month: "May", value: 0 },
          { month: "Jun", value: 0 },
        ],
        actual: [
          { month: "Jan", value: 0 },
          { month: "Feb", value: 0 },
          { month: "Mar", value: 0 },
          { month: "Apr", value: 0 },
          { month: "May", value: 0 },
          { month: "Jun", value: 0 },
        ],
      } as SCurveData;
    case "matrix":
      return {
        title: "",
        items: [
          { id: "m-1", name: "", impact: 5, effort: 5 },
          { id: "m-2", name: "", impact: 5, effort: 5 },
          { id: "m-3", name: "", impact: 5, effort: 5 },
          { id: "m-4", name: "", impact: 5, effort: 5 },
        ],
      } as MatrixData;
    case "flowchart":
      return {
        title: "",
        nodes: [
          { id: "n-1", label: "", type: "start" },
          { id: "n-2", label: "", type: "process" },
          { id: "n-3", label: "", type: "decision" },
          { id: "n-4", label: "", type: "end" },
        ],
        edges: [
          { from: "n-1", to: "n-2", label: "" },
          { from: "n-2", to: "n-3", label: "" },
          { from: "n-3", to: "n-4", label: "Yes" },
        ],
      } as FlowchartData;
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
    case "5why":
      return (data as FiveWhyData).problemStatement || "5-Why Analysis";
    case "scurve":
      return (data as SCurveData).title || "S-Curve";
    case "matrix":
      return (data as MatrixData).title || "Impact-Effort Matrix";
    case "flowchart":
      return (data as FlowchartData).title || "Flowchart";
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
      case "5why": {
        const d = data as FiveWhyData;
        return (
          d.problemStatement.trim().length > 0 ||
          d.whys.some((w) => w.question.trim() || w.answer.trim())
        );
      }
      case "scurve": {
        const d = data as SCurveData;
        return (
          d.title.trim().length > 0 ||
          d.plan.some((p) => p.value > 0) ||
          d.actual.some((a) => a.value > 0)
        );
      }
      case "matrix": {
        const d = data as MatrixData;
        return (
          d.title.trim().length > 0 ||
          d.items.some((i) => i.name.trim())
        );
      }
      case "flowchart": {
        const d = data as FlowchartData;
        return (
          d.title.trim().length > 0 ||
          d.nodes.some((n) => n.label.trim())
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

  const renderForm = () => {
    if (!framework) return null;
    switch (framework) {
      case "fishbone":
        return (
          <FishboneForm
            data={data as FishboneData}
            onChange={handleDataChange}
            onValidation={setValidationErrors}
          />
        );
      case "pareto":
        return (
          <ParetoForm
            data={data as ParetoData}
            onChange={handleDataChange}
            onValidation={setValidationErrors}
          />
        );
      case "swot":
        return (
          <SWOTForm
            data={data as SWOTData}
            onChange={handleDataChange}
            onValidation={setValidationErrors}
          />
        );
      case "5why":
        return (
          <FiveWhyForm
            data={data as FiveWhyData}
            onChange={handleDataChange}
            onValidation={setValidationErrors}
          />
        );
      case "scurve":
        return (
          <SCurveForm
            data={data as SCurveData}
            onChange={handleDataChange}
            onValidation={setValidationErrors}
          />
        );
      case "matrix":
        return (
          <MatrixForm
            data={data as MatrixData}
            onChange={handleDataChange}
            onValidation={setValidationErrors}
          />
        );
      case "flowchart":
        return (
          <FlowchartForm
            data={data as FlowchartData}
            onChange={handleDataChange}
            onValidation={setValidationErrors}
          />
        );
    }
  };

  const renderPreview = () => {
    if (!framework || !data || !template) return null;
    switch (framework) {
      case "fishbone":
        return (
          <FishbonePreview
            data={data as FishboneData}
            template={template}
          />
        );
      case "pareto":
        return (
          <ParetoPreview
            data={data as ParetoData}
            template={template}
          />
        );
      case "swot":
        return (
          <SWOTPreview
            data={data as SWOTData}
            template={template}
            iconMode={iconMode}
          />
        );
      case "5why":
        return (
          <FiveWhyPreview
            data={data as FiveWhyData}
            template={template}
          />
        );
      case "scurve":
        return (
          <SCurvePreview
            data={data as SCurveData}
            template={template}
          />
        );
      case "matrix":
        return (
          <MatrixPreview
            data={data as MatrixData}
            template={template}
          />
        );
      case "flowchart":
        return (
          <FlowchartPreview
            data={data as FlowchartData}
            template={template}
          />
        );
    }
  };

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
                renderForm()
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
                  {renderPreview()}
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
              Pick from 7 frameworks above. Fill in your data manually
              or use AI to extract it from your notes. Customize the look, then
              download as PNG or PDF.
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
