"use client";

import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FrameworkType } from "@/lib/types";

interface DownloadButtonProps {
  slideRef: React.RefObject<HTMLDivElement | null>;
  framework: FrameworkType;
  disabled?: boolean;
}

export default function DownloadButton({
  slideRef,
  framework,
  disabled = false,
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const downloadingRef = useRef(false);

  const handleDownload = useCallback(async () => {
    if (!slideRef.current || downloadingRef.current) return;
    downloadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const canvas = await html2canvas(slideRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#FFFFFF",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      pdf.save(`conextlab-${framework}-${timestamp}.pdf`);
    } catch {
      setError(
        "Download failed. Check your browser settings and try again."
      );
    } finally {
      setLoading(false);
      downloadingRef.current = false;
    }
  }, [slideRef, framework]);

  return (
    <div className="w-full">
      {error && (
        <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => {
              setError(null);
              handleDownload();
            }}
            className="text-red-700 font-semibold underline text-sm ml-3 flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={disabled || loading}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
          disabled || loading
            ? "bg-hairline text-muted-2 cursor-not-allowed"
            : "bg-ink text-surface hover:bg-slate active:scale-[0.98]"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating PDF...
          </span>
        ) : (
          "Download PDF"
        )}
      </button>
    </div>
  );
}
