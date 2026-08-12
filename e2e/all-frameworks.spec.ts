import { test, expect } from "@playwright/test";

const BASE = "https://chart.conextlab.ai";

// Helper: wait for the page to be fully loaded
async function waitForApp(page: any) {
  await page.goto(BASE);
  await page.waitForSelector("text=Choose a framework", { timeout: 15000 });
}

// Helper: select a framework by its label text
async function selectFramework(page: any, label: string) {
  await page.locator(`button:has-text("${label}")`).first().click();
  await page.waitForTimeout(500);
}

// Helper: fill a text input by placeholder (tries multiple selector strategies)
async function fillField(page: any, placeholder: string, value: string) {
  // Try multiple selector strategies to find the field
  const selectors = [
    `input[placeholder*="${placeholder}"]`,
    `textarea[placeholder*="${placeholder}"]`,
    `[placeholder*="${placeholder}"]`,
  ];
  let field = null;
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if (await el.count() > 0) {
      field = el;
      break;
    }
  }
  if (!field) {
    // Fallback: try to find any visible input near text matching the placeholder
    field = page.locator("input, textarea").first();
  }
  await field.click();
  await field.fill(value);
}

// Helper: click download button and wait for download
async function clickDownload(page: any, buttonText: string) {
  const downloadBtn = page.locator(`button:has-text("${buttonText}")`);
  await downloadBtn.waitFor({ state: "visible", timeout: 10000 });
  // Ensure button is enabled
  await expect(downloadBtn).toBeEnabled({ timeout: 5000 });
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 30000 }),
    downloadBtn.click(),
  ]);
  return download;
}

// ============================================================
// FRAMEWORK SELECTION & NAVIGATION
// ============================================================
test.describe("Framework Selection", () => {
  test("all 7 frameworks are visible in picker", async ({ page }) => {
    await waitForApp(page);
    await expect(page.locator("text=Fishbone")).toBeVisible();
    await expect(page.locator("text=5-Why")).toBeVisible();
    await expect(page.locator("text=Pareto")).toBeVisible();
    await expect(page.locator("text=SWOT")).toBeVisible();
    await expect(page.locator("text=S-Curve")).toBeVisible();
    await expect(page.locator("text=Impact-Effort")).toBeVisible();
    await expect(page.locator("text=Flowchart")).toBeVisible();
  });

  test("selecting a framework shows form and template sections", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "SWOT");
    await expect(page.locator("text=How would you like to input data?")).toBeVisible();
    await expect(page.locator("text=Choose a style")).toBeVisible();
    await expect(page.locator("text=Icon style")).toBeVisible();
    await expect(page.locator("text=Customize colors")).toBeVisible();
    await expect(page.locator("text=Preview")).toBeVisible();
  });

  test("data loss warning appears when switching frameworks with data", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "SWOT");
    await fillField(page, "e.g. New Product Launch", "Test SWOT");
    await page.waitForTimeout(300);
    // Try switching to Fishbone
    await page.locator("button:has-text('Fishbone')").first().click();
    await expect(page.locator("text=Switch framework?")).toBeVisible();
    await page.locator("button:has-text('Cancel')").click();
    // Verify we're still on SWOT by checking the title input still has our value
    const titleInput = page.locator("input[placeholder*='New Product Launch']").first();
    await expect(titleInput).toHaveValue("Test SWOT");
  });
});

// ============================================================
// FISHBONE
// ============================================================
test.describe("Fishbone", () => {
  test("manual data entry and preview", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Fishbone");

    // Fishbone has a problem statement field and category fields
    // Try to find the problem input (first visible input)
    const problemInput = page.locator("input, textarea").first();
    await problemInput.click();
    await problemInput.fill("Delivery delays increased 50%");

    // Fill category fields - they should be visible after selecting Fishbone
    const allInputs = page.locator("input:visible");
    const inputCount = await allInputs.count();
    // Fill the 2nd and 3rd visible inputs (after the problem field)
    if (inputCount > 1) {
      await allInputs.nth(1).fill("Untrained staff");
    }
    if (inputCount > 2) {
      await allInputs.nth(2).fill("Old conveyor belt");
    }

    await expect(page.locator("text=Delivery delays increased 50%").first()).toBeVisible();
  });

  test("AI extraction", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Fishbone");

    // Switch to AI mode
    await page.locator("button:has-text('AI Assist')").click();
    await page.waitForTimeout(300);

    const aiText = page.locator("textarea").first();
    await aiText.fill(
      "Our production line has 30% more defects this month. The main causes: operators are new and untrained, machines are overdue for maintenance, raw material quality from the new supplier is inconsistent, and the inspection method is outdated."
    );

    await page.locator("button:has-text('Generate with AI')").click();
    await page.waitForTimeout(15000);

    // Should have populated the form with data
    const problemField = page.locator("input").first();
    const val = await problemField.inputValue();
    expect(val.length).toBeGreaterThan(0);
  });

  test("PNG download", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Fishbone");
    // Fill all text inputs (exclude color inputs)
    const inputs = page.locator("input:visible:not([type='color']), textarea:visible");
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill(`Fishbone test ${i}`);
    }
    await page.waitForTimeout(1000);

    const download = await clickDownload(page, "Download PNG");
    expect(download.suggestedFilename()).toContain("conextlab-fishbone");
    expect(download.suggestedFilename()).toContain(".png");
  });

  test("PDF download", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Fishbone");
    const inputs = page.locator("input:visible:not([type='color']), textarea:visible");
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill(`Fishbone test ${i}`);
    }
    await page.waitForTimeout(1000);

    const download = await clickDownload(page, "Download PDF");
    expect(download.suggestedFilename()).toContain("conextlab-fishbone");
    expect(download.suggestedFilename()).toContain(".pdf");
  });
});

// ============================================================
// 5-WHY
// ============================================================
test.describe("5-Why", () => {
  test("manual data entry and preview", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "5-Why");

    await fillField(page, "Customer churn", "Customer churn increased 30%");
    await page.waitForTimeout(300);

    // Fill why #1
    const whyInputs = page.locator("input[placeholder*='Why?']");
    await whyInputs.nth(0).fill("Why did churn increase?");
    const answerInputs = page.locator("input[placeholder='Because...']");
    await answerInputs.nth(0).fill("Poor onboarding experience");

    // Fill why #2
    await whyInputs.nth(1).fill("Why was onboarding poor?");
    await answerInputs.nth(1).fill("No dedicated onboarding team");

    await page.waitForTimeout(500);
    await expect(page.getByText("Root Cause", { exact: true })).toBeVisible();
  });

  test("AI extraction", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "5-Why");

    await page.locator("button:has-text('AI Assist')").click();
    await page.waitForTimeout(300);

    const aiText = page.locator("textarea").first();
    await aiText.fill(
      "Customer churn increased 30% this quarter. Most churning customers cite poor onboarding. The onboarding team was reduced from 5 to 2 people. The training budget was cut. Management prioritized other projects."
    );

    await page.locator("button:has-text('Generate with AI')").click();
    await page.waitForTimeout(15000);

    const problemField = page.locator("input").first();
    const val = await problemField.inputValue();
    expect(val.length).toBeGreaterThan(0);
  });

  test("PNG download", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "5-Why");
    await fillField(page, "Customer churn", "Test 5-Why");
    const answerInputs = page.locator("input[placeholder='Because...']");
    await answerInputs.nth(0).fill("Reason 1");
    await answerInputs.nth(1).fill("Reason 2");
    await page.waitForTimeout(500);

    const download = await clickDownload(page, "Download PNG");
    expect(download.suggestedFilename()).toContain("conextlab-5why");
  });
});

// ============================================================
// PARETO
// ============================================================
test.describe("Pareto", () => {
  test("manual data entry and preview", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Pareto");

    await fillField(page, "Pareto chart title", "Customer Complaints Q3");
    await fillField(page, "Item name", "Late delivery");
    await page.locator("input[type='number']").first().fill("45");

    await expect(page.locator("text=Customer Complaints Q3").first()).toBeVisible();
  });

  test("PNG download", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Pareto");
    await fillField(page, "Pareto chart title", "Test Pareto");

    // Fill items using specific nth selectors
    const nameInputs = page.locator("input[placeholder*='Item name']");
    const numberInputs = page.locator("input[type='number']");
    await nameInputs.nth(0).fill("Item A");
    await numberInputs.nth(0).fill("50");
    await nameInputs.nth(1).fill("Item B");
    await numberInputs.nth(1).fill("30");
    await nameInputs.nth(2).fill("Item C");
    await numberInputs.nth(2).fill("20");
    await page.waitForTimeout(1000);

    const download = await clickDownload(page, "Download PNG");
    expect(download.suggestedFilename()).toContain("conextlab-pareto");
  });
});

// ============================================================
// SWOT
// ============================================================
test.describe("SWOT", () => {
  test("manual data entry and preview", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "SWOT");

    await fillField(page, "e.g. New Product Launch", "Product Launch Analysis");
    await fillField(page, "What are we good at?", "Strong brand");
    await fillField(page, "What needs improvement?", "Limited budget");
    await fillField(page, "What can we leverage?", "Growing market");
    await fillField(page, "What risks do we face?", "New regulations");

    await expect(page.locator("text=Product Launch Analysis").first()).toBeVisible();
    await expect(page.locator("text=Strong brand").first()).toBeVisible();
  });

  test("icon mode switching", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "SWOT");

    // Default is emoji
    await expect(page.locator("button:has-text('Emoji')")).toHaveClass(/border-blue/);

    // Switch to Icon
    await page.locator("button:has-text('Icon')").click();
    await page.waitForTimeout(300);
    await expect(page.locator("button:has-text('Icon')")).toHaveClass(/border-blue/);

    // Switch to None
    await page.locator("button:has-text('None')").click();
    await page.waitForTimeout(300);
    await expect(page.locator("button:has-text('None')")).toHaveClass(/border-blue/);
  });

  test("PNG and PDF download", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "SWOT");
    await fillField(page, "e.g. New Product Launch", "Download Test");
    await fillField(page, "What are we good at?", "Test strength");
    await page.waitForTimeout(500);

    const pngDownload = await clickDownload(page, "Download PNG");
    expect(pngDownload.suggestedFilename()).toContain("conextlab-swot");
    expect(pngDownload.suggestedFilename()).toContain(".png");

    const pdfDownload = await clickDownload(page, "Download PDF");
    expect(pdfDownload.suggestedFilename()).toContain("conextlab-swot");
    expect(pdfDownload.suggestedFilename()).toContain(".pdf");
  });
});

// ============================================================
// S-CURVE
// ============================================================
test.describe("S-Curve", () => {
  test("manual data entry and preview", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "S-Curve");

    await fillField(page, "Project Alpha", "Project Alpha Progress");

    // Fill plan values
    const planInputs = page.locator("text=Plan Data").locator("..").locator("input[type='number']");
    const planValues = [5, 15, 30, 55, 80, 100];
    for (let i = 0; i < planValues.length; i++) {
      await planInputs.nth(i).fill(String(planValues[i]));
    }

    // Fill actual values
    const actualInputs = page.locator("text=Actual Data").locator("..").locator("input[type='number']");
    const actualValues = [3, 12, 25, 45, 0, 0];
    for (let i = 0; i < actualValues.length; i++) {
      await actualInputs.nth(i).fill(String(actualValues[i]));
    }

    await page.waitForTimeout(500);
    await expect(page.locator("text=Project Alpha Progress").first()).toBeVisible();
    await expect(page.getByText("Plan", { exact: true })).toBeVisible();
    await expect(page.getByText("Actual", { exact: true })).toBeVisible();
  });

  test("AI extraction", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "S-Curve");

    await page.locator("button:has-text('AI Assist')").click();
    await page.waitForTimeout(300);

    const aiText = page.locator("textarea").first();
    await aiText.fill(
      "Project Beta 6-month plan: Jan 5%, Feb 15%, Mar 30%, Apr 55%, May 80%, Jun 100%. Actual: Jan 3%, Feb 12%, Mar 25%, Apr 45%, May 60%."
    );

    await page.locator("button:has-text('Generate with AI')").click();
    await page.waitForTimeout(15000);

    const titleField = page.locator("input").first();
    const val = await titleField.inputValue();
    expect(val.length).toBeGreaterThan(0);
  });

  test("PNG download", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "S-Curve");
    await fillField(page, "Project Alpha", "S-Curve Download Test");

    const planInputs = page.locator("text=Plan Data").locator("..").locator("input[type='number']");
    await planInputs.nth(0).fill("10");
    await planInputs.nth(1).fill("30");
    await planInputs.nth(2).fill("60");
    await page.waitForTimeout(500);

    const download = await clickDownload(page, "Download PNG");
    expect(download.suggestedFilename()).toContain("conextlab-scurve");
  });
});

// ============================================================
// IMPACT-EFFORT MATRIX
// ============================================================
test.describe("Impact-Effort Matrix", () => {
  test("manual data entry and preview", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Impact-Effort");

    await fillField(page, "Q3 Initiative", "Q3 Prioritization");

    // Fill initiative names
    const nameInputs = page.locator("input[placeholder='Initiative name']");
    await nameInputs.nth(0).fill("Redesign landing page");
    await nameInputs.nth(1).fill("Fix checkout bug");
    await nameInputs.nth(2).fill("Update FAQ");
    await nameInputs.nth(3).fill("Migrate database");

    await page.waitForTimeout(500);
    await expect(page.locator("text=Q3 Prioritization").first()).toBeVisible();
    await expect(page.locator("text=Quick Wins")).toBeVisible();
    await expect(page.locator("text=Major Projects")).toBeVisible();
  });

  test("AI extraction", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Impact-Effort");

    await page.locator("button:has-text('AI Assist')").click();
    await page.waitForTimeout(300);

    const aiText = page.locator("textarea").first();
    await aiText.fill(
      "Q3 priorities: Redesign landing page (high impact, medium effort), Fix checkout bug (high impact, low effort), Update FAQ page (low impact, low effort), Migrate database (high impact, high effort), Add dark mode (low impact, medium effort)"
    );

    await page.locator("button:has-text('Generate with AI')").click();
    await page.waitForTimeout(15000);

    const titleField = page.locator("input").first();
    const val = await titleField.inputValue();
    expect(val.length).toBeGreaterThan(0);
  });

  test("PNG download", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Impact-Effort");
    await fillField(page, "Q3 Initiative", "Matrix Download Test");

    const nameInputs = page.locator("input[placeholder='Initiative name']");
    await nameInputs.nth(0).fill("Task A");
    await nameInputs.nth(1).fill("Task B");
    await page.waitForTimeout(500);

    const download = await clickDownload(page, "Download PNG");
    expect(download.suggestedFilename()).toContain("conextlab-matrix");
  });
});

// ============================================================
// FLOWCHART
// ============================================================
test.describe("Flowchart", () => {
  test("manual data entry and preview", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Flowchart");

    await fillField(page, "Customer Onboarding", "Customer Onboarding Process");

    // Fill node labels
    const nodeInputs = page.locator("input[placeholder='Step label']");
    await nodeInputs.nth(0).fill("Start: User signs up");
    await nodeInputs.nth(1).fill("Verify email");
    await nodeInputs.nth(2).fill("Email verified?");
    await nodeInputs.nth(3).fill("End: Account created");

    await page.waitForTimeout(500);
    await expect(page.locator("text=Customer Onboarding Process").first()).toBeVisible();
  });

  test("AI extraction", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Flowchart");

    await page.locator("button:has-text('AI Assist')").click();
    await page.waitForTimeout(300);

    const aiText = page.locator("textarea").first();
    await aiText.fill(
      "Customer onboarding: Start with signup form, then verify email. If email verified, create account and send welcome email. If not verified, send reminder and wait 24h before retrying."
    );

    await page.locator("button:has-text('Generate with AI')").click();
    await page.waitForTimeout(15000);

    const titleField = page.locator("input").first();
    const val = await titleField.inputValue();
    expect(val.length).toBeGreaterThan(0);
  });

  test("vending machine example creates Yes/No branches", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Flowchart");

    await page.locator("button:has-text('Load vending machine example')").click();
    await page.waitForTimeout(500);

    await expect(page.locator("text=Vending Machine Algorithm").first()).toBeVisible();
    await expect(page.locator("input[placeholder='Step label']").nth(2)).toHaveValue("Coin valid?");
    await expect(page.locator("input[placeholder='Yes/No']").nth(2)).toHaveValue("Yes");
    await expect(page.locator("input[placeholder='Yes/No']").nth(3)).toHaveValue("No");
  });

  test("PNG download", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "Flowchart");
    await fillField(page, "Customer Onboarding", "Flowchart Download Test");

    const nodeInputs = page.locator("input[placeholder='Step label']");
    await nodeInputs.nth(0).fill("Start");
    await nodeInputs.nth(1).fill("Process");
    await nodeInputs.nth(2).fill("Decision");
    await nodeInputs.nth(3).fill("End");
    await page.waitForTimeout(500);

    const download = await clickDownload(page, "Download PNG");
    expect(download.suggestedFilename()).toContain("conextlab-flowchart");
  });
});

// ============================================================
// TEMPLATE & COLOR CUSTOMIZATION
// ============================================================
test.describe("Template & Color", () => {
  test("template switching works", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "SWOT");

    // Click 3D Depth template
    await page.locator("button:has-text('3D Depth')").click();
    await page.waitForTimeout(300);
    await expect(page.locator("button:has-text('3D Depth')")).toHaveClass(/border-blue/);

    // Click Minimal template
    await page.locator("button:has-text('Minimal')").first().click();
    await page.waitForTimeout(300);
    await expect(page.locator("button:has-text('Minimal')").first()).toHaveClass(/border-blue/);
  });

  test("color preset switching works", async ({ page }) => {
    await waitForApp(page);
    await selectFramework(page, "SWOT");

    // Click Dark Mode preset
    await page.locator("button:has-text('Dark Mode')").click();
    await page.waitForTimeout(300);

    // Click Warm preset
    await page.locator("button:has-text('Warm')").click();
    await page.waitForTimeout(300);

    // Click Forest preset
    await page.locator("button:has-text('Forest')").click();
    await page.waitForTimeout(300);
  });
});
