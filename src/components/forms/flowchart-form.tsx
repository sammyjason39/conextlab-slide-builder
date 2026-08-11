"use client";

import { FlowchartData, ValidationError } from "@/lib/types";
import { validateFlowchart } from "@/lib/validation";
import { useEffect } from "react";

interface FlowchartFormProps {
  data: FlowchartData;
  onChange: (data: FlowchartData) => void;
  onValidation: (errors: ValidationError[]) => void;
}

let nextNodeId = 100;
let nextEdgeId = 100;

export default function FlowchartForm({ data, onChange, onValidation }: FlowchartFormProps) {
  useEffect(() => {
    const result = validateFlowchart(data);
    onValidation(result.valid ? [] : result.errors);
  }, [data, onValidation]);

  const updateTitle = (val: string) => {
    onChange({ ...data, title: val });
  };

  const updateNode = (idx: number, field: string, val: string) => {
    const nodes = [...data.nodes];
    nodes[idx] = { ...nodes[idx], [field]: val };
    onChange({ ...data, nodes });
  };

  const addNode = () => {
    onChange({
      ...data,
      nodes: [
        ...data.nodes,
        { id: `n-${nextNodeId++}`, label: "", type: "process" },
      ],
    });
  };

  const removeNode = (idx: number) => {
    const nodeId = data.nodes[idx].id;
    onChange({
      ...data,
      nodes: data.nodes.filter((_, i) => i !== idx),
      edges: data.edges.filter((e) => e.from !== nodeId && e.to !== nodeId),
    });
  };

  const updateEdge = (idx: number, field: string, val: string) => {
    const edges = [...data.edges];
    edges[idx] = { ...edges[idx], [field]: val };
    onChange({ ...data, edges });
  };

  const addEdge = () => {
    onChange({
      ...data,
      edges: [
        ...data.edges,
        { from: data.nodes[0]?.id || "", to: data.nodes[1]?.id || "", label: "" },
      ],
    });
  };

  const removeEdge = (idx: number) => {
    onChange({ ...data, edges: data.edges.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-ink mb-1.5">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="e.g. Customer Onboarding Process"
          maxLength={200}
          className="w-full px-4 py-3 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
        />
        <p className="text-xs text-muted mt-1">{data.title.length}/200</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-ink mb-3">Nodes (Steps)</h3>
        <div className="space-y-2">
          {data.nodes.map((node, idx) => (
            <div key={node.id} className="flex items-center gap-2">
              <select
                value={node.type}
                onChange={(e) => updateNode(idx, "type", e.target.value)}
                className="w-28 px-2 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink text-sm focus:border-blue focus:outline-none"
              >
                <option value="start">Start</option>
                <option value="process">Process</option>
                <option value="decision">Decision</option>
                <option value="end">End</option>
              </select>
              <input
                type="text"
                value={node.label}
                onChange={(e) => updateNode(idx, "label", e.target.value)}
                placeholder="Step label"
                className="flex-1 px-3 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
              />
              <button
                onClick={() => removeNode(idx)}
                className="px-2 text-muted hover:text-red-500 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addNode}
          className="mt-2 text-sm text-blue font-semibold hover:underline"
        >
          + Add node
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-ink mb-3">Edges (Connections)</h3>
        <div className="space-y-2">
          {data.edges.map((edge, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <select
                value={edge.from}
                onChange={(e) => updateEdge(idx, "from", e.target.value)}
                className="flex-1 px-2 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink text-sm focus:border-blue focus:outline-none"
              >
                {data.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label || n.id}
                  </option>
                ))}
              </select>
              <span className="text-muted text-sm">→</span>
              <select
                value={edge.to}
                onChange={(e) => updateEdge(idx, "to", e.target.value)}
                className="flex-1 px-2 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink text-sm focus:border-blue focus:outline-none"
              >
                {data.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label || n.id}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={edge.label || ""}
                onChange={(e) => updateEdge(idx, "label", e.target.value)}
                placeholder="Label"
                className="w-20 px-2 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
              />
              <button
                onClick={() => removeEdge(idx)}
                className="px-2 text-muted hover:text-red-500 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addEdge}
          className="mt-2 text-sm text-blue font-semibold hover:underline"
        >
          + Add edge
        </button>
      </div>
    </div>
  );
}
