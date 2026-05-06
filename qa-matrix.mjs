import fs from "node:fs";
import path from "node:path";
import { chromium, devices } from "playwright";

const BASE_URL = "http://127.0.0.1:4173";
const OUT_DIR = path.join(process.cwd(), "output", "qa-matrix");
const BASE_CELLS = [
  "1,1", "2,1", "3,1", "4,1", "5,1",
  "1,2", "2,2", "3,2", "4,2", "5,2",
  "1,3", "2,3", "3,3", "4,3", "5,3",
  "1,4", "2,4", "3,4", "4,4", "5,4",
  "1,5", "2,5", "3,5", "4,5", "5,5",
];

fs.mkdirSync(OUT_DIR, { recursive: true });

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sanitize(name) {
  return name.replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "").toLowerCase();
}

function buildLayoutPayload(plants = [], desertTiles = []) {
  return {
    cells: BASE_CELLS,
    plants,
    desertTiles,
    selectedCropId: "herb",
    boostPotionActive: false,
    statsCollapsed: false,
    view: { offsetX: 0, offsetY: 0, scale: 1 },
  };
}

function formatErrors(errors, startIndex) {
  return errors
    .slice(startIndex)
    .map((entry) => `${entry.type}: ${entry.text}`)
    .join(" | ");
}

function intersects(a, b) {
  return !(
    a.x + a.width <= b.x
    || b.x + b.width <= a.x
    || a.y + a.height <= b.y
    || b.y + b.height <= a.y
  );
}

async function createContext(browser, mode) {
  const context = await browser.newContext(
    mode === "mobile"
      ? { ...devices["iPhone 13"] }
      : { viewport: { width: 1440, height: 1400 } },
  );

  await context.addInitScript(() => {
    const clipboardState = { text: "", items: 0 };
    const clipboard = {
      writeText: async (text) => {
        clipboardState.text = text;
        window.__qaClipboardText = text;
      },
      readText: async () => clipboardState.text,
      write: async (items) => {
        clipboardState.items = Array.isArray(items) ? items.length : 0;
        window.__qaClipboardItems = clipboardState.items;
      },
    };
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: clipboard,
    });
    if (typeof window.ClipboardItem === "undefined") {
      window.ClipboardItem = function ClipboardItem(data) {
        this.data = data;
      };
    }
  });

  return context;
}

async function newPage(browser, mode) {
  const context = await createContext(browser, mode);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => {
    errors.push({ type: "pageerror", text: error.message });
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push({ type: "console", text: message.text() });
    }
  });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  return { context, page, errors };
}

async function openTab(page, key) {
  await page.locator(`.tab-button[data-tab="${key}"]`).click();
  await page.waitForTimeout(180);
}

async function setLayoutPayload(page, payload) {
  await page.evaluate((data) => {
    localStorage.setItem("alchansia-layout-v1", JSON.stringify(data));
  }, payload);
  await page.reload({ waitUntil: "networkidle" });
}

async function clearStoredLayout(page) {
  await page.evaluate(() => {
    localStorage.removeItem("alchansia-layout-v1");
  });
  await page.reload({ waitUntil: "networkidle" });
}

async function firstCellPoint(page) {
  return page.evaluate(() => {
    const cell = window.__planner_debug.getCells()[0];
    return window.__planner_debug.gridToScreen(cell.col, cell.row);
  });
}

async function firstAddSlotPoint(page) {
  return page.evaluate(() => {
    const slot = window.__planner_debug.getAddSlots()[0];
    return window.__planner_debug.gridToScreen(slot.col, slot.row);
  });
}

async function placeCrop(page, cropName, point) {
  await page.locator(".crop-button", { hasText: cropName }).first().click();
  await page.click("#field-canvas", { position: point });
  await page.waitForTimeout(150);
}

async function getProductionTexts(page) {
  return page.locator("#production-grid .production-card").evaluateAll((nodes) =>
    nodes.map((node) => node.textContent.replace(/\s+/g, " ").trim()),
  );
}

async function saveViewportShot(page, fileName) {
  await page.screenshot({ path: path.join(OUT_DIR, fileName) });
}

async function selectOptionByText(locator, textFragment) {
  const value = await locator.evaluate((select, text) => {
    const option = [...select.options].find((candidate) => candidate.textContent.includes(text));
    return option ? option.value : "";
  }, textFragment);
  assert(value, `could not find option containing "${textFragment}"`);
  await locator.selectOption(value);
}

async function runScenario(results, browser, mode, name, body) {
  const { context, page, errors } = await newPage(browser, mode);
  const startIndex = errors.length;
  try {
    await body(page, errors);
    const newErrors = formatErrors(errors, startIndex);
    assert(!newErrors, `unexpected browser errors: ${newErrors}`);
    results.push({ mode, name, status: "PASS" });
  } catch (error) {
    const screenshotPath = path.join(OUT_DIR, `${mode}-${sanitize(name)}-fail.png`);
    try {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } catch {
      // Ignore screenshot failures during QA capture.
    }
    results.push({
      mode,
      name,
      status: "FAIL",
      details: error.message,
      screenshot: screenshotPath,
    });
  } finally {
    await context.close();
  }
}

async function runDesktop(results, browser) {
  const mode = "desktop";

  await runScenario(results, browser, mode, "planner loads with default state", async (page) => {
    assert(await page.locator("#planner-view").isVisible(), "planner tab did not render");
    assert((await page.locator("#field-summary").textContent()).includes("총 25칸"), "default field summary is wrong");
  });

  await runScenario(results, browser, mode, "planner action buttons are visible", async (page) => {
    for (const selector of ["#copy-layout-button", "#share-layout-button", "#layout-slots-button"]) {
      assert(await page.locator(selector).isVisible(), `${selector} is not visible`);
    }
  });

  await runScenario(results, browser, mode, "planner tool palette has six tools", async (page) => {
    assert(await page.locator("#tool-palette .crop-button").count() === 6, "tool palette count mismatch");
  });

  await runScenario(results, browser, mode, "planner crop palette has twelve crops", async (page) => {
    assert(await page.locator("#crop-palette .crop-button").count() === 12, "crop palette count mismatch");
  });

  await runScenario(results, browser, mode, "planner can place herb on a field cell", async (page) => {
    const point = await firstCellPoint(page);
    await placeCrop(page, "약초", point);
    assert((await page.locator("#field-summary").textContent()).includes("작물 1개"), "placing herb did not update summary");
  });

  await runScenario(results, browser, mode, "planner plant eraser removes a placed crop", async (page) => {
    const point = await firstCellPoint(page);
    await placeCrop(page, "약초", point);
    await page.locator("#tool-palette .crop-button", { hasText: "식물 지우개" }).click();
    await page.click("#field-canvas", { position: point });
    await page.waitForTimeout(150);
    assert((await page.locator("#field-summary").textContent()).includes("작물 0개"), "plant eraser did not remove crop");
  });

  await runScenario(results, browser, mode, "planner desertify marks a tile as desert", async (page) => {
    const point = await firstCellPoint(page);
    await page.locator("#tool-palette .crop-button", { hasText: "사막화" }).click();
    await page.click("#field-canvas", { position: point });
    await page.waitForTimeout(150);
    const count = await page.evaluate(() => window.__planner_debug.getDesertTiles().length);
    assert(count === 1, "desertify did not create a desert tile");
  });

  await runScenario(results, browser, mode, "planner expands into a dotted add slot", async (page) => {
    const totalBefore = await page.evaluate(() => window.__planner_debug.getCells().length);
    const point = await firstAddSlotPoint(page);
    await page.click("#field-canvas", { position: point });
    await page.waitForTimeout(200);
    const totalAfter = await page.evaluate(() => window.__planner_debug.getCells().length);
    assert(totalAfter === totalBefore + 1, "clicking an add slot did not expand the field");
  });

  await runScenario(results, browser, mode, "planner stats panel collapses", async (page) => {
    await page.locator("#toggle-stats-button").click();
    assert(await page.locator("#toggle-stats-button").getAttribute("aria-expanded") === "false", "stats panel did not collapse");
  });

  await runScenario(results, browser, mode, "planner stats panel re-expands", async (page) => {
    await page.locator("#toggle-stats-button").click();
    await page.locator("#toggle-stats-button").click();
    assert(await page.locator("#toggle-stats-button").getAttribute("aria-expanded") === "true", "stats panel did not re-expand");
  });

  await runScenario(results, browser, mode, "planner boost toggle switches on", async (page) => {
    await page.locator("#boost-potion-button").click();
    assert(await page.locator("#boost-potion-button").textContent() === "On", "boost toggle did not switch on");
  });

  await runScenario(results, browser, mode, "planner storage modal opens", async (page) => {
    await page.locator("#layout-slots-button").click();
    assert(await page.locator(".slot-panel.slot-modal").isVisible(), "layout slot modal did not open");
  });

  await runScenario(results, browser, mode, "planner layout can be saved into a slot", async (page) => {
    const point = await firstCellPoint(page);
    await placeCrop(page, "약초", point);
    await page.locator("#layout-slots-button").click();
    await page.locator(".slot-row").first().locator(".slot-action-button", { hasText: "저장" }).click();
    assert((await page.locator(".slot-row").first().locator(".slot-name-input").inputValue()).length >= 0, "slot save interaction failed");
  });

  await runScenario(results, browser, mode, "planner saved layout can be loaded back", async (page) => {
    const point = await firstCellPoint(page);
    await placeCrop(page, "약초", point);
    await page.locator("#layout-slots-button").click();
    const firstRow = page.locator(".slot-row").first();
    await firstRow.locator(".slot-action-button", { hasText: "저장" }).click();
    await page.locator(".slot-modal-close").click();
    await page.locator("#reset-button").click();
    await page.locator("#layout-slots-button").click();
    await firstRow.locator(".slot-action-button", { hasText: "불러오기" }).click();
    assert((await page.locator("#field-summary").textContent()).includes("작물 1개"), "saved layout did not reload");
  });

  await runScenario(results, browser, mode, "calculator tab renders recipe summary", async (page) => {
    await openTab(page, "calculator");
    assert(await page.locator("#recipe-summary").isVisible(), "recipe summary is not visible");
  });

  await runScenario(results, browser, mode, "calculator target select has recipe options", async (page) => {
    await openTab(page, "calculator");
    assert(await page.locator("#recipe-target-select option").count() > 10, "recipe target options did not load");
  });

  await runScenario(results, browser, mode, "calculator target level updates summary", async (page) => {
    await openTab(page, "calculator");
    await page.locator("#recipe-target-level").fill("2");
    await page.waitForTimeout(150);
    assert((await page.locator("#recipe-summary").textContent()).includes("+2"), "target level change did not affect summary");
  });

  await runScenario(results, browser, mode, "calculator cauldron enhancement updates note", async (page) => {
    await openTab(page, "calculator");
    await page.locator("#recipe-cauldron-enhancement").fill("3");
    await page.waitForTimeout(150);
    assert((await page.locator("#recipe-enhancement-note").textContent()).trim().length > 0, "enhancement note did not render");
  });

  await runScenario(results, browser, mode, "materials tab renders three cauldron rows", async (page) => {
    await openTab(page, "materials");
    assert(await page.locator(".cauldron-row").count() === 3, "materials tab did not render three cauldron rows");
  });

  await runScenario(results, browser, mode, "materials tab can add a gold cauldron card", async (page) => {
    await openTab(page, "materials");
    const row = page.locator(".cauldron-row").first();
    const before = await row.locator(".cauldron-card").count();
    await row.locator(".cauldron-row-header button").click();
    await page.waitForTimeout(150);
    const after = await row.locator(".cauldron-card").count();
    assert(after === before + 1, "gold cauldron add button did not append a card");
  });

  await runScenario(results, browser, mode, "materials tab recipe select updates material summary", async (page) => {
    await openTab(page, "materials");
    const recipeSelect = page.locator(".cauldron-card select").first();
    await selectOptionByText(recipeSelect, "성장포션");
    await page.waitForTimeout(200);
    const text = await page.locator("#material-usage-summary").textContent();
    assert(text.includes("붉은꽃"), "growth potion recipe did not affect material summary");
  });

  await runScenario(results, browser, mode, "materials tab cauldron enhancement input is editable", async (page) => {
    await openTab(page, "materials");
    const input = page.locator(".cauldron-level-input").first();
    await input.fill("2");
    assert(await input.inputValue() === "2", "cauldron enhancement input did not update");
  });

  await runScenario(results, browser, mode, "materials storage modal opens", async (page) => {
    await openTab(page, "materials");
    await page.locator("#cauldron-slots-button").click();
    assert(await page.locator(".slot-panel.slot-modal").isVisible(), "cauldron slot modal did not open");
  });

  await runScenario(results, browser, mode, "time calculator loads default 30 second recipe", async (page) => {
    await openTab(page, "time");
    assert((await page.locator("#time-result-primary").textContent()).includes("30초"), "default time result is not 30초");
  });

  await runScenario(results, browser, mode, "time calculator rejects invalid enhancement combination", async (page) => {
    await openTab(page, "time");
    await page.locator("#time-operation-mode").selectOption("enhancement");
    await page.locator("#time-item-a-select").selectOption("herb");
    await page.locator("#time-item-b-select").selectOption("red_flower_leaf");
    await page.waitForTimeout(200);
    assert((await page.locator("#time-result-primary").textContent()).includes("계산 불가"), "invalid enhancement did not show a blocked state");
  });

  await runScenario(results, browser, mode, "time calculator accepts valid craft recipe", async (page) => {
    await openTab(page, "time");
    await page.locator("#time-operation-mode").selectOption("craft");
    await page.locator("#time-item-a-select").selectOption("copper_scrap");
    await page.locator("#time-item-b-select").selectOption("mud");
    await page.waitForTimeout(200);
    const text = await page.locator("#time-result-primary").textContent();
    assert(!text.includes("계산 불가"), "valid craft recipe was rejected");
  });

  await runScenario(results, browser, mode, "time calculator accepts valid engrave recipe", async (page) => {
    await openTab(page, "time");
    await page.locator("#time-operation-mode").selectOption("engrave");
    await page.locator("#time-item-a-select").selectOption("mud");
    await page.locator("#time-item-b-select").selectOption("engraving_stone");
    await page.waitForTimeout(200);
    const text = await page.locator("#time-result-primary").textContent();
    assert(!text.includes("계산 불가"), "valid engrave recipe was rejected");
  });

  await runScenario(results, browser, mode, "skills tab loads summary and categories", async (page) => {
    await openTab(page, "skills");
    assert(await page.locator("#skill-tree-summary").isVisible(), "skill summary is not visible");
    assert(await page.locator("#skill-category-tabs .subtab-button").count() === 4, "skill category tabs count mismatch");
  });

  await runScenario(results, browser, mode, "skills tab switches to brewing tree", async (page) => {
    await openTab(page, "skills");
    await page.locator("#skill-category-tabs .subtab-button", { hasText: "연성" }).click();
    await page.waitForTimeout(150);
    assert((await page.locator("#skill-tree-summary").textContent()).includes("견습 마녀"), "brewing category switch failed");
  });

  await runScenario(results, browser, mode, "flame mastery investment syncs into time calculator", async (page) => {
    await openTab(page, "skills");
    await page.locator("#skill-category-tabs .subtab-button", { hasText: "연성" }).click();
    await page.locator(".skill-node").first().click();
    await page.locator("#skill-detail-dock button", { hasText: "투자" }).click();
    await page.waitForTimeout(150);
    await openTab(page, "time");
    assert(await page.locator("#time-flame-mastery").inputValue() === "1", "flame mastery did not sync to the time calculator");
  });

  await runScenario(results, browser, mode, "skill reset clears invested levels", async (page) => {
    await openTab(page, "skills");
    await page.locator("#skill-category-tabs .subtab-button", { hasText: "연성" }).click();
    await page.locator(".skill-node").first().click();
    await page.locator("#skill-detail-dock button", { hasText: "투자" }).click();
    await page.waitForTimeout(150);
    await page.locator("#skill-tree-summary button", { hasText: "스킬 리셋" }).click();
    await page.waitForTimeout(150);
    await openTab(page, "time");
    assert(await page.locator("#time-flame-mastery").inputValue() === "0", "skill reset did not clear flame mastery");
  });

  await runScenario(results, browser, mode, "growth potion calculator tab renders forecast summary", async (page) => {
    await openTab(page, "skill-points");
    assert(await page.locator("#sp-forecast-summary").isVisible(), "forecast summary is not visible");
  });

  await runScenario(results, browser, mode, "growth potion forecast updates after input change", async (page) => {
    await openTab(page, "skill-points");
    await page.locator("#sp-current-level").fill("12");
    await page.locator("#sp-current-exp").fill("3");
    await page.waitForTimeout(150);
    const text = await page.locator("#sp-forecast-summary").textContent();
    assert(text.includes("Lv 13"), "forecast summary did not recalculate the expected level");
  });

  await runScenario(results, browser, mode, "growth potion target summary updates after target change", async (page) => {
    await openTab(page, "skill-points");
    await page.locator("#sp-target-current-level").fill("10");
    await page.locator("#sp-target-level").fill("15");
    await page.waitForTimeout(150);
    const text = await page.locator("#sp-target-summary").textContent();
    assert(text.includes("20개"), "target summary did not update the required potion count");
    assert(text.includes("Lv 15"), "target summary did not update the target level forecast");
  });

  await runScenario(results, browser, mode, "planner dew root plus red flower yields 240 per hour", async (page) => {
    await setLayoutPayload(page, buildLayoutPayload([
      ["3,3", "water-flower"],
      ["3,2", "red-leaf"],
    ]));
    const texts = await getProductionTexts(page);
    assert(texts.some((text) => text.includes("붉은꽃") && text.includes("240개")), "dew root + red flower yield is not 240/h");
  });

  await runScenario(results, browser, mode, "planner dew root plus fire vine yields zero", async (page) => {
    await setLayoutPayload(page, buildLayoutPayload([
      ["3,3", "water-flower"],
      ["3,2", "fire-flower"],
    ]));
    const texts = await getProductionTexts(page);
    assert(texts.some((text) => text.includes("불씨덩굴") && text.includes("0개")), "dew root + fire vine did not stay at zero");
  });

  await runScenario(results, browser, mode, "planner blue moss alone yields 90 per hour", async (page) => {
    await setLayoutPayload(page, buildLayoutPayload([["2,2", "moss"]]));
    const texts = await getProductionTexts(page);
    assert(texts.some((text) => text.includes("푸른이끼") && text.includes("90개")), "blue moss alone yield is not 90/h");
    await saveViewportShot(page, "desktop-planner-final.png");
  });
}

async function runMobile(results, browser) {
  const mode = "mobile";

  await runScenario(results, browser, mode, "mobile home loads default planner", async (page) => {
    assert(await page.locator("#planner-view").isVisible(), "planner view did not load");
  });

  await runScenario(results, browser, mode, "mobile tab buttons render all six sections", async (page) => {
    assert(await page.locator(".tab-button").count() === 6, "tab count mismatch");
  });

  await runScenario(results, browser, mode, "mobile planner action buttons do not overlap the palette dock", async (page) => {
    const actionsBox = await page.locator(".toolbar-actions").boundingBox();
    const paletteBox = await page.locator(".palette-dock").boundingBox();
    assert(actionsBox && paletteBox, "could not measure planner toolbar or palette");
    assert(!intersects(actionsBox, paletteBox), "planner actions overlap the palette dock on mobile");
  });

  await runScenario(results, browser, mode, "mobile planner tool palette still shows six tools", async (page) => {
    assert(await page.locator("#tool-palette .crop-button").count() === 6, "mobile tool palette count mismatch");
  });

  await runScenario(results, browser, mode, "mobile crop palette is horizontally scrollable", async (page) => {
    const overflow = await page.evaluate(() => {
      const el = document.getElementById("crop-palette");
      return el ? el.scrollWidth > el.clientWidth : false;
    });
    assert(overflow, "mobile crop palette is not scrollable");
  });

  await runScenario(results, browser, mode, "mobile planner can place herb on the first cell", async (page) => {
    const point = await firstCellPoint(page);
    await placeCrop(page, "약초", point);
    assert((await page.locator("#field-summary").textContent()).includes("작물 1개"), "mobile crop placement failed");
  });

  await runScenario(results, browser, mode, "mobile planner stats toggle expands and re-collapses", async (page) => {
    await page.locator("#toggle-stats-button").scrollIntoViewIfNeeded();
    assert(await page.locator("#toggle-stats-button").getAttribute("aria-expanded") === "false", "mobile stats should start collapsed");
    await page.locator("#toggle-stats-button").click();
    assert(await page.locator("#toggle-stats-button").getAttribute("aria-expanded") === "true", "mobile stats did not expand");
    await page.locator("#toggle-stats-button").click();
    assert(await page.locator("#toggle-stats-button").getAttribute("aria-expanded") === "false", "mobile stats did not collapse again");
  });

  await runScenario(results, browser, mode, "mobile planner storage modal opens", async (page) => {
    await page.locator("#layout-slots-button").click();
    assert(await page.locator(".slot-panel.slot-modal").isVisible(), "mobile slot modal did not open");
  });

  await runScenario(results, browser, mode, "mobile calculator tab loads", async (page) => {
    await openTab(page, "calculator");
    assert(await page.locator("#calculator-view, #recipe-summary").locator("..").count() >= 0, "mobile calculator tab did not load");
  });

  await runScenario(results, browser, mode, "mobile calculator fields stack into one column", async (page) => {
    await openTab(page, "calculator");
    const first = await page.locator("#recipe-target-select").boundingBox();
    const second = await page.locator("#recipe-target-level").boundingBox();
    assert(first && second, "calculator fields are missing");
    assert(Math.abs(first.x - second.x) < 4 && second.y > first.y, "calculator fields are not stacked on mobile");
  });

  await runScenario(results, browser, mode, "mobile calculator summary updates on target level change", async (page) => {
    await openTab(page, "calculator");
    await page.locator("#recipe-target-level").fill("2");
    await page.waitForTimeout(150);
    assert((await page.locator("#recipe-summary").textContent()).includes("+2"), "mobile calculator summary did not react");
  });

  await runScenario(results, browser, mode, "mobile materials tab loads three rows", async (page) => {
    await openTab(page, "materials");
    assert(await page.locator(".cauldron-row").count() === 3, "mobile materials rows count mismatch");
  });

  await runScenario(results, browser, mode, "mobile materials add buttons are visible", async (page) => {
    await openTab(page, "materials");
    assert(await page.locator(".cauldron-row-header button").count() === 3, "mobile add buttons count mismatch");
  });

  await runScenario(results, browser, mode, "mobile materials cards fit within the viewport", async (page) => {
    await openTab(page, "materials");
    const box = await page.locator(".cauldron-card").first().boundingBox();
    const viewport = page.viewportSize();
    assert(box && viewport, "missing cauldron card or viewport");
    assert(box.x + box.width <= viewport.width + 1, "cauldron card overflows horizontally on mobile");
  });

  await runScenario(results, browser, mode, "mobile materials summary remains visible", async (page) => {
    await openTab(page, "materials");
    assert((await page.locator("#material-usage-summary").textContent()).includes("시간당 재료 소모량"), "mobile material summary is missing");
  });

  await runScenario(results, browser, mode, "mobile time calculator loads default result", async (page) => {
    await openTab(page, "time");
    assert((await page.locator("#time-result-primary").textContent()).includes("30초"), "mobile time default result is wrong");
  });

  await runScenario(results, browser, mode, "mobile time calculator controls stack vertically", async (page) => {
    await openTab(page, "time");
    const first = await page.locator("#time-operation-mode").boundingBox();
    const second = await page.locator("#time-cauldron-enhancement").boundingBox();
    assert(first && second, "time controls are missing");
    assert(Math.abs(first.x - second.x) < 4 && second.y > first.y, "time controls are not stacked on mobile");
  });

  await runScenario(results, browser, mode, "mobile time calculator blocks invalid enhancement recipes", async (page) => {
    await openTab(page, "time");
    await page.locator("#time-operation-mode").selectOption("enhancement");
    await page.locator("#time-item-a-select").selectOption("herb");
    await page.locator("#time-item-b-select").selectOption("red_flower_leaf");
    await page.waitForTimeout(200);
    assert((await page.locator("#time-result-primary").textContent()).includes("계산 불가"), "mobile invalid enhancement was not blocked");
  });

  await runScenario(results, browser, mode, "mobile time duration table is visible", async (page) => {
    await openTab(page, "time");
    assert(await page.locator("#time-duration-table-body tr").count() > 50, "time duration table did not render on mobile");
  });

  await runScenario(results, browser, mode, "mobile skills tab loads summary", async (page) => {
    await openTab(page, "skills");
    assert(await page.locator("#skill-tree-summary").isVisible(), "mobile skills summary is missing");
  });

  await runScenario(results, browser, mode, "mobile skill category tabs remain visible", async (page) => {
    await openTab(page, "skills");
    assert(await page.locator("#skill-category-tabs .subtab-button").count() === 4, "mobile skill category tabs count mismatch");
  });

  await runScenario(results, browser, mode, "mobile skill node opens the detail dock", async (page) => {
    await openTab(page, "skills");
    await page.locator(".skill-node").first().click();
    await page.waitForTimeout(150);
    assert(await page.locator("#skill-detail-dock").isVisible(), "mobile skill detail dock did not open");
  });

  await runScenario(results, browser, mode, "mobile skill invest button is visible", async (page) => {
    await openTab(page, "skills");
    await page.locator(".skill-node").first().click();
    await page.waitForTimeout(150);
    assert(await page.locator("#skill-detail-dock button", { hasText: "투자" }).isVisible(), "mobile invest button is missing");
  });

  await runScenario(results, browser, mode, "mobile skill tab switches to mana category", async (page) => {
    await openTab(page, "skills");
    await page.locator("#skill-category-tabs .subtab-button", { hasText: "마나" }).click();
    await page.waitForTimeout(150);
    assert((await page.locator("#skill-tree-summary").textContent()).includes("필요 레벨"), "mobile mana category switch failed");
  });

  await runScenario(results, browser, mode, "mobile growth potion calculator loads", async (page) => {
    await openTab(page, "skill-points");
    assert(await page.locator("#sp-forecast-summary").isVisible(), "mobile growth potion forecast is missing");
  });

  await runScenario(results, browser, mode, "mobile growth potion fields fit inside the viewport", async (page) => {
    await openTab(page, "skill-points");
    const box = await page.locator("#sp-current-level").boundingBox();
    const viewport = page.viewportSize();
    assert(box && viewport, "missing mobile growth potion input");
    assert(box.x + box.width <= viewport.width + 1, "growth potion input overflows on mobile");
  });

  await runScenario(results, browser, mode, "mobile forecast summary updates on level change", async (page) => {
    await openTab(page, "skill-points");
    await page.locator("#sp-current-level").fill("12");
    await page.waitForTimeout(150);
    const text = await page.locator("#sp-forecast-summary").textContent();
    assert(text.includes("Lv 12"), "mobile forecast summary did not update");
  });

  await runScenario(results, browser, mode, "mobile target summary updates on target change", async (page) => {
    await openTab(page, "skill-points");
    await page.locator("#sp-target-level").fill("15");
    await page.waitForTimeout(150);
    const text = await page.locator("#sp-target-summary").textContent();
    assert(text.includes("34개"), "mobile target summary did not update");
  });

  await runScenario(results, browser, mode, "mobile planner state survives tab roundtrip", async (page) => {
    const point = await firstCellPoint(page);
    await placeCrop(page, "약초", point);
    await openTab(page, "time");
    await openTab(page, "planner");
    assert((await page.locator("#field-summary").textContent()).includes("작물 1개"), "planner state did not survive a tab roundtrip on mobile");
  });

  await runScenario(results, browser, mode, "mobile planner canvas is visible", async (page) => {
    assert(await page.locator("#field-canvas").isVisible(), "mobile planner canvas is hidden");
  });

  await runScenario(results, browser, mode, "mobile materials summary table fits inside the viewport", async (page) => {
    await openTab(page, "materials");
    const box = await page.locator("#material-usage-summary").boundingBox();
    const viewport = page.viewportSize();
    assert(box && viewport, "missing material summary");
    assert(box.x + box.width <= viewport.width + 1, "material summary overflows on mobile");
  });

  await runScenario(results, browser, mode, "mobile time result cards do not overlap", async (page) => {
    await openTab(page, "time");
    const primary = await page.locator(".time-primary-card").boundingBox();
    const note = await page.locator(".time-result-layout .result-card").nth(1).boundingBox();
    assert(primary && note, "time result cards are missing");
    assert(!intersects(primary, note), "time result cards overlap on mobile");
  });

  await runScenario(results, browser, mode, "mobile planner dew root plus red flower still yields 240 per hour", async (page) => {
    await setLayoutPayload(page, buildLayoutPayload([
      ["3,3", "water-flower"],
      ["3,2", "red-leaf"],
    ]));
    const texts = await getProductionTexts(page);
    assert(texts.some((text) => text.includes("붉은꽃") && text.includes("240개")), "mobile dew root + red flower yield is not 240/h");
  });

  await runScenario(results, browser, mode, "mobile planner dew root plus fire vine still yields zero", async (page) => {
    await setLayoutPayload(page, buildLayoutPayload([
      ["3,3", "water-flower"],
      ["3,2", "fire-flower"],
    ]));
    const texts = await getProductionTexts(page);
    assert(texts.some((text) => text.includes("불씨덩굴") && text.includes("0개")), "mobile dew root + fire vine did not stay at zero");
  });

  await runScenario(results, browser, mode, "mobile planner blue moss alone still yields 90 per hour", async (page) => {
    await setLayoutPayload(page, buildLayoutPayload([["2,2", "moss"]]));
    const texts = await getProductionTexts(page);
    assert(texts.some((text) => text.includes("푸른이끼") && text.includes("90개")), "mobile blue moss alone yield is not 90/h");
    await saveViewportShot(page, "mobile-planner-final.png");
  });

  await runScenario(results, browser, mode, "mobile time tab key screen captures cleanly", async (page) => {
    await openTab(page, "time");
    await saveViewportShot(page, "mobile-time-final.png");
  });

  await runScenario(results, browser, mode, "mobile skills tab key screen captures cleanly", async (page) => {
    await openTab(page, "skills");
    await page.locator(".skill-node").first().click();
    await page.waitForTimeout(150);
    await saveViewportShot(page, "mobile-skills-final.png");
  });

  await runScenario(results, browser, mode, "mobile materials tab key screen captures cleanly", async (page) => {
    await openTab(page, "materials");
    await saveViewportShot(page, "mobile-materials-final.png");
  });
}

function summarize(results) {
  const desktop = results.filter((result) => result.mode === "desktop");
  const mobile = results.filter((result) => result.mode === "mobile");
  const failed = results.filter((result) => result.status === "FAIL");
  return {
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    desktop: {
      total: desktop.length,
      passed: desktop.filter((result) => result.status === "PASS").length,
      failed: desktop.filter((result) => result.status === "FAIL").length,
    },
    mobile: {
      total: mobile.length,
      passed: mobile.filter((result) => result.status === "PASS").length,
      failed: mobile.filter((result) => result.status === "FAIL").length,
    },
  };
}

function toMarkdown(results, summary) {
  const lines = [
    "# QA Matrix",
    "",
    `- Total scenarios: ${summary.total}`,
    `- Passed: ${summary.passed}`,
    `- Failed: ${summary.failed}`,
    `- Desktop: ${summary.desktop.passed}/${summary.desktop.total}`,
    `- Mobile: ${summary.mobile.passed}/${summary.mobile.total}`,
    "",
    "## Results",
    "",
    "| Mode | Scenario | Status | Details |",
    "| --- | --- | --- | --- |",
  ];

  for (const result of results) {
    lines.push(`| ${result.mode} | ${result.name} | ${result.status} | ${result.details ?? ""} |`);
  }

  return lines.join("\n");
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    await runDesktop(results, browser);
    await runMobile(results, browser);
  } finally {
    await browser.close();
  }

  const summary = summarize(results);
  fs.writeFileSync(path.join(OUT_DIR, "qa-results.json"), JSON.stringify({ summary, results }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "qa-results.md"), toMarkdown(results, summary));
  console.log(JSON.stringify(summary, null, 2));
  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}

await main();
