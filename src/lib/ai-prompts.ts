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

    default:
      return base;
  }
}

export function getUserPrompt(framework: FrameworkType, text: string): string {
  return `Extract ${framework} framework data from the following text. Return ONLY valid JSON:\n\n${text}`;
}
