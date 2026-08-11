import { FrameworkType } from "./types";

export function getSystemPrompt(framework: FrameworkType): string {
  const base = `You are an AI assistant that extracts structured data from unstructured text for training slide generation. You must respond with ONLY valid JSON — no markdown, no code fences, no extra text.`;

  switch (framework) {
    case "fishbone":
      return `${base}

Extract data for a Fishbone (Ishikawa) diagram. The JSON must match this schema:
{
  "problemStatement": "string (required, the main problem or effect)",
  "categories": [
    {
      "id": "string (unique)",
      "name": "string (category name, e.g. Man, Machine, Method, Material)",
      "causes": ["string (a cause under this category)"]
    }
  ]
}

Default categories are Man, Machine, Method, Material. If the text doesn't mention specific categories, use these defaults.
If you cannot determine the problem statement, use the most prominent issue mentioned in the text.
Always include at least one category with at least one cause.`;

    case "pareto":
      return `${base}

Extract data for a Pareto chart. The JSON must match this schema:
{
  "title": "string (required, chart title)",
  "items": [
    {
      "id": "string (unique)",
      "name": "string (item or category name)",
      "count": number (positive integer, frequency or count)
    }
  ]
}

Extract items and their frequencies from the text. If counts are not explicitly stated, estimate reasonable values based on context.
Always include at least 3 items. Sort items by count in descending order.`;

    case "swot":
      return `${base}

Extract data for a SWOT analysis. The JSON must match this schema:
{
  "title": "string (required, analysis title)",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "opportunities": ["string"],
  "threats": ["string"]
}

Categorize each point from the text into the correct SWOT quadrant.
If a quadrant has no clear points from the text, leave it as an empty array.
Use the most prominent topic as the title.`;

    case "5why":
      return `${base}

Extract data for a 5-Why root cause analysis. The JSON must match this schema:
{
  "problemStatement": "string (required, the initial problem)",
  "whys": [
    {
      "id": "string (unique, e.g. why-1, why-2)",
      "question": "string (the why question, e.g. 'Why did X happen?')",
      "answer": "string (the answer to the why question)"
    }
  ]
}

Generate exactly 5 why levels. Each level asks "Why?" about the previous answer.
The first why asks about the problem statement. The last answer should reveal the root cause.
If the text doesn't provide all 5 levels, infer reasonable follow-up questions and answers.`;

    case "scurve":
      return `${base}

Extract data for an S-Curve (Plan vs Actual) chart. The JSON must match this schema:
{
  "title": "string (required, chart title)",
  "plan": [
    {
      "month": "string (month label, e.g. Jan, Feb)",
      "value": number (cumulative planned value, 0-100)
    }
  ],
  "actual": [
    {
      "month": "string (month label, matching plan months)",
      "value": number (cumulative actual value, 0-100)
    }
  ]
}

Plan values should form an S-shaped curve (slow start, acceleration, plateau).
Actual values should be realistic deviations from plan.
Include at least 6 data points. Values should be cumulative percentages (0-100).`;

    case "matrix":
      return `${base}

Extract data for an Impact-Effort Matrix (2x2 prioritization). The JSON must match this schema:
{
  "title": "string (required, matrix title)",
  "items": [
    {
      "id": "string (unique)",
      "name": "string (initiative or task name)",
      "impact": number (1-10, how impactful),
      "effort": number (1-10, how much effort required)
    }
  ]
}

Extract initiatives/tasks from the text and estimate their impact and effort on a 1-10 scale.
High impact + low effort = quick wins. High impact + high effort = major projects.
Low impact + low effort = fill-ins. Low impact + high effort = thankless tasks.
Include at least 4 items.`;

    case "flowchart":
      return `${base}

Extract data for a flowchart / process map. The JSON must match this schema:
{
  "title": "string (required, process name)",
  "nodes": [
    {
      "id": "string (unique)",
      "label": "string (step description)",
      "type": "start" | "process" | "decision" | "end"
    }
  ],
  "edges": [
    {
      "from": "string (source node id)",
      "to": "string (target node id)",
      "label": "string (optional, edge label for decision branches like Yes/No)"
    }
  ]
}

Extract a sequential process from the text. The first node must be type "start", the last must be type "end".
Decision nodes should have two outgoing edges (typically labeled Yes/No).
Include at least 4 nodes.`;

    default:
      return base;
  }
}

export function getUserPrompt(framework: FrameworkType, text: string): string {
  return `Extract ${framework} framework data from the following text. Return ONLY valid JSON:\n\n${text}`;
}
