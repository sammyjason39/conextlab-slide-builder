import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSystemPrompt, getUserPrompt } from "@/lib/ai-prompts";
import { FrameworkType, AIExtractionResult, FrameworkData } from "@/lib/types";
import { validateFrameworkData } from "@/lib/validation";

const MAX_INPUT_LENGTH = 10000;
const API_TIMEOUT_MS = 30000;

const validFrameworks: FrameworkType[] = [
  "fishbone", "pareto", "swot", "5why", "scurve", "matrix", "flowchart",
];

function computeConfidence(
  framework: FrameworkType,
  data: FrameworkData
): "high" | "medium" | "low" {
  switch (framework) {
    case "fishbone": {
      const fb = data as { problemStatement: string; categories: { causes: string[] }[] };
      if (!fb.problemStatement) return "low";
      const totalCauses = fb.categories.reduce(
        (sum, c) => sum + c.causes.filter((s: string) => s.trim()).length,
        0
      );
      if (totalCauses === 0) return "low";
      if (totalCauses < 3) return "medium";
      return "high";
    }
    case "pareto": {
      const p = data as { items: { name: string; count: number }[] };
      const valid = p.items.filter((i) => i.name.trim() && i.count > 0);
      if (valid.length < 3) return "low";
      if (valid.length < 5) return "medium";
      return "high";
    }
    case "swot": {
      const s = data as {
        strengths: string[]; weaknesses: string[];
        opportunities: string[]; threats: string[];
      };
      const filled = [s.strengths, s.weaknesses, s.opportunities, s.threats].filter(
        (arr) => arr.length > 0 && arr.some((item: string) => item.trim())
      ).length;
      if (filled < 2) return "low";
      if (filled < 4) return "medium";
      return "high";
    }
    case "5why": {
      const d = data as { problemStatement: string; whys: { question: string; answer: string }[] };
      if (!d.problemStatement) return "low";
      const filled = d.whys.filter((w) => w.answer.trim()).length;
      if (filled < 2) return "low";
      if (filled < 4) return "medium";
      return "high";
    }
    case "scurve": {
      const d = data as { plan: { value: number }[]; actual: { value: number }[] };
      const planFilled = d.plan.filter((p) => p.value > 0).length;
      const actualFilled = d.actual.filter((a) => a.value > 0).length;
      if (planFilled < 3) return "low";
      if (actualFilled < 2) return "medium";
      return "high";
    }
    case "matrix": {
      const d = data as { items: { name: string }[] };
      const valid = d.items.filter((i) => i.name.trim()).length;
      if (valid < 2) return "low";
      if (valid < 4) return "medium";
      return "high";
    }
    case "flowchart": {
      const d = data as { nodes: { label: string }[] };
      const valid = d.nodes.filter((n) => n.label.trim()).length;
      if (valid < 2) return "low";
      if (valid < 4) return "medium";
      return "high";
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { framework, text } = await request.json();

    if (!framework || !text) {
      return NextResponse.json(
        { success: false, error: "Framework and text are required" },
        { status: 400 }
      );
    }

    if (typeof text === "string" && text.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Input text exceeds the ${MAX_INPUT_LENGTH} character limit. Please shorten your text.`,
        },
        { status: 400 }
      );
    }

    if (!validFrameworks.includes(framework as FrameworkType)) {
      return NextResponse.json(
        { success: false, error: "Invalid framework type" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OLLAMA_API_KEY;
    const baseURL = process.env.OLLAMA_BASE_URL || "https://ollama.com/v1";
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI generation is not configured. Set OLLAMA_API_KEY in your environment.",
        },
        { status: 503 }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL,
      timeout: API_TIMEOUT_MS,
    });

    const systemPrompt = getSystemPrompt(framework as FrameworkType);
    const userPrompt = getUserPrompt(framework as FrameworkType, text);

    const completion = await openai.chat.completions.create({
      model: "deepseek-v4-pro:cloud",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      return NextResponse.json(
        { success: false, error: "AI returned an empty response" },
        { status: 500 }
      );
    }

    let parsed: unknown;
    try {
      const fencedMatch = rawContent.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
      const cleaned = fencedMatch
        ? fencedMatch[1].trim()
        : rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "AI response could not be parsed as valid JSON",
        },
        { status: 500 }
      );
    }

    const validation = validateFrameworkData(
      framework as FrameworkType,
      parsed as FrameworkData
    );

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI generated data that failed validation. Please try again with more detailed input.",
        },
        { status: 500 }
      );
    }

    const confidence = computeConfidence(
      framework as FrameworkType,
      parsed as FrameworkData
    );

    const result: AIExtractionResult = {
      success: true,
      data: parsed as FrameworkData,
      confidence,
      note:
        confidence === "low"
          ? "Some fields could not be determined. Please review and fill in missing data."
          : undefined,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
