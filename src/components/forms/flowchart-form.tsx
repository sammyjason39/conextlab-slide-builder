"use client";

import { FlowchartData, ValidationError } from "@/lib/types";
import { validateFlowchart } from "@/lib/validation";
import { VENDING_MACHINE_FLOWCHART } from "@/lib/examples";
import { useEffect } from "react";

interface FlowchartFormProps {
  data: FlowchartData;
  onChange: (data: FlowchartData) => void;
  onValidation: (errors: ValidationError[]) => void;
}

let nextNodeId = 100;

export default function FlowchartForm({
  data,
  onChange,
  onValidation,
}: FlowchartFormProps) {
  useEffect(() => {
    const result = validateFlowchart(data);
    onValidation(result.valid ? [] : result.errors);
  }, [data, onValidation]);

  const commit = (next: FlowchartData) => {
    onChange(next);
    const result = validateFlowchart(next);
    onValidation(result.valid ? [] : result.errors);
  };

  const updateTitle = (val: string) => {
    commit({ ...data, title: val });
  };

  const updateNode = (idx: number, field: string, val: string) => {
    const nodes = [...data.nodes];
    nodes[idx] = { ...nodes[idx], [field]: val };
    commit({ ...data, nodes });
  };

  const addNode = () => {
    commit({
      ...data,
      nodes: [
        ...data.nodes,
        { id: `n-${nextNodeId++}`, label: "", type: "process" },
      ],
    });
  };

  const removeNode = (idx: number) => {
    const nodeId = data.nodes[idx].id;
    commit({
      ...data,
      nodes: data.nodes.filter((_, i) => i !== idx),
      edges: data.edges.filter((e) => e.from !== nodeId && e.to !== nodeId),
    });
  };

  const updateEdge = (idx: number, field: string, val: string) => {
    const edges = [...data.edges];
    edges[idx] = { ...edges[idx], [field]: val };
    commit({ ...data, edges });
  };

  const defaultEdgeFrom = () => {
    const decision = [...data.nodes]
      .reverse()
      .find(
        (n) =>
          n.type === "decision" &&
          data.edges.filter((e) => e.from === n.id).length < 2
      );
    if (decision) return decision.id;
    return data.nodes[data.nodes.length - 2]?.id || data.nodes[0]?.id || "";
  };

  const addEdge = () => {
    const from = defaultEdgeFrom();
    const usedTargets = new Set(
      data.edges.filter((e) => e.from === from).map((e) => e.to)
    );
    const to =
      data.nodes.find((n) => n.id !== from && !usedTargets.has(n.id))?.id ||
      data.nodes[data.nodes.length - 1]?.id ||
      "";
    const existingFrom = data.edges.filter((e) => e.from === from);
    const label =
      data.nodes.find((n) => n.id === from)?.type === "decision"
        ? existingFrom.length === 0
          ? "Yes"
          : existingFrom.length === 1
            ? "No"
            : ""
        : "";
    commit({
      ...data,
      edges: [...data.edges, { from, to, label }],
    });
  };

  const removeEdge = (idx: number) => {
    commit({ ...data, edges: data.edges.filter((_, i) => i !== idx) });
  };

  const addYesNoBranch = (decisionId: string) => {
    const existing = data.edges.filter((e) => e.from === decisionId);
    const hasYes = existing.some((e) => (e.label || "").toLowerCase() === "yes");
    const hasNo = existing.some((e) => (e.label || "").toLowerCase() === "no");
    if (existing.length >= 2 && hasYes && hasNo) return;

    const nodes = [...data.nodes];
    const edges = [...data.edges];

    const ensureBranch = (label: string, fallbackLabel: string) => {
      if (existing.some((e) => (e.label || "").toLowerCase() === label.toLowerCase())) {
        return;
      }
      const nodeId = `n-${nextNodeId++}`;
      nodes.push({ id: nodeId, label: fallbackLabel, type: "process" });
      edges.push({ from: decisionId, to: nodeId, label });
    };

    if (!hasYes) ensureBranch("Yes", "Yes path");
    if (!hasNo) ensureBranch("No", "No path");

    commit({ ...data, nodes, edges });
  };

  const loadVendingExample = () => {
    nextNodeId = 200;
    commit({
      title: VENDING_MACHINE_FLOWCHART.title,
      nodes: VENDING_MACHINE_FLOWCHART.nodes.map((n) => ({ ...n })),
      edges: VENDING_MACHINE_FLOWCHART.edges.map((e) => ({ ...e })),
    });
  };

  const outgoingCount = (id: string) =>
    data.edges.filter((e) => e.from === id).length;

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

      <div className="p-4 rounded-xl border border-blue/20 bg-blue-soft/30 space-y-3">
        <p className="text-sm text-ink font-semibold">How to create a branch</p>
        <p className="text-sm text-muted leading-relaxed">
          1. Add a <span className="font-semibold text-ink">Decision</span> node
          (diamond). 2. Add two outcome nodes. 3. Connect the decision to both
          with edges labeled <span className="font-semibold text-ink">Yes</span>{" "}
          and <span className="font-semibold text-ink">No</span>. Or click{" "}
          <span className="font-semibold text-ink">+ Yes/No branch</span> on a
          decision, or load the vending machine example.
        </p>
        <button
          type="button"
          onClick={loadVendingExample}
          className="px-4 py-2 rounded-xl bg-blue text-surface text-sm font-semibold hover:bg-blue/90 transition-colors"
        >
          Load vending machine example
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-ink mb-3">Nodes (Steps)</h3>
        <div className="space-y-2">
          {data.nodes.map((node, idx) => (
            <div key={node.id} className="flex flex-wrap items-center gap-2">
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
                className="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
              />
              {node.type === "decision" && (
                <button
                  type="button"
                  onClick={() => addYesNoBranch(node.id)}
                  className="px-3 py-2 rounded-xl border-2 border-blue/30 text-blue text-xs font-semibold hover:bg-blue-soft/50 transition-colors"
                >
                  + Yes/No branch
                </button>
              )}
              {node.type === "decision" && outgoingCount(node.id) < 2 && (
                <span className="text-xs text-amber-600">Needs 2 branches</span>
              )}
              <button
                type="button"
                onClick={() => removeNode(idx)}
                className="px-2 text-muted hover:text-red-500 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addNode}
          className="mt-2 text-sm text-blue font-semibold hover:underline"
        >
          + Add node
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-ink mb-3">Edges (Connections)</h3>
        <p className="text-xs text-muted mb-3">
          From → To. For decisions, label one edge Yes and the other No.
        </p>
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
                placeholder="Yes/No"
                className="w-24 px-2 py-2.5 rounded-xl border-2 border-hairline bg-surface text-ink placeholder:text-muted-2 focus:border-blue focus:outline-none transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => removeEdge(idx)}
                className="px-2 text-muted hover:text-red-500 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addEdge}
          className="mt-2 text-sm text-blue font-semibold hover:underline"
        >
          + Add edge
        </button>
      </div>
    </div>
  );
}
