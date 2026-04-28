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
    iconPath: "./crop_icons/herb_seed.png",
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
    iconPath: "./crop_icons/red_flower_seed.png",
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
    iconPath: "./crop_icons/dew_root_bulb.png",
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
    iconPath: "./crop_icons/blue_moss_spore.png",
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
    iconPath: "./crop_icons/poison_flower_seed.png",
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
    iconPath: "./crop_icons/moonlight_mushroom_seed.png",
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
    iconPath: "./crop_icons/star_flower_seed.png",
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
    iconPath: "./crop_icons/fire_vine_seed.png",
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
    iconPath: "./crop_icons/wind_blossom_seed.png",
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
    iconPath: "./crop_icons/illusion_fern_seed.png",
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
    iconPath: "./crop_icons/sunset_bush_seed.png",
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
    iconPath: "./crop_icons/sunlight_flower_seed.png",
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
const cropImageCache = new Map();
const CAULDRON_TIERS = [
  { id: "gold", name: "금 가마솥", iconPath: "./cauldron_icons/gold_cauldron.png" },
  { id: "silver", name: "은 가마솥", iconPath: "./cauldron_icons/silver_cauldron.png" },
  { id: "copper", name: "동 가마솥", iconPath: "./cauldron_icons/copper_cauldron.png" },
];
const CROP_PRODUCTION_MATERIALS = {
  "red-leaf": "붉은꽃잎",
  moss: "푸른이끼",
  "poison-flower": "독꽃잎",
  "star-flower": "별꽃가루",
  "fire-flower": "불씨열매",
  "wind-flower": "바람꽃잎",
  "phantom-fern": "환영잎",
  "sunset-tree": "노을잎",
};
const PLANNER_SKILL_KEYS = {
  rootDominion: "뿌리 지배",
  veinReading: "맥읽기",
  soilMastery: "토양 숙련",
  timeMastery: "시간 숙련",
  sturdyStem: "단단한 줄기",
  overcrowdingResist: "과밀 저항",
};
const CROP_TO_PLANT_ID = {
  herb: "herb",
  "red-leaf": "red_flower",
  "water-flower": "dew_root",
  moss: "blue_moss",
  "poison-flower": "poison_flower",
  mushroom: "moonlight_mushroom",
  "star-flower": "star_flower",
  "fire-flower": "fire_vine",
  "wind-flower": "wind_blossom",
  "phantom-fern": "illusion_fern",
  "sunset-tree": "sunset_bush",
  "sun-flower": "sunlight_flower",
};
const PLANT_SPECS = {
  herb: { growTimeMs: 10000, waterIntervalMs: Number.POSITIVE_INFINITY, maxHarvests: 1, produce: { intervalMs: 1 } },
  red_flower: { growTimeMs: 10000, waterIntervalMs: 20000, maxHarvests: 500, produce: { intervalMs: 15000 } },
  dew_root: { growTimeMs: 15000, waterIntervalMs: Number.POSITIVE_INFINITY, maxHarvests: Number.POSITIVE_INFINITY, produce: null },
  blue_moss: { growTimeMs: 25000, waterIntervalMs: Number.POSITIVE_INFINITY, maxHarvests: 1000, produce: { intervalMs: 40000 } },
  poison_flower: { growTimeMs: 25000, waterIntervalMs: 25000, maxHarvests: 300, produce: { intervalMs: 600000 } },
  moonlight_mushroom: { growTimeMs: 30000, waterIntervalMs: 60000, maxHarvests: 3, produce: { intervalMs: 1 } },
  star_flower: { growTimeMs: 30000, waterIntervalMs: 25000, maxHarvests: 100, produce: { intervalMs: 300000 } },
  fire_vine: { growTimeMs: 30000, waterIntervalMs: Number.POSITIVE_INFINITY, maxHarvests: 100, produce: { intervalMs: 600000 }, waterKills: true },
  wind_blossom: { growTimeMs: 35000, waterIntervalMs: 30000, maxHarvests: Number.POSITIVE_INFINITY, produce: { intervalMs: 1800000 } },
  sunlight_flower: { growTimeMs: 35000, waterIntervalMs: 25000, maxHarvests: Number.POSITIVE_INFINITY, produce: null },
  illusion_fern: { growTimeMs: 25000, waterIntervalMs: 30000, maxHarvests: 500, produce: { intervalMs: 480000 } },
  sunset_bush: { growTimeMs: 25000, waterIntervalMs: 25000, maxHarvests: 200, produce: { intervalMs: 10000 } },
};
const PLANNER_SIMULATION = {
  startMs: 1000,
  durationMs: 2 * 60 * 60 * 1000,
  stepMs: 1000,
};
const STATIC_TIMED_ITEMS = [
  { code: "herb_seed", name: "약초 씨앗", type: "seed", baseDurationMs: 15000 },
  { code: "dewroot_bulb", name: "이슬뿌리 구근", type: "seed", baseDurationMs: 15000 },
  { code: "red_flower_seed", name: "붉은꽃 씨앗", type: "seed", baseDurationMs: 15000 },
  { code: "blue_moss_spore", name: "푸른이끼 포자", type: "seed", baseDurationMs: 15000 },
  { code: "poison_flower_seed", name: "독꽃 씨앗", type: "seed", baseDurationMs: 15000 },
  { code: "moonlight_mushroom_seed", name: "달빛버섯 씨앗", type: "seed", baseDurationMs: 15000 },
  { code: "embervine_seed", name: "불씨덩굴 씨앗", type: "seed", baseDurationMs: 15000 },
  { code: "wind_flower_seed", name: "바람꽃 씨앗", type: "seed", baseDurationMs: 15000 },
  { code: "star_flower_seed", name: "별꽃 씨앗", type: "seed", baseDurationMs: 60000 },
  { code: "sunlight_flower_seed", name: "햇살꽃 씨앗", type: "seed", baseDurationMs: 60000 },
  { code: "phantom_fern_seed", name: "환영고사리 씨앗", type: "seed", baseDurationMs: 60000 },
  { code: "sunset_tree_seed", name: "노을목 씨앗", type: "seed", baseDurationMs: 60000 },
  { code: "herb", name: "약초", type: "produce", baseDurationMs: 15000 },
  { code: "red_petal", name: "붉은꽃잎", type: "produce", baseDurationMs: 30000 },
  { code: "blue_moss", name: "푸른이끼", type: "produce", baseDurationMs: 30000 },
  { code: "poison_petal", name: "독꽃잎", type: "produce", baseDurationMs: 30000 },
  { code: "moonlight_mushroom", name: "달빛버섯", type: "produce", baseDurationMs: 60000 },
  { code: "sunset_leaf", name: "노을잎", type: "produce", baseDurationMs: 60000 },
  { code: "star_powder", name: "별꽃가루", type: "produce", baseDurationMs: 120000 },
  { code: "ember_fruit", name: "불씨열매", type: "produce", baseDurationMs: 120000 },
  { code: "sunset_fruit", name: "노을열매", type: "produce", baseDurationMs: 120000 },
  { code: "phantom_leaf", name: "환영잎", type: "produce", baseDurationMs: 180000 },
  { code: "wind_petal", name: "바람꽃잎", type: "produce", baseDurationMs: 180000 },
  { code: "worn_cauldron", name: "낡은 가마솥", type: "tool", baseDurationMs: 30000 },
  { code: "copper_cauldron", name: "구리 가마솥", type: "tool", baseDurationMs: 60000 },
  { code: "silver_cauldron", name: "은 가마솥", type: "tool", baseDurationMs: 120000 },
  { code: "gold_cauldron", name: "금 가마솥", type: "tool", baseDurationMs: 240000 },
  { code: "record_fragment_1", name: "기록 조각 1", type: "material", baseDurationMs: 0 },
  { code: "record_fragment_2", name: "기록 조각 2", type: "material", baseDurationMs: 0 },
  { code: "record_fragment_3", name: "기록 조각 3", type: "material", baseDurationMs: 0 },
  { code: "record_fragment_4", name: "기록 조각 4", type: "material", baseDurationMs: 0 },
  { code: "record_fragment_5", name: "기록 조각 5", type: "material", baseDurationMs: 0 },
  { code: "restored_tablet", name: "복원된 석판", type: "material", baseDurationMs: 0 },
  { code: "magic_glass", name: "마법 유리", type: "material", baseDurationMs: 5000 },
  { code: "copper_piece", name: "구리조각", type: "material", baseDurationMs: 30000 },
  { code: "mud", name: "진흙", type: "material", baseDurationMs: 30000 },
  { code: "poison_fang", name: "독이빨", type: "material", baseDurationMs: 30000 },
  { code: "snake_scale", name: "뱀비늘", type: "material", baseDurationMs: 30000 },
  { code: "alloy_ingot", name: "합금 주괴", type: "material", baseDurationMs: 60000 },
  { code: "mana_alloy", name: "마력 합금", type: "material", baseDurationMs: 60000 },
  { code: "engraving_stone", name: "각인석", type: "material", baseDurationMs: 60000 },
  { code: "mana_crystal", name: "마력결정", type: "material", baseDurationMs: 60000 },
  { code: "rusted_armor_piece", name: "녹슨 갑주편", type: "material", baseDurationMs: 60000 },
  { code: "broken_tablet_piece", name: "깨진 석판 조각", type: "material", baseDurationMs: 60000 },
  { code: "silver_ore", name: "은광석", type: "material", baseDurationMs: 60000 },
  { code: "gilt_ingot", name: "금동 주괴", type: "material", baseDurationMs: 90000 },
  { code: "gold_chunk", name: "황금덩어리", type: "material", baseDurationMs: 90000 },
  { code: "platinum_ingot", name: "백금 주괴", type: "material", baseDurationMs: 90000 },
  { code: "amber_ore", name: "호박석 원석", type: "material", baseDurationMs: 120000 },
  { code: "fluorite_ore", name: "형석 원석", type: "material", baseDurationMs: 120000 },
  { code: "lava_core", name: "용암핵", type: "material", baseDurationMs: 120000 },
  { code: "cut_amber", name: "가공된 호박석", type: "material", baseDurationMs: 120000 },
  { code: "cut_fluorite", name: "가공된 형석", type: "material", baseDurationMs: 120000 },
  { code: "star_crystal", name: "별의 결정", type: "material", baseDurationMs: 120000 },
  { code: "alloy_epaulet", name: "합금 견장", type: "equipment", baseDurationMs: 60000 },
  { code: "mana_ring", name: "마력 반지", type: "equipment", baseDurationMs: 60000 },
  { code: "copper_dagger", name: "구리 단검", type: "equipment", baseDurationMs: 60000 },
  { code: "gilt_helmet", name: "금동 투구", type: "equipment", baseDurationMs: 60000 },
  { code: "gold_amulet", name: "황금 부적", type: "equipment", baseDurationMs: 60000 },
  { code: "golden_crown", name: "금빛 왕관", type: "equipment", baseDurationMs: 60000 },
  { code: "lava_emblem", name: "용암 휘장", type: "equipment", baseDurationMs: 60000 },
  { code: "mana_pendant", name: "마력 펜던트", type: "equipment", baseDurationMs: 60000 },
  { code: "mud_mask", name: "진흙 가면", type: "equipment", baseDurationMs: 60000 },
  { code: "platinum_chest", name: "백금 흉갑", type: "equipment", baseDurationMs: 60000 },
  { code: "scale_bracelet", name: "비늘 팔찌", type: "equipment", baseDurationMs: 60000 },
  { code: "silver_cloak", name: "은빛 망토", type: "equipment", baseDurationMs: 60000 },
  { code: "silver_shield", name: "은빛 방패", type: "equipment", baseDurationMs: 60000 },
  { code: "tablet_shield", name: "석판 방패", type: "equipment", baseDurationMs: 60000 },
  { code: "blank_rune", name: "백지의 룬", type: "equipment", baseDurationMs: 60000 },
  { code: "merchant_recommendation", name: "상인 길드 추천서", type: "equipment", baseDurationMs: 60000 },
  { code: "orb_of_oblivion", name: "망각의 오브", type: "equipment", baseDurationMs: 60000 },
  { code: "space_knot", name: "공간의 매듭", type: "equipment", baseDurationMs: 60000 },
  { code: "healing_potion", name: "힐링포션", type: "potion", baseDurationMs: 15000 },
  { code: "growth_potion", name: "성장포션", type: "potion", baseDurationMs: 30000 },
  { code: "boost_potion", name: "촉진포션", type: "potion", baseDurationMs: 30000 },
  { code: "opaque_sediment", name: "불투명한 침전물", type: "potion", baseDurationMs: 30000 },
  { code: "mana_potion", name: "마나포션", type: "potion", baseDurationMs: 30000 },
  { code: "vigor_potion", name: "활력포션", type: "potion", baseDurationMs: 30000 },
  { code: "moss_jelly", name: "이끼젤리", type: "potion", baseDurationMs: 30000 },
  { code: "paralysis_potion", name: "중독포션", type: "potion", baseDurationMs: 30000 },
  { code: "numbing_potion", name: "마비포션", type: "potion", baseDurationMs: 30000 },
  { code: "venom_potion", name: "맹독포션", type: "potion", baseDurationMs: 30000 },
  { code: "slime_potion", name: "점액포션", type: "potion", baseDurationMs: 30000 },
  { code: "antidote_potion", name: "해독포션", type: "potion", baseDurationMs: 60000 },
  { code: "corrosion_potion", name: "부식포션", type: "potion", baseDurationMs: 60000 },
  { code: "oblivion_potion", name: "망각포션", type: "potion", baseDurationMs: 60000 },
  { code: "berserk_potion", name: "광폭포션", type: "potion", baseDurationMs: 60000 },
  { code: "hallucination_spore", name: "환각포자", type: "potion", baseDurationMs: 60000 },
  { code: "stealth_potion", name: "은신포션", type: "potion", baseDurationMs: 60000 },
  { code: "blessing_potion", name: "축복포션", type: "potion", baseDurationMs: 120000 },
  { code: "courage_potion", name: "용기포션", type: "potion", baseDurationMs: 120000 },
  { code: "dream_potion", name: "몽환포션", type: "potion", baseDurationMs: 120000 },
  { code: "explosion_potion", name: "폭발포션", type: "potion", baseDurationMs: 120000 },
  { code: "foresight_potion", name: "예지포션", type: "potion", baseDurationMs: 120000 },
  { code: "meteor_potion", name: "유성포션", type: "potion", baseDurationMs: 120000 },
  { code: "plague_potion", name: "역병포션", type: "potion", baseDurationMs: 120000 },
  { code: "purify_potion", name: "정화포션", type: "potion", baseDurationMs: 120000 },
  { code: "resist_potion", name: "저항포션", type: "potion", baseDurationMs: 120000 },
  { code: "steam_potion", name: "증기포션", type: "potion", baseDurationMs: 120000 },
  { code: "afterimage_potion", name: "잔상포션", type: "potion", baseDurationMs: 180000 },
  { code: "breeze_potion", name: "미풍포션", type: "potion", baseDurationMs: 180000 },
  { code: "comet_potion", name: "혜성포션", type: "potion", baseDurationMs: 180000 },
  { code: "daydream_potion", name: "백일몽포션", type: "potion", baseDurationMs: 180000 },
  { code: "dissipation_potion", name: "소산포션", type: "potion", baseDurationMs: 180000 },
  { code: "flame_potion", name: "화염포션", type: "potion", baseDurationMs: 180000 },
  { code: "gale_potion", name: "돌풍포션", type: "potion", baseDurationMs: 180000 },
  { code: "swiftwind_potion", name: "질풍포션", type: "potion", baseDurationMs: 180000 },
  { code: "heatwave_potion", name: "열풍포션", type: "potion", baseDurationMs: 180000 },
  { code: "poison_mist_potion", name: "독안개포션", type: "potion", baseDurationMs: 180000 },
  { code: "mirage_potion", name: "신기루포션", type: "potion", baseDurationMs: 180000 },
  { code: "fog_potion", name: "안개포션", type: "potion", baseDurationMs: 180000 },
  { code: "phantom_potion", name: "환영포션", type: "potion", baseDurationMs: 180000 },
  { code: "revival_potion", name: "회생포션", type: "potion", baseDurationMs: 180000 },
  { code: "sunset_potion", name: "석양포션", type: "potion", baseDurationMs: 180000 },
  { code: "afterglow_potion", name: "노을포션", type: "potion", baseDurationMs: 180000 },
  { code: "dissolve_potion", name: "용해포션", type: "potion", baseDurationMs: 240000 },
  { code: "copper_diamond_box", name: "구리 다이아 상자", type: "misc", baseDurationMs: 30000 },
  { code: "silver_diamond_box", name: "은제 다이아 상자", type: "misc", baseDurationMs: 30000 },
  { code: "gold_diamond_box", name: "금제 다이아 상자", type: "misc", baseDurationMs: 30000 },
  { code: "large_diamond_box", name: "대형 다이아 상자", type: "misc", baseDurationMs: 30000 },
];

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
const canvasActions = document.createElement("div");
canvasActions.className = "canvas-actions";
canvasActions.setAttribute("aria-label", "밭 조작");
cropPalette.insertAdjacentElement("afterend", canvasActions);
canvasActions.append(togglePanLockButton, expandRingButton, clearCropsButton, resetButton);
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
const boostPotionControl = document.createElement("label");
boostPotionControl.className = "boost-potion-toggle";
boostPotionControl.innerHTML = `
  <span>촉진포션</span>
  <button id="boost-potion-button" type="button" aria-pressed="false">Off</button>
`;
statsContent.insertBefore(boostPotionControl, productionGrid);
const boostPotionButton = document.getElementById("boost-potion-button");
const copyFeedback = document.getElementById("copy-feedback");
const plannerCard = document.querySelector(".planner-card");
const siteNote = document.querySelector(".site-note");
const shareLayoutButton = document.createElement("button");
shareLayoutButton.id = "share-layout-button";
shareLayoutButton.type = "button";
shareLayoutButton.textContent = "밭 공유";
toolbarActions.appendChild(shareLayoutButton);
const openLayoutSlotsButton = document.createElement("button");
openLayoutSlotsButton.id = "layout-slots-button";
openLayoutSlotsButton.type = "button";
openLayoutSlotsButton.textContent = "저장/불러오기";
toolbarActions.appendChild(openLayoutSlotsButton);
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
slotPanel.classList.add("slot-modal");
const slotPanelCloseButton = document.createElement("button");
slotPanelCloseButton.type = "button";
slotPanelCloseButton.className = "slot-modal-close";
slotPanelCloseButton.dataset.action = "close-slot-dialog";
slotPanelCloseButton.textContent = "닫기";
slotPanel.querySelector(".slot-panel-header").appendChild(slotPanelCloseButton);
slotPanel.hidden = true;
document.body.appendChild(slotPanel);
const slotModalBackdrop = document.createElement("button");
slotModalBackdrop.type = "button";
slotModalBackdrop.className = "slot-modal-backdrop";
slotModalBackdrop.setAttribute("aria-label", "저장/불러오기 닫기");
slotModalBackdrop.hidden = true;
document.body.appendChild(slotModalBackdrop);
const tabButtons = [...document.querySelectorAll(".tab-button")];
const plannerView = document.getElementById("planner-view");
const calculatorView = document.getElementById("calculator-view");
const materialsView = document.getElementById("materials-view");
const timeView = document.getElementById("time-view");
const skillsView = document.getElementById("skills-view");
const skillPointsView = document.getElementById("skill-points-view");
const recipeTargetSelect = document.getElementById("recipe-target-select");
const recipeTargetLevelInput = document.getElementById("recipe-target-level");
const recipeTargetCountInput = document.getElementById("recipe-target-count");
const recipeCauldronEnhancementInput = document.getElementById("recipe-cauldron-enhancement");
const recipeEnhancementNote = document.getElementById("recipe-enhancement-note");
const recipeControls = document.getElementById("recipe-controls");
const recipeSummary = document.getElementById("recipe-summary");
const recipeBreakdown = document.getElementById("recipe-breakdown");
const recipeList = document.getElementById("recipe-list");
const cauldronBoard = document.getElementById("cauldron-board");
const materialUsageSummary = document.getElementById("material-usage-summary");
const timeStatusBanner = document.getElementById("time-status-banner");
const timeOperationModeSelect = document.getElementById("time-operation-mode");
const timeCauldronEnhancementInput = document.getElementById("time-cauldron-enhancement");
const timeFlameMasteryInput = document.getElementById("time-flame-mastery");
const timeItemASelect = document.getElementById("time-item-a-select");
const timeItemBSelect = document.getElementById("time-item-b-select");
const timeItemAEnhancementInput = document.getElementById("time-item-a-enhancement");
const timeItemBEnhancementInput = document.getElementById("time-item-b-enhancement");
const timeItemASummary = document.getElementById("time-item-a-summary");
const timeItemBSummary = document.getElementById("time-item-b-summary");
const timeResultPrimary = document.getElementById("time-result-primary");
const timeFormulaBreakdown = document.getElementById("time-formula-breakdown");
const timeResultNotes = document.getElementById("time-result-notes");
const timeTableFilterInput = document.getElementById("time-table-filter");
const timeDurationTableBody = document.getElementById("time-duration-table-body");
const skillTreeSummary = document.getElementById("skill-tree-summary");
const skillCategoryTabs = document.getElementById("skill-category-tabs");
const skillTreeGrid = document.getElementById("skill-tree-grid");
const skillDetailDock = document.getElementById("skill-detail-dock");
const spCurrentLevelInput = document.getElementById("sp-current-level");
const spCurrentExpInput = document.getElementById("sp-current-exp");
const spPotionLevelInput = document.getElementById("sp-potion-level");
const spPotionCountInput = document.getElementById("sp-potion-count");
const spForecastSummary = document.getElementById("sp-forecast-summary");
const spTargetCurrentLevelInput = document.getElementById("sp-target-current-level");
const spTargetCurrentExpInput = document.getElementById("sp-target-current-exp");
const spTargetLevelInput = document.getElementById("sp-target-level");
const spTargetPotionLevelInput = document.getElementById("sp-target-potion-level");
const spTargetSummary = document.getElementById("sp-target-summary");
const openCauldronSlotsButton = document.createElement("button");
openCauldronSlotsButton.id = "cauldron-slots-button";
openCauldronSlotsButton.className = "slot-open-button";
openCauldronSlotsButton.type = "button";
openCauldronSlotsButton.textContent = "저장/불러오기";
cauldronBoard.before(openCauldronSlotsButton);

const STORAGE_KEY = "alchansia-layout-v1";
const SLOT_STORAGE_KEY = "alchansia-layout-slots-v1";
const CALCULATOR_STORAGE_KEY = "alchansia-calculator-v1";
const MATERIAL_STORAGE_KEY = "alchansia-materials-v1";
const CAULDRON_SLOT_STORAGE_KEY = "alchansia-cauldron-slots-v1";
const TIME_CALCULATOR_STORAGE_KEY = "alchansia-time-calculator-v1";
const SKILL_TREE_STORAGE_KEY = "alchansia-skill-tree-v1";
const SKILL_POINT_STORAGE_KEY = "alchansia-skill-points-v1";
const TIME_RELEVANT_SKILL_KEYS = {
  flameMastery: "불꽃 숙련",
};
const RECIPE_RELEVANT_SKILL_KEYS = {
  wickMastery: "심지 숙련",
};
const SHARE_PARAM = "layout";
const MAX_LAYOUT_SLOTS = 10;
const MILLIS_IN_SECOND = 1000;
const MINUTE_MILLIS = 60000;
const GROWTH_POTION_NAME = "성장포션";
const SKILL_NAME_ALIASES = {
  유령깔때기: "유령깔대기",
};
const SKILL_CATEGORY_THEMES = {
  경작: {
    treeId: "farming",
    icon: "",
    tint: "#739a4a",
    glow: "rgba(115, 154, 74, 0.28)",
    accent: "#4c6d2b",
  },
  연성: {
    treeId: "brewing",
    icon: "",
    tint: "#8d5a2f",
    glow: "rgba(191, 122, 45, 0.28)",
    accent: "#6f4320",
  },
  마나: {
    treeId: "mana",
    icon: "",
    tint: "#4f82b8",
    glow: "rgba(79, 130, 184, 0.28)",
    accent: "#345e8c",
  },
  계약: {
    treeId: "contract",
    icon: "",
    tint: "#8d4f6d",
    glow: "rgba(141, 79, 109, 0.28)",
    accent: "#69384f",
  },
};
const SKILL_ICON_PATHS = {
  "가위손": "./skill_icons/scissors_hand.png",
  "혼령낫": "./skill_icons/magic_scythe.png",
  "정령의 낫": "./skill_icons/spirit_scythe.png",
  "요정의 주머니": "./skill_icons/fairy_pocket.png",
  "토양 숙련": "./skill_icons/soil_mastery.png",
  "시간 숙련": "./skill_icons/time_mastery.png",
  "자연의 축복": "./skill_icons/natures_blessing.png",
  "부활": "./skill_icons/revival.png",
  "풍요의 손길": "./skill_icons/touch_of_plenty.png",
  "계승": "./skill_icons/succession.png",
  "뿌리 지배": "./skill_icons/root_dominion.png",
  "과밀 저항": "./skill_icons/overcrowding_resist.png",
  "단단한 줄기": "./skill_icons/sturdy_stem.png",
  "맥읽기": "./skill_icons/vein_reading.png",
  "유전": "./skill_icons/inheritance.png",
  "불꽃 숙련": "./skill_icons/flame_mastery.png",
  "유령 깔대기": "./skill_icons/brewing_funnel.png",
  "행운 숙련": "./skill_icons/luck_mastery.png",
  "금속 단련": "./skill_icons/metal_tempering.png",
  "불꽃의 정령": "./skill_icons/flame_spirit.png",
  "생명의 씨앗": "./skill_icons/seed_ingredient.png",
  "피어나는 손": "./skill_icons/blooming_hand.png",
  "심지 숙련": "./skill_icons/wick_mastery.png",
  "화염 고삐": "./skill_icons/fine_tuning.png",
  "연성의 맥": "./skill_icons/auto_buy_stone.png",
};
Object.assign(SKILL_ICON_PATHS, {
  "유대의 룬": "./skill_icons/bond_rune.png",
  "부유술": "./skill_icons/levitation.png",
  "귀환 마법진": "./skill_icons/return_portal.png",
  "수정구 점술": "./skill_icons/crystal_divination.png",
  "서약의 인장": "./skill_icons/oath_seal.png",
  "영혼 대면": "./skill_icons/soul_confrontation.png",
  "까마귀 길잡이": "./skill_icons/extra_loot.png",
  "차원 교차": "./skill_icons/potion_preserve.png",
  "유물 숙련": "./skill_icons/relic_mastery.png",
  "무소유": "./skill_icons/overflow_discard.png",
  "혈맹": "./skill_icons/unlock_guild.png",
  "마나 그릇": "./skill_icons/mana_vessel.png",
  "깊은 흡수": "./skill_icons/deep_absorption.png",
  "마나 숙련": "./skill_icons/mana_mastery.png",
  "생기 착취": "./skill_icons/life_drain.png",
  "마나 증류": "./skill_icons/mana_siphon.png",
  "마나 응축": "./skill_icons/mana_efficiency.png",
  "생명의 순환": "./skill_icons/cycle_of_life.png",
  "명상": "./skill_icons/meditation.png",
});
const SKILL_COLUMN_OFFSETS = {
  "계승": -1,
  "풍요의 손길": -1,
};
const SKILL_FIXED_COLUMNS = {
  "유전": 1,
  "불꽃 숙련": 1,
  "마나 그릇": 1,
};
for (const theme of Object.values(SKILL_CATEGORY_THEMES)) {
  if (theme.treeId === "farming") {
    theme.icon = "./skill_icons/scissors_hand.png";
  } else if (theme.treeId === "brewing") {
    theme.icon = "./skill_icons/flame_mastery.png";
  } else if (theme.treeId === "mana") {
    theme.icon = "./skill_icons/mana_vessel.png";
  } else if (theme.treeId === "contract") {
    theme.icon = "./skill_icons/bond_rune.png";
  }
}
const SKILL_LANE_LABELS = ["기초", "전개", "심화", "핵심", "완성", "초월"];
const DEFAULT_WITCH_TITLE = { id: "default", name: "견습 마녀", tier: "default" };
const SKILLED_WITCH_TITLES = {
  farming: { id: "farmer", name: "농부", tier: "skilled" },
  brewing: { id: "alchemist", name: "연금술사", tier: "skilled" },
  mana: { id: "mage", name: "마법사", tier: "skilled" },
  contract: { id: "employer", name: "고용주", tier: "skilled" },
};
const SKILLED_WITCH_TITLE_COMBOS = {
  "brewing+farming": { id: "elixirist", name: "비약술사", tier: "skilled" },
  "farming+mana": { id: "spiritist", name: "정령술사", tier: "skilled" },
  "contract+farming": { id: "lord", name: "영주", tier: "skilled" },
  "brewing+mana": { id: "arcanist", name: "비전술사", tier: "skilled" },
  "brewing+contract": { id: "merchant", name: "상인", tier: "skilled" },
  "contract+mana": { id: "summoner", name: "소환사", tier: "skilled" },
};
const MASTER_WITCH_TITLES = {
  farming: { id: "godmother", name: "대모", tier: "master" },
  brewing: { id: "apothecary", name: "영약사", tier: "master" },
  mana: { id: "archmage", name: "대마법사", tier: "master" },
  contract: { id: "sovereign", name: "군주", tier: "master" },
};
const MASTER_WITCH_TITLE_COMBOS = {
  "brewing+farming": { id: "gaia", name: "가이아", tier: "master" },
  "farming+mana": { id: "yggdrasil", name: "이그드라실", tier: "master" },
  "contract+farming": { id: "overlord", name: "오버로드", tier: "master" },
  "brewing+mana": { id: "master_arcanist", name: "아르카니스트", tier: "master" },
  "brewing+contract": { id: "maestro", name: "마에스트로", tier: "master" },
  "contract+mana": { id: "master_archmage", name: "아크메이지", tier: "master" },
};
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
  cauldronSlots: Array.from({ length: MAX_LAYOUT_SLOTS }, () => null),
  activeSlotMode: "layout",
  recipes: [],
  potionRecipes: [],
  cauldronRecipes: [],
  timedItems: [],
  timedItemByCode: new Map(),
  skills: [],
  skillLookup: new Map(),
  skillLevels: new Map(),
  activeSkillCategory: "",
  selectedSkillKey: "",
  cauldrons: Object.fromEntries(CAULDRON_TIERS.map((tier) => [tier.id, []])),
  recipeSelections: new Map(),
  hover: null,
  hoverPoint: null,
  activeTab: "planner",
  selectedCropId: CROPS[0].id,
  boostPotionActive: false,
  panLocked: true,
  statsCollapsed: window.matchMedia("(max-width: 720px)").matches,
  skillPointInputs: {
    forecastCurrentLevel: 1,
    forecastCurrentExp: 0,
    forecastPotionLevel: 0,
    forecastPotionCount: 1,
    targetCurrentLevel: 1,
    targetCurrentExp: 0,
    targetLevel: 2,
    targetPotionLevel: 0,
  },
  timeCalculatorInputs: {
    operationMode: "auto",
    cauldronEnhancement: 0,
    flameMastery: 0,
    itemACode: "",
    itemBCode: "",
    itemAEnhancement: 0,
    itemBEnhancement: 0,
    tableFilter: "",
  },
  timeBrewingRecipes: [],
  timeCraftRecipes: [],
  timeRecipeByKey: new Map(),
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
let plannerAnalysisCache = { key: "", value: null };

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

function currentCauldronPayload() {
  return Object.fromEntries(
    CAULDRON_TIERS.map((tier) => [
      tier.id,
      state.cauldrons[tier.id].map((cauldron) => ({
        id: cauldron.id,
        level: Math.max(0, Number(cauldron.level) || 0),
        recipeValue: cauldron.recipeValue || defaultCauldronRecipeValue(),
      })),
    ]),
  );
}

function applyCauldronPayload(payload) {
  CAULDRON_TIERS.forEach((tier) => {
    const items = Array.isArray(payload?.[tier.id]) ? payload[tier.id] : [];
    state.cauldrons[tier.id] = items.map((item) => ({
      id: typeof item.id === "string" ? item.id : `${tier.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      level: Math.max(0, Math.min(20, Number(item.level) || 0)),
      recipeValue: typeof item.recipeValue === "string" ? item.recipeValue : defaultCauldronRecipeValue(),
    }));
  });
}

function saveCauldronStateToStorage() {
  try {
    window.localStorage.setItem(MATERIAL_STORAGE_KEY, JSON.stringify(currentCauldronPayload()));
  } catch (error) {
    // Ignore storage errors so the calculator remains usable.
  }
}

function loadCauldronStateFromStorage() {
  try {
    const raw = window.localStorage.getItem(MATERIAL_STORAGE_KEY);
    if (raw) {
      applyCauldronPayload(JSON.parse(raw));
    }
  } catch (error) {
    // Ignore corrupt storage and keep defaults.
  }
}

function saveCauldronSlotsToStorage() {
  try {
    window.localStorage.setItem(CAULDRON_SLOT_STORAGE_KEY, JSON.stringify(state.cauldronSlots));
  } catch (error) {
    // Ignore storage errors so the calculator remains usable.
  }
}

function loadCauldronSlotsFromStorage() {
  try {
    const raw = window.localStorage.getItem(CAULDRON_SLOT_STORAGE_KEY);
    state.cauldronSlots = raw
      ? normalizeLayoutSlots(JSON.parse(raw))
      : Array.from({ length: MAX_LAYOUT_SLOTS }, () => null);
  } catch (error) {
    state.cauldronSlots = Array.from({ length: MAX_LAYOUT_SLOTS }, () => null);
  }
}

function currentCalculatorPayload() {
  return {
    target: recipeTargetSelect.value,
    level: recipeTargetLevelInput.value,
    count: recipeTargetCountInput.value,
    cauldronEnhancement: recipeCauldronEnhancementInput.value,
    selections: [...state.recipeSelections.entries()],
  };
}

function saveCalculatorStateToStorage() {
  try {
    window.localStorage.setItem(CALCULATOR_STORAGE_KEY, JSON.stringify(currentCalculatorPayload()));
  } catch (error) {
    // Ignore storage errors so the calculator remains usable.
  }
}

function loadCalculatorStateFromStorage() {
  try {
    const raw = window.localStorage.getItem(CALCULATOR_STORAGE_KEY);
    if (!raw) {
      return;
    }
    const payload = JSON.parse(raw);
    recipeTargetLevelInput.value = String(Math.max(0, Number(payload.level) || 0));
    recipeTargetCountInput.value = String(Math.max(1, Number(payload.count) || 1));
    recipeCauldronEnhancementInput.value = String(Math.max(0, Number(payload.cauldronEnhancement) || 0));
    state.recipeSelections = new Map(Array.isArray(payload.selections) ? payload.selections : []);
    if (typeof payload.target === "string") {
      recipeTargetSelect.dataset.pendingValue = payload.target;
    }
  } catch (error) {
    // Ignore corrupt storage and keep defaults.
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

function renderLegacyLayoutSlots() {
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

function activeSlotConfig() {
  if (state.activeSlotMode === "cauldron") {
    return {
      title: "가마솥 배치 저장/불러오기",
      slots: state.cauldronSlots,
      saveSlots: saveCauldronSlotsToStorage,
      currentPayload: currentCauldronPayload,
      applyPayload: (payload) => {
        applyCauldronPayload(payload);
        saveCauldronStateToStorage();
        renderMaterialCalculator();
      },
    };
  }

  return {
    title: "밭 배치 저장/불러오기",
    slots: state.layoutSlots,
    saveSlots: saveLayoutSlotsToStorage,
    currentPayload: currentLayoutPayload,
    applyPayload: (payload) => {
      applyLayoutPayload(payload);
      saveLayoutToStorage();
      renderPalette();
      centerView();
    },
  };
}

function openSlotModal(mode) {
  state.activeSlotMode = mode;
  renderLayoutSlots();
  slotPanel.hidden = false;
  slotModalBackdrop.hidden = false;
}

function closeSlotModal() {
  slotPanel.hidden = true;
  slotModalBackdrop.hidden = true;
}

function renderLayoutSlots() {
  const config = activeSlotConfig();
  const title = slotPanel.querySelector(".slot-panel-header h3");
  const description = slotPanel.querySelector(".slot-panel-header p");
  if (title) {
    title.textContent = config.title;
  }
  if (description) {
    description.textContent = "최대 10개 저장";
  }

  slotList.innerHTML = "";

  config.slots.forEach((slot, index) => {
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
      if (config.slots[index]) {
        config.slots[index].name = nameInput.value.trim();
        config.saveSlots();
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
      config.slots[index] = {
        name: nameInput.value.trim(),
        payload: config.currentPayload(),
        savedAt: Date.now(),
      };
      config.saveSlots();
      renderLayoutSlots();
      showCopyFeedback(`${slotDisplayName(config.slots[index], index)}에 저장했습니다.`);
    });

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.className = "slot-action-button subtle";
    loadButton.textContent = "불러오기";
    loadButton.disabled = !slot;
    loadButton.addEventListener("click", () => {
      if (!config.slots[index]) {
        return;
      }
      config.applyPayload(config.slots[index].payload);
      renderLayoutSlots();
      showCopyFeedback(`${slotDisplayName(config.slots[index], index)}을 불러왔습니다.`);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "slot-action-button subtle";
    deleteButton.textContent = "삭제";
    deleteButton.disabled = !slot;
    deleteButton.addEventListener("click", () => {
      config.slots[index] = null;
      config.saveSlots();
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
  materialsView.hidden = tabId !== "materials";
  timeView.hidden = tabId !== "time";
  skillsView.hidden = tabId !== "skills";
  skillPointsView.hidden = tabId !== "skill-points";

  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });

  if (tabId === "planner") {
    resizeCanvas();
  } else if (tabId === "materials") {
    renderMaterialCalculator();
  } else if (tabId === "time") {
    updateTimeCalculator();
  } else if (tabId === "skills") {
    renderSkillTree();
  } else if (tabId === "skill-points") {
    renderSkillPointCalculator();
  }
}

function compoundedEffect(base, level, count) {
  const factor = 1 - base * level;
  let result = 1;
  for (let index = 0; index < count; index += 1) {
    result *= factor;
  }
  return 1 - result;
}

function enhancementSuccessRate(levelA, levelB, wickMasteryLevel, cauldronEnhancement) {
  const difference = Math.abs(levelA - levelB);
  const baseRate = 0.5 * (0.5 ** difference);
  const wickBonus = wickMasteryLevel > 0
    ? compoundedEffect(0.005, wickMasteryLevel, cauldronEnhancement + 1) * baseRate
    : 0;
  return Math.min(0.75, baseRate + wickBonus);
}

function recipeCauldronEnhancement() {
  return Math.max(0, Number(recipeCauldronEnhancementInput?.value) || 0);
}

function activeWickMasteryLevel() {
  return getSkillLevel(normalizeSkillName(RECIPE_RELEVANT_SKILL_KEYS.wickMastery));
}

function enhancementExpectedCount(
  levelGap,
  cauldronEnhancement = recipeCauldronEnhancement(),
  wickMasteryLevel = activeWickMasteryLevel(),
) {
  const safeGap = Math.max(levelGap, 0);
  if (safeGap === 0) {
    return 1;
  }

  const successRate = enhancementSuccessRate(0, 0, wickMasteryLevel, cauldronEnhancement);
  const expectedCopiesPerSuccess = (1 + successRate) / successRate;
  return expectedCopiesPerSuccess ** safeGap;
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

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && quoted && nextChar === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells.map((value) => value.trim());
}

function parseDurationSeconds(value) {
  const text = String(value ?? "").trim().toLowerCase();
  const amount = Number.parseFloat(text);
  if (!Number.isFinite(amount)) {
    return 0;
  }

  if (text.endsWith("m")) {
    return amount * 60;
  }

  return amount;
}

function parsePotionCsv(text) {
  const [headerLine, ...lines] = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  if (!headerLine) {
    return [];
  }

  return lines
    .map(parseCsvLine)
    .filter((parts) => parts.length >= 5)
    .map(([name, material1, material2, duration, price], index) => ({
      id: `potion-${index}-${normalizeItemName(name)}`,
      type: "potion",
      name,
      material1,
      material2,
      durationSeconds: parseDurationSeconds(duration),
      price: Number(price) || 0,
    }));
}

function normalizeSkillName(name) {
  const normalized = normalizeItemName(String(name || ""));
  return SKILL_NAME_ALIASES[normalized] ?? normalized;
}

function preloadCropImages() {
  CROPS.forEach((crop) => {
    if (!crop.iconPath || cropImageCache.has(crop.id)) {
      return;
    }

    const image = new Image();
    image.decoding = "async";
    image.loading = "eager";
    image.src = crop.iconPath;
    image.addEventListener("load", () => {
      draw();
      renderPalette();
    });
    cropImageCache.set(crop.id, image);
  });
}

function parseSkillPrerequisites(text) {
  if (!text || text.trim() === "-") {
    return [];
  }

  return parseCsvLine(text)
    .flatMap((cell) => String(cell).split(","))
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(.+?)\s*>=\s*(\d+)$/);
      if (!match) {
        return null;
      }

      return {
        rawName: match[1].trim(),
        skillKey: normalizeSkillName(match[1]),
        minLevel: Number(match[2]) || 0,
      };
    })
    .filter(Boolean);
}

function parseSkillCsv(text) {
  const [headerLine, ...lines] = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  if (!headerLine) {
    return [];
  }

  return lines
    .map(parseCsvLine)
    .filter((parts) => parts.length >= 5)
    .filter((parts) => String(parts[0] || "").trim() && String(parts[1] || "").trim())
    .map(([category, name, maxLevel, prerequisites, description], index) => ({
      id: `skill-${index}-${normalizeSkillName(name)}`,
      key: normalizeSkillName(name),
      category: String(category || "").trim(),
      name: String(name || "").trim(),
      iconPath: SKILL_ICON_PATHS[String(name || "").trim()] ?? "",
      maxLevel: Math.max(1, Number(maxLevel) || 1),
      prerequisites: parseSkillPrerequisites(prerequisites),
      description: String(description || "").trim(),
    }));
}

function currentSkillTreePayload() {
  return {
    levels: [...state.skillLevels.entries()],
    activeCategory: state.activeSkillCategory,
    selectedSkillKey: state.selectedSkillKey,
  };
}

function saveSkillTreeToStorage() {
  try {
    window.localStorage.setItem(SKILL_TREE_STORAGE_KEY, JSON.stringify(currentSkillTreePayload()));
  } catch (error) {
    // Ignore storage errors so the skill tree remains usable.
  }
}

function loadSkillTreeFromStorage() {
  try {
    const raw = window.localStorage.getItem(SKILL_TREE_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const payload = JSON.parse(raw);
    state.skillLevels = new Map(Array.isArray(payload.levels) ? payload.levels : []);
    if (typeof payload.activeCategory === "string") {
      state.activeSkillCategory = payload.activeCategory;
    }
    if (typeof payload.selectedSkillKey === "string") {
      state.selectedSkillKey = payload.selectedSkillKey;
    }
  } catch (error) {
    state.skillLevels = new Map();
  }
}

function currentSkillPointPayload() {
  return { ...state.skillPointInputs };
}

function saveSkillPointInputs() {
  try {
    window.localStorage.setItem(SKILL_POINT_STORAGE_KEY, JSON.stringify(currentSkillPointPayload()));
  } catch (error) {
    // Ignore storage errors so the calculator remains usable.
  }
}

function loadSkillPointInputs() {
  try {
    const raw = window.localStorage.getItem(SKILL_POINT_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const payload = JSON.parse(raw);
    state.skillPointInputs = {
      ...state.skillPointInputs,
      ...payload,
    };
  } catch (error) {
    // Ignore corrupt storage and keep defaults.
  }
}

function currentTimeCalculatorPayload() {
  return { ...state.timeCalculatorInputs };
}

function saveTimeCalculatorInputs() {
  try {
    window.localStorage.setItem(TIME_CALCULATOR_STORAGE_KEY, JSON.stringify(currentTimeCalculatorPayload()));
  } catch (error) {
    // Ignore storage errors so the calculator remains usable.
  }
}

function loadTimeCalculatorInputs() {
  try {
    const raw = window.localStorage.getItem(TIME_CALCULATOR_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const payload = JSON.parse(raw);
    state.timeCalculatorInputs = {
      ...state.timeCalculatorInputs,
      ...payload,
    };
  } catch (error) {
    // Ignore corrupt storage and keep defaults.
  }
}

function syncTimeCalculatorSkillsFromTree() {
  state.timeCalculatorInputs.flameMastery = getSkillLevel(normalizeSkillName(TIME_RELEVANT_SKILL_KEYS.flameMastery));
}

async function loadTimeGameIndex() {
  const response = await fetch("./alcanthia_time_data.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("?? ?? ??? ??? ???? ?????.");
  }
  return response.json();
}

function buildTimeRecipeKey(codeA, codeB) {
  return [codeA, codeB].sort().join("::");
}

function findMatchingTimeRecipe(itemA, itemB) {
  return state.timeRecipeByKey.get(buildTimeRecipeKey(itemA.code, itemB.code)) ?? null;
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

function analyzeRequirement(itemKey, usedLevel, recipeMap, path, includeIntermediate = false, directCount = 1) {
  const recipe = recipeMap.get(itemKey);
  const collections = getRecipeCollections();

  if (!recipe) {
    return {
      baseLevels: new Map([[`${itemKey}|${usedLevel}`, directCount]]),
      intermediate: new Map(),
    };
  }

  const selection = getRecipeSelection(path, recipe.requiredLevel);
  const baseCopiesNeeded = directCount * enhancementExpectedCount(usedLevel);
  const firstAnalysis = analyzeRequirement(
    recipe.key1,
    selection.firstLevel,
    recipeMap,
    `${path}/1`,
    true,
    baseCopiesNeeded,
  );
  const secondAnalysis = analyzeRequirement(
    recipe.key2,
    selection.secondLevel,
    recipeMap,
    `${path}/2`,
    true,
    baseCopiesNeeded,
  );

  let baseLevels = mergeCountMaps(firstAnalysis.baseLevels, secondAnalysis.baseLevels);

  let intermediate = mergeCountMaps(firstAnalysis.intermediate, secondAnalysis.intermediate);

  if (includeIntermediate && collections.intermediateKeys.has(itemKey)) {
    const usageKey = `${itemKey}|${usedLevel}`;
    intermediate.set(usageKey, (intermediate.get(usageKey) ?? 0) + directCount);
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
    if (recipeTargetSelect.dataset.pendingValue) {
      recipeTargetSelect.value = recipeTargetSelect.dataset.pendingValue;
      delete recipeTargetSelect.dataset.pendingValue;
    }
  }

  const selectedKey = recipeTargetSelect.value || state.recipes[0].resultKey;
  recipeTargetSelect.value = selectedKey;
  const targetLevel = Math.max(0, Number(recipeTargetLevelInput.value) || 0);
  const targetCount = Math.max(1, Number(recipeTargetCountInput.value) || 1);
  const cauldronEnhancement = recipeCauldronEnhancement();
  const wickMasteryLevel = activeWickMasteryLevel();
  const enhancementSuccess = enhancementSuccessRate(0, 0, wickMasteryLevel, cauldronEnhancement);
  const expectedCopiesPerSuccess = (1 + enhancementSuccess) / enhancementSuccess;
  recipeTargetLevelInput.value = String(targetLevel);
  recipeTargetCountInput.value = String(targetCount);
  recipeCauldronEnhancementInput.value = String(cauldronEnhancement);
  const recipeMap = recipeSourceMap();
  const recipe = recipeMap.get(selectedKey);

  if (!recipe) {
    recipeSummary.innerHTML = `<p>선택한 완성품의 계산 정보를 찾지 못했습니다.</p>`;
    recipeControls.innerHTML = "";
    recipeBreakdown.innerHTML = "";
    return;
  }

  if (recipeEnhancementNote) {
    recipeEnhancementNote.textContent = `심지 숙련 Lv ${wickMasteryLevel}, 솥 강화 +${cauldronEnhancement} 기준으로 계산 중입니다. 같은 강화끼리 합칠 때 성공률 ${formatNumber(enhancementSuccess * 100, 1)}%, 1단계당 기대 소모 ${formatNumber(expectedCopiesPerSuccess, 3)}개`;
  }

  recipeControls.innerHTML = "";
  recipeControls.appendChild(renderRecipeSelectionNode(recipe, recipeMap, selectedKey));

  const rootSelection = getRecipeSelection(selectedKey, recipe.requiredLevel);
  const finalCopiesNeeded = enhancementExpectedCount(targetLevel) * targetCount;
  const topMaterialNeeds = [
    {
      name: recipe.material1,
      level: rootSelection.firstLevel,
      count: finalCopiesNeeded,
    },
    {
      name: recipe.material2,
      level: rootSelection.secondLevel,
      count: finalCopiesNeeded,
    },
  ];
  const requirement = analyzeRequirement(selectedKey, targetLevel, recipeMap, selectedKey, false, targetCount);
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
  saveCalculatorStateToStorage();
}

async function loadRecipes() {
  renderRecipeCalculator();
}

function allCraftItemOptions() {
  const items = new Map();
  state.recipes.forEach((recipe) => {
    items.set(recipe.key1, itemDisplayName(recipe.key1));
    items.set(recipe.key2, itemDisplayName(recipe.key2));
    items.set(recipe.resultKey, recipe.result);
  });
  return [...items.entries()].sort((a, b) => a[1].localeCompare(b[1], "ko"));
}

function timeItemNameByCode(code) {
  return state.timedItemByCode.get(code)?.name ?? code;
}

function buildRecipeCalculatorRecipesFromTimeData() {
  return state.timeCraftRecipes
    .map((recipe) => {
      const inputA = state.timedItemByCode.get(recipe.inputs[0]);
      const inputB = state.timedItemByCode.get(recipe.inputs[1]);
      const outputCode = Array.isArray(recipe.outputs) ? recipe.outputs[0] ?? "" : "";
      const outputItem = state.timedItemByCode.get(outputCode);
      if (!inputA || !inputB || !outputItem) {
        return null;
      }

      return {
        material1: inputA.name,
        material2: inputB.name,
        result: outputItem.name,
        requiredLevel: Number(recipe.requiredLevel) || 0,
        key1: inputA.code,
        key2: inputB.code,
        resultKey: outputItem.code,
        kind: recipe.kind ?? "craft",
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.result.localeCompare(right.result, "ko"));
}

function buildCauldronRecipesFromTimeData() {
  const recipes = [];
  const pushRecipe = (kind, recipe, index) => {
    const inputA = state.timedItemByCode.get(recipe.inputs[0]);
    const inputB = state.timedItemByCode.get(recipe.inputs[1]);
    if (!inputA || !inputB) {
      return;
    }

    const outputCodes = Array.isArray(recipe.outputs) ? recipe.outputs : [];
    const outputNames = outputCodes.map((code) => timeItemNameByCode(code));
    const value = `${kind}:${recipe.inputs.join("+")}=>${outputCodes.join("+") || index}`;
    recipes.push({
      kind,
      value,
      id: value,
      outputCode: outputCodes[0] ?? "",
      outputName: outputNames.join(", ") || `${timeItemNameByCode(recipe.inputs[0])} 조합`,
      name: outputNames.join(", ") || `${timeItemNameByCode(recipe.inputs[0])} 조합`,
      material1: inputA.name,
      material2: inputB.name,
      inputCodes: [...recipe.inputs],
      outputCodes,
      requiredLevel: recipe.requiredLevel ?? 0,
      durationSeconds: Math.max(inputA.baseDurationMs, inputB.baseDurationMs) / MILLIS_IN_SECOND,
    });
  };

  state.timeBrewingRecipes.forEach((recipe, index) => pushRecipe("potion", recipe, index));
  state.timeCraftRecipes.forEach((recipe, index) => pushRecipe(recipe.kind ?? "craft", recipe, index));

  return recipes;
}

function normalizeCauldronRecipes() {
  const available = new Set(brewingCauldronRecipes().map((recipe) => recipe.value));
  const fallback = brewingCauldronRecipes()[0]?.value ?? "";
  CAULDRON_TIERS.forEach((tier) => {
    state.cauldrons[tier.id].forEach((cauldron) => {
      if (!available.has(cauldron.recipeValue)) {
        cauldron.recipeValue = fallback;
      }
    });
  });
}

function activeFlameMasteryLevel() {
  return getSkillLevel(normalizeSkillName(TIME_RELEVANT_SKILL_KEYS.flameMastery));
}

function effectiveCauldronRecipeSeconds(recipe, cauldronLevel) {
  const baseDurationMs = Math.max(0, Number(recipe.durationSeconds) || 0) * MILLIS_IN_SECOND;
  const flameReduction = flameMasteryReduction(activeFlameMasteryLevel(), cauldronLevel);
  return Math.round(baseDurationMs * (1 - flameReduction)) / MILLIS_IN_SECOND;
}

function brewingCauldronRecipes() {
  return state.cauldronRecipes.filter((recipe) => recipe.kind === "potion");
}

function defaultCauldronRecipeValue() {
  return brewingCauldronRecipes()[0]?.value ?? "";
}

function createCauldron(tierId) {
  return {
    id: `${tierId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    level: 0,
    recipeValue: defaultCauldronRecipeValue(),
  };
}

function addCauldron(tierId) {
  state.cauldrons[tierId].push(createCauldron(tierId));
  saveCauldronStateToStorage();
  renderMaterialCalculator();
}

function recipeSelectOptions(selectedValue) {
  const potionOptions = brewingCauldronRecipes()
    .map((recipe) => `<option value="${recipe.value}">${recipe.name}</option>`)
    .join("");

  const html = `
    <optgroup label="양조">${potionOptions}</optgroup>
  `;

  return html.replace(`value="${selectedValue}"`, `value="${selectedValue}" selected`);
}

function selectedRecipeDetails(value) {
  const recipe = brewingCauldronRecipes().find((candidate) => candidate.value === value);
  return recipe ? { type: recipe.kind, recipe } : null;
}

function formatNumber(value, maximumFractionDigits = 2) {
  return value.toLocaleString("ko-KR", { maximumFractionDigits });
}

function renderCauldronCard(tier, cauldron) {
  const selected = selectedRecipeDetails(cauldron.recipeValue);
  const level = Math.max(0, Number(cauldron.level) || 0);
  let meta = "레시피를 선택해주세요.";

  if (selected?.recipe) {
    const seconds = effectiveCauldronRecipeSeconds(selected.recipe, level);
    const cyclesPerHour = seconds > 0 ? 3600 / seconds : 0;
    meta = `${selected.recipe.material1} + ${selected.recipe.material2} → ${selected.recipe.outputName} · ${formatNumber(seconds, 1)}초/회 · 시간당 ${formatNumber(cyclesPerHour, 2)}회`;
  }

  return `
    <article class="cauldron-card" data-tier="${tier.id}" data-id="${cauldron.id}">
      <div class="cauldron-card-header">
        <strong>
          <img class="cauldron-tier-icon" src="${tier.iconPath}" alt="${tier.name}" />
          ${tier.name}
        </strong>
        <button class="cauldron-delete" type="button" data-action="delete-cauldron" aria-label="가마솥 삭제">삭제</button>
      </div>
      <div class="cauldron-controls">
        <label class="compact-field">
          <span>강화</span>
          <input class="cauldron-level-input" data-action="change-cauldron-level" type="number" min="0" max="20" value="${level}" />
        </label>
        <label class="compact-field recipe-field">
          <span>레시피</span>
          <select class="cauldron-recipe-select" data-action="change-cauldron-recipe">
            ${recipeSelectOptions(cauldron.recipeValue)}
          </select>
        </label>
      </div>
      <p>${meta}</p>
    </article>
  `;
}

function collectHourlyMaterialUsage() {
  const usage = new Map();

  CAULDRON_TIERS.forEach((tier) => {
    state.cauldrons[tier.id].forEach((cauldron) => {
      const selected = selectedRecipeDetails(cauldron.recipeValue);
      if (!selected?.recipe || selected.recipe.durationSeconds <= 0) {
        return;
      }

      const seconds = effectiveCauldronRecipeSeconds(selected.recipe, cauldron.level);
      const cyclesPerHour = seconds > 0 ? 3600 / seconds : 0;
      [selected.recipe.material1, selected.recipe.material2].forEach((material) => {
        usage.set(material, (usage.get(material) ?? 0) + cyclesPerHour);
      });
    });
  });

  return [...usage.entries()].sort((a, b) => a[0].localeCompare(b[0], "ko"));
}

function renderMaterialUsageSummary() {
  const usage = collectHourlyMaterialUsage();
  const { cropYieldTotals } = calculateCropProduction();
  const fieldProduction = new Map();
  CROPS.filter((crop) => (cropYieldTotals.get(crop.id) ?? 0) > 0).forEach((crop) => {
    const producedMaterial = CROP_PRODUCTION_MATERIALS[crop.id] ?? crop.name;
    fieldProduction.set(producedMaterial, (fieldProduction.get(producedMaterial) ?? 0) + (cropYieldTotals.get(crop.id) ?? 0));
  });
  const producedMaterials = [...fieldProduction.entries()]
    .filter(([, count]) => count > 0)
    .map(([material]) => material);
  const materials = [...new Set([...usage.map(([material]) => material), ...producedMaterials])]
    .sort((a, b) => a.localeCompare(b, "ko"));

  if (!usage.length) {
    materialUsageSummary.innerHTML = `
      <h4>시간당 재료 소모량</h4>
      <p>양조 레시피가 선택된 가마솥이 없습니다.</p>
      ${renderFieldProductionTable(fieldProduction)}
    `;
    return;
  }

  const usageMap = new Map(usage);
  const rows = usage
    .map(
      ([material, count]) => `
        <tr>
          <td><strong>${material}</strong></td>
          <td>${formatNumber(count, 2)}개/시간</td>
        </tr>
      `,
    )
    .join("");

  materialUsageSummary.innerHTML = `
    <h4>시간당 재료 소모량</h4>
    <table class="mini-table">
      <thead>
        <tr>
          <th>재료</th>
          <th>소모량</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    ${renderFieldProductionTable(fieldProduction)}
    ${renderMaterialBalanceTable(materials, usageMap, fieldProduction)}
  `;
}

function renderFieldProductionTable(fieldProduction) {
  const rows = [...fieldProduction.entries()]
    .filter(([, count]) => count > 0)
    .sort((a, b) => a[0].localeCompare(b[0], "ko"))
    .map(
      ([material, count]) => `
        <tr>
          <td><strong>${material}</strong></td>
          <td>${formatNumber(count, 2)}개/시간</td>
        </tr>
      `,
    )
    .join("");

  return `
    <h4 class="material-summary-heading">밭 생산량</h4>
    ${
      rows
        ? `<table class="mini-table">
            <thead>
              <tr>
                <th>재료</th>
                <th>생산량</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>`
        : `<p>생산 중인 재료가 없습니다.</p>`
    }
  `;
}

function renderMaterialBalanceTable(materials, usageMap, fieldProduction) {
  if (!materials.length) {
    return "";
  }

  const rows = materials
    .map((material) => {
      const produced = fieldProduction.get(material) ?? 0;
      const consumed = usageMap.get(material) ?? 0;
      const balance = produced - consumed;
      const className = balance >= 0 ? "positive" : "negative";
      return `
        <tr>
          <td><strong>${material}</strong></td>
          <td>${formatNumber(produced, 2)}</td>
          <td>${formatNumber(consumed, 2)}</td>
          <td class="${className}">${balance >= 0 ? "+" : ""}${formatNumber(balance, 2)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <h4 class="material-summary-heading">최종 증/감</h4>
    <table class="mini-table">
      <thead>
        <tr>
          <th>재료</th>
          <th>생산</th>
          <th>소모</th>
          <th>증감</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderMaterialCalculator() {
  if (!cauldronBoard || !materialUsageSummary) {
    return;
  }

  if (!brewingCauldronRecipes().length) {
    cauldronBoard.innerHTML = `<div class="result-card"><p>원본 앱 레시피를 불러오는 중입니다.</p></div>`;
    materialUsageSummary.innerHTML = "";
    return;
  }

  const scrollPositions = new Map(
    [...cauldronBoard.querySelectorAll(".cauldron-row")].map((row) => {
      const list = row.querySelector(".cauldron-list");
      return [row.dataset.tier, list?.scrollLeft ?? 0];
    }),
  );

  cauldronBoard.innerHTML = CAULDRON_TIERS.map((tier) => {
    const cards = state.cauldrons[tier.id]
      .map((cauldron) => renderCauldronCard(tier, cauldron))
      .join("");

    return `
      <section class="cauldron-row" data-tier="${tier.id}">
        <div class="cauldron-row-header">
          <h3>
            <img class="cauldron-tier-icon" src="${tier.iconPath}" alt="${tier.name}" />
            ${tier.name}
          </h3>
          <button type="button" data-action="add-cauldron" data-tier="${tier.id}">+</button>
        </div>
        <div class="cauldron-list">
          ${cards || `<p class="empty-row">오른쪽 + 버튼으로 ${tier.name}을 추가하세요.</p>`}
        </div>
      </section>
    `;
  }).join("");

  cauldronBoard.querySelectorAll(".cauldron-row").forEach((row) => {
    const list = row.querySelector(".cauldron-list");
    if (list) {
      list.scrollLeft = scrollPositions.get(row.dataset.tier) ?? 0;
    }
  });

  renderMaterialUsageSummary();
}

function loadPotionRecipes() {
  renderMaterialCalculator();
  renderSkillPointCalculator();
}

async function initializeTimeCalculatorData() {
  setTimeStatus("loading", "???? ???? ???? ????.");

  try {
    const data = await loadTimeGameIndex();
    const timedItems = Array.isArray(data?.timedItems) ? data.timedItems : [];
    const brewRecipes = Array.isArray(data?.brewRecipes) ? data.brewRecipes : [];
    const craftRecipes = Array.isArray(data?.craftRecipes) ? data.craftRecipes : [];

    state.timedItems = timedItems
      .map((item) => ({
        code: item.code,
        name: item.name,
        type: item.type ?? "unknown",
        baseDurationMs: Number(item.baseDurationMs) || 0,
      }))
      .sort((left, right) => left.name.localeCompare(right.name, "ko") || left.code.localeCompare(right.code, "ko"));
    state.timedItemByCode = new Map(state.timedItems.map((item) => [item.code, item]));

    state.timeBrewingRecipes = brewRecipes.map((recipe) => ({
      kind: recipe.kind ?? "potion",
      inputs: [...recipe.inputs],
      requiredLevel: recipe.requiredLevel ?? 0,
      outputs: [...recipe.outputs],
    }));
    state.timeCraftRecipes = craftRecipes.map((recipe) => ({
      kind: recipe.kind ?? (recipe.inputs?.includes("engraving_stone") ? "engrave" : "craft"),
      inputs: [...recipe.inputs],
      requiredLevel: recipe.requiredLevel ?? 0,
      outputs: [...recipe.outputs],
    }));
    state.timeRecipeByKey = new Map(
      [...state.timeBrewingRecipes, ...state.timeCraftRecipes].map((recipe) => [
        buildTimeRecipeKey(recipe.inputs[0], recipe.inputs[1]),
        recipe,
      ]),
    );

    if (!state.timedItems.length || !state.timeBrewingRecipes.length || !state.timeCraftRecipes.length) {
      throw new Error("?? ?? ???? ?? ????.");
    }

    state.cauldronRecipes = buildCauldronRecipesFromTimeData();
    state.recipes = buildRecipeCalculatorRecipesFromTimeData();
    state.potionRecipes = state.cauldronRecipes
      .filter((recipe) => recipe.kind === "potion")
      .map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        material1: recipe.material1,
        material2: recipe.material2,
        durationSeconds: recipe.durationSeconds,
      }));
    CAULDRON_TIERS.forEach((tier) => {
      if (!state.cauldrons[tier.id].length) {
        state.cauldrons[tier.id].push(createCauldron(tier.id));
      }
    });
    normalizeCauldronRecipes();
    if (!state.recipes.some((recipe) => recipe.resultKey === recipeTargetSelect.value)) {
      recipeTargetSelect.innerHTML = "";
    }

    if (!state.timeCalculatorInputs.itemACode || !state.timedItemByCode.has(state.timeCalculatorInputs.itemACode)) {
      state.timeCalculatorInputs.itemACode = state.timedItemByCode.has("herb") ? "herb" : state.timedItems[0]?.code ?? "";
    }
    if (!state.timeCalculatorInputs.itemBCode || !state.timedItemByCode.has(state.timeCalculatorInputs.itemBCode)) {
      state.timeCalculatorInputs.itemBCode =
        state.timedItemByCode.has("red_flower_leaf") ? "red_flower_leaf" : state.timedItems[1]?.code ?? state.timedItems[0]?.code ?? "";
    }

    populateTimeItemSelectors();
    syncTimeCalculatorInputs();
    renderTimeDurationTable();
    renderRecipeCalculator();
    renderMaterialCalculator();
    renderSkillPointCalculator();
    updateTimeCalculator();
    setTimeStatus("ready", "");
  } catch (error) {
    state.recipes = [];
    state.cauldronRecipes = [];
    state.potionRecipes = [];
    state.timedItems = [...STATIC_TIMED_ITEMS].sort(
      (left, right) => left.name.localeCompare(right.name, "ko") || left.code.localeCompare(right.code, "ko"),
    );
    state.timedItemByCode = new Map(state.timedItems.map((item) => [item.code, item]));
    state.timeBrewingRecipes = [];
    state.timeCraftRecipes = [];
    state.timeRecipeByKey = new Map();
    populateTimeItemSelectors();
    syncTimeCalculatorInputs();
    renderTimeDurationTable();
    renderRecipeCalculator();
    setTimeStatus("error", `?? ?? ???? ???? ?????: ${error.message}`);
  }
}

function setTimeStatus(type, message) {
  if (!timeStatusBanner) {
    return;
  }

  if (type === "ready") {
    timeStatusBanner.hidden = true;
    timeStatusBanner.textContent = "";
    timeStatusBanner.className = "status-banner";
    return;
  }

  timeStatusBanner.hidden = false;
  timeStatusBanner.className = `status-banner ${type}`;
  timeStatusBanner.textContent = message;
}

function shouldHideTimeItem(item) {
  const name = String(item?.name ?? "");
  return name.includes("시험용") || name.startsWith("기록 조각");
}

function visibleTimeItems() {
  return state.timedItems.filter((item) => !shouldHideTimeItem(item));
}

function populateTimeItemSelectors() {
  if (!timeItemASelect || !timeItemBSelect) {
    return;
  }

  const options = visibleTimeItems()
    .map(
      (item) => `<option value="${item.code}">${item.name}</option>`,
    )
    .join("");

  timeItemASelect.innerHTML = options;
  timeItemBSelect.innerHTML = options;
}

function syncTimeCalculatorInputs() {
  if (!timeOperationModeSelect) {
    return;
  }

  syncTimeCalculatorSkillsFromTree();
  timeOperationModeSelect.value = state.timeCalculatorInputs.operationMode;
  timeCauldronEnhancementInput.value = String(state.timeCalculatorInputs.cauldronEnhancement);
  timeFlameMasteryInput.value = String(state.timeCalculatorInputs.flameMastery);
  timeItemASelect.value = state.timeCalculatorInputs.itemACode;
  timeItemBSelect.value = state.timeCalculatorInputs.itemBCode;
  timeItemAEnhancementInput.value = String(state.timeCalculatorInputs.itemAEnhancement);
  timeItemBEnhancementInput.value = String(state.timeCalculatorInputs.itemBEnhancement);
  timeTableFilterInput.value = state.timeCalculatorInputs.tableFilter;
}

function renderTimeDurationTable() {
  if (!timeDurationTableBody) {
    return;
  }

  const query = state.timeCalculatorInputs.tableFilter.trim().toLowerCase();
  const rows = visibleTimeItems().filter((item) => {
    if (!query) {
      return true;
    }
    return item.name.toLowerCase().includes(query);
  });

  timeDurationTableBody.innerHTML = rows
    .map(
      (item) => `
        <tr>
          <td><strong>${item.name}</strong></td>
          <td>${formatWorkDuration(item.baseDurationMs)}</td>
        </tr>
      `,
    )
    .join("");
}

function timeItemTypeLabel(type) {
  return {
    seed: "씨앗",
    produce: "작물",
    tool: "도구",
    material: "재료",
    equipment: "장비",
    potion: "포션",
    misc: "기타",
  }[type] ?? type;
}

function resolveTimeOperationMode(selectedMode, itemA, itemB, enhancementA, enhancementB) {
  const matchedRecipe = findMatchingTimeRecipe(itemA, itemB);
  const validEnhancement =
    itemA.code === itemB.code && enhancementA === enhancementB && itemA.type !== "produce";

  if (selectedMode === "auto") {
    if (validEnhancement) {
      return { valid: true, mode: "enhancement", recipe: null };
    }
    if (matchedRecipe) {
      return { valid: true, mode: matchedRecipe.kind, recipe: matchedRecipe };
    }
    return {
      valid: false,
      reason: "원본 앱에 없는 조합입니다. 양조 43개, 제작 37개 레시피 중 하나이거나 같은 강화의 동일 아이템 2개 강화여야 합니다.",
    };
  }

  if (selectedMode === "enhancement") {
    return validEnhancement
      ? { valid: true, mode: "enhancement", recipe: null }
      : { valid: false, reason: "강화는 같은 강화 수치의 동일한 아이템 2개를 넣어야만 가능합니다." };
  }

  if (selectedMode === "potion") {
    return matchedRecipe?.kind === "potion"
      ? { valid: true, mode: "potion", recipe: matchedRecipe }
      : { valid: false, reason: "양조는 원본 앱의 43개 레시피 조합에서만 가능합니다." };
  }

  if (selectedMode === "craft") {
    return matchedRecipe?.kind === "craft"
      ? { valid: true, mode: "craft", recipe: matchedRecipe }
      : { valid: false, reason: "제작은 원본 앱의 제작 레시피에서만 가능합니다." };
  }

  if (selectedMode === "engrave") {
    return matchedRecipe?.kind === "engrave"
      ? { valid: true, mode: "engrave", recipe: matchedRecipe }
      : { valid: false, reason: "각인은 각인석이 포함된 원본 앱 레시피에서만 가능합니다." };
  }

  return { valid: false, reason: "이 작업 종류는 현재 지원하지 않습니다." };
}

function timeOperationLabel(mode) {
  return {
    potion: "양조",
    craft: "제작",
    enhancement: "강화",
    engrave: "각인",
  }[mode] ?? "작업";
}

function enhancedWorkDuration(baseDurationMs, enhancement) {
  return Math.round(baseDurationMs * (2 ** Math.max(0, enhancement)));
}

function flameMasteryReduction(flameMastery, cauldronEnhancement) {
  if (flameMastery <= 0) {
    return 0;
  }

  return compoundedReduction(0.01, flameMastery, cauldronEnhancement + 1);
}

function compoundedReduction(base, level, count) {
  return compoundedEffect(base, level, count);
}

function formatWorkDuration(durationMs) {
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

function formatReductionPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function renderTimeItemSummary(item, enhancement, effectiveMs) {
  return `
    <strong>${item.name}</strong>
    <p>기본시간: ${formatWorkDuration(item.baseDurationMs)}</p>
    <p>강화 반영시간: ${formatWorkDuration(effectiveMs)}</p>
  `;
}

function buildTimeNotes(mode, itemA, itemB, flameReduction) {
  const notes = [
    {
      title: "작업 판정",
      body: `현재 조합은 <strong>${timeOperationLabel(mode)}</strong> 기준으로 계산했습니다.`,
    },
    {
      title: "기준 시간 규칙",
      body: "결과물 시간이 아니라 재료 두 개의 강화 반영시간 중 더 긴 값을 기준으로 사용합니다.",
    },
  ];

  const impactSkills = ["불꽃 숙련"];
  notes.push({
    title: "현재 작업 영향 스킬",
    body: impactSkills.map((skill) => `<strong>${skill}</strong>`).join(", "),
  });

  if (flameReduction > 0) {
    notes.push({
      title: "불꽃 숙련 적용",
      body: `가마솥 강화 ${state.timeCalculatorInputs.cauldronEnhancement} 기준으로 총 ${formatReductionPercent(flameReduction)} 감소가 반영됐습니다.`,
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

function updateTimeCalculator() {
  if (!state.timedItems.length || !timeResultPrimary) {
    return;
  }

  syncTimeCalculatorSkillsFromTree();
  if (timeFlameMasteryInput) {
    timeFlameMasteryInput.value = String(state.timeCalculatorInputs.flameMastery);
  }
  const itemA = state.timedItemByCode.get(state.timeCalculatorInputs.itemACode);
  const itemB = state.timedItemByCode.get(state.timeCalculatorInputs.itemBCode);
  if (!itemA || !itemB) {
    return;
  }

  const effectiveA = enhancedWorkDuration(itemA.baseDurationMs, state.timeCalculatorInputs.itemAEnhancement);
  const effectiveB = enhancedWorkDuration(itemB.baseDurationMs, state.timeCalculatorInputs.itemBEnhancement);
  const baseWorkMs = Math.max(effectiveA, effectiveB);
  const modeResult = resolveTimeOperationMode(
    state.timeCalculatorInputs.operationMode,
    itemA,
    itemB,
    state.timeCalculatorInputs.itemAEnhancement,
    state.timeCalculatorInputs.itemBEnhancement,
  );

  timeItemASummary.innerHTML = renderTimeItemSummary(itemA, state.timeCalculatorInputs.itemAEnhancement, effectiveA);
  timeItemBSummary.innerHTML = renderTimeItemSummary(itemB, state.timeCalculatorInputs.itemBEnhancement, effectiveB);

  if (!modeResult.valid) {
    timeResultPrimary.innerHTML = `
      <div class="time-result-kicker">계산 불가</div>
      <div class="time-result-time">-</div>
      <p class="time-result-detail">${modeResult.reason}</p>
    `;
    timeFormulaBreakdown.innerHTML = "";
    timeResultNotes.innerHTML = `
      <div class="time-note-row">
        <strong>원본 앱 규칙</strong>
        <div>양조는 43개, 제작은 37개 원본 레시피 조합만 허용되고 강화는 같은 강화 수치의 동일 아이템 2개로만 가능합니다.</div>
      </div>
    `;
    saveTimeCalculatorInputs();
    return;
  }

  const { mode, recipe } = modeResult;
  const flameReduction = flameMasteryReduction(
    state.timeCalculatorInputs.flameMastery,
    state.timeCalculatorInputs.cauldronEnhancement,
  );
  const finalMs = Math.round(baseWorkMs * (1 - flameReduction));

  timeResultPrimary.innerHTML = `
    <div class="time-result-kicker">${timeOperationLabel(mode)} 예상 시간</div>
    <div class="time-result-time">${formatWorkDuration(finalMs)}</div>
    <p class="time-result-detail">
      기준시간은 두 재료 중 더 긴 시간인 <strong>${formatWorkDuration(baseWorkMs)}</strong>입니다.
      이후 불꽃 숙련 보정을 적용했습니다.
    </p>
    ${
      recipe
        ? `<p class="time-result-detail">레시피: <strong>${itemA.name}</strong> + <strong>${itemB.name}</strong> → <strong>${recipe.outputs.map((output) => state.timedItemByCode.get(output)?.name ?? output).join(", ")}</strong> / 필요 강화 합 ${recipe.requiredLevel}</p>`
        : `<p class="time-result-detail">강화 규칙: 동일 아이템 + 같은 강화 수치</p>`
    }
  `;

  timeFormulaBreakdown.innerHTML = [
    {
      title: "1. 재료별 강화 반영 시간",
      body: `${itemA.name}: ${formatWorkDuration(itemA.baseDurationMs)} × 2^${state.timeCalculatorInputs.itemAEnhancement} = ${formatWorkDuration(effectiveA)}<br>${itemB.name}: ${formatWorkDuration(itemB.baseDurationMs)} × 2^${state.timeCalculatorInputs.itemBEnhancement} = ${formatWorkDuration(effectiveB)}`,
    },
    {
      title: "2. 작업 기준시간",
      body: `max(${formatWorkDuration(effectiveA)}, ${formatWorkDuration(effectiveB)}) = <strong>${formatWorkDuration(baseWorkMs)}</strong>`,
    },
    {
      title: "3. 불꽃 숙련 보정",
      body: `감소율 = ${formatReductionPercent(flameReduction)}<br>최종 시간 = <strong>${formatWorkDuration(finalMs)}</strong>`,
    },
  ]
    .map(
      (section) => `
        <div class="time-formula-row">
          <strong>${section.title}</strong>
          <div>${section.body}</div>
        </div>
      `,
    )
    .join("");

  timeResultNotes.innerHTML = buildTimeNotes(mode, itemA, itemB, flameReduction)
    .map(
      (note) => `
        <div class="time-note-row">
          <strong>${note.title}</strong>
          <div>${note.body}</div>
        </div>
      `,
    )
    .join("");

  saveTimeCalculatorInputs();
}

function skillCategories() {
  return [...new Set(state.skills.map((skill) => skill.category))];
}

function getSkillLevel(skillKey) {
  return Math.max(0, Number(state.skillLevels.get(skillKey)) || 0);
}

function skillPrerequisitesMet(skill) {
  return skill.prerequisites.every((requirement) => getSkillLevel(requirement.skillKey) >= requirement.minLevel);
}

function canIncreaseSkill(skill) {
  return getSkillLevel(skill.key) < skill.maxLevel && skillPrerequisitesMet(skill);
}

function wouldBreakDependentSkills(skillKey, nextLevel) {
  return state.skills.some((candidate) => {
    const learnedLevel = getSkillLevel(candidate.key);
    if (learnedLevel <= 0) {
      return false;
    }

    return candidate.prerequisites.some(
      (requirement) => requirement.skillKey === skillKey && nextLevel < requirement.minLevel,
    );
  });
}

function canDecreaseSkill(skill) {
  const currentLevel = getSkillLevel(skill.key);
  if (currentLevel <= 0) {
    return false;
  }

  return !wouldBreakDependentSkills(skill.key, currentLevel - 1);
}

function skillMissingRequirements(skill) {
  return skill.prerequisites.filter((requirement) => getSkillLevel(requirement.skillKey) < requirement.minLevel);
}

function skillPointTotals() {
  let spent = 0;
  state.skillLevels.forEach((level) => {
    spent += Math.max(0, Number(level) || 0);
  });
  return spent;
}

function requiredSkillLevel() {
  return Math.max(1, skillPointTotals() + 1);
}

function skillCategoryMeta(category) {
  return SKILL_CATEGORY_THEMES[category] ?? {
    treeId: normalizeSkillName(category),
    icon: "",
    tint: "#7f6a49",
    glow: "rgba(127, 106, 73, 0.22)",
    accent: "#5f4d36",
  };
}

function learnedSkillCount(category) {
  return state.skills.filter((skill) => skill.category === category && getSkillLevel(skill.key) > 0).length;
}

function skillTreePointSummary() {
  const spent = { farming: 0, brewing: 0, mana: 0, contract: 0 };
  const max = { farming: 0, brewing: 0, mana: 0, contract: 0 };

  state.skills.forEach((skill) => {
    const treeId = skillCategoryMeta(skill.category).treeId;
    if (!(treeId in spent)) {
      return;
    }

    spent[treeId] += getSkillLevel(skill.key);
    max[treeId] += Math.max(0, Number(skill.maxLevel) || 0);
  });

  return { spent, max };
}

function currentWitchTitleFromSkills() {
  const summary = skillTreePointSummary();
  const activeTrees = Object.keys(summary.spent)
    .filter((treeId) => summary.spent[treeId] > 0)
    .sort((left, right) => summary.spent[right] - summary.spent[left]);
  const completedTrees = activeTrees.filter((treeId) => summary.max[treeId] > 0 && summary.spent[treeId] >= summary.max[treeId]);

  if (completedTrees.length >= 2) {
    const comboKey = [completedTrees[0], completedTrees[1]].sort().join("+");
    return {
      title: MASTER_WITCH_TITLE_COMBOS[comboKey] ?? MASTER_WITCH_TITLES[completedTrees[0]] ?? DEFAULT_WITCH_TITLE,
      summary,
    };
  }

  if (completedTrees.length === 1) {
    return {
      title: MASTER_WITCH_TITLES[completedTrees[0]] ?? DEFAULT_WITCH_TITLE,
      summary,
    };
  }

  const skilledTrees = activeTrees.filter((treeId) => summary.max[treeId] > 0 && summary.spent[treeId] / summary.max[treeId] >= 0.5);
  if (skilledTrees.length >= 2) {
    const comboKey = [skilledTrees[0], skilledTrees[1]].sort().join("+");
    return {
      title: SKILLED_WITCH_TITLE_COMBOS[comboKey] ?? SKILLED_WITCH_TITLES[skilledTrees[0]] ?? DEFAULT_WITCH_TITLE,
      summary,
    };
  }

  if (skilledTrees.length === 1) {
    return {
      title: SKILLED_WITCH_TITLES[skilledTrees[0]] ?? DEFAULT_WITCH_TITLE,
      summary,
    };
  }

  return { title: DEFAULT_WITCH_TITLE, summary };
}

function buildSkillColumns(categorySkills) {
  const byKey = new Map(categorySkills.map((skill) => [skill.key, skill]));
  const memo = new Map();
  const visiting = new Set();

  const depthFor = (skill) => {
    if (memo.has(skill.key)) {
      return memo.get(skill.key);
    }

    if (visiting.has(skill.key)) {
      return 0;
    }

    visiting.add(skill.key);
    const prerequisiteDepths = skill.prerequisites
      .map((requirement) => byKey.get(requirement.skillKey))
      .filter(Boolean)
      .map(depthFor);
    visiting.delete(skill.key);

    const depth = prerequisiteDepths.length ? Math.max(...prerequisiteDepths) + 1 : 0;
    memo.set(skill.key, depth);
    return depth;
  };

  const columns = [];
  categorySkills.forEach((skill, order) => {
    const depth = depthFor(skill);
    if (!columns[depth]) {
      columns[depth] = [];
    }

    columns[depth].push({ ...skill, depth, order });
  });

  return columns
    .filter(Boolean)
    .map((column) =>
      column.sort((left, right) => {
        const leftLevel = Math.max(...left.prerequisites.map((requirement) => requirement.minLevel), 0);
        const rightLevel = Math.max(...right.prerequisites.map((requirement) => requirement.minLevel), 0);
        return leftLevel - rightLevel || left.order - right.order;
      }),
    );
}

function skillLaneLabel(index) {
  return SKILL_LANE_LABELS[index] ?? `Tier ${index + 1}`;
}

function skillIconLabel(skillName) {
  const tokens = Array.from(String(skillName || "").replace(/\s+/g, "").trim());
  return tokens.slice(0, 2).join("") || "?";
}

function formatSkillDescriptionValue(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }

  return rounded.toFixed(2).replace(/\.?0+$/, "");
}

function resolveSkillDescription(description, level) {
  const actualLevel = Math.max(0, Number(level) || 0);
  return String(description || "")
    .replace(/(\d+(?:\.\d+)?)\s*\*\s*lv(\s*(?:%|개|칸|명))?/gi, (_, factor, unit = "") => {
      return `${formatSkillDescriptionValue(Number(factor) * actualLevel)}${unit}`;
    })
    .replace(/lv\s*\*\s*(\d+(?:\.\d+)?)(\s*(?:%|개|칸|명))?/gi, (_, factor, unit = "") => {
      return `${formatSkillDescriptionValue(actualLevel * Number(factor))}${unit}`;
    })
    .replace(/lv(\s*(?:%|개|칸|명))/gi, (_, unit = "") => {
      return `${formatSkillDescriptionValue(actualLevel)}${unit}`;
    });
}

function ensureSelectedSkill(categorySkills) {
  if (!categorySkills.length) {
    state.selectedSkillKey = "";
    return null;
  }

  const selected = categorySkills.find((skill) => skill.key === state.selectedSkillKey);
  if (selected) {
    return selected;
  }

  const learned = categorySkills.find((skill) => getSkillLevel(skill.key) > 0);
  state.selectedSkillKey = (learned ?? categorySkills[0]).key;
  return state.skillLookup.get(state.selectedSkillKey) ?? categorySkills[0];
}

function buildSkillNodeLayout(categorySkills) {
  const columns = buildSkillColumns(categorySkills);
  const positions = new Map();
  let maxColumn = 0;

  columns.forEach((column, depth) => {
    const occupiedColumns = new Set();
    const arranged = [...column].sort((left, right) => {
      const leftParents = left.prerequisites
        .map((requirement) => positions.get(requirement.skillKey)?.column)
        .filter(Number.isFinite);
      const rightParents = right.prerequisites
        .map((requirement) => positions.get(requirement.skillKey)?.column)
        .filter(Number.isFinite);
      const leftAnchor = leftParents.length ? leftParents.reduce((sum, value) => sum + value, 0) / leftParents.length : left.order;
      const rightAnchor = rightParents.length ? rightParents.reduce((sum, value) => sum + value, 0) / rightParents.length : right.order;
      return leftAnchor - rightAnchor || left.order - right.order;
    });

    arranged.forEach((skill, fallbackIndex) => {
      const parentColumns = skill.prerequisites
        .map((requirement) => positions.get(requirement.skillKey)?.column)
        .filter(Number.isFinite);
      let targetColumn = parentColumns.length
        ? Math.round(parentColumns.reduce((sum, value) => sum + value, 0) / parentColumns.length)
        : fallbackIndex;
      targetColumn = Math.max(0, targetColumn + (SKILL_COLUMN_OFFSETS[skill.name] ?? 0));
      if (Number.isFinite(SKILL_FIXED_COLUMNS[skill.name])) {
        targetColumn = SKILL_FIXED_COLUMNS[skill.name];
      }

      while (occupiedColumns.has(targetColumn)) {
        targetColumn += 1;
      }

      occupiedColumns.add(targetColumn);
      maxColumn = Math.max(maxColumn, targetColumn);
      positions.set(skill.key, { row: depth, column: targetColumn, skill });
    });
  });

  const usedColumns = [...new Set([...positions.values()].map((position) => position.column))].sort((left, right) => left - right);
  const columnMap = new Map(usedColumns.map((column, index) => [column, index]));
  positions.forEach((position, key) => {
    positions.set(key, { ...position, column: columnMap.get(position.column) ?? position.column });
  });
  positions.forEach((position, key) => {
    if (Number.isFinite(SKILL_FIXED_COLUMNS[position.skill.name])) {
      positions.set(key, { ...position, column: SKILL_FIXED_COLUMNS[position.skill.name] });
    }
  });

  const rows = Math.max(columns.length, 1);
  const cols = Math.max(
    [...positions.values()].reduce((max, position) => Math.max(max, position.column + 1), 1),
    1,
  );
  const connections = categorySkills.flatMap((skill) => {
    const child = positions.get(skill.key);
    if (!child) {
      return [];
    }

    return skill.prerequisites
      .map((requirement) => {
        const parent = positions.get(requirement.skillKey);
        if (!parent) {
          return null;
        }

        const x1 = ((parent.column + 0.5) / cols) * 100;
        const y1 = ((parent.row + 0.5) / rows) * 100;
        const x2 = ((child.column + 0.5) / cols) * 100;
        const y2 = ((child.row + 0.5) / rows) * 100;
        const midY = (y1 + y2) / 2;
        return {
          key: `${requirement.skillKey}-${skill.key}-${requirement.minLevel}`,
          active: getSkillLevel(requirement.skillKey) >= requirement.minLevel,
          path: `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`,
        };
      })
      .filter(Boolean);
  });

  return { positions, connections, rows, cols };
}

function renderSkillDetailDock(skill, theme) {
  if (!skillDetailDock) {
    return;
  }

  if (!skill) {
    skillDetailDock.innerHTML = "";
    return;
  }

  const currentLevel = getSkillLevel(skill.key);
  const missing = skillMissingRequirements(skill);

  skillDetailDock.innerHTML = `
    <section class="skill-detail-card" style="--detail-tint:${theme.tint}; --detail-glow:${theme.glow}; --detail-accent:${theme.accent};">
      <div class="skill-detail-icon-wrap">
        <button class="skill-detail-icon" type="button" data-select-skill="${skill.key}" aria-label="${skill.name} 선택">
          ${
            skill.iconPath
              ? `<img class="skill-detail-icon-image" src="${skill.iconPath}" alt="${skill.name}" loading="eager" decoding="async" />`
              : `<span>${skillIconLabel(skill.name)}</span>`
          }
        </button>
      </div>
      <div class="skill-detail-copy">
        <p class="skill-detail-kicker">${skill.category} · ${skillLaneLabel(Number.isFinite(skill.depth) ? skill.depth : 0)}</p>
        <h3>${skill.name}</h3>
        <p class="skill-detail-description">${resolveSkillDescription(skill.description, currentLevel)}</p>
        <p class="skill-detail-meta">현재 Lv ${currentLevel} / ${skill.maxLevel}</p>
        <p class="skill-detail-requirements ${missing.length ? "missing" : "met"}">
          ${missing.length
            ? `필요 조건: ${missing
                .map(
                  (requirement) =>
                    `${state.skillLookup.get(requirement.skillKey)?.name ?? requirement.rawName} ${requirement.minLevel}`,
                )
                .join(", ")}`
            : skill.prerequisites.length
              ? "선행 조건 충족"
              : "시작 스킬"}
        </p>
      </div>
      <div class="skill-detail-actions">
        <div class="skill-detail-level">SP ${currentLevel}</div>
        <div class="skill-detail-stepper">
          <button type="button" data-action="decrease-skill" data-skill-key="${skill.key}" ${canDecreaseSkill(skill) ? "" : "disabled"}>회수</button>
          <button type="button" data-action="increase-skill" data-skill-key="${skill.key}" ${canIncreaseSkill(skill) ? "" : "disabled"}>투자</button>
        </div>
      </div>
    </section>
  `;
}

function renderSkillCategoryTabs() {
  if (!skillCategoryTabs) {
    return;
  }

  const categories = skillCategories();
  if (!categories.length) {
    skillCategoryTabs.innerHTML = "";
    return;
  }

  if (!categories.includes(state.activeSkillCategory)) {
    [state.activeSkillCategory] = categories;
  }

  skillCategoryTabs.innerHTML = categories
    .map((category) => {
      const theme = skillCategoryMeta(category);
      const learned = learnedSkillCount(category);
      const total = state.skills.filter((skill) => skill.category === category).length;
      return `
        <button
          class="subtab-button ${category === state.activeSkillCategory ? "active" : ""}"
          type="button"
          data-category="${category}"
          style="--tab-tint:${theme.tint}; --tab-glow:${theme.glow}; --tab-accent:${theme.accent};"
        >
          <span class="subtab-icon-wrap">
            ${theme.icon ? `<img src="${theme.icon}" alt="" class="subtab-icon" />` : `<span class="subtab-icon-fallback">${category.slice(0, 1)}</span>`}
          </span>
          <span class="subtab-copy">
            <strong>${category}</strong>
            <small>${learned} / ${total}</small>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderSkillTree() {
  if (!skillTreeGrid || !skillTreeSummary) {
    return;
  }

  if (!state.skills.length) {
    skillTreeSummary.innerHTML = `<p>skills.csv를 불러오는 중입니다.</p>`;
    skillTreeGrid.innerHTML = "";
    skillCategoryTabs.innerHTML = "";
    renderSkillDetailDock(null, skillCategoryMeta(""));
    return;
  }

  renderSkillCategoryTabs();
  const currentCategory = state.activeSkillCategory || skillCategories()[0];
  const categorySkills = state.skills.filter((skill) => skill.category === currentCategory);
  const totalSpent = skillPointTotals();
  const neededLevel = requiredSkillLevel();
  const unlockedCount = state.skills.filter(skillPrerequisitesMet).length;
  const categoryLearned = learnedSkillCount(currentCategory);
  const theme = skillCategoryMeta(currentCategory);
  const witchTitle = currentWitchTitleFromSkills();
  const selectedSkill = ensureSelectedSkill(categorySkills);
  const { positions, connections, rows, cols } = buildSkillNodeLayout(categorySkills);

  skillTreeSummary.innerHTML = `
    <div class="skill-summary-shell">
      <div class="skill-summary-chip" style="--summary-tint:${theme.tint}; --summary-glow:${theme.glow};">
        ${theme.icon ? `<img src="${theme.icon}" alt="" class="skill-summary-icon" />` : ""}
        <div>
          <strong>${currentCategory}</strong>
          <p>${categoryLearned} / ${categorySkills.length} 습득</p>
        </div>
      </div>
      <div class="skill-summary-stats">
        <div class="skill-summary-title-card">
          <span class="skill-summary-level-label">현재 칭호</span>
          <strong class="skill-summary-title-value">${witchTitle.title.name}</strong>
        </div>
        <div class="skill-summary-level-card">
          <span class="skill-summary-level-label">필요 레벨</span>
          <strong class="skill-summary-level-value">Lv ${formatNumber(neededLevel, 0)}</strong>
          <small>총 투자 SP ${formatNumber(totalSpent, 0)}</small>
        </div>
        <div class="skill-summary-meta">
          <p>해금 스킬: <strong>${formatNumber(unlockedCount, 0)}</strong> / ${formatNumber(state.skills.length, 0)}</p>
          <button type="button" class="skill-reset-button" data-action="reset-skills">스킬 리셋</button>
        </div>
      </div>
      </div>
    </div>
  `;

  skillTreeGrid.innerHTML = `
    <div class="skill-tree-shell icon-only" style="--tree-tint:${theme.tint}; --tree-glow:${theme.glow}; --tree-accent:${theme.accent};">
      <div class="skill-map-shell" style="--skill-cols:${cols}; --skill-rows:${rows};">
        <svg class="skill-connector-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          ${connections
            .map(
              (connection) => `
                <path class="skill-connector ${connection.active ? "active" : ""}" d="${connection.path}" pathLength="100"></path>
              `,
            )
            .join("")}
        </svg>
        <div class="skill-node-layer">
          ${categorySkills
            .map((skill) => {
              const position = positions.get(skill.key);
              const currentLevel = getSkillLevel(skill.key);
              const met = skillPrerequisitesMet(skill);
              const selected = selectedSkill?.key === skill.key;
              const statusClass = currentLevel > 0 ? "learned" : met ? "ready" : "locked";

              return `
                <button
                  class="skill-node ${statusClass} ${selected ? "selected" : ""}"
                  type="button"
                  data-select-skill="${skill.key}"
                  style="grid-column:${(position?.column ?? 0) + 1}; grid-row:${(position?.row ?? 0) + 1};"
                  aria-label="${skill.name}"
                  title="${skill.name}"
                >
                  ${
                    skill.iconPath
                      ? `<img class="skill-node-image" src="${skill.iconPath}" alt="${skill.name}" loading="eager" decoding="async" />`
                      : `<span class="skill-node-icon">${skillIconLabel(skill.name)}</span>`
                  }
                  <span class="skill-node-level">Lv ${currentLevel}/${skill.maxLevel}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </div>
    </div>
  `;

  renderSkillDetailDock(positions.get(selectedSkill?.key)?.skill ?? selectedSkill, theme);
}

function updateSkillLevel(skillKey, delta) {
  const skill = state.skillLookup.get(skillKey);
  if (!skill) {
    return;
  }

  const nextLevel = Math.max(0, Math.min(skill.maxLevel, getSkillLevel(skillKey) + delta));
  if (delta > 0 && !canIncreaseSkill(skill)) {
    return;
  }
  if (delta < 0 && wouldBreakDependentSkills(skillKey, nextLevel)) {
    return;
  }

  state.skillLevels.set(skillKey, nextLevel);
  if (nextLevel <= 0) {
    state.skillLevels.delete(skillKey);
  }
  saveSkillTreeToStorage();
  renderSkillTree();
  renderRecipeCalculator();
  renderMaterialCalculator();
  updateTimeCalculator();
  draw();
}

function resetSkillLevels() {
  state.skillLevels = new Map();
  saveSkillTreeToStorage();
  renderSkillTree();
  renderRecipeCalculator();
  renderMaterialCalculator();
  updateTimeCalculator();
  draw();
}

function syncSkillPointInputsFromState() {
  if (!spCurrentLevelInput) {
    return;
  }

  spCurrentLevelInput.value = String(state.skillPointInputs.forecastCurrentLevel);
  spCurrentExpInput.value = String(state.skillPointInputs.forecastCurrentExp);
  spPotionLevelInput.value = String(state.skillPointInputs.forecastPotionLevel);
  spPotionCountInput.value = String(state.skillPointInputs.forecastPotionCount);
  spTargetCurrentLevelInput.value = String(state.skillPointInputs.targetCurrentLevel);
  spTargetCurrentExpInput.value = String(state.skillPointInputs.targetCurrentExp);
  spTargetLevelInput.value = String(state.skillPointInputs.targetLevel);
  spTargetPotionLevelInput.value = String(state.skillPointInputs.targetPotionLevel);
}

function expRequiredForNextLevel(level) {
  return 2 ** Math.floor(Math.max(1, level) / 5);
}

function potionExperience(level) {
  return 4 ** Math.max(0, Number(level) || 0);
}

function simulateLevelProgress(currentLevel, currentExp, gainedExp) {
  let level = Math.max(1, Number(currentLevel) || 1);
  let exp = Math.max(0, Number(currentExp) || 0) + Math.max(0, Number(gainedExp) || 0);
  let spent = 0;

  while (true) {
    const needed = expRequiredForNextLevel(level);
    if (exp < needed) {
      return {
        level,
        exp,
        nextLevelExp: needed,
        totalSp: level,
        gainedLevels: level - Math.max(1, Number(currentLevel) || 1),
        spentExp: spent,
      };
    }

    exp -= needed;
    spent += needed;
    level += 1;
  }
}

function potionsRequiredForTargetLevel(currentLevel, currentExp, targetLevel, potionLevel) {
  const normalized = simulateLevelProgress(currentLevel, currentExp, 0);
  const safeTargetLevel = Math.max(1, Number(targetLevel) || 1);
  const baseLevel = normalized.level;
  if (safeTargetLevel <= baseLevel) {
    return 0;
  }

  const potionExp = potionExperience(potionLevel);
  if (potionExp <= 0) {
    return Infinity;
  }

  let totalExpNeeded = 0;
  let level = baseLevel;
  let exp = normalized.exp;
  while (level < safeTargetLevel) {
    const needed = expRequiredForNextLevel(level);
    const deficit = Math.max(0, needed - exp);
    totalExpNeeded += deficit;
    exp = 0;
    level += 1;
  }

  return Math.ceil(totalExpNeeded / potionExp);
}

function renderSkillPointCalculator() {
  if (!spForecastSummary || !spTargetSummary) {
    return;
  }

  syncSkillPointInputsFromState();

  const forecastPotionExp = potionExperience(state.skillPointInputs.forecastPotionLevel);
  const forecastTotalExpGain = forecastPotionExp * Math.max(1, state.skillPointInputs.forecastPotionCount);
  const forecastResult = simulateLevelProgress(
    state.skillPointInputs.forecastCurrentLevel,
    state.skillPointInputs.forecastCurrentExp,
    forecastTotalExpGain,
  );
  const growthPotionRecipe = state.potionRecipes.find((recipe) => normalizeItemName(recipe.name) === normalizeItemName(GROWTH_POTION_NAME));

  spForecastSummary.innerHTML = `
    <p>포션 1개 경험치 : <strong>${formatNumber(forecastPotionExp, 0)}</strong></p>
    <p>총 획득 경험치 : <strong>${formatNumber(forecastTotalExpGain, 0)}</strong></p>
    <p>예상 레벨 : <strong>Lv ${formatNumber(forecastResult.level, 0)}</strong></p>
    <p>남는 경험치 : <strong>${formatNumber(forecastResult.exp, 0)}</strong> / ${formatNumber(forecastResult.nextLevelExp, 0)}</p>
    <p>예상 총 SP : <strong>${formatNumber(forecastResult.totalSp, 0)}</strong></p>
    ${
      growthPotionRecipe
        ? `<p class="skill-point-note">성장포션 레시피: ${growthPotionRecipe.material1} + ${growthPotionRecipe.material2}</p>`
        : ""
    }
  `;

  const neededPotions = potionsRequiredForTargetLevel(
    state.skillPointInputs.targetCurrentLevel,
    state.skillPointInputs.targetCurrentExp,
    state.skillPointInputs.targetLevel,
    state.skillPointInputs.targetPotionLevel,
  );
  const targetPotionExp = potionExperience(state.skillPointInputs.targetPotionLevel);
  const reached = simulateLevelProgress(
    state.skillPointInputs.targetCurrentLevel,
    state.skillPointInputs.targetCurrentExp,
    neededPotions * targetPotionExp,
  );

  spTargetSummary.innerHTML = `
    <p>포션 1개 경험치 : <strong>${formatNumber(targetPotionExp, 0)}</strong></p>
    <p>필요 성장포션 : <strong>${formatNumber(neededPotions, 0)}개</strong></p>
    <p>도달 예상 레벨 : <strong>Lv ${formatNumber(reached.level, 0)}</strong></p>
    <p>남는 경험치 : <strong>${formatNumber(reached.exp, 0)}</strong> / ${formatNumber(reached.nextLevelExp, 0)}</p>
  `;

  saveSkillPointInputs();
}

async function loadSkills() {
  try {
    const response = await fetch("./skills.csv", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Skill csv load failed");
    }

    state.skills = parseSkillCsv(await response.text());
    state.skillLookup = new Map(state.skills.map((skill) => [skill.key, skill]));
    if (!state.activeSkillCategory) {
      state.activeSkillCategory = skillCategories()[0] ?? "";
    }
    renderSkillTree();
    renderRecipeCalculator();
    draw();
  } catch (error) {
    if (skillTreeSummary) {
      skillTreeSummary.innerHTML = `<p>skills.csv를 불러오지 못했습니다.</p>`;
    }
    if (skillTreeGrid) {
      skillTreeGrid.innerHTML = "";
    }
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

function expansionCostText(enhancement) {
  return `${enhancement}강 마력결정 1개 + ${enhancement}강 각인석 1개`;
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

function plannerSkillLevel(skillName) {
  return getSkillLevel(normalizeSkillName(skillName));
}

function plannerSkillLevels() {
  return {
    rootDominion: plannerSkillLevel(PLANNER_SKILL_KEYS.rootDominion),
    veinReading: plannerSkillLevel(PLANNER_SKILL_KEYS.veinReading),
    soilMastery: plannerSkillLevel(PLANNER_SKILL_KEYS.soilMastery),
    timeMastery: plannerSkillLevel(PLANNER_SKILL_KEYS.timeMastery),
    sturdyStem: plannerSkillLevel(PLANNER_SKILL_KEYS.sturdyStem),
    overcrowdingResist: plannerSkillLevel(PLANNER_SKILL_KEYS.overcrowdingResist),
  };
}

function plannerSimulationCacheKey() {
  return JSON.stringify({
    cells: [...state.cells].sort(),
    plants: [...state.plants.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    desertTiles: [...state.desertTiles].sort(),
    boostPotionActive: state.boostPotionActive,
    skillLevels: plannerSkillLevels(),
  });
}

function plannerFieldEnhancement(col, row) {
  const point = logicalPoint(col, row);
  const center = logicalPoint(CENTER_CELL.col, CENTER_CELL.row);
  const distance = Math.abs(point.x - center.x) + Math.abs(point.y - center.y);
  return Math.max(0, distance - 3);
}

function plannerCompoundedValue(base, level, count) {
  return level > 0 ? compoundedEffect(base, level, count) : 0;
}

function plannerGrowthTime(plantId, cellConditions, soilMastery, enhancement) {
  const spec = PLANT_SPECS[plantId];
  if (!spec) {
    return Number.POSITIVE_INFINITY;
  }
  const growthMultiplier = 1 - plannerCompoundedValue(0.05, soilMastery, enhancement + 1);
  const toxicMultiplier = cellConditions.includes("toxic") && plantId === "poison_flower" ? 0.5 : 1;
  const fertileMultiplier = cellConditions.includes("fertile") ? 0.5 : 1;
  return spec.growTimeMs * growthMultiplier * toxicMultiplier * fertileMultiplier;
}

function plannerProductionInterval(baseIntervalMs, timeMastery, enhancement) {
  if (!Number.isFinite(baseIntervalMs) || baseIntervalMs <= 0) {
    return baseIntervalMs;
  }
  return baseIntervalMs * (1 - plannerCompoundedValue(0.01, timeMastery, enhancement + 1));
}

function plannerMaxHarvests(maxHarvests, enhancement, sturdyStem) {
  if (!Number.isFinite(maxHarvests)) {
    return Number.POSITIVE_INFINITY;
  }
  if (enhancement <= 0 || sturdyStem <= 0) {
    return maxHarvests;
  }
  return maxHarvests * (enhancement + 1);
}

function plannerOvercrowdingMultiplier(sameNeighborCount, overcrowdingResist) {
  if (!sameNeighborCount) {
    return 1;
  }
  return 1 - (1 - (0.5 ** sameNeighborCount)) * Math.max(0, 1 - overcrowdingResist * 0.25);
}

function plannerProductionMultiplier(
  plantId,
  redEssenceActive,
  cellConditions,
  sameNeighborCount,
  uniqueNeighborCount,
  overcrowdingResist,
) {
  let multiplier = redEssenceActive ? 1.5 : 1;

  if (plantId === "blue_moss" && cellConditions.includes("humid")) {
    multiplier *= 2;
  }
  if (plantId === "poison_flower" && cellConditions.includes("toxic")) {
    multiplier *= 2;
  }
  if (plantId === "illusion_fern" && Number.isFinite(uniqueNeighborCount)) {
    multiplier *= Math.max(0, uniqueNeighborCount);
  }
  if (cellConditions.includes("sunlit")) {
    multiplier *= 1.3;
  }

  multiplier *= plannerOvercrowdingMultiplier(sameNeighborCount, overcrowdingResist);
  return multiplier;
}

function buildPlannerAnalysis() {
  const skillLevels = plannerSkillLevels();
  const cells = new Map();
  const cropCounts = new Map(CROPS.map((crop) => [crop.id, 0]));

  for (const key of state.cells) {
    const { col, row } = parseKey(key);
    const point = logicalPoint(col, row);
    cells.set(key, {
      key,
      col,
      row,
      logicalX: point.x,
      logicalY: point.y,
      conditions: state.desertTiles.has(key) ? ["arid"] : [],
      plant: null,
    });
  }

  for (const [key, cropId] of state.plants.entries()) {
    const cell = cells.get(key);
    const plantId = CROP_TO_PLANT_ID[cropId];
    const spec = PLANT_SPECS[plantId];
    if (!cell || !spec) {
      continue;
    }

    cropCounts.set(cropId, (cropCounts.get(cropId) ?? 0) + 1);

    const startMs = PLANNER_SIMULATION.startMs;
    const manuallyWatered = !spec.waterKills && !cell.conditions.includes("arid");
    cell.plant = {
      cropId,
      id: plantId,
      enhancement: 0,
      health: 100,
      growStartedAt: manuallyWatered || spec.waterKills ? startMs : null,
      wateredAt: manuallyWatered ? startMs : null,
      produceAccum: 0,
      totalProduced: 0,
      lastUpdate: startMs,
      conditions: plantId === "poison_flower" ? ["poison_immune"] : [],
    };
  }

  const orthogonalNeighborKeys = (cell) =>
    getDiagonalNeighbors(cell.col, cell.row)
      .map(({ col, row }) => cellKey(col, row))
      .filter((key) => cells.has(key));

  const rangeKeys = (cell, range) => {
    if (range >= 1) {
      return [...cells.values()]
        .filter((other) =>
          other.key !== cell.key
          && Math.max(
            Math.abs(other.logicalX - cell.logicalX),
            Math.abs(other.logicalY - cell.logicalY),
          ) <= range,
        )
        .map((other) => other.key);
    }
    return orthogonalNeighborKeys(cell);
  };

  const isMature = (cell, timeMs) =>
    Boolean(
      cell?.plant
      && cell.plant.health > 0
      && cell.plant.growStartedAt != null
      && timeMs >= cell.plant.growStartedAt + plannerGrowthTime(
        cell.plant.id,
        cell.conditions,
        skillLevels.soilMastery,
        cell.plant.enhancement,
      ),
    );

  for (
    let currentMs = PLANNER_SIMULATION.startMs + PLANNER_SIMULATION.stepMs;
    currentMs <= PLANNER_SIMULATION.startMs + PLANNER_SIMULATION.durationMs;
    currentMs += PLANNER_SIMULATION.stepMs
  ) {
    for (const cell of cells.values()) {
      cell.conditions = cell.conditions.filter((condition) =>
        condition !== "humid" && condition !== "poisonous" && condition !== "sunlit");
    }

    for (const cell of cells.values()) {
      if (!isMature(cell, currentMs)) {
        continue;
      }

      const plant = cell.plant;
      if (plant.id === "dew_root") {
        const veinBonus = skillLevels.veinReading > 0 ? plant.enhancement : 0;
        const range = skillLevels.rootDominion + plant.enhancement + veinBonus;
        for (const targetKey of rangeKeys(cell, range)) {
          const target = cells.get(targetKey);
          if (!target || target.conditions.includes("arid")) {
            continue;
          }
          if (!target.conditions.includes("humid")) {
            target.conditions.push("humid");
          }
          if (target.plant && target.plant.health > 0) {
            target.plant.wateredAt = currentMs;
            target.plant.growStartedAt ??= currentMs;
          }
        }
      } else if (plant.id === "sunlight_flower") {
        if (!cell.conditions.includes("sunlit")) {
          cell.conditions.push("sunlit");
        }
        const veinBonus = skillLevels.veinReading > 0 ? plant.enhancement : 0;
        const range = plant.enhancement + veinBonus;
        for (const targetKey of (range > 0 ? rangeKeys(cell, range) : orthogonalNeighborKeys(cell))) {
          const target = cells.get(targetKey);
          if (target && !target.conditions.includes("sunlit")) {
            target.conditions.push("sunlit");
          }
        }
      }
    }

    for (const cell of cells.values()) {
      const plant = cell.plant;
      if (!plant || plant.health <= 0) {
        continue;
      }

      const spec = PLANT_SPECS[plant.id];
      const deltaMs = currentMs - plant.lastUpdate;
      if (spec.waterKills && plant.wateredAt != null) {
        plant.health = 0;
        plant.lastUpdate = currentMs;
        continue;
      }
      if (!spec.waterKills && plant.wateredAt == null) {
        plant.lastUpdate = currentMs;
        continue;
      }

      if (!spec.waterKills && Number.isFinite(spec.waterIntervalMs) && plant.wateredAt != null) {
        const dryAt = plant.wateredAt + spec.waterIntervalMs * 2;
        if (currentMs > dryAt) {
          const decayFrom = Math.max(plant.lastUpdate, dryAt);
          const decayMs = Math.max(0, currentMs - decayFrom);
          if (decayMs > 0) {
            const healthPerMinute = 60000 / spec.waterIntervalMs;
            plant.health = Math.max(0, plant.health - (decayMs / 60000) * healthPerMinute);
          }
        }
      }

      if (plant.conditions.includes("poisoned")) {
        plant.health = Math.max(0, plant.health - (deltaMs / 60000));
      }
      if (plant.health <= 0) {
        plant.lastUpdate = currentMs;
        continue;
      }

      const produce = spec.produce;
      if (!produce || plant.growStartedAt == null) {
        plant.lastUpdate = currentMs;
        continue;
      }

      const maxHarvests = plannerMaxHarvests(
        spec.maxHarvests,
        plant.enhancement,
        skillLevels.sturdyStem,
      );
      const remainingCapacity = Number.isFinite(maxHarvests)
        ? Math.max(0, maxHarvests - plant.totalProduced)
        : Number.POSITIVE_INFINITY;
      const readyAt = plant.growStartedAt
        + plannerGrowthTime(plant.id, cell.conditions, skillLevels.soilMastery, plant.enhancement);

      if (remainingCapacity > 0 && currentMs >= readyAt && !plant.conditions.includes("poisoned")) {
        const sameNeighborCount = orthogonalNeighborKeys(cell)
          .map((key) => cells.get(key)?.plant)
          .filter((neighbor) => neighbor && neighbor.health > 0 && neighbor.id === plant.id)
          .length;
        const diverseNeighborCount = plant.id === "illusion_fern"
          ? new Set(
            orthogonalNeighborKeys(cell)
              .map((key) => cells.get(key)?.plant)
              .filter((neighbor) => neighbor && neighbor.health > 0)
              .map((neighbor) => neighbor.id),
          ).size
          : undefined;
        const multiplier = plannerProductionMultiplier(
          plant.id,
          state.boostPotionActive,
          cell.conditions,
          sameNeighborCount,
          diverseNeighborCount,
          skillLevels.overcrowdingResist,
        );
        const adjustedInterval = plannerProductionInterval(
          produce.intervalMs,
          skillLevels.timeMastery,
          plant.enhancement,
        );
        const activeMs = Math.max(0, currentMs - Math.max(plant.lastUpdate, readyAt));
        plant.produceAccum += activeMs * multiplier;

        while (
          adjustedInterval > 0
          && plant.produceAccum >= adjustedInterval
          && plant.totalProduced < maxHarvests
        ) {
          plant.produceAccum -= adjustedInterval;
          plant.totalProduced += 1;
        }
      }

      plant.lastUpdate = currentMs;
    }

    for (const cell of cells.values()) {
      if (!isMature(cell, currentMs) || cell.plant.id !== "poison_flower") {
        continue;
      }

      const veinBonus = skillLevels.veinReading > 0 ? cell.plant.enhancement : 0;
      const range = cell.plant.enhancement + veinBonus;
      for (const targetKey of rangeKeys(cell, range)) {
        const target = cells.get(targetKey);
        if (target && !target.conditions.includes("poisonous")) {
          target.conditions.push("poisonous");
        }
      }
    }

    for (const cell of cells.values()) {
      if (!cell.conditions.includes("poisonous") || !cell.plant || cell.plant.health <= 0) {
        continue;
      }
      if (
        !cell.plant.conditions.includes("poisoned")
        && !cell.plant.conditions.includes("poison_immune")
      ) {
        cell.plant.conditions.push("poisoned");
      }
    }
  }

  const snapshotTime = PLANNER_SIMULATION.startMs + PLANNER_SIMULATION.durationMs;
  const cropYieldTotals = new Map(CROPS.map((crop) => [crop.id, 0]));

  for (const cell of cells.values()) {
    const plant = cell.plant;
    if (!plant || plant.health <= 0 || plant.growStartedAt == null || plant.conditions.includes("poisoned")) {
      continue;
    }

    const spec = PLANT_SPECS[plant.id];
    const produce = spec?.produce;
    if (!produce || produce.intervalMs <= 1) {
      continue;
    }

    const readyAt = plant.growStartedAt
      + plannerGrowthTime(plant.id, cell.conditions, skillLevels.soilMastery, plant.enhancement);
    if (snapshotTime < readyAt) {
      continue;
    }

    const maxHarvests = plannerMaxHarvests(
      spec.maxHarvests,
      plant.enhancement,
      skillLevels.sturdyStem,
    );
    const remainingCapacity = Number.isFinite(maxHarvests)
      ? Math.max(0, maxHarvests - plant.totalProduced)
      : Number.POSITIVE_INFINITY;
    if (remainingCapacity <= 0) {
      continue;
    }

    const sameNeighborCount = orthogonalNeighborKeys(cell)
      .map((key) => cells.get(key)?.plant)
      .filter((neighbor) => neighbor && neighbor.health > 0 && neighbor.id === plant.id)
      .length;
    const diverseNeighborCount = plant.id === "illusion_fern"
      ? new Set(
        orthogonalNeighborKeys(cell)
          .map((key) => cells.get(key)?.plant)
          .filter((neighbor) => neighbor && neighbor.health > 0)
          .map((neighbor) => neighbor.id),
      ).size
      : undefined;
    const multiplier = plannerProductionMultiplier(
      plant.id,
      state.boostPotionActive,
      cell.conditions,
      sameNeighborCount,
      diverseNeighborCount,
      skillLevels.overcrowdingResist,
    );
    const adjustedInterval = plannerProductionInterval(
      produce.intervalMs,
      skillLevels.timeMastery,
      plant.enhancement,
    );
    const perHour = (3600000 / adjustedInterval) * multiplier;
    cropYieldTotals.set(plant.cropId, (cropYieldTotals.get(plant.cropId) ?? 0) + perHour);
  }

  const effects = new Map();

  for (const cell of cells.values()) {
    effects.set(cell.key, {
      watered: cell.conditions.includes("humid") ? 1 : 0,
      poisoned: cell.conditions.includes("poisonous") || cell.plant?.conditions.includes("poisoned") ? 1 : 0,
      sunBuff: cell.conditions.includes("sunlit") ? 1 : 0,
      dead: Boolean(cell.plant && cell.plant.health <= 0),
    });
  }

  return {
    cropCounts,
    cropYieldTotals,
    totalYield: [...cropYieldTotals.values()].reduce((sum, value) => sum + value, 0),
    effects,
  };
}

function getPlannerAnalysis() {
  const key = plannerSimulationCacheKey();
  if (plannerAnalysisCache.key === key && plannerAnalysisCache.value) {
    return plannerAnalysisCache.value;
  }

  const value = buildPlannerAnalysis();
  plannerAnalysisCache = { key, value };
  return value;
}

function buildEffectMap() {
  return getPlannerAnalysis().effects;
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
  const cropImage = cropImageCache.get(crop.id);
  const hasCropImage = cropImage?.complete && cropImage.naturalWidth > 0;
  const gradient = ctx.createLinearGradient(
    center.x - radius,
    center.y - radius,
    center.x + radius,
    center.y + radius,
  );
  gradient.addColorStop(0, crop.accentColor ?? crop.color);
  gradient.addColorStop(1, crop.color);

  ctx.save();
  ctx.globalAlpha = effect.dead ? 0.42 : 0.96;
  if (!hasCropImage) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.lineWidth = isHovered ? 3 : 2;
    ctx.strokeStyle = effect.dead ? "rgba(90, 57, 33, 0.85)" : "rgba(255,255,255,0.85)";
    ctx.stroke();
  } else if (isHovered) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius + 3, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
  ctx.restore();

  if (hasCropImage) {
    const imageSize = radius * 2.15;
    ctx.save();
    ctx.globalAlpha = effect.dead ? 0.58 : 1;
    ctx.drawImage(
      cropImage,
      center.x - imageSize / 2,
      center.y - imageSize / 2,
      imageSize,
      imageSize,
    );
    ctx.restore();
  } else {
    ctx.save();
    ctx.fillStyle = effect.dead ? "rgba(59,40,22,0.92)" : "rgba(44, 30, 16, 0.92)";
    ctx.font = `700 ${Math.round(CELL_SIZE * 0.44)}px "Malgun Gothic", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(crop.short, center.x, center.y + 1);
    ctx.restore();
  }

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
    const spec = CROP_TO_PLANT_ID[crop.id] ? PLANT_SPECS[CROP_TO_PLANT_ID[crop.id]] : null;
    const displayYield = spec?.produce?.intervalMs && spec.produce.intervalMs > 1
      ? 3600000 / spec.produce.intervalMs
      : crop.hourlyYield;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `crop-button${crop.id === state.selectedCropId ? " active" : ""}`;
    button.dataset.cropId = crop.id;
    const hasIconImage = Boolean(crop.iconPath);
    button.innerHTML = `
      <span class="crop-button-top">
        <span class="crop-swatch${hasIconImage ? " has-image" : ""}"${hasIconImage ? "" : ` style="background:linear-gradient(135deg, ${crop.accentColor ?? crop.color}, ${crop.color})"`}>
          ${
            hasIconImage
              ? `<img class="crop-swatch-image" src="${crop.iconPath}" alt="${crop.name}" loading="eager" decoding="async" />`
              : `<span class="crop-swatch-text">${crop.short}</span>`
          }
        </span>
        <span class="crop-button-label">
          <strong>${crop.name}</strong>
          <span class="crop-yield">시간당 ${displayYield.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}개</span>
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
  const { cropCounts, cropYieldTotals, totalYield } = calculateCropProduction();

  productionSummary.textContent = `시간당 총 생산량 ${totalYield.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}개`;
  if (state.boostPotionActive) {
    productionSummary.textContent += " (붉은 정수 On)";
  }

  productionGrid.innerHTML = "";

  CROPS.filter((crop) =>
    (cropCounts.get(crop.id) ?? 0) > 0 || (cropYieldTotals.get(crop.id) ?? 0) > 0).forEach((crop) => {
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

function calculateCropProduction() {
  return getPlannerAnalysis();
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

function renderBoostPotionButton() {
  boostPotionButton.textContent = state.boostPotionActive ? "On" : "Off";
  boostPotionButton.setAttribute("aria-pressed", String(state.boostPotionActive));
  boostPotionButton.classList.toggle("active", state.boostPotionActive);
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
  const layer = plannerFieldEnhancement(col, row);
  slotTooltip.innerHTML = `
    <strong>확장 비용</strong>
    강화 단계 ${layer}<br />
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

openLayoutSlotsButton.addEventListener("click", () => {
  openSlotModal("layout");
});

openCauldronSlotsButton.addEventListener("click", () => {
  openSlotModal("cauldron");
});

slotModalBackdrop.addEventListener("click", closeSlotModal);

slotPanel.addEventListener("click", (event) => {
  if (event.target.dataset.action === "close-slot-dialog") {
    closeSlotModal();
  }
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

recipeCauldronEnhancementInput.addEventListener("input", () => {
  renderRecipeCalculator();
});

cauldronBoard.addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  if (action === "add-cauldron") {
    addCauldron(event.target.dataset.tier);
    return;
  }

  if (action === "delete-cauldron") {
    const card = event.target.closest(".cauldron-card");
    if (!card) {
      return;
    }
    const cauldrons = state.cauldrons[card.dataset.tier];
    state.cauldrons[card.dataset.tier] = cauldrons.filter((cauldron) => cauldron.id !== card.dataset.id);
    saveCauldronStateToStorage();
    renderMaterialCalculator();
  }
});

cauldronBoard.addEventListener("input", (event) => {
  if (event.target.dataset.action !== "change-cauldron-level") {
    return;
  }

  const card = event.target.closest(".cauldron-card");
  const cauldron = state.cauldrons[card.dataset.tier].find((item) => item.id === card.dataset.id);
  if (!cauldron) {
    return;
  }

  cauldron.level = Math.max(0, Math.min(20, Number(event.target.value) || 0));
  saveCauldronStateToStorage();
  renderMaterialCalculator();
});

cauldronBoard.addEventListener("change", (event) => {
  if (event.target.dataset.action !== "change-cauldron-recipe") {
    return;
  }

  const card = event.target.closest(".cauldron-card");
  const cauldron = state.cauldrons[card.dataset.tier].find((item) => item.id === card.dataset.id);
  if (!cauldron) {
    return;
  }

  cauldron.recipeValue = event.target.value;
  saveCauldronStateToStorage();
  renderMaterialCalculator();
});

skillCategoryTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) {
    return;
  }

  state.activeSkillCategory = button.dataset.category;
  state.selectedSkillKey = "";
  saveSkillTreeToStorage();
  renderSkillTree();
});

skillTreeSummary?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='reset-skills']");
  if (!button) {
    return;
  }

  resetSkillLevels();
});

skillTreeGrid?.addEventListener("click", (event) => {
  const selectButton = event.target.closest("[data-select-skill]");
  if (selectButton) {
    state.selectedSkillKey = selectButton.dataset.selectSkill;
    saveSkillTreeToStorage();
    renderSkillTree();
    return;
  }

  const button = event.target.closest("[data-action][data-skill-key]");
  if (!button) {
    return;
  }

  const delta = button.dataset.action === "increase-skill" ? 1 : -1;
  updateSkillLevel(button.dataset.skillKey, delta);
});

skillDetailDock?.addEventListener("click", (event) => {
  const selectButton = event.target.closest("[data-select-skill]");
  if (selectButton) {
    state.selectedSkillKey = selectButton.dataset.selectSkill;
    saveSkillTreeToStorage();
    renderSkillTree();
    return;
  }

  const button = event.target.closest("[data-action][data-skill-key]");
  if (!button) {
    return;
  }

  const delta = button.dataset.action === "increase-skill" ? 1 : -1;
  updateSkillLevel(button.dataset.skillKey, delta);
});

[
  [spCurrentLevelInput, "forecastCurrentLevel", 1],
  [spCurrentExpInput, "forecastCurrentExp", 0],
  [spPotionLevelInput, "forecastPotionLevel", 0],
  [spPotionCountInput, "forecastPotionCount", 1],
  [spTargetCurrentLevelInput, "targetCurrentLevel", 1],
  [spTargetCurrentExpInput, "targetCurrentExp", 0],
  [spTargetLevelInput, "targetLevel", 1],
  [spTargetPotionLevelInput, "targetPotionLevel", 0],
].forEach(([input, key, minimum]) => {
  input?.addEventListener("input", () => {
    state.skillPointInputs[key] = Math.max(minimum, Number(input.value) || minimum);
    renderSkillPointCalculator();
  });
});

[
  [timeOperationModeSelect, "operationMode", "change"],
  [timeCauldronEnhancementInput, "cauldronEnhancement", "input"],
  [timeFlameMasteryInput, "flameMastery", "input"],
  [timeItemASelect, "itemACode", "change"],
  [timeItemBSelect, "itemBCode", "change"],
  [timeItemAEnhancementInput, "itemAEnhancement", "input"],
  [timeItemBEnhancementInput, "itemBEnhancement", "input"],
].forEach(([input, key, eventName]) => {
  input?.addEventListener(eventName, () => {
    if (key === "operationMode" || key === "itemACode" || key === "itemBCode") {
      state.timeCalculatorInputs[key] = input.value;
    } else {
      state.timeCalculatorInputs[key] = Math.max(0, Number(input.value) || 0);
    }
    updateTimeCalculator();
  });
});

timeTableFilterInput?.addEventListener("input", () => {
  state.timeCalculatorInputs.tableFilter = timeTableFilterInput.value;
  renderTimeDurationTable();
  saveTimeCalculatorInputs();
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

boostPotionButton.addEventListener("click", () => {
  state.boostPotionActive = !state.boostPotionActive;
  renderBoostPotionButton();
  renderProductionStats();
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
    activeTab: state.activeTab,
    totalCells: state.cells.size,
    selectedCropId: state.selectedCropId,
    cells: [...state.cells].map(parseKey),
    plants: [...state.plants.entries()].map(([key, cropId]) => ({
      ...parseKey(key),
      cropId,
    })),
    desertTiles: [...state.desertTiles].map(parseKey),
    expandableSlots: state.addSlots,
    skillCategory: state.activeSkillCategory,
    skillPointsSpent: skillPointTotals(),
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
loadCauldronSlotsFromStorage();
loadCalculatorStateFromStorage();
loadCauldronStateFromStorage();
loadTimeCalculatorInputs();
loadSkillTreeFromStorage();
loadSkillPointInputs();
preloadCropImages();
const loadedSharedLayout = loadLayoutFromUrl();
if (!loadedSharedLayout) {
  loadLayoutFromStorage();
}
copyLayoutButton.textContent = "캡쳐";
setActiveTab("planner");
renderPalette();
renderPanLockButton();
renderStatsPanel();
renderBoostPotionButton();
renderLayoutSlots();
renderRecipeCalculator();
renderMaterialCalculator();
initializeTimeCalculatorData();
renderSkillTree();
renderSkillPointCalculator();
draw();
resizeCanvas();
startCanvasResolutionWatcher();
loadRecipes();
loadPotionRecipes();
loadSkills();
window.addEventListener("resize", syncResponsivePanels);
window.addEventListener("hashchange", () => {
  applySharedLayoutFromCurrentUrl(true);
});

if (loadedSharedLayout) {
  showCopyFeedback("공유 링크 배치를 불러왔습니다.");
}
