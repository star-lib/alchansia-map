import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const outDir = path.join(root, "output", "verify");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

fs.mkdirSync(outDir, { recursive: true });

const server = http.createServer((req, res) => {
  const rawPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const filePath = path.join(root, decodeURIComponent(rawPath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const port = typeof address === "object" && address ? address.port : 4173;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });

try {
  await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" });

  const initialState = JSON.parse(
    await page.evaluate(() => window.render_game_to_text()),
  );

  const legacyPayload = {
    cells: [
      "0,0", "2,0", "4,0", "6,0",
      "1,1", "3,1", "5,1",
      "0,2", "2,2", "4,2", "6,2",
      "1,3", "3,3", "5,3",
      "0,4", "2,4", "4,4", "6,4",
      "1,5", "3,5", "5,5",
      "0,6", "2,6", "4,6", "6,6",
    ],
    plants: [["3,3", { cropId: "water-flower", enhancement: 2 }]],
    desertTiles: ["1,3"],
    toxicTiles: ["5,3"],
    scarecrowTiles: ["3,1"],
    selectedCropId: "herb",
    selectedCropEnhancement: 0,
  };
  await page.evaluate((payload) => {
    localStorage.setItem("alchansia-layout-v1", JSON.stringify(payload));
  }, legacyPayload);
  await page.reload({ waitUntil: "networkidle" });

  const migratedLegacyState = JSON.parse(
    await page.evaluate(() => window.render_game_to_text()),
  );
  if (migratedLegacyState.totalCells !== 25) {
    throw new Error(`legacy migration cell count mismatch: ${migratedLegacyState.totalCells}`);
  }
  if (
    migratedLegacyState.plants.length !== 1
    || migratedLegacyState.plants[0].col !== 3
    || migratedLegacyState.plants[0].row !== 3
    || migratedLegacyState.plants[0].enhancement !== 2
  ) {
    throw new Error(`legacy migration plant mismatch: ${JSON.stringify(migratedLegacyState.plants)}`);
  }

  await page.evaluate(() => window.__planner_debug.selectCrop("water-flower"));
  const baseCell = await page.evaluate(() => {
    const cell = window.__planner_debug.getCells()[0];
    return window.__planner_debug.gridToScreen(cell.col, cell.row);
  });
  await page.click("canvas", { position: baseCell });
  await page.waitForTimeout(120);

  await page.click("canvas", { position: baseCell });
  await page.waitForTimeout(120);
  await page.click("canvas", { position: baseCell });
  await page.waitForTimeout(120);

  await page.evaluate(() => window.__planner_debug.selectCrop("fire-flower"));
  const fireTarget = await page.evaluate(() => {
    const target = { col: 2, row: 0 };
    return window.__planner_debug.gridToScreen(target.col, target.row);
  });
  await page.click("canvas", { position: fireTarget });
  await page.waitForTimeout(120);

  const plantedState = JSON.parse(
    await page.evaluate(() => window.render_game_to_text()),
  );

  const removableTile = await page.evaluate(() => {
    const target = { col: 6, row: 6 };
    return window.__planner_debug.gridToScreen(target.col, target.row);
  });
  await page.click("canvas", { position: removableTile, button: "right" });
  await page.waitForTimeout(120);

  const removedTileState = JSON.parse(
    await page.evaluate(() => window.render_game_to_text()),
  );

  const target = await page.evaluate(() => {
    const slot = window.__planner_debug.getAddSlots()[0];
    return window.__planner_debug.gridToScreen(slot.col, slot.row);
  });

  await page.click("canvas", { position: target });
  await page.waitForTimeout(200);

  const expandedState = JSON.parse(
    await page.evaluate(() => window.render_game_to_text()),
  );

  await page.click("#expand-ring-button");
  await page.waitForTimeout(200);

  const expandedRingState = JSON.parse(
    await page.evaluate(() => window.render_game_to_text()),
  );

  const viewBeforePan = await page.evaluate(() => window.__planner_debug.getView());

  await page.mouse.move(640, 520);
  await page.mouse.down();
  await page.mouse.move(760, 610, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(120);

  const viewAfterPan = await page.evaluate(() => window.__planner_debug.getView());

  await page.hover("canvas");
  await page.mouse.wheel(0, -320);
  await page.waitForTimeout(120);

  const viewAfterZoom = await page.evaluate(() => window.__planner_debug.getView());

  await page.screenshot({ path: path.join(outDir, "layout.png"), fullPage: true });

  fs.writeFileSync(
    path.join(outDir, "result.json"),
    JSON.stringify(
      {
        initialState,
        migratedLegacyState,
        plantedState,
        removedTileState,
        expandedState,
        expandedRingState,
        viewBeforePan,
        viewAfterPan,
        viewAfterZoom,
      },
      null,
      2,
    ),
  );

  console.log(
    JSON.stringify({
      initialTotalCells: initialState.totalCells,
      migratedLegacyTotalCells: migratedLegacyState.totalCells,
      migratedLegacyPlantCount: migratedLegacyState.plants.length,
      plantedCount: plantedState.plants.length,
      removedTileTotalCells: removedTileState.totalCells,
      expandedTotalCells: expandedState.totalCells,
      expandedRingTotalCells: expandedRingState.totalCells,
      panDeltaX: viewAfterPan.offsetX - viewBeforePan.offsetX,
      panDeltaY: viewAfterPan.offsetY - viewBeforePan.offsetY,
      zoomScaleBefore: viewAfterPan.scale,
      zoomScaleAfter: viewAfterZoom.scale,
      screenshot: path.join(outDir, "layout.png"),
      result: path.join(outDir, "result.json"),
    }),
  );
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
