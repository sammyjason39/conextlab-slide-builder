import { FlowchartData } from "./types";

export const VENDING_MACHINE_FLOWCHART: FlowchartData = {
  title: "Vending Machine Algorithm",
  nodes: [
    { id: "vm-start", label: "Start", type: "start" },
    { id: "vm-coin", label: "Insert coin", type: "process" },
    { id: "vm-valid", label: "Coin valid?", type: "decision" },
    { id: "vm-reject", label: "Reject coin", type: "process" },
    { id: "vm-end-reject", label: "End", type: "end" },
    { id: "vm-select", label: "Select item", type: "process" },
    { id: "vm-avail", label: "Item available?", type: "decision" },
    { id: "vm-refund", label: "Refund coin", type: "process" },
    { id: "vm-end-refund", label: "End", type: "end" },
    { id: "vm-dispense", label: "Dispense item", type: "process" },
    { id: "vm-end-ok", label: "End", type: "end" },
  ],
  edges: [
    { from: "vm-start", to: "vm-coin" },
    { from: "vm-coin", to: "vm-valid" },
    { from: "vm-valid", to: "vm-select", label: "Yes" },
    { from: "vm-valid", to: "vm-reject", label: "No" },
    { from: "vm-reject", to: "vm-end-reject" },
    { from: "vm-select", to: "vm-avail" },
    { from: "vm-avail", to: "vm-dispense", label: "Yes" },
    { from: "vm-avail", to: "vm-refund", label: "No" },
    { from: "vm-refund", to: "vm-end-refund" },
    { from: "vm-dispense", to: "vm-end-ok" },
  ],
};
