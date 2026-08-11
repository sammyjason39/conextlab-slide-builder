import {
  FishboneData,
  ParetoData,
  SWOTData,
  FiveWhyData,
  SCurveData,
  MatrixData,
  FlowchartData,
  FrameworkData,
  ValidationResult,
  FrameworkType,
} from "./types";

export function validateFishbone(data: FishboneData): ValidationResult {
  const errors = [];

  if (!data.problemStatement || data.problemStatement.trim().length === 0) {
    errors.push({
      field: "problemStatement",
      message: "A problem statement is required before generating the slide",
    });
  }

  if (data.problemStatement && data.problemStatement.length > 200) {
    errors.push({
      field: "problemStatement",
      message: "Problem statement must be under 200 characters",
    });
  }

  const hasAnyCause = data.categories.some(
    (cat) =>
      cat.causes.length > 0 && cat.causes.some((c) => c.trim().length > 0)
  );

  if (!hasAnyCause) {
    errors.push({
      field: "categories",
      message: "Add at least one cause to any category before generating",
    });
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export function validatePareto(data: ParetoData): ValidationResult {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push({
      field: "title",
      message: "A title is required before generating the slide",
    });
  }

  if (data.title && data.title.length > 200) {
    errors.push({
      field: "title",
      message: "Title must be under 200 characters",
    });
  }

  const validItems = data.items.filter((item) => item.name.trim().length > 0);

  if (validItems.length < 3) {
    errors.push({
      field: "items",
      message: "Enter at least 3 items for a meaningful Pareto chart",
    });
  }

  for (const item of data.items) {
    if (item.name.trim().length > 0) {
      if (typeof item.count !== "number" || isNaN(item.count)) {
        errors.push({
          field: `item-${item.id}`,
          message: `Count for "${item.name}" must be a number`,
        });
      } else if (item.count <= 0) {
        errors.push({
          field: `item-${item.id}`,
          message: `Count for "${item.name}" must be a positive number`,
        });
      }
    }
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateSWOT(data: SWOTData): ValidationResult {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push({
      field: "title",
      message: "A title is required before generating the slide",
    });
  }

  if (data.title && data.title.length > 200) {
    errors.push({
      field: "title",
      message: "Title must be under 200 characters",
    });
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateFiveWhy(data: FiveWhyData): ValidationResult {
  const errors = [];

  if (!data.problemStatement || data.problemStatement.trim().length === 0) {
    errors.push({
      field: "problemStatement",
      message: "A problem statement is required",
    });
  }

  if (data.problemStatement && data.problemStatement.length > 200) {
    errors.push({
      field: "problemStatement",
      message: "Problem statement must be under 200 characters",
    });
  }

  const filledWhys = data.whys.filter(
    (w) => w.question.trim() || w.answer.trim()
  );

  if (filledWhys.length < 2) {
    errors.push({
      field: "whys",
      message: "Fill at least 2 why levels for a meaningful analysis",
    });
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateSCurve(data: SCurveData): ValidationResult {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push({
      field: "title",
      message: "A title is required before generating the slide",
    });
  }

  if (data.title && data.title.length > 200) {
    errors.push({
      field: "title",
      message: "Title must be under 200 characters",
    });
  }

  const validPlan = data.plan.filter((p) => p.month.trim() && p.value > 0);
  if (validPlan.length < 2) {
    errors.push({
      field: "plan",
      message: "Add at least 2 plan data points",
    });
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateMatrix(data: MatrixData): ValidationResult {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push({
      field: "title",
      message: "A title is required before generating the slide",
    });
  }

  if (data.title && data.title.length > 200) {
    errors.push({
      field: "title",
      message: "Title must be under 200 characters",
    });
  }

  const validItems = data.items.filter((i) => i.name.trim());
  if (validItems.length < 2) {
    errors.push({
      field: "items",
      message: "Add at least 2 items for a meaningful matrix",
    });
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateFlowchart(data: FlowchartData): ValidationResult {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push({
      field: "title",
      message: "A title is required before generating the slide",
    });
  }

  if (data.title && data.title.length > 200) {
    errors.push({
      field: "title",
      message: "Title must be under 200 characters",
    });
  }

  if (data.nodes.length < 2) {
    errors.push({
      field: "nodes",
      message: "Add at least 2 nodes for a meaningful flowchart",
    });
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateFrameworkData(
  framework: FrameworkType,
  data: FrameworkData
): ValidationResult {
  switch (framework) {
    case "fishbone":
      return validateFishbone(data as FishboneData);
    case "pareto":
      return validatePareto(data as ParetoData);
    case "swot":
      return validateSWOT(data as SWOTData);
    case "5why":
      return validateFiveWhy(data as FiveWhyData);
    case "scurve":
      return validateSCurve(data as SCurveData);
    case "matrix":
      return validateMatrix(data as MatrixData);
    case "flowchart":
      return validateFlowchart(data as FlowchartData);
    default:
      return {
        valid: false,
        errors: [{ field: "framework", message: "Unknown framework type" }],
      };
  }
}
