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
    hourlyYield: 0,
  },
  {
    id: "red-leaf",
    name: "붉은꽃",
    short: "붉",
    color: "#d63f3f",
    accentColor: "#ff8e8e",
    summary: "주기적 물 필요",
    details: [
      "1칸 차지",
      "주기적으로 물이 필요한 작물입니다.",
    ],
    hourlyYield: 240,
  },
  {
    id: "water-flower",
    name: "이슬뿌리",
    short: "이",
    color: "#4aa8e8",
    accentColor: "#9fd8ff",
    summary: "체비쇼프 2칸 물 공급",
    details: [
      "1칸 차지",
      "체비쇼프 거리 2칸까지 항상 물을 공급합니다.",
      "물 공급 범위는 파란 오버레이로 표시됩니다.",
    ],
    hourlyYield: 0,
  },
  {
    id: "moss",
    name: "푸른이끼",
    short: "푸",
    color: "#2e9a90",
    accentColor: "#7bd8c2",
    summary: "첫 물 1회",
    details: [
      "1칸 차지",
      "처음 1회만 물이 필요합니다.",
    ],
    hourlyYield: 90,
  },
  {
    id: "poison-flower",
    name: "독꽃",
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
    hourlyYield: 6,
  },
  {
    id: "mushroom",
    name: "달빛버섯",
    short: "달",
    color: "#fff8dd",
    accentColor: "#f1df8f",
    summary: "첫 물 1회, 1회 수확",
    details: [
      "1칸 차지",
      "처음 1회만 물이 필요합니다.",
      "1회만 수확 가능한 작물입니다.",
    ],
    hourlyYield: 0,
  },
  {
    id: "star-flower",
    name: "별꽃",
    short: "별",
    color: "#7dbf3f",
    accentColor: "#f2da55",
    summary: "주기적 물 필요",
    details: [
      "1칸 차지",
      "주기적으로 물이 필요한 작물입니다.",
    ],
    hourlyYield: 12,
  },
  {
    id: "fire-flower",
    name: "불씨덩굴",
    short: "불",
    color: "#e3481e",
    accentColor: "#ffb347",
    summary: "물 공급 시 사망",
    details: [
      "1칸 차지",
      "물 공급을 받으면 즉시 죽는 작물입니다.",
    ],
    hourlyYield: 6,
  },
  {
    id: "wind-flower",
    name: "바람꽃",
    short: "바",
    color: "#cbefff",
    accentColor: "#eefaff",
    summary: "시간당 생산량 2",
    details: [
      "1칸 차지",
      "고유 범위 효과는 없는 일반 생산 작물입니다.",
    ],
    hourlyYield: 2,
  },
  {
    id: "phantom-fern",
    name: "환영고사리",
    short: "환",
    color: "#78b48d",
    accentColor: "#c9f0da",
    summary: "시간당 생산량 7.5",
    details: [
      "1칸 차지",
      "주변 4칸의 서로 다른 식물 수에 따라 생산량이 증가합니다.",
    ],
    hourlyYield: 7.5,
  },
  {
    id: "sunset-tree",
    name: "노을목",
    short: "노",
    color: "#c87442",
    accentColor: "#f2bb7d",
    summary: "시간당 생산량 6",
    details: [
      "1칸 차지",
      "고유 범위 효과는 없는 일반 생산 작물입니다.",
    ],
    hourlyYield: 6,
  },
  {
    id: "sun-flower",
    name: "햇살꽃",
    short: "햇",
    color: "#f2c230",
    accentColor: "#fff09f",
    summary: "주기적 물 필요, 생산속도 +30%",
    details: [
      "1칸 차지",
      "주기적으로 물이 필요합니다.",
      "대각선 인접 1칸 범위의 생산 속도를 30% 올립니다.",
      "버프 범위는 금색 오버레이로 표시됩니다.",
    ],
    hourlyYield: 0,
  },
];

const TOOLS = [
  {
    id: "erase-plant",
    name: "식물 지우개",
    short: "식",
    color: "#888888",
    accentColor: "#d4d4d4",
    summary: "심어진 식물 제거",
    details: [
      "밭은 남겨두고 심어진 식물만 제거합니다.",
    ],
    hourlyYield: 0,
  },
  {
    id: "erase-tile",
    name: "땅 지우개",
    short: "땅",
    color: "#6f6048",
    accentColor: "#b7a27d",
    summary: "밭 타일 제거",
    details: [
      "선택한 밭 타일 자체를 제거합니다.",
    ],
    hourlyYield: 0,
  },
  {
    id: "desertify",
    name: "사막화",
    short: "사",
    color: "#b78945",
    accentColor: "#e0bd79",
    summary: "물 공급 차단 땅 속성",
    details: [
      "선택한 땅에 사막화 속성을 추가하거나 제거합니다.",
      "사막화된 땅은 이슬뿌리 범위 안이어도 물을 받지 않습니다.",
    ],
    hourlyYield: 0,
  },
];

const cropById = new Map([...CROPS, ...TOOLS].map((crop) => [crop.id, crop]));

const canvas = document.getElementById("field-canvas");
const ctx = canvas.getContext("2d");
const summary = document.getElementById("field-summary");
const togglePanLockButton = document.getElementById("toggle-pan-lock-button");
const copyLayoutButton = document.getElementById("copy-layout-button");
const toolbarActions = copyLayoutButton.parentElement;
const expandRingButton = document.getElementById("expand-ring-button");
const resetButton = document.getElementById("reset-button");
const clearCropsButton = document.getElementById("clear-crops-button");
const cropPalette = document.getElementById("crop-palette");
const paletteDock = document.createElement("div");
paletteDock.className = "palette-dock";
const toolSection = document.createElement("section");
toolSection.className = "palette-section";
toolSection.innerHTML = '<p class="palette-title">맵 도구</p>';
const toolPalette = document.createElement("div");
toolPalette.id = "tool-palette";
toolPalette.className = "tool-palette horizontal";
toolPalette.setAttribute("aria-label", "맵 도구 선택");
const cropSection = document.createElement("section");
cropSection.className = "palette-section";
cropSection.innerHTML = '<p class="palette-title">씨앗</p>';
const paletteAnchor = cropPalette.parentElement;
paletteAnchor.insertBefore(paletteDock, cropPalette);
toolSection.appendChild(toolPalette);
cropSection.appendChild(cropPalette);
paletteDock.append(toolSection, cropSection);
const slotTooltip = document.getElementById("slot-tooltip");
const toggleStatsButton = document.getElementById("toggle-stats-button");
const productionSummary = document.getElementById("production-summary");
const statsContent = document.getElementById("stats-content");
const productionGrid = document.getElementById("production-grid");
const copyFeedback = document.getElementById("copy-feedback");
const plannerCard = document.querySelector(".planner-card");
const siteNote = document.querySelector(".site-note");
const shareLayoutButton = document.createElement("button");
shareLayoutButton.id = "share-layout-button";
shareLayoutButton.type = "button";
shareLayoutButton.textContent = "밭 공유";
toolbarActions.insertBefore(shareLayoutButton, expandRingButton);
const slotPanel = document.createElement("section");
slotPanel.className = "slot-panel";
slotPanel.innerHTML = `
  <div class="slot-panel-header">
    <h3>밭 저장하기</h3>
    <p>최대 10개 저장</p>
  </div>
  <div id="slot-list" class="slot-list"></div>
`;
plannerCard.insertBefore(slotPanel, siteNote);
const slotList = document.getElementById("slot-list");
const tabButtons = [...document.querySelectorAll(".tab-button")];
const plannerView = document.getElementById("planner-view");
const calculatorView = document.getElementById("calculator-view");
const recipeTargetSelect = document.getElementById("recipe-target-select");
const recipeTargetLevelInput = document.getElementById("recipe-target-level");
const recipeTargetCountInput = document.getElementById("recipe-target-count");
const recipeControls = document.getElementById("recipe-controls");
const recipeSummary = document.getElementById("recipe-summary");
const recipeBreakdown = document.getElementById("recipe-breakdown");
const recipeList = document.getElementById("recipe-list");

const STORAGE_KEY = "alchansia-layout-v1";
const SLOT_STORAGE_KEY = "alchansia-layout-slots-v1";
const SHARE_PARAM = "layout";
const MAX_LAYOUT_SLOTS = 10;
const ENHANCE_EXPECTED_COST = 3;
const CENTER_CELL = { col: 3, row: 3 };
const BASE_BOUNDS = {
  minCol: 0,
  maxCol: 6,
  minRow: 0,
  maxRow: 6,
};

const state = {
  cells: createStartingCells(),
  addSlots: [],
  plants: new Map(),
  desertTiles: new Set(),
  layoutSlots: Array.from({ length: MAX_LAYOUT_SLOTS }, () => null),
  recipes: [],
  recipeSelections: new Map(),
  hover: null,
  hoverPoint: null,
  activeTab: "planner",
  selectedCropId: CROPS[0].id,
  panLocked: true,
  statsCollapsed: window.matchMedia("(max-width: 720px)").matches,
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
    pointers: new Map(),
    pinchDistance: 0,
    pinchScale: 1,
  },
};

let copyFeedbackTimeout = null;
let resizeObserver = null;
let lastDevicePixelRatio = window.devicePixelRatio || 1;
let lastCompactViewport = window.matchMedia("(max-width: 720px)").matches;

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

function currentLayoutPayload() {
  return {
    cells: [...state.cells],
    plants: [...state.plants.entries()],
    desertTiles: [...state.desertTiles],
    selectedCropId: state.selectedCropId,
  };
}

function applyLayoutPayload(payload) {
  const cells = Array.isArray(payload?.cells) && payload.cells.length
    ? new Set(payload.cells.filter((value) => typeof value === "string"))
    : createStartingCells();
  const plants = new Map(
    Array.isArray(payload?.plants)
      ? payload.plants.filter(
          (entry) =>
            Array.isArray(entry) &&
            entry.length === 2 &&
            typeof entry[0] === "string" &&
            cropById.has(entry[1]),
        )
      : [],
  );
  const desertTiles = new Set(
    Array.isArray(payload?.desertTiles)
      ? payload.desertTiles.filter((value) => typeof value === "string")
      : [],
  );

  state.cells = cells.size ? cells : createStartingCells();
  state.plants = new Map([...plants].filter(([key]) => state.cells.has(key)));
  state.desertTiles = new Set([...desertTiles].filter((key) => state.cells.has(key)));

  if (cropById.has(payload?.selectedCropId)) {
    state.selectedCropId = payload.selectedCropId;
  }
}

function encodeLayoutPayload(payload) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeLayoutPayload(encoded) {
  const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(normalized + padding);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function currentShareUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete(SHARE_PARAM);
  url.hash = `${SHARE_PARAM}=${encodeLayoutPayload(currentLayoutPayload())}`;
  return url.toString();
}

function updateUrlWithCurrentLayout() {
  window.history.replaceState(null, "", currentShareUrl());
}

function clearSharedLayoutFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete(SHARE_PARAM);
  url.hash = "";
  window.history.replaceState(null, "", url.toString());
}

function loadLayoutFromUrl() {
  try {
    const url = new URL(window.location.href);
    const hashValue = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
    const hashParams = new URLSearchParams(hashValue);
    const encoded = hashParams.get(SHARE_PARAM) ?? url.searchParams.get(SHARE_PARAM);
    if (!encoded) {
      return false;
    }

    applyLayoutPayload(decodeLayoutPayload(encoded));
    saveLayoutToStorage();
    return true;
  } catch (error) {
    return false;
  }
}

function applySharedLayoutFromCurrentUrl(showMessage = false) {
  const loaded = loadLayoutFromUrl();
  if (!loaded) {
    return false;
  }

  renderPalette();
  centerView();

  if (showMessage) {
    showCopyFeedback("공유 링크 배치를 불러왔습니다.");
  }

  return true;
}

function saveLayoutToStorage() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLayoutPayload()));
  } catch (error) {
    // Ignore storage errors so the planner remains usable.
  }
}

function normalizeLayoutSlots(rawSlots) {
  const slots = Array.from({ length: MAX_LAYOUT_SLOTS }, (_, index) => {
    const rawSlot = Array.isArray(rawSlots) ? rawSlots[index] : null;
    if (!rawSlot || typeof rawSlot !== "object" || !rawSlot.payload) {
      return null;
    }

    return {
      name: typeof rawSlot.name === "string" ? rawSlot.name : "",
      payload: rawSlot.payload,
      savedAt: typeof rawSlot.savedAt === "number" ? rawSlot.savedAt : Date.now(),
    };
  });

  return slots;
}

function saveLayoutSlotsToStorage() {
  try {
    window.localStorage.setItem(SLOT_STORAGE_KEY, JSON.stringify(state.layoutSlots));
  } catch (error) {
    // Ignore storage errors so the planner remains usable.
  }
}

function loadLayoutSlotsFromStorage() {
  try {
    const raw = window.localStorage.getItem(SLOT_STORAGE_KEY);
    if (!raw) {
      state.layoutSlots = Array.from({ length: MAX_LAYOUT_SLOTS }, () => null);
      return;
    }

    state.layoutSlots = normalizeLayoutSlots(JSON.parse(raw));
  } catch (error) {
    state.layoutSlots = Array.from({ length: MAX_LAYOUT_SLOTS }, () => null);
  }
}

function slotDisplayName(slot, index) {
  return slot?.name?.trim() || `슬롯 ${index + 1}`;
}

function formatSlotTimestamp(savedAt) {
  if (!savedAt) {
    return "비어 있음";
  }

  return new Date(savedAt).toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderLayoutSlots() {
  slotList.innerHTML = "";

  state.layoutSlots.forEach((slot, index) => {
    const row = document.createElement("article");
    row.className = "slot-row";

    const nameInput = document.createElement("input");
    nameInput.className = "slot-name-input";
    nameInput.type = "text";
    nameInput.maxLength = 24;
    nameInput.placeholder = `슬롯 ${index + 1}`;
    nameInput.value = slot?.name ?? "";
    nameInput.setAttribute("aria-label", `슬롯 ${index + 1} 이름`);
    nameInput.addEventListener("change", () => {
      if (state.layoutSlots[index]) {
        state.layoutSlots[index].name = nameInput.value.trim();
        saveLayoutSlotsToStorage();
        renderLayoutSlots();
      }
    });

    const meta = document.createElement("p");
    meta.className = "slot-meta";
    meta.textContent = slot
      ? `${slotDisplayName(slot, index)} · ${formatSlotTimestamp(slot.savedAt)}`
      : `슬롯 ${index + 1} · 비어 있음`;

    const actions = document.createElement("div");
    actions.className = "slot-actions";

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "slot-action-button";
    saveButton.textContent = "저장";
    saveButton.addEventListener("click", () => {
      state.layoutSlots[index] = {
        name: nameInput.value.trim(),
        payload: currentLayoutPayload(),
        savedAt: Date.now(),
      };
      saveLayoutSlotsToStorage();
      renderLayoutSlots();
      showCopyFeedback(`${slotDisplayName(state.layoutSlots[index], index)}에 저장했습니다.`);
    });

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.className = "slot-action-button subtle";
    loadButton.textContent = "불러오기";
    loadButton.disabled = !slot;
    loadButton.addEventListener("click", () => {
      if (!state.layoutSlots[index]) {
        return;
      }
      applyLayoutPayload(state.layoutSlots[index].payload);
      saveLayoutToStorage();
      renderPalette();
      centerView();
      renderLayoutSlots();
      showCopyFeedback(`${slotDisplayName(state.layoutSlots[index], index)}을 불러왔습니다.`);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "slot-action-button subtle";
    deleteButton.textContent = "삭제";
    deleteButton.disabled = !slot;
    deleteButton.addEventListener("click", () => {
      state.layoutSlots[index] = null;
      saveLayoutSlotsToStorage();
      renderLayoutSlots();
      showCopyFeedback(`슬롯 ${index + 1}을 비웠습니다.`);
    });

    actions.append(saveButton, loadButton, deleteButton);
    row.append(nameInput, meta, actions);
    slotList.appendChild(row);
  });
}

function setActiveTab(tabId) {
  state.activeTab = tabId;
  plannerView.hidden = tabId !== "planner";
  calculatorView.hidden = tabId !== "calculator";

  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });

  if (tabId === "planner") {
    resizeCanvas();
  }
}

function enhancementExpectedCount(levelGap) {
  return ENHANCE_EXPECTED_COST ** Math.max(levelGap, 0);
}

function normalizeItemName(name) {
  return name.replace(/\s+/g, "").trim();
}

function parseRecipeCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  if (!headerLine) {
    return [];
  }

  return lines
    .map((line) => line.split(",").map((value) => value.trim()))
    .filter((parts) => parts.length >= 4)
    .map(([material1, material2, result, requiredLevel]) => ({
      material1,
      material2,
      result,
      requiredLevel: Number(requiredLevel) || 0,
      key1: normalizeItemName(material1),
      key2: normalizeItemName(material2),
      resultKey: normalizeItemName(result),
    }));
}

function getRecipeCollections() {
  const productKeys = new Set(state.recipes.map((recipe) => recipe.resultKey));
  const materialKeys = new Set(
    state.recipes.flatMap((recipe) => [recipe.key1, recipe.key2]),
  );
  const baseKeys = [...materialKeys].filter((key) => !productKeys.has(key));
  const intermediateKeys = [...productKeys].filter((key) => materialKeys.has(key));
  const finalKeys = [...productKeys].filter((key) => !materialKeys.has(key));

  return {
    productKeys,
    materialKeys,
    baseKeys: new Set(baseKeys),
    intermediateKeys: new Set(intermediateKeys),
    finalKeys: new Set(finalKeys),
  };
}

function recipeSourceMap() {
  return new Map(state.recipes.map((recipe) => [recipe.resultKey, recipe]));
}

function itemDisplayName(itemKey) {
  const recipeByResult = state.recipes.find((recipe) => recipe.resultKey === itemKey);
  if (recipeByResult) {
    return recipeByResult.result;
  }

  const recipeByMaterial = state.recipes.find(
    (recipe) => recipe.key1 === itemKey || recipe.key2 === itemKey,
  );
  if (!recipeByMaterial) {
    return itemKey;
  }

  return recipeByMaterial.key1 === itemKey ? recipeByMaterial.material1 : recipeByMaterial.material2;
}

function getRecipeSelection(path, requiredLevel) {
  const existing = state.recipeSelections.get(path);
  if (existing && existing.firstLevel + existing.secondLevel === requiredLevel) {
    return existing;
  }

  const firstLevel = Math.floor(requiredLevel / 2);
  const nextSelection = {
    firstLevel,
    secondLevel: requiredLevel - firstLevel,
  };
  state.recipeSelections.set(path, nextSelection);
  return nextSelection;
}

function setRecipeSelection(path, requiredLevel, anchor, value) {
  const safeValue = Math.max(0, Math.min(requiredLevel, Number(value) || 0));
  const nextSelection =
    anchor === "first"
      ? { firstLevel: safeValue, secondLevel: requiredLevel - safeValue }
      : { firstLevel: requiredLevel - safeValue, secondLevel: safeValue };

  state.recipeSelections.set(path, nextSelection);
}

function mergeCountMaps(left, right) {
  const merged = new Map(left);
  right.forEach((value, key) => {
    merged.set(key, (merged.get(key) ?? 0) + value);
  });
  return merged;
}

function scaleCountMap(source, factor) {
  const scaled = new Map();
  source.forEach((value, key) => {
    scaled.set(key, value * factor);
  });
  return scaled;
}

function analyzeRequirement(itemKey, usedLevel, recipeMap, path, includeIntermediate = false) {
  const recipe = recipeMap.get(itemKey);
  const collections = getRecipeCollections();

  if (!recipe) {
    return {
      baseLevels: new Map([[`${itemKey}|${usedLevel}`, enhancementExpectedCount(usedLevel)]]),
      intermediate: new Map(),
    };
  }

  const selection = getRecipeSelection(path, recipe.requiredLevel);
  const copiesNeeded = enhancementExpectedCount(usedLevel);
  const firstAnalysis = analyzeRequirement(
    recipe.key1,
    selection.firstLevel,
    recipeMap,
    `${path}/1`,
    true,
  );
  const secondAnalysis = analyzeRequirement(
    recipe.key2,
    selection.secondLevel,
    recipeMap,
    `${path}/2`,
    true,
  );

  let baseLevels = mergeCountMaps(firstAnalysis.baseLevels, secondAnalysis.baseLevels);
  baseLevels = scaleCountMap(baseLevels, copiesNeeded);

  let intermediate = mergeCountMaps(firstAnalysis.intermediate, secondAnalysis.intermediate);
  intermediate = scaleCountMap(intermediate, copiesNeeded);

  if (includeIntermediate && collections.intermediateKeys.has(itemKey)) {
    const usageKey = `${itemKey}|${usedLevel}`;
    intermediate.set(usageKey, (intermediate.get(usageKey) ?? 0) + copiesNeeded);
  }

  return { baseLevels, intermediate };
}

function groupLevelMap(levelMap) {
  const grouped = new Map();

  [...levelMap.entries()].forEach(([key, count]) => {
    const [itemKey, levelText] = key.split("|");
    const level = Number(levelText) || 0;
    const entry = grouped.get(itemKey) ?? {
      displayName: itemDisplayName(itemKey),
      direct: [],
      rawTotal: 0,
    };

    entry.direct.push({ level, count });
    entry.rawTotal += count * enhancementExpectedCount(level);
    grouped.set(itemKey, entry);
  });

  grouped.forEach((entry) => {
    entry.direct.sort((a, b) => b.level - a.level);
  });

  return [...grouped.values()].sort((a, b) => a.displayName.localeCompare(b.displayName, "ko"));
}

function formatLevelLabel(level) {
  return level > 0 ? `+${level}강` : "노강";
}

function renderRequirementSection(title, entries) {
  if (!entries.length) {
    return `
      <div class="result-card">
        <h4>${title}</h4>
        <p>없음</p>
      </div>
    `;
  }

  const lines = entries
    .map((entry) => {
      const directText = entry.direct
        .map(
          ({ level, count }) =>
            `${formatLevelLabel(level)} ${count.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}개`,
        )
        .join(" / ");

      const normalizedText = entry.rawTotal.toLocaleString("ko-KR", {
        maximumFractionDigits: 2,
      });

      return `
        <div class="requirement-line">
          <p><strong>${entry.displayName}</strong></p>
          <p>강화된 재료 필요 개수 : ${directText}</p>
          <p>노강 환산 개수 : ${normalizedText}개</p>
        </div>
      `;
    })
    .join("");

  return `
    <div class="result-card">
      <h4>${title}</h4>
      ${lines}
    </div>
  `;
}

function renderRecipeSelectionNode(recipe, recipeMap, path) {
  const selection = getRecipeSelection(path, recipe.requiredLevel);
  const node = document.createElement("article");
  node.className = "recipe-node";
  node.innerHTML = `
    <div class="recipe-node-header">
      <h5>${recipe.result}</h5>
      <p>필요 강화 합 ${recipe.requiredLevel}</p>
    </div>
    <div class="recipe-choice-grid">
      <label class="field">
        <span>${recipe.material1} 강화</span>
        <select data-path="${path}" data-anchor="first"></select>
      </label>
      <label class="field">
        <span>${recipe.material2} 강화</span>
        <select data-path="${path}" data-anchor="second"></select>
      </label>
    </div>
    <p class="recipe-choice-note">${recipe.material1} +${selection.firstLevel} / ${recipe.material2} +${selection.secondLevel}</p>
  `;

  const [firstSelect, secondSelect] = [...node.querySelectorAll("select")];
  const options = Array.from({ length: recipe.requiredLevel + 1 }, (_, level) => {
    const option = document.createElement("option");
    option.value = String(level);
    option.textContent = `+${level}`;
    return option;
  });
  options.forEach((option) => firstSelect.appendChild(option.cloneNode(true)));
  options.forEach((option) => secondSelect.appendChild(option.cloneNode(true)));
  firstSelect.value = String(selection.firstLevel);
  secondSelect.value = String(selection.secondLevel);

  const handleSelectionChange = (event) => {
    setRecipeSelection(path, recipe.requiredLevel, event.target.dataset.anchor, event.target.value);
    renderRecipeCalculator();
  };
  firstSelect.addEventListener("change", handleSelectionChange);
  secondSelect.addEventListener("change", handleSelectionChange);

  const children = document.createElement("div");
  children.className = "recipe-children";

  const childRecipe1 = recipeMap.get(recipe.key1);
  if (childRecipe1) {
    children.appendChild(renderRecipeSelectionNode(childRecipe1, recipeMap, `${path}/1`));
  }

  const childRecipe2 = recipeMap.get(recipe.key2);
  if (childRecipe2) {
    children.appendChild(renderRecipeSelectionNode(childRecipe2, recipeMap, `${path}/2`));
  }

  if (children.childElementCount) {
    node.appendChild(children);
  }

  return node;
}

function renderRecipeTable() {
  if (!state.recipes.length) {
    recipeList.innerHTML = `<div class="result-card"><p>조합법을 불러오는 중입니다.</p></div>`;
    return;
  }

  const rows = state.recipes
    .map(
      (recipe) => `
        <tr>
          <td>${recipe.material1}</td>
          <td>${recipe.material2}</td>
          <td>${recipe.result}</td>
          <td>${recipe.requiredLevel}</td>
        </tr>
      `,
    )
    .join("");

  recipeList.innerHTML = `
    <table class="mini-table">
      <thead>
        <tr>
          <th>재료 1</th>
          <th>재료 2</th>
          <th>완성품</th>
          <th>필요 강화 합</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderRecipeCalculator() {
  if (!state.recipes.length) {
    recipeTargetSelect.innerHTML = `<option>조합법 로딩 중...</option>`;
    recipeSummary.innerHTML = `<p>조합법을 불러오는 중입니다.</p>`;
    recipeControls.innerHTML = "";
    recipeBreakdown.innerHTML = "";
    renderRecipeTable();
    return;
  }

  if (!recipeTargetSelect.options.length) {
    const collections = getRecipeCollections();
    const intermediateOptions = state.recipes
      .filter((recipe) => collections.intermediateKeys.has(recipe.resultKey))
      .map((recipe) => `<option value="${recipe.resultKey}">${recipe.result}</option>`)
      .join("");
    const finalOptions = state.recipes
      .filter((recipe) => collections.finalKeys.has(recipe.resultKey))
      .map((recipe) => `<option value="${recipe.resultKey}">${recipe.result}</option>`)
      .join("");

    recipeTargetSelect.innerHTML = `
      <optgroup label="중간재료">${intermediateOptions}</optgroup>
      <optgroup label="완성품">${finalOptions}</optgroup>
    `;
  }

  const selectedKey = recipeTargetSelect.value || state.recipes[0].resultKey;
  recipeTargetSelect.value = selectedKey;
  const targetLevel = Math.max(0, Number(recipeTargetLevelInput.value) || 0);
  const targetCount = Math.max(1, Number(recipeTargetCountInput.value) || 1);
  recipeTargetLevelInput.value = String(targetLevel);
  recipeTargetCountInput.value = String(targetCount);
  const recipeMap = recipeSourceMap();
  const recipe = recipeMap.get(selectedKey);

  if (!recipe) {
    recipeSummary.innerHTML = `<p>선택한 완성품의 계산 정보를 찾지 못했습니다.</p>`;
    recipeControls.innerHTML = "";
    recipeBreakdown.innerHTML = "";
    return;
  }

  recipeControls.innerHTML = "";
  recipeControls.appendChild(renderRecipeSelectionNode(recipe, recipeMap, selectedKey));

  const rootSelection = getRecipeSelection(selectedKey, recipe.requiredLevel);
  const finalCopiesNeeded = enhancementExpectedCount(targetLevel) * targetCount;
  const topMaterialNeeds = [
    {
      name: recipe.material1,
      level: rootSelection.firstLevel,
      count: enhancementExpectedCount(rootSelection.firstLevel) * finalCopiesNeeded,
    },
    {
      name: recipe.material2,
      level: rootSelection.secondLevel,
      count: enhancementExpectedCount(rootSelection.secondLevel) * finalCopiesNeeded,
    },
  ];
  const requirement = analyzeRequirement(selectedKey, targetLevel, recipeMap, selectedKey, false);
  const baseEntries = groupLevelMap(requirement.baseLevels);
  const intermediateEntries = groupLevelMap(requirement.intermediate);
  recipeSummary.innerHTML = `
    <h4><strong>${recipe.result}+${targetLevel}</strong></h4>
    <p>제작 개수 : ${targetCount.toLocaleString("ko-KR")}개</p>
    <p>필요 <strong>${recipe.result}+0</strong> : ${finalCopiesNeeded.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}개</p>
    <p>상위 재료 필요 개수: ${topMaterialNeeds
      .map(
        (material) =>
          `<strong>${material.name}</strong> ${formatLevelLabel(material.level)} ${material.count.toLocaleString("ko-KR", {
            maximumFractionDigits: 2,
          })}개`,
      )
      .join(" / ")}</p>
  `;

  recipeBreakdown.innerHTML = `
    ${renderRequirementSection("필요 중간 재료", intermediateEntries)}
    ${renderRequirementSection("필요 기본 재료", baseEntries)}
  `;

  renderRecipeTable();
}

async function loadRecipes() {
  try {
    const response = await fetch("./조합법.csv", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Recipe csv load failed");
    }

    state.recipes = parseRecipeCsv(await response.text());
    recipeTargetSelect.innerHTML = "";
    renderRecipeCalculator();
  } catch (error) {
    recipeSummary.innerHTML = `<p>조합법.csv를 불러오지 못했습니다.</p>`;
    recipeBreakdown.innerHTML = "";
    recipeList.innerHTML = "";
  }
}

function loadLayoutFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    applyLayoutPayload(JSON.parse(raw));
  } catch (error) {
    // Ignore corrupt storage and keep defaults.
  }
}

function chebyshevDistance(a, b) {
  const pointA = logicalPoint(a.col, a.row);
  const pointB = logicalPoint(b.col, b.row);
  return Math.max(
    Math.abs(pointA.x - pointB.x),
    Math.abs(pointA.y - pointB.y),
  );
}

function borderLayer(col, row) {
  const colGap = Math.max(BASE_BOUNDS.minCol - col, col - BASE_BOUNDS.maxCol, 0);
  const rowGap = Math.max(BASE_BOUNDS.minRow - row, row - BASE_BOUNDS.maxRow, 0);
  return Math.max(colGap, rowGap);
}

function expansionCostText(layer) {
  return `${layer}강 마력결정 1개 + ${layer}강 각인석 1개`;
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
        if (
          chebyshevDistance(origin, target) <= 2 &&
          !state.desertTiles.has(cell)
        ) {
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

function paintCanvasBackground(targetCtx, width, height) {
  targetCtx.save();
  const radial = targetCtx.createRadialGradient(
    width * 0.24,
    height * 0.08,
    20,
    width * 0.24,
    height * 0.08,
    width * 0.55,
  );
  radial.addColorStop(0, "rgba(255, 255, 255, 0.62)");
  radial.addColorStop(0.28, "rgba(255, 255, 255, 0.22)");
  radial.addColorStop(1, "rgba(255, 255, 255, 0)");

  const linear = targetCtx.createLinearGradient(0, 0, 0, height);
  linear.addColorStop(0, "#f4e4bd");
  linear.addColorStop(1, "#e4d19f");

  targetCtx.fillStyle = linear;
  targetCtx.fillRect(0, 0, width, height);
  targetCtx.fillStyle = radial;
  targetCtx.fillRect(0, 0, width, height);
  targetCtx.restore();
}

function draw(options = {}) {
  const {
    includeAddSlots = true,
    includeCanvasBackground = false,
  } = options;

  state.addSlots = collectAddSlots();
  const effects = buildEffectMap();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (includeCanvasBackground) {
    paintCanvasBackground(ctx, canvas.width, canvas.height);
  }
  ctx.save();
  ctx.translate(state.view.offsetX, state.view.offsetY);
  ctx.scale(state.view.scale, state.view.scale);

  drawGridBackdrop();

  for (const key of state.cells) {
    const { col, row } = parseKey(key);
    const points = polygonForCell(col, row);
    const effect = effects.get(key);
    const isHovered = getHoveredKey("cell") === key;
    const isDesert = state.desertTiles.has(key);

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

    if (isDesert) {
      ctx.save();
      ctx.strokeStyle = "rgba(130, 83, 31, 0.72)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(center.x - 16, center.y - 3);
      ctx.lineTo(center.x - 3, center.y - 10);
      ctx.lineTo(center.x + 5, center.y - 2);
      ctx.lineTo(center.x + 16, center.y - 9);
      ctx.moveTo(center.x - 10, center.y + 8);
      ctx.lineTo(center.x - 1, center.y + 2);
      ctx.lineTo(center.x + 11, center.y + 10);
      ctx.stroke();
      ctx.restore();
    }

    const cropId = state.plants.get(key);
    if (cropId) {
      drawPlant(col, row, cropById.get(cropId), effect, isHovered);
    }
  }

  if (includeAddSlots) {
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
  }

  ctx.restore();

  const plantedCount = state.plants.size;
  summary.textContent = `총 ${state.cells.size}칸, 작물 ${plantedCount}개. 점선 칸은 확장, 밭 칸은 ${cropById.get(state.selectedCropId).name} 심기입니다.`;
  updateSlotTooltip();
  renderProductionStats();
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const wrap = canvas.parentElement;
  const compactViewport = window.matchMedia("(max-width: 720px)").matches;
  const displayWidth = Math.max(320, Math.floor(wrap.clientWidth));
  const displayHeight = compactViewport
    ? displayWidth
    : Math.max(560, Math.round(displayWidth * 0.72));

  canvas.width = Math.round(displayWidth * ratio);
  canvas.height = Math.round(displayHeight * ratio);
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  centerView();
}

function startCanvasResolutionWatcher() {
  const syncIfNeeded = () => {
    const currentRatio = window.devicePixelRatio || 1;
    if (Math.abs(currentRatio - lastDevicePixelRatio) > 0.001) {
      lastDevicePixelRatio = currentRatio;
      resizeCanvas();
    }
  };

  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(canvas.parentElement);
  }

  window.addEventListener("resize", resizeCanvas);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", syncIfNeeded);
  }

  window.setInterval(syncIfNeeded, 300);
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

function renderPaletteGroup(target, items) {
  target.innerHTML = "";

  items.forEach((crop) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `crop-button${crop.id === state.selectedCropId ? " active" : ""}`;
    button.dataset.cropId = crop.id;
    button.innerHTML = `
      <span class="crop-button-top">
        <span class="crop-swatch" style="background:linear-gradient(135deg, ${crop.accentColor ?? crop.color}, ${crop.color})">
          <span class="crop-swatch-text">${crop.short}</span>
        </span>
        <span class="crop-button-label">
          <strong>${crop.name}</strong>
          <span class="crop-yield">시간당 ${crop.hourlyYield.toLocaleString("ko-KR")}개</span>
        </span>
      </span>
    `;
    button.addEventListener("click", () => {
      state.selectedCropId = crop.id;
      saveLayoutToStorage();
      renderPalette();
      draw();
    });
    target.appendChild(button);
  });
}

function renderPalette() {
  renderPaletteGroup(toolPalette, TOOLS);
  renderPaletteGroup(cropPalette, CROPS);
}

function renderProductionStats() {
  const cropCounts = new Map(CROPS.map((crop) => [crop.id, 0]));
  const effects = buildEffectMap();
  const cropYieldTotals = new Map(CROPS.map((crop) => [crop.id, 0]));

  for (const [key, cropId] of state.plants.entries()) {
    if (cropCounts.has(cropId)) {
      cropCounts.set(cropId, cropCounts.get(cropId) + 1);
    }

    const crop = cropById.get(cropId);
    if (!crop || crop.hourlyYield <= 0) {
      continue;
    }

    const buffMultiplier = getProductionMultiplier(key, cropId, effects);
    cropYieldTotals.set(
      cropId,
      cropYieldTotals.get(cropId) + crop.hourlyYield * buffMultiplier,
    );
  }

  const totalYield = [...cropYieldTotals.values()].reduce((sum, value) => sum + value, 0);

  productionSummary.textContent = `시간당 총 생산량 ${totalYield.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}개`;

  productionGrid.innerHTML = "";

  CROPS.forEach((crop) => {
    const count = cropCounts.get(crop.id) ?? 0;
    const yieldTotal = cropYieldTotals.get(crop.id) ?? 0;
    const card = document.createElement("article");
    card.className = "production-card";
    card.innerHTML = `
      <strong>${crop.name}</strong>
      <p>심은 개수: ${count}개</p>
      <p>시간당 생산량: ${yieldTotal.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}개</p>
    `;
    productionGrid.appendChild(card);
  });
}

function getNeighborPlantIds(key) {
  const { col, row } = parseKey(key);
  return getDiagonalNeighbors(col, row)
    .map(({ col: neighborCol, row: neighborRow }) => state.plants.get(cellKey(neighborCol, neighborRow)))
    .filter(Boolean);
}

function getOvercrowdingMultiplier(sameNeighborCount) {
  const factors = [1, 0.5, 0.25, 0.16, 0.06];
  return factors[Math.min(sameNeighborCount, 4)];
}

function getProductionMultiplier(key, cropId, effects) {
  const effect = effects.get(key);
  const neighborPlantIds = getNeighborPlantIds(key);
  const sameNeighborCount = neighborPlantIds.filter((id) => id === cropId).length;
  let multiplier = getOvercrowdingMultiplier(sameNeighborCount);

  if (effect && effect.sunBuff > 0) {
    multiplier *= 1.3;
  }

  if (cropId === "moss" && effect && effect.watered > 0) {
    multiplier *= 2;
  }

  if (cropId === "phantom-fern") {
    const uniqueNeighborPlantCount = new Set(neighborPlantIds).size;
    multiplier *= Math.max(1, Math.min(uniqueNeighborPlantCount, 4));
  }

  return multiplier;
}

function showCopyFeedback(message, isError = false) {
  copyFeedback.hidden = false;
  copyFeedback.textContent = message;
  copyFeedback.style.color = isError ? "#9f3e31" : "#6f6048";

  if (copyFeedbackTimeout) {
    clearTimeout(copyFeedbackTimeout);
  }

  copyFeedbackTimeout = window.setTimeout(() => {
    copyFeedback.hidden = true;
  }, 2400);
}

async function canvasToBlob(targetCanvas) {
  return new Promise((resolve, reject) => {
    targetCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas blob 생성에 실패했습니다."));
      }
    }, "image/png");
  });
}

async function copyLayoutToClipboard() {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    showCopyFeedback("이 브라우저에서는 이미지 캡쳐 저장을 지원하지 않습니다.", true);
    return;
  }

  try {
    draw({ includeAddSlots: false, includeCanvasBackground: true });
    const blob = await canvasToBlob(canvas);
    const item = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([item]);
    showCopyFeedback("복사 완료");
  } catch (error) {
    showCopyFeedback("캡쳐에 실패했습니다. HTTPS 또는 localhost 환경인지 확인해 주세요.", true);
  } finally {
    draw();
  }
}

async function copyShareLink() {
  updateUrlWithCurrentLayout();
  const shareUrl = window.location.href;

  try {
    await navigator.clipboard.writeText(shareUrl);
    showCopyFeedback("복사 완료");
  } catch (error) {
    showCopyFeedback("공유 링크 복사에 실패했습니다.", true);
  }
}

function renderPanLockButton() {
  togglePanLockButton.textContent = state.panLocked ? "이동 잠김" : "이동 가능";
  togglePanLockButton.classList.toggle("locked", state.panLocked);
}

function renderStatsPanel() {
  toggleStatsButton.setAttribute("aria-expanded", String(!state.statsCollapsed));
  statsContent.hidden = state.statsCollapsed;
}

function syncResponsivePanels() {
  const compactViewport = window.matchMedia("(max-width: 720px)").matches;

  if (compactViewport !== lastCompactViewport) {
    state.statsCollapsed = compactViewport;
    lastCompactViewport = compactViewport;
    renderStatsPanel();
  }
}

function updateSlotTooltip() {
  if (state.hover?.kind !== "add" || !state.hoverPoint) {
    slotTooltip.hidden = true;
    return;
  }

  const { col, row } = parseKey(state.hover.key);
  const layer = borderLayer(col, row);
  slotTooltip.innerHTML = `
    <strong>확장 비용</strong>
    테두리 ${layer}단계 확장<br />
    ${expansionCostText(layer)}
  `;
  slotTooltip.hidden = false;
  slotTooltip.style.left = `${Math.min(state.hoverPoint.x + 18, canvas.clientWidth - 220)}px`;
  slotTooltip.style.top = `${Math.min(state.hoverPoint.y + 18, canvas.clientHeight - 84)}px`;
}

function expandToNextRing() {
  const cells = [...state.cells].map(parseKey);
  const cols = cells.map(({ col }) => col);
  const rows = cells.map(({ row }) => row);
  const minCol = Math.min(...cols) - 1;
  const maxCol = Math.max(...cols) + 1;
  const minRow = Math.min(...rows) - 1;
  const maxRow = Math.max(...rows) + 1;
  const targets = [];

  for (let row = minRow; row <= maxRow; row += 1) {
    for (let col = minCol; col <= maxCol; col += 1) {
      if ((col + row) % 2 !== 0) {
        continue;
      }

      const key = cellKey(col, row);
      if (!state.cells.has(key)) {
        targets.push({ col, row });
      }
    }
  }

  targets.forEach(({ col, row }) => {
    state.cells.add(cellKey(col, row));
  });

  state.hover = null;
  state.hoverPoint = null;
  saveLayoutToStorage();
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

  canvas.style.cursor = nextHover
    ? "pointer"
    : state.pointer.active && !state.panLocked
      ? "grab"
      : "default";
}

function applyClick(point) {
  const slot = findSlotAtPoint(point.x, point.y);
  if (slot) {
    state.cells.add(cellKey(slot.col, slot.row));
    saveLayoutToStorage();
    draw();
    return;
  }

  const cell = findCellAtPoint(point.x, point.y);
  if (!cell) {
    return;
  }

  if (state.selectedCropId === "erase-plant") {
    state.plants.delete(cell.key);
  } else if (state.selectedCropId === "erase-tile") {
    state.cells.delete(cell.key);
    state.plants.delete(cell.key);
    state.desertTiles.delete(cell.key);
    if (state.cells.size === 0) {
      state.cells = createStartingCells();
    }
  } else if (state.selectedCropId === "desertify") {
    if (state.desertTiles.has(cell.key)) {
      state.desertTiles.delete(cell.key);
    } else {
      state.desertTiles.add(cell.key);
    }
  } else {
    const existingCropId = state.plants.get(cell.key);
    if (existingCropId === state.selectedCropId) {
      state.plants.delete(cell.key);
    } else {
      state.plants.set(cell.key, state.selectedCropId);
    }
  }

  saveLayoutToStorage();
  draw();
}

canvas.addEventListener("pointerdown", (event) => {
  const point = pointerPosition(event);
  state.pointer.pointers.set(event.pointerId, { x: point.x, y: point.y });
  state.pointer.active = true;
  state.pointer.id = event.pointerId;
  state.pointer.startX = point.x;
  state.pointer.startY = point.y;
  state.pointer.lastX = point.x;
  state.pointer.lastY = point.y;
  state.pointer.dragging = false;

  if (state.pointer.pointers.size === 2) {
    const [first, second] = [...state.pointer.pointers.values()];
    state.pointer.pinchDistance = Math.hypot(second.x - first.x, second.y - first.y);
    state.pointer.pinchScale = state.view.scale;
  }

  canvas.setPointerCapture(event.pointerId);
  canvas.style.cursor = state.panLocked ? "default" : "grab";
});

canvas.addEventListener("pointermove", (event) => {
  const point = pointerPosition(event);
  state.pointer.pointers.set(event.pointerId, { x: point.x, y: point.y });

  if (state.pointer.pointers.size >= 2) {
    const [first, second] = [...state.pointer.pointers.values()];
    const distance = Math.hypot(second.x - first.x, second.y - first.y);
    const midpoint = {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
    };

    if (state.pointer.pinchDistance > 0) {
      const worldPoint = screenToWorld(midpoint.x, midpoint.y);
      const nextScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, state.pointer.pinchScale * (distance / state.pointer.pinchDistance)),
      );
      state.view.scale = nextScale;
      state.view.offsetX = midpoint.x - worldPoint.x * nextScale;
      state.view.offsetY = midpoint.y - worldPoint.y * nextScale;
      draw();
    }

    canvas.style.cursor = "default";
    return;
  }

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

    if (state.pointer.dragging && !state.panLocked) {
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
  state.pointer.pointers.delete(event.pointerId);

  if (state.pointer.id !== event.pointerId) {
    if (state.pointer.pointers.size < 2) {
      state.pointer.pinchDistance = 0;
    }
    return;
  }

  const point = pointerPosition(event);
  const wasDragging = state.pointer.dragging;
  state.pointer.active = false;
  state.pointer.id = null;
  state.pointer.dragging = false;
  state.pointer.pinchDistance = 0;
  canvas.releasePointerCapture(event.pointerId);

  if (!wasDragging && event.button === 0) {
    applyClick(point);
  }

  updateHover(point);
});

canvas.addEventListener("pointercancel", () => {
  state.pointer.active = false;
  state.pointer.id = null;
  state.pointer.dragging = false;
  state.pointer.pointers.clear();
  state.pointer.pinchDistance = 0;
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

  if (state.plants.has(cell.key)) {
    state.plants.delete(cell.key);
    saveLayoutToStorage();
    draw();
    updateHover(point);
    return;
  }

  state.cells.delete(cell.key);
  state.plants.delete(cell.key);
  state.desertTiles.delete(cell.key);

  for (const [key] of state.plants) {
    if (!state.cells.has(key)) {
      state.plants.delete(key);
    }
  }

  if (state.cells.size === 0) {
    state.cells = createStartingCells();
  }

  state.hover = null;
  saveLayoutToStorage();
  draw();
  updateHover(point);
});

clearCropsButton.addEventListener("click", () => {
  state.plants.clear();
  saveLayoutToStorage();
  draw();
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.tab);
  });
});

recipeTargetSelect.addEventListener("change", () => {
  renderRecipeCalculator();
});

recipeTargetLevelInput.addEventListener("input", () => {
  renderRecipeCalculator();
});

recipeTargetCountInput.addEventListener("input", () => {
  renderRecipeCalculator();
});

copyLayoutButton.addEventListener("click", () => {
  copyLayoutToClipboard();
});

shareLayoutButton.addEventListener("click", () => {
  copyShareLink();
});

togglePanLockButton.addEventListener("click", () => {
  state.panLocked = !state.panLocked;
  renderPanLockButton();
  canvas.style.cursor = state.panLocked ? "default" : "grab";
});

toggleStatsButton.addEventListener("click", () => {
  state.statsCollapsed = !state.statsCollapsed;
  renderStatsPanel();
});

expandRingButton.addEventListener("click", () => {
  expandToNextRing();
});

resetButton.addEventListener("click", () => {
  state.cells = createStartingCells();
  state.plants.clear();
  state.desertTiles.clear();
  state.hover = null;
  state.hoverPoint = null;
  saveLayoutToStorage();
  clearSharedLayoutFromUrl();
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
    desertTiles: [...state.desertTiles].map(parseKey),
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
  getDesertTiles: () => [...state.desertTiles].map(parseKey),
  gridToScreen: (col, row) => {
    const center = gridToPixel(col, row);
    return worldToScreen(center.x, center.y);
  },
  selectCrop: (cropId) => {
    if (cropById.has(cropId)) {
      state.selectedCropId = cropId;
      renderPalette();
      draw();
    }
  },
};

loadLayoutSlotsFromStorage();
const loadedSharedLayout = loadLayoutFromUrl();
if (!loadedSharedLayout) {
  loadLayoutFromStorage();
}
copyLayoutButton.textContent = "캡쳐";
setActiveTab("planner");
renderPalette();
renderPanLockButton();
renderStatsPanel();
renderLayoutSlots();
renderRecipeCalculator();
draw();
resizeCanvas();
startCanvasResolutionWatcher();
loadRecipes();
window.addEventListener("resize", syncResponsivePanels);
window.addEventListener("hashchange", () => {
  applySharedLayoutFromCurrentUrl(true);
});

if (loadedSharedLayout) {
  showCopyFeedback("공유 링크 배치를 불러왔습니다.");
}
