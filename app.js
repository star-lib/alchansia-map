const STARTING_ROWS = [4, 3, 4, 3, 4, 3, 4];
const CELL_SIZE = 44;
const HALF_W = CELL_SIZE;
const HALF_H = CELL_SIZE * 0.58;
const GRID_PAD = 2;
const MIN_SCALE = 0.45;
const MAX_SCALE = 2.8;
const ZOOM_FACTOR = 1.12;
const DRAG_THRESHOLD = 6;

const CROPS = [
  {
    id: "herb",
    name: "약초",
    short: "약",
    color: "#69a84a",
    accentColor: "#8d6bc9",
    summary: "첫 물 1회, 1회 수확",
    details: [
      "1칸 차지",
      "처음 1회만 물이 필요합니다.",
      "1회만 수확 가능한 작물입니다.",
    ],
  },
  {
    id: "red-leaf",
    name: "빨간 잎",
    short: "잎",
    color: "#d63f3f",
    accentColor: "#ff8e8e",
    summary: "주기적 물 필요",
    details: [
      "1칸 차지",
      "주기적으로 물이 필요한 작물입니다.",
    ],
  },
  {
    id: "moss",
    name: "이끼",
    short: "끼",
    color: "#2e9a90",
    accentColor: "#7bd8c2",
    summary: "첫 물 1회",
    details: [
      "1칸 차지",
      "처음 1회만 물이 필요합니다.",
    ],
  },
  {
    id: "water-flower",
    name: "물 꽃",
    short: "물",
    color: "#76cfff",
    accentColor: "#d5f2ff",
    summary: "체비쇼프 2칸 물 공급",
    details: [
      "1칸 차지",
      "체비쇼프 거리 2칸까지 항상 물을 공급합니다.",
      "물 공급 범위는 파란 오버레이로 표시됩니다.",
    ],
  },
  {
    id: "poison-flower",
    name: "독 꽃",
    short: "독",
    color: "#7d49ba",
    accentColor: "#c89cf0",
    summary: "독 면역, 인접 대각선 땅 중독",
    details: [
      "1칸 차지",
      "독에 면역입니다.",
      "대각선 인접 1칸 범위의 땅을 중독시킵니다.",
      "주기적으로 물이 필요합니다.",
    ],
  },
  {
    id: "fire-flower",
    name: "불 꽃",
    short: "불",
    color: "#e3481e",
    accentColor: "#ffb347",
    summary: "물 공급 시 사망",
    details: [
      "1칸 차지",
      "물 공급을 받으면 즉시 죽는 작물입니다.",
    ],
  },
  {
    id: "mushroom",
    name: "버섯",
    short: "버",
    color: "#fff8dd",
    accentColor: "#f1df8f",
    summary: "첫 물 1회, 1회 수확",
    details: [
      "1칸 차지",
      "처음 1회만 물이 필요합니다.",
      "1회만 수확 가능한 작물입니다.",
    ],
  },
  {
    id: "star-flower",
    name: "별 꽃",
    short: "별",
    color: "#7dbf3f",
    accentColor: "#f2da55",
    summary: "주기적 물 필요",
    details: [
      "1칸 차지",
      "주기적으로 물이 필요한 작물입니다.",
    ],
  },
  {
    id: "sun-flower",
    name: "태양 꽃",
    short: "양",
    color: "#f2c230",
    accentColor: "#fff09f",
    summary: "주기적 물 필요, 생산속도 +30%",
    details: [
      "1칸 차지",
      "주기적으로 물이 필요합니다.",
      "대각선 인접 1칸 범위의 생산 속도를 30% 올립니다.",
      "버프 범위는 금색 오버레이로 표시됩니다.",
    ],
  },
];

const TOOLS = [
  {
    id: "erase",
    name: "지우개",
    short: "X",
    color: "#888888",
    accentColor: "#d4d4d4",
    summary: "심어진 작물 제거",
    details: [
      "밭 자체는 남겨두고 작물만 제거합니다.",
    ],
  },
];

const cropById = new Map([...CROPS, ...TOOLS].map((crop) => [crop.id, crop]));

const canvas = document.getElementById("field-canvas");
const ctx = canvas.getContext("2d");
const summary = document.getElementById("field-summary");
const expandRingButton = document.getElementById("expand-ring-button");
const resetButton = document.getElementById("reset-button");
const clearCropsButton = document.getElementById("clear-crops-button");
const cropPalette = document.getElementById("crop-palette");
const cropDetails = document.getElementById("crop-details");
const slotTooltip = document.getElementById("slot-tooltip");

const CENTER_CELL = { col: 3, row: 3 };

const state = {
  cells: createStartingCells(),
  addSlots: [],
  plants: new Map(),
  hover: null,
  hoverPoint: null,
  selectedCropId: CROPS[0].id,
  view: {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  },
  pointer: {
    active: false,
    id: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    dragging: false,
  },
};

function createStartingCells() {
  const cells = new Set();

  STARTING_ROWS.forEach((count, row) => {
    const offset = row % 2 === 0 ? 0 : 1;
    for (let col = 0; col < count; col += 1) {
      cells.add(cellKey(col * 2 + offset, row));
    }
  });

  return cells;
}

function cellKey(col, row) {
  return `${col},${row}`;
}

function parseKey(key) {
  const [col, row] = key.split(",").map(Number);
  return { col, row };
}

function logicalPoint(col, row) {
  return {
    x: (col + row) / 2,
    y: (row - col) / 2,
  };
}

function chebyshevDistance(a, b) {
  const pointA = logicalPoint(a.col, a.row);
  const pointB = logicalPoint(b.col, b.row);
  return Math.max(
    Math.abs(pointA.x - pointB.x),
    Math.abs(pointA.y - pointB.y),
  );
}

function centerDistance(col, row) {
  return chebyshevDistance({ col, row }, CENTER_CELL);
}

function expansionTier(distance) {
  return Math.max(distance - 3, 0);
}

function expansionCostText(distance) {
  const tier = expansionTier(distance);
  return `${tier}강 마력결정 1개 + ${tier}강 각인석 1개`;
}

function getDiagonalNeighbors(col, row) {
  return [
    { col: col - 1, row: row - 1 },
    { col: col + 1, row: row - 1 },
    { col: col - 1, row: row + 1 },
    { col: col + 1, row: row + 1 },
  ];
}

function collectAddSlots() {
  const slots = new Map();

  for (const key of state.cells) {
    const { col, row } = parseKey(key);

    for (const neighbor of getDiagonalNeighbors(col, row)) {
      const neighborKey = cellKey(neighbor.col, neighbor.row);
      if (state.cells.has(neighborKey) || slots.has(neighborKey)) {
        continue;
      }

      slots.set(neighborKey, neighbor);
    }
  }

  return [...slots.values()];
}

function gridToPixel(col, row) {
  return {
    x: col * HALF_W,
    y: row * HALF_H,
  };
}

function polygonForCell(col, row) {
  const center = gridToPixel(col, row);
  return [
    { x: center.x, y: center.y - HALF_H },
    { x: center.x + HALF_W, y: center.y },
    { x: center.x, y: center.y + HALF_H },
    { x: center.x - HALF_W, y: center.y },
  ];
}

function drawDiamond(points, options) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.fillStyle = options.fill;
  ctx.strokeStyle = options.stroke;
  ctx.lineWidth = options.lineWidth ?? 2;
  if (options.dash) {
    ctx.setLineDash(options.dash);
  }
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function getCellBounds() {
  const cells = [...state.cells].map(parseKey);
  const cols = cells.map(({ col }) => col);
  const rows = cells.map(({ row }) => row);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);

  return {
    minX: (minCol - GRID_PAD) * HALF_W - HALF_W,
    maxX: (maxCol + GRID_PAD) * HALF_W + HALF_W,
    minY: (minRow - GRID_PAD) * HALF_H - HALF_H,
    maxY: (maxRow + GRID_PAD) * HALF_H + HALF_H,
    minCol: minCol - GRID_PAD,
    maxCol: maxCol + GRID_PAD,
    minRow: minRow - GRID_PAD,
    maxRow: maxRow + GRID_PAD,
  };
}

function getRenderBounds() {
  const cellBounds = getCellBounds();
  const slots = state.addSlots.length ? state.addSlots : collectAddSlots();
  const cols = [cellBounds.minCol, cellBounds.maxCol, ...slots.map(({ col }) => col)];
  const rows = [cellBounds.minRow, cellBounds.maxRow, ...slots.map(({ row }) => row)];

  return {
    minCol: Math.min(...cols) - 1,
    maxCol: Math.max(...cols) + 1,
    minRow: Math.min(...rows) - 1,
    maxRow: Math.max(...rows) + 1,
  };
}

function drawGridBackdrop() {
  const bounds = getRenderBounds();

  ctx.save();
  ctx.strokeStyle = "rgba(112, 92, 62, 0.12)";
  ctx.lineWidth = 1;

  for (let row = bounds.minRow; row <= bounds.maxRow; row += 1) {
    for (let col = bounds.minCol; col <= bounds.maxCol; col += 1) {
      const points = polygonForCell(col, row);
      drawDiamond(points, {
        fill: "rgba(255,255,255,0)",
        stroke: "rgba(112, 92, 62, 0.12)",
        lineWidth: 1,
      });
    }
  }

  ctx.restore();
}

function buildEffectMap() {
  const effects = new Map();

  for (const key of state.cells) {
    effects.set(key, {
      watered: 0,
      poisoned: 0,
      sunBuff: 0,
      dead: false,
    });
  }

  for (const [key, cropId] of state.plants) {
    const crop = cropById.get(cropId);
    if (!crop) continue;

    const origin = parseKey(key);

    if (crop.id === "water-flower") {
      for (const cell of state.cells) {
        const target = parseKey(cell);
        if (chebyshevDistance(origin, target) <= 2) {
          effects.get(cell).watered += 1;
        }
      }
    }

    if (crop.id === "poison-flower") {
      for (const neighbor of getDiagonalNeighbors(origin.col, origin.row)) {
        const neighborKey = cellKey(neighbor.col, neighbor.row);
        if (state.cells.has(neighborKey)) {
          effects.get(neighborKey).poisoned += 1;
        }
      }
    }

    if (crop.id === "sun-flower") {
      for (const neighbor of getDiagonalNeighbors(origin.col, origin.row)) {
        const neighborKey = cellKey(neighbor.col, neighbor.row);
        if (state.cells.has(neighborKey)) {
          effects.get(neighborKey).sunBuff += 1;
        }
      }
    }
  }

  for (const [key, cropId] of state.plants) {
    if (cropId === "fire-flower" && effects.get(key)?.watered > 0) {
      effects.get(key).dead = true;
    }
  }

  return effects;
}

function drawEffectOverlay(points, effect) {
  if (effect.watered > 0) {
    drawDiamond(points, {
      fill: "#8fd8ff",
      stroke: "#4097c8",
      lineWidth: 1.6,
    });
  }

  if (effect.poisoned > 0) {
    drawDiamond(points, {
      fill: "#b382ef",
      stroke: "#7744b4",
      lineWidth: 1.6,
    });
  }

  if (effect.sunBuff > 0) {
    drawStripedDiamond(points, {
      fill: "rgba(255, 243, 176, 0.96)",
      stroke: "#d5a722",
      stripe: "#f0c445",
      lineWidth: 1.4,
      stripeSpacing: 11,
    });
  }
}

function drawStripedDiamond(points, options) {
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const span = Math.max(maxX - minX, maxY - minY);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.fillStyle = options.fill;
  ctx.fill();
  ctx.clip();

  ctx.strokeStyle = options.stripe;
  ctx.lineWidth = 2;

  for (let offset = -span; offset <= span * 2; offset += options.stripeSpacing ?? 10) {
    ctx.beginPath();
    ctx.moveTo(minX + offset, maxY);
    ctx.lineTo(minX + offset + span, minY);
    ctx.stroke();
  }

  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.strokeStyle = options.stroke;
  ctx.lineWidth = options.lineWidth ?? 1.2;
  ctx.stroke();
  ctx.restore();
}

function drawPlant(col, row, crop, effect, isHovered) {
  const center = gridToPixel(col, row);
  const radius = CELL_SIZE * 0.4;
  const gradient = ctx.createLinearGradient(
    center.x - radius,
    center.y - radius,
    center.x + radius,
    center.y + radius,
  );
  gradient.addColorStop(0, crop.accentColor ?? crop.color);
  gradient.addColorStop(1, crop.color);

  ctx.save();
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.globalAlpha = effect.dead ? 0.42 : 0.96;
  ctx.fill();
  ctx.lineWidth = isHovered ? 3 : 2;
  ctx.strokeStyle = effect.dead ? "rgba(90, 57, 33, 0.85)" : "rgba(255,255,255,0.85)";
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = effect.dead ? "rgba(59,40,22,0.92)" : "rgba(44, 30, 16, 0.92)";
  ctx.font = `700 ${Math.round(CELL_SIZE * 0.44)}px "Malgun Gothic", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(crop.short, center.x, center.y + 1);
  ctx.restore();

  if (effect.dead) {
    ctx.save();
    ctx.strokeStyle = "rgba(92, 34, 20, 0.92)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(center.x - 14, center.y - 14);
    ctx.lineTo(center.x + 14, center.y + 14);
    ctx.moveTo(center.x + 14, center.y - 14);
    ctx.lineTo(center.x - 14, center.y + 14);
    ctx.stroke();
    ctx.restore();
  }

  if (effect.watered > 0 || effect.poisoned > 0 || effect.sunBuff > 0) {
    const markers = [];
    if (effect.watered > 0) markers.push({ color: "#4ea7d8", text: `W${effect.watered}` });
    if (effect.poisoned > 0) markers.push({ color: "#8f6ab4", text: `P${effect.poisoned}` });
    if (effect.sunBuff > 0) markers.push({ color: "#f0c445", text: `S${effect.sunBuff}` });

    markers.forEach((marker, index) => {
      const x = center.x - 14 + index * 18;
      const y = center.y + 24;
      ctx.save();
      ctx.fillStyle = marker.color;
      ctx.beginPath();
      ctx.roundRect(x - 7, y - 7, 16, 14, 5);
      ctx.fill();
      ctx.fillStyle = "#fffaf2";
      ctx.font = '700 9px "Segoe UI", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(marker.text, x + 1, y + 1);
      ctx.restore();
    });
  }
}

function getHoveredKey(kind) {
  return state.hover?.kind === kind ? state.hover.key : null;
}

function draw() {
  state.addSlots = collectAddSlots();
  const effects = buildEffectMap();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(state.view.offsetX, state.view.offsetY);
  ctx.scale(state.view.scale, state.view.scale);

  drawGridBackdrop();

  for (const key of state.cells) {
    const { col, row } = parseKey(key);
    const points = polygonForCell(col, row);
    const effect = effects.get(key);
    const isHovered = getHoveredKey("cell") === key;

    drawDiamond(points, {
      fill: isHovered ? "rgba(218, 180, 113, 0.98)" : "rgba(202, 161, 100, 0.96)",
      stroke: isHovered ? "rgba(126, 86, 39, 0.98)" : "rgba(138, 98, 50, 0.95)",
      lineWidth: isHovered ? 3.1 : 2.4,
    });

    drawEffectOverlay(points, effect);

    const center = gridToPixel(col, row);
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.38)";
    ctx.beginPath();
    ctx.ellipse(center.x - 8, center.y - 10, 16, 9, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const cropId = state.plants.get(key);
    if (cropId) {
      drawPlant(col, row, cropById.get(cropId), effect, isHovered);
    }
  }

  state.addSlots.forEach(({ col, row }) => {
    const key = cellKey(col, row);
    const isHovered = getHoveredKey("add") === key;
    const points = polygonForCell(col, row);

    drawDiamond(points, {
      fill: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.72)",
      stroke: isHovered ? "rgba(211, 139, 56, 0.95)" : "rgba(66, 107, 52, 0.48)",
      lineWidth: isHovered ? 3 : 2,
      dash: [8, 6],
    });

    const center = gridToPixel(col, row);
    ctx.save();
    ctx.fillStyle = isHovered ? "#d38b38" : "rgba(66, 107, 52, 0.72)";
    ctx.font = `700 ${Math.round(CELL_SIZE * 0.72)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("+", center.x, center.y + 2);
    ctx.restore();
  });

  ctx.restore();

  const plantedCount = state.plants.size;
  summary.textContent = `총 ${state.cells.size}칸, 작물 ${plantedCount}개. 점선 칸은 확장, 밭 칸은 ${cropById.get(state.selectedCropId).name} 심기입니다.`;
  updateSlotTooltip();
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const wrap = canvas.parentElement;
  const displayWidth = Math.max(320, Math.floor(wrap.clientWidth));
  const displayHeight = Math.max(560, Math.round(displayWidth * 0.72));

  canvas.width = Math.round(displayWidth * ratio);
  canvas.height = Math.round(displayHeight * ratio);
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  centerView();
}

function pointInPolygon(point, polygon) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function screenToWorld(x, y) {
  return {
    x: (x - state.view.offsetX) / state.view.scale,
    y: (y - state.view.offsetY) / state.view.scale,
  };
}

function worldToScreen(x, y) {
  return {
    x: x * state.view.scale + state.view.offsetX,
    y: y * state.view.scale + state.view.offsetY,
  };
}

function findCellAtPoint(x, y) {
  const worldPoint = screenToWorld(x, y);

  for (const key of state.cells) {
    const { col, row } = parseKey(key);
    if (pointInPolygon(worldPoint, polygonForCell(col, row))) {
      return { key, col, row };
    }
  }

  return null;
}

function findSlotAtPoint(x, y) {
  const worldPoint = screenToWorld(x, y);
  return state.addSlots.find(({ col, row }) =>
    pointInPolygon(worldPoint, polygonForCell(col, row)),
  );
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function centerView() {
  state.addSlots = collectAddSlots();
  const bounds = getCellBounds();
  const worldWidth = bounds.maxX - bounds.minX;
  const worldHeight = bounds.maxY - bounds.minY;
  const scaleX = canvas.clientWidth / Math.max(worldWidth, 1);
  const scaleY = canvas.clientHeight / Math.max(worldHeight, 1);
  state.view.scale = Math.max(
    MIN_SCALE,
    Math.min(MAX_SCALE, Math.min(scaleX, scaleY) * 0.88),
  );

  const worldCenterX = (bounds.minX + bounds.maxX) / 2;
  const worldCenterY = (bounds.minY + bounds.maxY) / 2;
  state.view.offsetX = canvas.clientWidth / 2 - worldCenterX * state.view.scale;
  state.view.offsetY = canvas.clientHeight / 2 - worldCenterY * state.view.scale;
  draw();
}

function renderPalette() {
  const paletteItems = [...CROPS, ...TOOLS];

  cropPalette.innerHTML = "";

  paletteItems.forEach((crop) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `crop-button${crop.id === state.selectedCropId ? " active" : ""}`;
    button.dataset.cropId = crop.id;
    button.innerHTML = `
      <i class="crop-swatch" style="background:linear-gradient(135deg, ${crop.accentColor ?? crop.color}, ${crop.color})"></i>
      <span>
        <strong>${crop.name}</strong>
        <span>${crop.summary}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      state.selectedCropId = crop.id;
      renderPalette();
      renderCropDetails();
      draw();
    });
    cropPalette.appendChild(button);
  });
}

function renderCropDetails() {
  const crop = cropById.get(state.selectedCropId);
  cropDetails.innerHTML = `
    <strong>${crop.name}</strong>
    <p>${crop.summary}</p>
    <ul>${crop.details.map((line) => `<li>${line}</li>`).join("")}</ul>
  `;
}

function updateSlotTooltip() {
  if (state.hover?.kind !== "add" || !state.hoverPoint) {
    slotTooltip.hidden = true;
    return;
  }

  const { col, row } = parseKey(state.hover.key);
  const distance = centerDistance(col, row);
  slotTooltip.innerHTML = `
    <strong>확장 비용</strong>
    마름모 격자거리 ${distance}<br />
    ${expansionCostText(distance)}
  `;
  slotTooltip.hidden = false;
  slotTooltip.style.left = `${Math.min(state.hoverPoint.x + 18, canvas.clientWidth - 220)}px`;
  slotTooltip.style.top = `${Math.min(state.hoverPoint.y + 18, canvas.clientHeight - 84)}px`;
}

function currentMaxDistance() {
  return Math.max(...[...state.cells].map((key) => {
    const { col, row } = parseKey(key);
    return centerDistance(col, row);
  }));
}

function expandToNextRing() {
  const nextDistance = currentMaxDistance() + 1;
  const targets = state.addSlots.filter(({ col, row }) => centerDistance(col, row) === nextDistance);

  targets.forEach(({ col, row }) => {
    state.cells.add(cellKey(col, row));
  });

  state.hover = null;
  state.hoverPoint = null;
  draw();
}

function updateHover(point) {
  state.hoverPoint = point;

  if (state.pointer.dragging) {
    if (state.hover !== null) {
      state.hover = null;
      draw();
    }
    canvas.style.cursor = "grabbing";
    return;
  }

  const slot = findSlotAtPoint(point.x, point.y);
  const cell = slot ? null : findCellAtPoint(point.x, point.y);
  const nextHover = slot
    ? { kind: "add", key: cellKey(slot.col, slot.row) }
    : cell
      ? { kind: "cell", key: cell.key }
      : null;

  if (
    nextHover?.kind !== state.hover?.kind ||
    nextHover?.key !== state.hover?.key
  ) {
    state.hover = nextHover;
    draw();
  }

  canvas.style.cursor = nextHover ? "pointer" : state.pointer.active ? "grab" : "default";
}

function applyClick(point) {
  const slot = findSlotAtPoint(point.x, point.y);
  if (slot) {
    state.cells.add(cellKey(slot.col, slot.row));
    draw();
    return;
  }

  const cell = findCellAtPoint(point.x, point.y);
  if (!cell) {
    return;
  }

  if (state.selectedCropId === "erase") {
    state.plants.delete(cell.key);
  } else {
    const existingCropId = state.plants.get(cell.key);
    if (existingCropId === state.selectedCropId) {
      state.plants.delete(cell.key);
    } else {
      state.plants.set(cell.key, state.selectedCropId);
    }
  }

  draw();
}

canvas.addEventListener("pointerdown", (event) => {
  const point = pointerPosition(event);
  state.pointer.active = true;
  state.pointer.id = event.pointerId;
  state.pointer.startX = point.x;
  state.pointer.startY = point.y;
  state.pointer.lastX = point.x;
  state.pointer.lastY = point.y;
  state.pointer.dragging = false;
  canvas.setPointerCapture(event.pointerId);
  canvas.style.cursor = "grab";
});

canvas.addEventListener("pointermove", (event) => {
  const point = pointerPosition(event);

  if (state.pointer.active && state.pointer.id === event.pointerId) {
    const dx = point.x - state.pointer.lastX;
    const dy = point.y - state.pointer.lastY;
    const travel = Math.hypot(
      point.x - state.pointer.startX,
      point.y - state.pointer.startY,
    );

    if (!state.pointer.dragging && travel > DRAG_THRESHOLD) {
      state.pointer.dragging = true;
    }

    if (state.pointer.dragging) {
      state.view.offsetX += dx;
      state.view.offsetY += dy;
      state.pointer.lastX = point.x;
      state.pointer.lastY = point.y;
      draw();
    } else {
      state.pointer.lastX = point.x;
      state.pointer.lastY = point.y;
    }
  }

  updateHover(point);
});

canvas.addEventListener("pointerleave", () => {
  if (state.hover !== null && !state.pointer.dragging) {
    state.hover = null;
    state.hoverPoint = null;
    draw();
  }
  canvas.style.cursor = state.pointer.dragging ? "grabbing" : "default";
});

canvas.addEventListener("pointerup", (event) => {
  if (state.pointer.id !== event.pointerId) {
    return;
  }

  const point = pointerPosition(event);
  const wasDragging = state.pointer.dragging;
  state.pointer.active = false;
  state.pointer.id = null;
  state.pointer.dragging = false;
  canvas.releasePointerCapture(event.pointerId);

  if (!wasDragging) {
    applyClick(point);
  }

  updateHover(point);
});

canvas.addEventListener("pointercancel", () => {
  state.pointer.active = false;
  state.pointer.id = null;
  state.pointer.dragging = false;
  state.hover = null;
  state.hoverPoint = null;
  canvas.style.cursor = "default";
  draw();
});

canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    const point = pointerPosition(event);
    const worldPoint = screenToWorld(point.x, point.y);
    const zoomMultiplier = event.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
    const nextScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, state.view.scale * zoomMultiplier),
    );

    if (nextScale === state.view.scale) {
      return;
    }

    state.view.scale = nextScale;
    state.view.offsetX = point.x - worldPoint.x * nextScale;
    state.view.offsetY = point.y - worldPoint.y * nextScale;
    draw();
    updateHover(point);
  },
  { passive: false },
);

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const point = pointerPosition(event);
  const cell = findCellAtPoint(point.x, point.y);
  if (!cell) {
    return;
  }

  state.cells.delete(cell.key);
  state.plants.delete(cell.key);

  for (const [key] of state.plants) {
    if (!state.cells.has(key)) {
      state.plants.delete(key);
    }
  }

  if (state.cells.size === 0) {
    state.cells = createStartingCells();
  }

  state.hover = null;
  draw();
  updateHover(point);
});

clearCropsButton.addEventListener("click", () => {
  state.plants.clear();
  draw();
});

expandRingButton.addEventListener("click", () => {
  expandToNextRing();
});

resetButton.addEventListener("click", () => {
  state.cells = createStartingCells();
  state.plants.clear();
  state.hover = null;
  state.hoverPoint = null;
  centerView();
});

window.render_game_to_text = () =>
  JSON.stringify({
    origin: "top-left, x increases right, y increases down",
    totalCells: state.cells.size,
    selectedCropId: state.selectedCropId,
    cells: [...state.cells].map(parseKey),
    plants: [...state.plants.entries()].map(([key, cropId]) => ({
      ...parseKey(key),
      cropId,
    })),
    expandableSlots: state.addSlots,
  });

window.advanceTime = () => {
  draw();
};

window.__planner_debug = {
  getView: () => ({ ...state.view }),
  getAddSlots: () => state.addSlots.map((slot) => ({ ...slot })),
  getCells: () => [...state.cells].map(parseKey),
  getPlants: () =>
    [...state.plants.entries()].map(([key, cropId]) => ({
      ...parseKey(key),
      cropId,
    })),
  gridToScreen: (col, row) => {
    const center = gridToPixel(col, row);
    return worldToScreen(center.x, center.y);
  },
  selectCrop: (cropId) => {
    if (cropById.has(cropId)) {
      state.selectedCropId = cropId;
      renderPalette();
      renderCropDetails();
      draw();
    }
  },
};

window.addEventListener("resize", resizeCanvas);

renderPalette();
renderCropDetails();
draw();
resizeCanvas();
