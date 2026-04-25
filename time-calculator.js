const INDEX_PATH = "./alcanthia_index.js";
const MILLIS_IN_SECOND = 1000;
const ZN = 60000;
const SKILL_TREE_STORAGE_KEY = "alchansia-skill-tree-v1";

const operationModeSelect = document.getElementById("operation-mode");
const cauldronEnhancementInput = document.getElementById("cauldron-enhancement");
const flameMasteryInput = document.getElementById("flame-mastery");
const firePotionLevelInput = document.getElementById("fire-potion-level");
const itemASelect = document.getElementById("item-a-select");
const itemBSelect = document.getElementById("item-b-select");
const itemAEnhancementInput = document.getElementById("item-a-enhancement");
const itemBEnhancementInput = document.getElementById("item-b-enhancement");
const itemASummary = document.getElementById("item-a-summary");
const itemBSummary = document.getElementById("item-b-summary");
const resultPrimary = document.getElementById("result-primary");
const formulaBreakdown = document.getElementById("formula-breakdown");
const resultNotes = document.getElementById("result-notes");
const durationTableBody = document.getElementById("duration-table-body");
const tableFilterInput = document.getElementById("table-filter");
const statusBanner = document.getElementById("status-banner");

const appState = {
  items: [],
  itemByCode: new Map(),
  brewingRecipes: [],
  craftRecipes: [],
  recipeByKey: new Map(),
};

init().catch((error) => {
  setStatus("error", `초기화에 실패했습니다: ${error.message}`);
});

async function init() {
  bindEvents();
  const source = await loadGameIndex();
  const items = extractTimedItems(source);

  if (!items.length) {
    throw new Error("alcanthia_index.js에서 시간 데이터를 찾지 못했습니다.");
  }

  appState.items = items.sort((a, b) => a.name.localeCompare(b.name, "ko") || a.code.localeCompare(b.code, "ko"));
  appState.itemByCode = new Map(appState.items.map((item) => [item.code, item]));

  populateItemSelectors();
  renderDurationTable();
  updateCalculator();
  setStatus("ready", `게임 데이터 ${appState.items.length}개 항목을 불러왔습니다.`);
}

function bindEvents() {
  [
    operationModeSelect,
    cauldronEnhancementInput,
    flameMasteryInput,
    firePotionLevelInput,
    itemASelect,
    itemBSelect,
    itemAEnhancementInput,
    itemBEnhancementInput,
  ].forEach((element) => element.addEventListener("input", updateCalculator));

  tableFilterInput.addEventListener("input", renderDurationTable);
  window.addEventListener("storage", (event) => {
    if (event.key !== SKILL_TREE_STORAGE_KEY) {
      return;
    }
    syncFlameMasteryFromSkillTree();
    updateCalculator();
  });
}

async function loadGameIndex() {
  const response = await fetch(INDEX_PATH, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("alcanthia_index.js를 불러오지 못했습니다.");
  }
  return response.text();
}

function extractTimedItems(source) {
  const items = [];
  const seen = new Set();
  const keyRegex = /([A-Za-z0-9_]+):\{/g;
  let match;

  while ((match = keyRegex.exec(source)) !== null) {
    const code = match[1];
    const bodyStart = match.index + match[0].length - 1;
    const bodyEnd = findMatchingBrace(source, bodyStart);

    if (bodyEnd === -1) {
      continue;
    }

    const body = source.slice(bodyStart + 1, bodyEnd);
    if (!body.includes('brewDuration:') || !body.includes('name:"')) {
      continue;
    }

    const nameMatch = body.match(/name:"([^"]+)"/);
    const typeMatch = body.match(/type:"([^"]+)"/);
    const durationMatch = body.match(/brewDuration:([^,}]+)/);

    if (!nameMatch || !durationMatch || seen.has(code)) {
      continue;
    }

    const baseDurationMs = evaluateDuration(durationMatch[1].trim());

    items.push({
      code,
      name: nameMatch[1],
      type: typeMatch ? typeMatch[1] : "unknown",
      baseDurationMs,
    });

    seen.add(code);
    keyRegex.lastIndex = bodyEnd;
  }

  return items;
}

function findMatchingBrace(source, startIndex) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function evaluateDuration(expression) {
  return Function("zn", `return (${expression});`)(ZN);
}

function populateItemSelectors() {
  const options = appState.items
    .map(
      (item) =>
        `<option value="${item.code}">${item.name} · ${item.code} · ${formatDuration(item.baseDurationMs)}</option>`,
    )
    .join("");

  itemASelect.innerHTML = options;
  itemBSelect.innerHTML = options;

  itemASelect.value = appState.items.find((item) => item.code === "herb")?.code ?? appState.items[0].code;
  itemBSelect.value = appState.items.find((item) => item.code === "blue_moss")?.code ?? appState.items[1].code;
}

function readSkillTreeLevels() {
  try {
    const raw = window.localStorage.getItem(SKILL_TREE_STORAGE_KEY);
    if (!raw) {
      return new Map();
    }

    const payload = JSON.parse(raw);
    return new Map(Array.isArray(payload?.levels) ? payload.levels : []);
  } catch (error) {
    return new Map();
  }
}

function syncFlameMasteryFromSkillTree() {
  const levels = readSkillTreeLevels();
  const level = Math.max(0, Number(levels.get("불꽃숙련")) || 0);
  flameMasteryInput.value = String(level);
}

function renderDurationTable() {
  const query = tableFilterInput.value.trim().toLowerCase();
  const rows = appState.items.filter((item) => {
    if (!query) {
      return true;
    }
    return item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query);
  });

  durationTableBody.innerHTML = rows
    .map(
      (item) => `
        <tr>
          <td><strong>${item.name}</strong></td>
          <td class="muted">${item.code}</td>
          <td>${item.type}</td>
          <td>${formatDuration(item.baseDurationMs)}</td>
        </tr>
      `,
    )
    .join("");
}

function updateCalculator() {
  if (!appState.items.length) {
    return;
  }

  syncFlameMasteryFromSkillTree();

  const itemA = appState.itemByCode.get(itemASelect.value);
  const itemB = appState.itemByCode.get(itemBSelect.value);

  if (!itemA || !itemB) {
    return;
  }

  const enhancementA = readNonNegativeInt(itemAEnhancementInput, 0);
  const enhancementB = readNonNegativeInt(itemBEnhancementInput, 0);
  const cauldronEnhancement = readNonNegativeInt(cauldronEnhancementInput, 0);
  const flameMastery = readNonNegativeInt(flameMasteryInput, 0);
  const firePotionLevel = Math.max(-1, Number(firePotionLevelInput.value) || -1);

  const effectiveA = enhancedDuration(itemA.baseDurationMs, enhancementA);
  const effectiveB = enhancedDuration(itemB.baseDurationMs, enhancementB);
  const baseWorkMs = Math.max(effectiveA, effectiveB);

  const mode = resolveOperationMode(operationModeSelect.value, itemA, itemB);
  const flameReduction = flameMasteryReduction(flameMastery, cauldronEnhancement);
  const afterFlameMs = Math.round(baseWorkMs * (1 - flameReduction));
  const fireReduction = mode === "enhancement" && firePotionLevel >= 0
    ? Math.min(0.95, (firePotionLevel + 1) * 0.1)
    : 0;
  const finalMs = Math.round(afterFlameMs * (1 - fireReduction));

  itemASummary.innerHTML = renderItemSummary(itemA, enhancementA, effectiveA);
  itemBSummary.innerHTML = renderItemSummary(itemB, enhancementB, effectiveB);

  resultPrimary.innerHTML = `
    <div class="result-kicker">${operationLabel(mode)} 예상 시간</div>
    <div class="result-time">${formatDuration(finalMs)}</div>
    <div class="result-detail">
      기준시간은 두 재료 중 더 긴 시간인 <strong>${formatDuration(baseWorkMs)}</strong>입니다.
      이후 Flame Mastery와 Fire Potion 보정을 순서대로 적용했습니다.
    </div>
  `;

  formulaBreakdown.innerHTML = [
    {
      title: "1. 재료별 강화 반영 시간",
      body: `${itemA.name}: ${formatDuration(itemA.baseDurationMs)} × 2^${enhancementA} = ${formatDuration(effectiveA)}<br>${itemB.name}: ${formatDuration(itemB.baseDurationMs)} × 2^${enhancementB} = ${formatDuration(effectiveB)}`,
    },
    {
      title: "2. 작업 기준시간",
      body: `max(${formatDuration(effectiveA)}, ${formatDuration(effectiveB)}) = <strong>${formatDuration(baseWorkMs)}</strong>`,
    },
    {
      title: "3. Flame Mastery 보정",
      body: `감소율 = ${formatPercent(flameReduction)}<br>적용 후 시간 = ${formatDuration(afterFlameMs)}`,
    },
    {
      title: "4. Fire Potion 보정",
      body: mode === "enhancement" && fireReduction > 0
        ? `감소율 = ${formatPercent(fireReduction)}<br>최종 시간 = <strong>${formatDuration(finalMs)}</strong>`
        : `적용 없음${mode !== "enhancement" ? " (강화 작업에서만 적용)" : ""}`,
    },
  ]
    .map(
      (section) => `
        <div class="formula-row">
          <strong>${section.title}</strong>
          <div>${section.body}</div>
        </div>
      `,
    )
    .join("");

  resultNotes.innerHTML = buildNotes(mode, itemA, itemB, flameReduction, fireReduction)
    .map(
      (note) => `
        <div class="note-row">
          <strong>${note.title}</strong>
          <div>${note.body}</div>
        </div>
      `,
    )
    .join("");
}

function renderItemSummary(item, enhancement, effectiveMs) {
  return `
    <strong>${item.name}</strong><br>
    코드: <code>${item.code}</code><br>
    종류: ${item.type}<br>
    기본시간: ${formatDuration(item.baseDurationMs)}<br>
    강화 반영시간: ${formatDuration(effectiveMs)}
  `;
}

function resolveOperationMode(selectedMode, itemA, itemB) {
  if (selectedMode !== "auto") {
    return selectedMode;
  }

  if (itemA.code === itemB.code && itemA.type !== "produce") {
    return "enhancement";
  }

  if (itemA.type === "produce" && itemB.type === "produce") {
    return "potion";
  }

  return "craft";
}

function operationLabel(mode) {
  return {
    potion: "양조",
    craft: "제작",
    enhancement: "강화",
    engrave: "각인",
    utility: "유틸",
  }[mode] ?? "작업";
}

function enhancedDuration(baseDurationMs, enhancement) {
  return Math.round(baseDurationMs * (2 ** enhancement));
}

function flameMasteryReduction(flameMastery, cauldronEnhancement) {
  if (flameMastery <= 0) {
    return 0;
  }

  return ds(0.01, flameMastery, cauldronEnhancement + 1);
}

function ds(base, level, count) {
  const factor = 1 - base * level;
  let result = 1;
  for (let index = 0; index < count; index += 1) {
    result *= factor;
  }
  return 1 - result;
}

function buildNotes(mode, itemA, itemB, flameReduction, fireReduction) {
  const notes = [
    {
      title: "작업 판정",
      body: `현재 조합은 <strong>${operationLabel(mode)}</strong>으로 계산했습니다.`,
    },
    {
      title: "기준 시간 규칙",
      body: "결과물 시간이 아니라, 재료 두 개의 강화 반영시간 중 더 긴 값을 기준으로 사용합니다.",
    },
  ];

  notes.push({
    title: "확인된 시간 영향 스킬",
    body: "원본 게임 번들 기준으로 작업 시간에는 불꽃 숙련만 직접 반영됩니다. 행운 숙련은 결과물 2배, 심지 숙련은 강화 성공률, 금속 단련·생명의 씨앗은 재료 허용, 불꽃의 정령·피어나는 손·화염 고삐·연성의 맥은 자동화에만 관여합니다.",
  });

  if (flameReduction > 0) {
    notes.push({
      title: "Flame Mastery 적용",
      body: `가마솥 강화 ${readNonNegativeInt(cauldronEnhancementInput, 0)} 기준으로 총 ${formatPercent(flameReduction)} 감소가 반영됐습니다.`,
    });
  }

  if (mode === "enhancement") {
    notes.push({
      title: "강화 작업 주의",
      body: `${itemA.name}처럼 같은 아이템을 합칠 때는 보통 두 재료 시간이 같아서 계산이 단순합니다.`,
    });
  }

  if (fireReduction > 0) {
    notes.push({
      title: "Fire Potion 적용",
      body: `강화 작업에서만 적용되며, 현재 ${formatPercent(fireReduction)} 추가 감소가 들어갔습니다.`,
    });
  }

  if (itemA.baseDurationMs === 0 || itemB.baseDurationMs === 0) {
    notes.push({
      title: "0초 예외 아이템",
      body: "기록 조각처럼 기본시간이 0초인 항목은 다른 재료 쪽 시간이 그대로 기준이 됩니다.",
    });
  }

  return notes;
}

function readNonNegativeInt(input, fallback) {
  const value = Number(input.value);
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(0, Math.floor(value));
}

function formatDuration(durationMs) {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return "0초";
  }

  const totalSeconds = durationMs / MILLIS_IN_SECOND;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Number((totalSeconds % 60).toFixed(totalSeconds % 1 === 0 ? 0 : 1));
  const parts = [];

  if (hours) {
    parts.push(`${hours}시간`);
  }
  if (minutes) {
    parts.push(`${minutes}분`);
  }
  if (seconds || parts.length === 0) {
    parts.push(`${seconds}초`);
  }

  return parts.join(" ");
}

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function setStatus(type, message) {
  statusBanner.className = `status-banner ${type}`;
  statusBanner.textContent = message;
}
