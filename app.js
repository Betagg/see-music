const canvas = document.querySelector("#visualizer");
const ctx = canvas.getContext("2d");
const webglCanvas = document.querySelector("#webglVisualizer");
const audio = document.querySelector("#audio");
const fileInput = document.querySelector("#fileInput");
const urlInput = document.querySelector("#urlInput");
const loadUrlButton = document.querySelector("#loadUrlButton");
const trackName = document.querySelector("#trackName");
const emptyState = document.querySelector("#emptyState");
const modeButtons = document.querySelectorAll(".mode-button");
const themeButtons = document.querySelectorAll(".theme-button");
const sensitivityInput = document.querySelector("#sensitivity");
const tuningGrid = document.querySelector("#tuningGrid");
let tuningInputs = document.querySelectorAll("[data-tuning]");
let tuningValueNodes = document.querySelectorAll("[data-tuning-value]");
const resetTuningButton = document.querySelector("#resetTuningButton");
const bassMeter = document.querySelector("#bassMeter");
const midMeter = document.querySelector("#midMeter");
const trebleMeter = document.querySelector("#trebleMeter");
const beatMeter = document.querySelector("#beatMeter");
const recordButton = document.querySelector("#recordButton");
const downloadButton = document.querySelector("#downloadButton");
const statusText = document.querySelector("#statusText");
const languageButton = document.querySelector("#languageButton");
const seekInput = document.querySelector("#seekInput");
const currentTimeLabel = document.querySelector("#currentTimeLabel");
const durationLabel = document.querySelector("#durationLabel");
const immersiveButton = document.querySelector("#immersiveButton");
const exitImmersiveButton = document.querySelector("#exitImmersiveButton");

const themes = {
  aurora: { base: 185, second: 318, third: 42, ink: "5, 7, 13" },
  ember: { base: 24, second: 350, third: 48, ink: "12, 6, 5" },
  mono: { base: 43, second: 210, third: 38, ink: "4, 5, 6" },
};

const starSeeds = Array.from({ length: 90 }, (_, index) => ({
  x: (Math.sin(index * 71.13) * 0.5 + 0.5) % 1,
  y: (Math.sin(index * 37.91 + 2.7) * 0.5 + 0.5) % 1,
  size: 0.4 + ((index * 17) % 11) / 7,
  phase: index * 0.73,
}));

const translations = {
  zh: {
    brand: "看见音乐",
    heroTitle: "看见音乐之美",
    chooseMusic: "选择音乐",
    urlPlaceholder: "粘贴音频直链或视频链接",
    load: "读取",
    emptyTrack: "还没有选择文件",
    modeRing: "光谱圆环",
    modeTunnel: "波形隧道",
    modeCurtain: "光幕雕塑",
    modeTerrain: "声波地貌",
    modeLaser: "激光厅",
    modeScanner: "光环扫描",
    modeVortex: "声波漩涡",
    modeWireform: "线场雕塑",
    modePsyfluid: "迷幻流体",
    modeCrystal: "晶体星尘",
    modeSkyChamber: "光域天窗",
    modeBoiling: "沸点字浪",
    modeErosion: "侵蚀流域",
    themeAurora: "极光",
    themeEmber: "炽热",
    themeMono: "黑金",
    sensitivity: "灵敏度",
    tuningTitle: "当前效果调参",
    resetTuning: "重置",
    bass: "低频",
    mid: "中频",
    treble: "高频",
    beat: "节拍",
    startRecording: "开始录制",
    stopRecording: "停止录制",
    downloadVideo: "下载视频",
    showControls: "显示控制",
    immersive: "沉浸",
    exit: "退出",
    ready: "选择或拖入音乐后即可开始。",
    pasteUrl: "请先粘贴一个音频链接。",
    badUrl: "链接格式不正确。",
    resolving: "正在解析视频里的音频流。",
    serviceMissing: "本地解析服务未启动。请在项目目录运行 npm run start。",
    staticResolverUnavailable: "公开视频页暂不支持平台链接解析。请上传本地音频，或在电脑上运行 npm run start 后打开本地版。",
    resolveFailed: "视频链接解析失败。",
    resolved: "视频音频已解析，点击播放器开始。",
    directLoaded: "已读取音频链接，点击播放器开始。若无声音，通常是链接跨域限制。",
    localLoaded: "已载入音乐，点击播放器开始。",
    audioError: "音频读取失败。请确认链接可直接访问，或改用本地上传。",
    visualizing: "正在把音乐翻译成画面。",
    paused: "已暂停。",
    ended: "播放结束，可以换模式或重新录制。",
    unsupportedRecord: "当前浏览器不支持录制，请换 Chrome 或 Edge。",
    emptyRecording: "录制没有生成数据，请先播放音乐再录制。",
    recordingDoneAudio: "录制完成，已包含画面和音频。",
    recordingDoneVideo: "录制完成，当前浏览器只导出了画面。",
    recording: "正在录制当前视觉。",
    noVideo: "还没有可下载的视频，请先录制一段。",
    saved: "视频已保存。",
    saveCancelled: "已取消保存。",
    downloadTriggered: "已触发下载；如果没有反应，已尝试打开视频预览页。",
    dragAudio: "松开即可载入音乐文件。",
    badDrop: "请拖入音频文件。",
  },
  en: {
    brand: "See Music",
    heroTitle: "See the Beauty of Music",
    chooseMusic: "Choose Music",
    urlPlaceholder: "Paste an audio or video link",
    load: "Load",
    emptyTrack: "No file selected",
    modeRing: "Spectrum Ring",
    modeTunnel: "Wave Tunnel",
    modeCurtain: "Light Sculpture",
    modeTerrain: "Sound Terrain",
    modeLaser: "Laser Cathedral",
    modeScanner: "Light Scanner",
    modeVortex: "Sonic Vortex",
    modeWireform: "Wireform Sculpture",
    modePsyfluid: "Psy Fluid",
    modeCrystal: "Crystal Drift",
    modeSkyChamber: "Sky Chamber",
    modeBoiling: "Boiling Type",
    modeErosion: "Erosion Flow",
    themeAurora: "Aurora",
    themeEmber: "Ember",
    themeMono: "Black Gold",
    sensitivity: "Sensitivity",
    tuningTitle: "Mode Tuning",
    resetTuning: "Reset",
    bass: "Bass",
    mid: "Mid",
    treble: "Treble",
    beat: "Beat",
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
    downloadVideo: "Download Video",
    showControls: "Show Controls",
    immersive: "Immersive",
    exit: "Exit",
    ready: "Choose or drop music to begin.",
    pasteUrl: "Paste an audio link first.",
    badUrl: "Invalid link.",
    resolving: "Resolving audio from the video link.",
    serviceMissing: "Local resolver is not running. Run npm run start in the project folder.",
    staticResolverUnavailable: "The public static site cannot resolve platform links. Upload local audio, or run npm run start and open the local app.",
    resolveFailed: "Could not resolve this video link.",
    resolved: "Video audio resolved. Press play to begin.",
    directLoaded: "Audio link loaded. Press play to begin. If it stays silent, the link is likely blocked by CORS.",
    localLoaded: "Music loaded. Press play to begin.",
    audioError: "Could not load audio. Try a direct link or local upload.",
    visualizing: "Translating music into visuals.",
    paused: "Paused.",
    ended: "Playback ended. Choose another mode or record again.",
    unsupportedRecord: "Recording is not supported here. Try Chrome or Edge.",
    emptyRecording: "No recording data was created. Play music before recording.",
    recordingDoneAudio: "Recording complete with audio and visuals.",
    recordingDoneVideo: "Recording complete. This browser exported visuals only.",
    recording: "Recording current visuals.",
    noVideo: "No video to download yet. Record a clip first.",
    saved: "Video saved.",
    saveCancelled: "Save cancelled.",
    downloadTriggered: "Download triggered. If nothing happens, a preview tab was opened.",
    dragAudio: "Drop to load the music file.",
    badDrop: "Drop an audio file.",
  },
};
const hazeSeeds = Array.from({ length: 48 }, (_, index) => ({
  x: (Math.sin(index * 61.7) * 0.5 + 0.5) % 1,
  y: (Math.sin(index * 19.9 + 4.3) * 0.5 + 0.5) % 1,
  size: 1 + ((index * 13) % 17),
  phase: index * 0.53,
}));

const laserSeeds = Array.from({ length: 34 }, (_, index) => ({
  side: index % 2 ? 1 : -1,
  lane: (index * 7) % 11,
  phase: index * 0.47,
  depth: 0.18 + ((index * 13) % 80) / 100,
}));

const fluidSeeds = Array.from({ length: 56 }, (_, index) => ({
  angle: index * 2.399963,
  radius: 0.08 + ((index * 37) % 100) / 100,
  phase: index * 0.39,
  size: 0.6 + ((index * 19) % 90) / 100,
}));

const crystalSeeds = Array.from({ length: 28 }, (_, index) => ({
  x: (Math.sin(index * 42.71) * 0.5 + 0.5) % 1,
  y: (Math.sin(index * 15.33 + 1.9) * 0.5 + 0.5) % 1,
  z: 0.34 + (((index * 31) % 100) / 100) * 1.18,
  sides: 7 + (index % 5),
  hue: index % 3 === 0 ? 112 : index % 3 === 1 ? 286 : 186,
  phase: index * 0.61,
}));

const boilingLetters = "BOILING POINT".split("");
const boilingBubbles = Array.from({ length: 86 }, (_, index) => ({
  x: (Math.sin(index * 31.13) * 0.5 + 0.5) % 1,
  z: 0.35 + (((index * 23) % 100) / 100) * 0.9,
  radius: 0.7 + ((index * 11) % 13) / 5,
  phase: index * 0.47,
}));
let boilingDroplets = [];

let audioContext;
let analyser;
let source;
let frequencyData = new Uint8Array(1024);
let timeData = new Uint8Array(1024);
let currentMode = "ring";
let currentTheme = "aurora";
let frame = 0;
let recorder;
let recordedChunks = [];
let recordedVideoUrl = "";
let recordedMimeType = "video/webm";
let localAudioUrl = "";
let lastBass = 0;
let beatPulse = 0;
let beatCooldown = 0;
let isImmersive = false;
let revealTimer;
let isSeeking = false;
let knownDuration = 0;
let currentLanguage = "zh";
let dragDepth = 0;
let webglState;
let webglSupported = true;
const tuningDefaults = {
  size: 1,
  hue: 0,
  gradient: 1,
  saturation: 1,
  sharpness: 1,
  line: 1,
  density: 1,
  speed: 1,
  vibration: 1,
};
const modeTuningConfigs = {
  ring: [
    { key: "size", zh: "圆环半径", en: "Ring Radius", min: 0.65, max: 1.7, step: 0.05 },
    { key: "density", zh: "频谱柱密度", en: "Bar Density", min: 0.5, max: 2.2, step: 0.05 },
    { key: "line", zh: "频谱柱粗细", en: "Bar Width", min: 0.5, max: 2.4, step: 0.05 },
    { key: "hue", zh: "环形色相", en: "Ring Hue", min: -180, max: 180, step: 5 },
    { key: "saturation", zh: "发光饱和度", en: "Glow Saturation", min: 0.35, max: 1.8, step: 0.05 },
    { key: "vibration", zh: "鼓点弹性", en: "Beat Elasticity", min: 0, max: 2.4, step: 0.05 },
  ],
  tunnel: [
    { key: "size", zh: "隧道尺度", en: "Tunnel Scale", min: 0.65, max: 1.7, step: 0.05 },
    { key: "density", zh: "隧道层数", en: "Tunnel Layers", min: 0.45, max: 2.1, step: 0.05 },
    { key: "line", zh: "轮廓线宽", en: "Contour Width", min: 0.45, max: 2.3, step: 0.05 },
    { key: "speed", zh: "穿行速度", en: "Travel Speed", min: 0.2, max: 2.4, step: 0.05 },
    { key: "vibration", zh: "声墙起伏", en: "Wall Motion", min: 0, max: 2.4, step: 0.05 },
  ],
  curtain: [
    { key: "size", zh: "光幕高度", en: "Curtain Height", min: 0.7, max: 1.7, step: 0.05 },
    { key: "density", zh: "光柱数量", en: "Light Columns", min: 0.45, max: 2.2, step: 0.05 },
    { key: "line", zh: "光柱粗细", en: "Column Width", min: 0.45, max: 2.4, step: 0.05 },
    { key: "hue", zh: "光幕颜色", en: "Curtain Color", min: -180, max: 180, step: 5 },
    { key: "vibration", zh: "垂直脉冲", en: "Vertical Pulse", min: 0, max: 2.4, step: 0.05 },
  ],
  terrain: [
    { key: "size", zh: "地貌尺度", en: "Terrain Scale", min: 0.65, max: 1.65, step: 0.05 },
    { key: "density", zh: "地形线密度", en: "Ridge Density", min: 0.45, max: 2.2, step: 0.05 },
    { key: "line", zh: "地形线粗细", en: "Ridge Width", min: 0.45, max: 2.3, step: 0.05 },
    { key: "speed", zh: "地平线漂移", en: "Horizon Drift", min: 0.2, max: 2.2, step: 0.05 },
    { key: "vibration", zh: "山峰隆起", en: "Peak Lift", min: 0, max: 2.4, step: 0.05 },
    { key: "sharpness", zh: "山脊锐度", en: "Ridge Sharpness", min: 0.35, max: 1.8, step: 0.05 },
  ],
  laser: [
    { key: "density", zh: "激光束数量", en: "Beam Count", min: 0.45, max: 2.2, step: 0.05 },
    { key: "line", zh: "激光束粗细", en: "Beam Width", min: 0.45, max: 2.6, step: 0.05 },
    { key: "speed", zh: "扫动速度", en: "Sweep Speed", min: 0.2, max: 2.4, step: 0.05 },
    { key: "hue", zh: "激光色相", en: "Laser Hue", min: -180, max: 180, step: 5 },
    { key: "saturation", zh: "霓虹强度", en: "Neon Saturation", min: 0.35, max: 1.8, step: 0.05 },
  ],
  scanner: [
    { key: "size", zh: "扫描锥范围", en: "Scan Cone", min: 0.7, max: 1.7, step: 0.05 },
    { key: "line", zh: "扫描线粗细", en: "Scan Width", min: 0.45, max: 2.4, step: 0.05 },
    { key: "speed", zh: "扫描速度", en: "Scan Speed", min: 0.2, max: 2.4, step: 0.05 },
    { key: "hue", zh: "冷暖偏移", en: "Hue Shift", min: -180, max: 180, step: 5 },
    { key: "vibration", zh: "节拍闪光", en: "Beat Flash", min: 0, max: 2.4, step: 0.05 },
  ],
  vortex: [
    { key: "size", zh: "漩涡洞口", en: "Vortex Core", min: 0.65, max: 1.7, step: 0.05 },
    { key: "density", zh: "螺旋层数", en: "Spiral Layers", min: 0.45, max: 2.2, step: 0.05 },
    { key: "line", zh: "螺旋线宽", en: "Spiral Width", min: 0.45, max: 2.4, step: 0.05 },
    { key: "speed", zh: "旋转速度", en: "Spin Speed", min: 0.2, max: 2.4, step: 0.05 },
    { key: "vibration", zh: "吸力强度", en: "Pull Strength", min: 0, max: 2.4, step: 0.05 },
  ],
  wireform: [
    { key: "size", zh: "雕塑体量", en: "Sculpture Scale", min: 0.7, max: 1.7, step: 0.05 },
    { key: "density", zh: "切片密度", en: "Slice Density", min: 0.45, max: 2.2, step: 0.05 },
    { key: "line", zh: "线场粗细", en: "Line Width", min: 0.45, max: 2.4, step: 0.05 },
    { key: "speed", zh: "旋转速度", en: "Rotation Speed", min: 0.2, max: 2.4, step: 0.05 },
    { key: "sharpness", zh: "结构锐度", en: "Structure Sharpness", min: 0.35, max: 1.8, step: 0.05 },
  ],
  psyfluid: [
    { key: "size", zh: "流体范围", en: "Fluid Scale", min: 0.7, max: 1.7, step: 0.05 },
    { key: "density", zh: "流体层数", en: "Fluid Layers", min: 0.45, max: 2.2, step: 0.05 },
    { key: "speed", zh: "流动速度", en: "Flow Speed", min: 0.2, max: 2.4, step: 0.05 },
    { key: "gradient", zh: "迷幻渐变", en: "Psy Gradient", min: 0.4, max: 1.8, step: 0.05 },
    { key: "saturation", zh: "色彩浓度", en: "Color Intensity", min: 0.35, max: 1.8, step: 0.05 },
    { key: "vibration", zh: "眼状脉冲", en: "Eye Pulse", min: 0, max: 2.4, step: 0.05 },
  ],
  crystal: [
    { key: "size", zh: "晶体大小", en: "Crystal Size", min: 0.7, max: 1.7, step: 0.05 },
    { key: "density", zh: "星尘密度", en: "Dust Density", min: 0.45, max: 2.2, step: 0.05 },
    { key: "line", zh: "晶体描边", en: "Facet Lines", min: 0.45, max: 2.4, step: 0.05 },
    { key: "speed", zh: "漂浮速度", en: "Drift Speed", min: 0.2, max: 2.4, step: 0.05 },
    { key: "vibration", zh: "晶体呼吸", en: "Crystal Breath", min: 0, max: 2.4, step: 0.05 },
  ],
  skychamber: [
    { key: "size", zh: "天窗开口", en: "Aperture Size", min: 0.7, max: 1.7, step: 0.05 },
    { key: "gradient", zh: "光场渐变", en: "Light Gradient", min: 0.4, max: 1.8, step: 0.05 },
    { key: "saturation", zh: "光色浓度", en: "Light Saturation", min: 0.35, max: 1.8, step: 0.05 },
    { key: "line", zh: "边缘光宽", en: "Rim Width", min: 0.45, max: 2.4, step: 0.05 },
    { key: "speed", zh: "呼吸速度", en: "Breath Speed", min: 0.2, max: 2.4, step: 0.05 },
    { key: "vibration", zh: "光场脉冲", en: "Light Pulse", min: 0, max: 2.4, step: 0.05 },
  ],
  boiling: [
    { key: "size", zh: "文字尺度", en: "Type Scale", min: 0.7, max: 1.7, step: 0.05 },
    { key: "density", zh: "气泡密度", en: "Bubble Density", min: 0.45, max: 2.2, step: 0.05 },
    { key: "line", zh: "水纹粗细", en: "Ripple Width", min: 0.45, max: 2.4, step: 0.05 },
    { key: "speed", zh: "沸腾速度", en: "Boil Speed", min: 0.2, max: 2.4, step: 0.05 },
    { key: "vibration", zh: "喷溅幅度", en: "Splash Energy", min: 0, max: 2.4, step: 0.05 },
    { key: "hue", zh: "水光色相", en: "Water Hue", min: -180, max: 180, step: 5 },
  ],
  erosion: [
    { key: "size", zh: "地形尺度", en: "Terrain Scale", min: 0.65, max: 1.7, step: 0.05 },
    { key: "density", zh: "河道密度", en: "Channel Density", min: 0.45, max: 2.2, step: 0.05 },
    { key: "line", zh: "等高线粗细", en: "Contour Width", min: 0.45, max: 2.4, step: 0.05 },
    { key: "gradient", zh: "地貌渐变", en: "Terrain Gradient", min: 0.4, max: 1.8, step: 0.05 },
    { key: "saturation", zh: "沉积色彩", en: "Sediment Color", min: 0.35, max: 1.8, step: 0.05 },
    { key: "sharpness", zh: "侵蚀锐度", en: "Erosion Sharpness", min: 0.35, max: 1.8, step: 0.05 },
    { key: "vibration", zh: "律动侵蚀", en: "Rhythmic Erosion", min: 0, max: 2.4, step: 0.05 },
  ],
};
let visualTuning = { ...tuningDefaults };
const modeTuningValues = {};

function formatTuningValue(key, value) {
  if (key === "hue") return `${Math.round(value)}°`;
  return value.toFixed(2);
}

function modeTuningDefaults(mode) {
  const defaults = { ...tuningDefaults };
  (modeTuningConfigs[mode] || modeTuningConfigs.ring).forEach((control) => {
    defaults[control.key] = control.default ?? tuningDefaults[control.key];
  });
  return defaults;
}

function getModeTuning(mode) {
  return { ...modeTuningDefaults(mode), ...(modeTuningValues[mode] || {}) };
}

function updateTuningLabels() {
  tuningValueNodes.forEach((node) => {
    const key = node.dataset.tuningValue;
    node.textContent = formatTuningValue(key, visualTuning[key] ?? modeTuningDefaults(currentMode)[key]);
  });
}

function readVisualTuning() {
  const next = getModeTuning(currentMode);
  tuningInputs.forEach((input) => {
    next[input.dataset.tuning] = Number(input.value);
  });
  modeTuningValues[currentMode] = next;
  visualTuning = next;
  return visualTuning;
}

function bindTuningInputs() {
  tuningInputs.forEach((input) => {
    input.addEventListener("input", () => {
      readVisualTuning();
      updateTuningLabels();
    });

    input.addEventListener("change", () => {
      readVisualTuning();
      updateTuningLabels();
      resetErosionFeedback();
    });
  });
}

function renderTuningPanel() {
  const controls = modeTuningConfigs[currentMode] || modeTuningConfigs.ring;
  visualTuning = getModeTuning(currentMode);
  tuningGrid.innerHTML = controls
    .map((control) => {
      const id = `tune-${currentMode}-${control.key}`;
      const value = visualTuning[control.key] ?? tuningDefaults[control.key];
      const label = currentLanguage === "zh" ? control.zh : control.en;
      return `
        <label class="tuning-row" for="${id}">
          <span>${label}</span>
          <input id="${id}" data-tuning="${control.key}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${value}" />
          <b data-tuning-value="${control.key}">${formatTuningValue(control.key, value)}</b>
        </label>
      `;
    })
    .join("");
  tuningInputs = tuningGrid.querySelectorAll("[data-tuning]");
  tuningValueNodes = tuningGrid.querySelectorAll("[data-tuning-value]");
  bindTuningInputs();
  updateTuningLabels();
}

function resetVisualTuning() {
  delete modeTuningValues[currentMode];
  renderTuningPanel();
  resetErosionFeedback();
}

function tunedTheme() {
  const baseTheme = themes[currentTheme];
  const hue = visualTuning.hue || 0;
  return {
    ...baseTheme,
    base: baseTheme.base + hue,
    second: baseTheme.second + hue * visualTuning.gradient,
    third: baseTheme.third + hue * 0.7,
  };
}

function tunedFeatures(features) {
  const vibration = visualTuning.vibration;
  return {
    bass: Math.min(1.6, features.bass * vibration),
    mid: Math.min(1.6, features.mid * vibration),
    treble: Math.min(1.6, features.treble * vibration),
    energy: Math.min(1.6, features.energy * (0.65 + vibration * 0.35)),
    beat: Math.min(1.8, features.beat * (0.5 + vibration * 0.55)),
  };
}

function applyCanvasTuning(width, height) {
  ctx.save();
  ctx.filter = `saturate(${visualTuning.saturation}) contrast(${0.85 + visualTuning.sharpness * 0.24})`;
  ctx.translate(width / 2, height / 2);
  ctx.scale(visualTuning.size, visualTuning.size);
  ctx.translate(-width / 2, -height / 2);
}

function t(key) {
  return translations[currentLanguage][key] || translations.zh[key] || key;
}

function setStatus(key) {
  statusText.textContent = t(key);
}

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });

  if (!trackName.dataset.customTrack) trackName.textContent = t("emptyTrack");
  if (!audio.src) setStatus("ready");
  languageButton.textContent = language === "zh" ? "EN" : "中";
  immersiveButton.textContent = isImmersive ? t("exit") : t("immersive");
  if (recorder?.state === "recording") recordButton.textContent = t("stopRecording");
  renderTuningPanel();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  webglCanvas.width = canvas.width;
  webglCanvas.height = canvas.height;
  if (webglState?.gl) {
    webglState.gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
    resetErosionFeedback();
  }
}

function setupAudioGraph() {
  if (!audioContext) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.82;
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    timeData = new Uint8Array(analyser.frequencyBinCount);
  }

  if (!source) {
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }
}

function bandAverage(start, end) {
  if (!frequencyData) return 0;
  let total = 0;
  const max = Math.min(end, frequencyData.length);
  for (let i = start; i < max; i += 1) total += frequencyData[i];
  return total / Math.max(1, max - start) / 255;
}

function audioFeatures() {
  if (!analyser) {
    return { bass: 0, mid: 0, treble: 0, energy: 0, beat: 0 };
  }

  analyser.getByteFrequencyData(frequencyData);
  analyser.getByteTimeDomainData(timeData);

  const bass = bandAverage(2, 18);
  const mid = bandAverage(18, 96);
  const treble = bandAverage(96, 320);
  const energy = (bass * 1.35 + mid + treble * 0.8) / 3.15;
  const bassRise = bass - lastBass;

  if (beatCooldown <= 0 && bass > 0.32 && bassRise > 0.045) {
    beatPulse = 1;
    beatCooldown = 12;
  } else {
    beatPulse *= 0.88;
    beatCooldown -= 1;
  }

  lastBass = bass * 0.72 + lastBass * 0.28;

  bassMeter.textContent = Math.round(bass * 100);
  midMeter.textContent = Math.round(mid * 100);
  trebleMeter.textContent = Math.round(treble * 100);
  beatMeter.textContent = Math.round(beatPulse * 100);

  return { bass, mid, treble, energy, beat: beatPulse };
}

function clearStage(width, height, features) {
  const theme = tunedTheme();
  const alpha = 0.28;
  ctx.fillStyle = `rgba(${theme.ink}, ${alpha + features.energy * 0.12})`;
  ctx.fillRect(0, 0, width, height);
}

const erosionVertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const erosionFragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_energy;
uniform float u_beat;
uniform vec3 u_theme;
uniform sampler2D u_previous;
uniform float u_feedback;
uniform float u_scale;
uniform float u_density;
uniform float u_gradient;
uniform float u_saturation;
uniform float u_sharpness;
uniform float u_line;
varying vec2 v_uv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.82, -0.57, 0.57, 0.82);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = r * p * 2.03 + 13.7;
    a *= 0.5;
  }
  return v;
}

vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
}

float terrainPulse() {
  float groove = 0.55 + 0.45 * sin(u_time * (1.7 + u_mid * 1.8));
  return clamp(u_bass * 0.9 + u_mid * 0.28 + u_beat * 0.85 + groove * u_energy * 0.35, 0.0, 1.7);
}

float channelMask(vec2 p) {
  float pulse = terrainPulse();
  vec2 w = vec2(
    fbm(p * 0.72 + vec2(sin(u_time * 0.21) * 0.16, cos(u_time * 0.17) * 0.11)),
    fbm(p * 0.54 + vec2(cos(u_time * 0.13) * 0.13, sin(u_time * 0.19) * 0.15))
  );
  float river = sin((p.x + w.x * (2.15 + pulse * 0.7)) * 2.2) + sin((p.y - w.y * (1.7 + pulse * 0.65)) * 1.35) * 0.55;
  float thin = 1.0 - smoothstep(0.018, 0.16 + pulse * 0.12, abs(river));
  float tributary = 1.0 - smoothstep(0.01, 0.09 + u_mid * 0.08 + pulse * 0.045, abs(sin(p.x * 4.0 + p.y * 2.3 + w.y * (4.2 + pulse * 1.6))));
  return clamp(thin + tributary * 0.45, 0.0, 1.0);
}

float heightField(vec2 p) {
  float pulse = terrainPulse();
  vec2 warp = vec2(
    fbm(p * 0.9 + vec2(sin(u_time * 0.16) * 0.2, cos(u_time * 0.12) * 0.16)),
    fbm(p * 0.9 + vec2(9.3 + cos(u_time * 0.14) * 0.18, 2.1 + sin(u_time * 0.11) * 0.18))
  );
  p += (warp - 0.5) * (0.78 + u_mid * 1.15 + pulse * 0.72);
  float base = fbm(p * (1.35 + pulse * 0.18));
  float ridges = 1.0 - abs(2.0 * fbm(p * (2.25 + u_treble * 0.3) + warp * (1.25 + pulse * 1.05)) - 1.0);
  float channels = channelMask(p);
  float lift = 0.72 + pulse * 0.42;
  float ridgeGain = 0.28 + u_treble * 0.2 + pulse * 0.22;
  float erosionDepth = 0.26 + u_bass * 0.28 + pulse * 0.34;
  float eroded = base * lift + ridges * ridgeGain - channels * erosionDepth;
  return eroded * (0.92 + pulse * 0.18);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  p *= 1.78 / max(u_scale, 0.2);

  float h = heightField(p);
  float e = 0.006;
  float hx = heightField(p + vec2(e, 0.0)) - heightField(p - vec2(e, 0.0));
  float hy = heightField(p + vec2(0.0, e)) - heightField(p - vec2(0.0, e));
  vec3 n = normalize(vec3(-hx * 2.5, -hy * 2.5, 1.0));
  vec3 light = normalize(vec3(-0.42, 0.58, 0.7));
  float shade = clamp(dot(n, light), 0.0, 1.0);
  float channels = channelMask(p);
  float pulse = terrainPulse();
  float contours = 1.0 - smoothstep(0.0, (0.046 + u_mid * 0.02) / max(u_line, 0.2), abs(fract(h * (5.5 + u_density * 2.0 + pulse * 5.0)) - 0.5));
  float sediment = fbm(p * (5.8 + u_density * 1.7 + pulse * 2.0) + vec2(sin(u_time * 0.24), cos(u_time * 0.18)) * 0.18);
  float grain = hash(gl_FragCoord.xy + floor(u_time * 30.0)) - 0.5;

  vec3 deep = hsv2rgb(vec3(u_theme.x + 0.48 * u_gradient, 0.72, 0.08 + u_energy * 0.05));
  vec3 silt = hsv2rgb(vec3(u_theme.y, 0.62, 0.16 + h * 0.18 + u_bass * 0.06));
  vec3 ridge = hsv2rgb(vec3(u_theme.z, 0.78, 0.38 + u_treble * 0.12));
  vec3 water = hsv2rgb(vec3(u_theme.x, 0.74, 0.3 + u_mid * 0.12));

  vec3 color = mix(deep, silt, smoothstep(-0.15, 0.78, h));
  color = mix(color, ridge, smoothstep(0.52, 0.9, h) * (0.18 + shade * 0.24));
  color = mix(color, water, channels * (0.34 + pulse * 0.18));
  color += ridge * contours * (0.045 + u_treble * 0.1 + pulse * 0.04);
  color += water * pow(channels, 2.0) * (0.055 + pulse * 0.09 + u_beat * 0.08);
  color *= 0.42 + shade * 0.48;
  color += sediment * 0.018 + grain * (0.012 + u_treble * 0.018);
  color += vec3(1.0, 0.82, 0.55) * u_beat * 0.035;

  vec2 texel = 1.0 / u_resolution;
  vec3 prev = texture2D(u_previous, v_uv).rgb;
  vec3 prevBlur = (
    texture2D(u_previous, v_uv + vec2(texel.x, 0.0)).rgb +
    texture2D(u_previous, v_uv - vec2(texel.x, 0.0)).rgb +
    texture2D(u_previous, v_uv + vec2(0.0, texel.y)).rgb +
    texture2D(u_previous, v_uv - vec2(0.0, texel.y)).rgb
  ) * 0.25;
  vec3 memory = mix(prev, prevBlur, 0.28 + u_mid * 0.2);
  memory *= 0.885 - u_energy * 0.025;
  vec3 excitation = color * (0.12 + pulse * 0.09 + u_beat * 0.06);
  color = mix(color, memory + excitation, u_feedback);
  color = color / (1.0 + color * 1.55);
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, u_saturation);
  color = mix(vec3(0.5), color, u_sharpness);

  float vignette = smoothstep(1.55, 0.18, length(uv - 0.5));
  color *= 0.34 + vignette * 0.72;
  gl_FragColor = vec4(color, 1.0);
}
`;

const displayFragmentShader = `
precision highp float;

uniform sampler2D u_scene;
varying vec2 v_uv;

void main() {
  gl_FragColor = texture2D(u_scene, v_uv);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "Shader compile failed");
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "Shader link failed");
  }
  return program;
}

function createFeedbackTexture(gl, width, height) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  return texture;
}

function createFeedbackTarget(gl, width, height) {
  const texture = createFeedbackTexture(gl, width, height);
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  return { texture, framebuffer };
}

function resetErosionFeedback() {
  if (!webglState?.gl) return;
  const { gl, feedback } = webglState;
  if (feedback?.targets) {
    feedback.targets.forEach((target) => {
      gl.deleteTexture(target.texture);
      gl.deleteFramebuffer(target.framebuffer);
    });
  }

  const width = Math.max(1, webglCanvas.width);
  const height = Math.max(1, webglCanvas.height);
  const targets = [createFeedbackTarget(gl, width, height), createFeedbackTarget(gl, width, height)];
  webglState.feedback = { width, height, targets, readIndex: 0, initialized: false };
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function initErosionWebgl() {
  if (webglState || !webglSupported) return webglState;
  const gl = webglCanvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    premultipliedAlpha: false,
  });

  if (!gl) {
    webglSupported = false;
    return null;
  }

  try {
    const program = createProgram(gl, erosionVertexShader, erosionFragmentShader);
    const displayProgram = createProgram(gl, erosionVertexShader, displayFragmentShader);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    webglState = {
      gl,
      program,
      displayProgram,
      buffer,
      position: gl.getAttribLocation(program, "a_position"),
      displayPosition: gl.getAttribLocation(displayProgram, "a_position"),
      uniforms: {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        time: gl.getUniformLocation(program, "u_time"),
        bass: gl.getUniformLocation(program, "u_bass"),
        mid: gl.getUniformLocation(program, "u_mid"),
        treble: gl.getUniformLocation(program, "u_treble"),
        energy: gl.getUniformLocation(program, "u_energy"),
        beat: gl.getUniformLocation(program, "u_beat"),
        theme: gl.getUniformLocation(program, "u_theme"),
        previous: gl.getUniformLocation(program, "u_previous"),
        feedback: gl.getUniformLocation(program, "u_feedback"),
        scale: gl.getUniformLocation(program, "u_scale"),
        density: gl.getUniformLocation(program, "u_density"),
        gradient: gl.getUniformLocation(program, "u_gradient"),
        saturation: gl.getUniformLocation(program, "u_saturation"),
        sharpness: gl.getUniformLocation(program, "u_sharpness"),
        line: gl.getUniformLocation(program, "u_line"),
      },
      displayUniforms: {
        scene: gl.getUniformLocation(displayProgram, "u_scene"),
      },
    };
    resetErosionFeedback();
  } catch (error) {
    console.error(error);
    webglSupported = false;
    return null;
  }

  return webglState;
}

function drawErosionFlow(features) {
  const state = initErosionWebgl();
  if (!state) return;
  const { gl, program, displayProgram, buffer, position, displayPosition, uniforms, displayUniforms } = state;
  const theme = tunedTheme();
  const sensitivity = Number(sensitivityInput.value);
  if (!state.feedback || state.feedback.width !== webglCanvas.width || state.feedback.height !== webglCanvas.height) {
    resetErosionFeedback();
  }

  const feedback = state.feedback;
  const read = feedback.targets[feedback.readIndex];
  const writeIndex = 1 - feedback.readIndex;
  const write = feedback.targets[writeIndex];

  if (!feedback.initialized) {
    feedback.targets.forEach((target) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
      gl.clearColor(0.03, 0.04, 0.06, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    });
    feedback.initialized = true;
  }

  gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
  gl.bindFramebuffer(gl.FRAMEBUFFER, write.framebuffer);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, read.texture);
  gl.uniform2f(uniforms.resolution, webglCanvas.width, webglCanvas.height);
  gl.uniform1f(uniforms.time, frame / 60);
  gl.uniform1f(uniforms.bass, Math.min(1, features.bass * sensitivity));
  gl.uniform1f(uniforms.mid, Math.min(1, features.mid * sensitivity));
  gl.uniform1f(uniforms.treble, Math.min(1, features.treble * sensitivity));
  gl.uniform1f(uniforms.energy, Math.min(1, features.energy * sensitivity));
  gl.uniform1f(uniforms.beat, features.beat);
  gl.uniform3f(uniforms.theme, (theme.base % 360) / 360, (theme.second % 360) / 360, (theme.third % 360) / 360);
  gl.uniform1i(uniforms.previous, 0);
  gl.uniform1f(uniforms.feedback, 0.48 + Math.min(0.12, features.energy * 0.12));
  gl.uniform1f(uniforms.scale, visualTuning.size);
  gl.uniform1f(uniforms.density, visualTuning.density);
  gl.uniform1f(uniforms.gradient, visualTuning.gradient);
  gl.uniform1f(uniforms.saturation, visualTuning.saturation);
  gl.uniform1f(uniforms.sharpness, visualTuning.sharpness);
  gl.uniform1f(uniforms.line, visualTuning.line);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.useProgram(displayProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(displayPosition);
  gl.vertexAttribPointer(displayPosition, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, write.texture);
  gl.uniform1i(displayUniforms.scene, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  feedback.readIndex = writeIndex;
}

function drawRing(width, height, features) {
  const theme = tunedTheme();
  const cx = width / 2;
  const cy = height / 2;
  const size = Math.min(width, height);
  const radius = size * (0.18 + features.bass * 0.12 + features.beat * 0.025);
  const bars = Math.round(160 * visualTuning.density);
  const sensitivity = Number(sensitivityInput.value);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(frame * 0.002 + features.beat * 0.035);

  for (let i = 0; i < bars; i += 1) {
    const bin = Math.floor((i / bars) * frequencyData.length * 0.58);
    const amp = (frequencyData?.[bin] || 0) / 255;
    const angle = (Math.PI * 2 * i) / bars;
    const length = size * 0.035 + amp * size * 0.18 * sensitivity;
    const hue = theme.base + amp * 70 + features.bass * 38;

    ctx.strokeStyle = `hsla(${hue}, 92%, ${58 + amp * 24}%, ${0.62 + amp * 0.34})`;
    ctx.lineWidth = (2) * visualTuning.line;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.lineTo(Math.cos(angle) * (radius + length), Math.sin(angle) * (radius + length));
    ctx.stroke();
  }

  const glow = radius * (1.15 + features.energy * 0.45);
  const gradient = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, glow);
  gradient.addColorStop(0, `hsla(${theme.base}, 92%, 68%, ${0.35 + features.mid * 0.35})`);
  gradient.addColorStop(0.55, `hsla(${theme.third}, 92%, 66%, ${0.16 + features.bass * 0.28})`);
  gradient.addColorStop(1, `hsla(${theme.second}, 92%, 62%, 0)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, glow, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTunnel(width, height, features) {
  const theme = tunedTheme();
  const cx = width / 2;
  const cy = height / 2;
  const rings = Math.round(34 * visualTuning.density);
  const sensitivity = Number(sensitivityInput.value);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(frame * 0.006) * 0.08 + features.beat * 0.04);

  for (let r = rings; r > 0; r -= 1) {
    const depth = r / rings;
    const radius = Math.min(width, height) * (0.06 + depth * 0.58);
      const points = Math.round(96 * visualTuning.density);
    const waveOffset = Math.floor(depth * frequencyData.length * 0.45);

    ctx.beginPath();
    for (let i = 0; i <= points; i += 1) {
      const angle = (Math.PI * 2 * i) / points;
      const bin = (waveOffset + i * 3) % frequencyData.length;
      const amp = (frequencyData?.[bin] || 0) / 255;
      const wobble = Math.sin(angle * 4 + frame * 0.025 + r) * features.mid * 18;
      const audioRadius = radius + amp * 90 * sensitivity * depth + wobble;
      const x = Math.cos(angle) * audioRadius;
      const y = Math.sin(angle) * audioRadius * (0.62 + depth * 0.28);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `hsla(${theme.third + depth * 155 + features.treble * 80}, 90%, ${42 + depth * 28}%, ${0.08 + depth * 0.42})`;
    ctx.lineWidth = (1 + depth * 2.2 + features.bass * 3 + features.beat * 2.5) * visualTuning.line;
    ctx.stroke();
  }

  ctx.restore();
}

function drawCurtain(width, height, features) {
  const theme = tunedTheme();
  const cx = width / 2;
  const cy = height / 2;
  const baseWidth = Math.min(width * 0.82, 980);
  const columns = Math.round(112 * visualTuning.density);
  const sensitivity = Number(sensitivityInput.value);
  const beatLift = 1 + features.beat * 0.28;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = "lighter";

  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(width, height) * 0.62);
  halo.addColorStop(0, `hsla(${theme.base}, 92%, 62%, ${0.1 + features.energy * 0.24})`);
  halo.addColorStop(0.48, `hsla(${theme.second}, 86%, 58%, ${0.06 + features.bass * 0.18})`);
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, Math.min(width, height) * 0.62, 0, Math.PI * 2);
  ctx.fill();

  for (let layer = 0; layer < 3; layer += 1) {
    const layerScale = 1 - layer * 0.16;
    const alpha = 0.46 - layer * 0.12;
    const yOffset = layer * 18;

    for (let i = 0; i < columns; i += 1) {
      const t = i / (columns - 1);
      const bin = Math.floor((t ** 1.42) * frequencyData.length * 0.72);
      const amp = ((frequencyData[bin] || 0) / 255) ** 1.18;
      const curve = Math.sin(t * Math.PI);
      const x = (t - 0.5) * baseWidth * layerScale;
      const heightScale = Math.min(width, height) * 0.18;
      const barHeight = (18 + amp * heightScale * sensitivity * beatLift) * (0.36 + curve * 0.94);
      const hue = theme.base + amp * 82 + layer * 24 + features.treble * 40;

      ctx.strokeStyle = `hsla(${hue}, 92%, ${56 + amp * 28}%, ${alpha + amp * 0.32})`;
      ctx.lineWidth = (1.2 + amp * 3.5 + features.beat * 1.8) * visualTuning.line;
      ctx.beginPath();
      ctx.moveTo(x, -yOffset - barHeight);
      ctx.quadraticCurveTo(x + Math.sin(frame * 0.018 + i * 0.21) * 10, -yOffset, x, yOffset + barHeight);
      ctx.stroke();

      if (i % 8 === 0) {
        const dotSize = 1.8 + amp * 7 + features.beat * 3;
        ctx.fillStyle = `hsla(${theme.third + amp * 70}, 96%, 68%, ${0.28 + amp * 0.55})`;
        ctx.beginPath();
        ctx.arc(x, -yOffset - barHeight, dotSize, 0, Math.PI * 2);
        ctx.arc(x, yOffset + barHeight, dotSize * 0.72, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.lineWidth = (2) * visualTuning.line;
  for (let pass = 0; pass < 3; pass += 1) {
    ctx.beginPath();
    for (let i = 0; i < timeData.length; i += 8) {
      const t = i / (timeData.length - 1);
      const wave = (timeData[i] - 128) / 128;
      const x = (t - 0.5) * baseWidth;
      const y = wave * Math.min(width, height) * (0.08 + pass * 0.018) * sensitivity;
      const shimmer = Math.sin(t * Math.PI * 8 + frame * 0.025 + pass) * features.treble * 10;
      if (i === 0) ctx.moveTo(x, y + shimmer);
      else ctx.lineTo(x, y + shimmer);
    }
    ctx.strokeStyle = `hsla(${theme.second + pass * 22}, 94%, ${62 + pass * 8}%, ${0.24 + features.mid * 0.28})`;
    ctx.stroke();
  }

  const rings = 5;
  for (let i = 0; i < rings; i += 1) {
    const radius = Math.min(width, height) * (0.11 + i * 0.08 + features.bass * 0.025);
    ctx.strokeStyle = `hsla(${theme.third + i * 18}, 88%, 62%, ${0.08 + features.energy * 0.16 - i * 0.008})`;
    ctx.lineWidth = (1 + features.beat * 1.4) * visualTuning.line;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.78, radius * 0.36, Math.sin(frame * 0.004) * 0.08, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawTerrain(width, height, features) {
  const sensitivity = Number(sensitivityInput.value);
  const horizon = height * 0.47;
  const vanishingX = width * 0.74;
  const peakX = width * 0.18;
  const terrainWidth = width * 0.92;
  const terrainHeight = height * (0.18 + features.bass * 0.08);
  const glow = 0.18 + features.energy * 0.36;

  ctx.save();
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, `rgba(38, 20, 4, ${0.62 + features.bass * 0.18})`);
  bg.addColorStop(0.36, "rgba(3, 33, 29, 0.82)");
  bg.addColorStop(1, "rgba(2, 4, 7, 0.96)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  for (const haze of hazeSeeds) {
    const drift = Math.sin(frame * 0.01 + haze.phase) * 12;
    const x = haze.x * width + drift;
    const y = haze.y * height * 0.86;
    const radius = haze.size * (0.45 + features.treble * 0.55);
    ctx.fillStyle = `rgba(180, 225, 210, ${0.025 + features.treble * 0.07})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const ridgeGradient = ctx.createLinearGradient(0, horizon - 80, width, horizon + 80);
  ridgeGradient.addColorStop(0, `rgba(255, 177, 74, ${0.22 + features.bass * 0.34})`);
  ridgeGradient.addColorStop(0.35, `rgba(245, 226, 156, ${0.28 + features.mid * 0.32})`);
  ridgeGradient.addColorStop(1, `rgba(86, 222, 214, ${0.18 + features.treble * 0.22})`);

  for (let row = 0; row < 34; row += 1) {
    const depth = row / 33;
    const yBase = horizon + depth ** 1.85 * height * 0.48;
    const scale = 1 + depth * 2.5;
    ctx.beginPath();

    for (let col = 0; col <= 90; col += 1) {
      const t = col / 90;
      const x = width * 0.02 + t * terrainWidth;
      const bin = Math.floor((t ** 1.2) * frequencyData.length * 0.52);
      const amp = (frequencyData[bin] || 0) / 255;
      const peakInfluence = Math.exp(-Math.abs(t - 0.17) * 9);
      const wave = Math.sin(t * Math.PI * 8 + row * 0.24 + frame * 0.014) * 10;
      const mountain = -peakInfluence * terrainHeight * (0.45 + features.bass * 2.4) * (1 - depth * 0.55);
      const audioLift = -amp * terrainHeight * 0.55 * sensitivity * (1 - depth * 0.24);
      const perspectivePull = (vanishingX - x) * depth * 0.035;
      const y = yBase + wave * (1 - depth * 0.35) + mountain + audioLift;
      if (col === 0) ctx.moveTo(x + perspectivePull, y);
      else ctx.lineTo(x + perspectivePull, y);
    }

    ctx.strokeStyle = ridgeGradient;
    ctx.lineWidth = (0.8 + (1 - depth) * 1.1 + features.beat * 1.4) * visualTuning.line;
    ctx.globalAlpha = 0.15 + (1 - depth) * 0.35;
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  for (let col = 0; col < 34; col += 1) {
    const t = col / 33;
    const startX = width * 0.03 + t * terrainWidth;
    const bin = Math.floor(t * frequencyData.length * 0.4);
    const amp = (frequencyData[bin] || 0) / 255;
    ctx.beginPath();
    ctx.moveTo(startX, horizon - amp * 60);
    ctx.lineTo(vanishingX + (startX - vanishingX) * 0.25, height * 0.92);
    ctx.strokeStyle = `rgba(74, 214, 202, ${0.06 + amp * 0.16})`;
    ctx.lineWidth = (0.8 + amp * 1.2) * visualTuning.line;
    ctx.stroke();
  }

  const beamY = horizon + Math.sin(frame * 0.017) * 10;
  const beam = ctx.createLinearGradient(0, beamY, width, beamY);
  beam.addColorStop(0, `rgba(255,196,94,${0.18 + features.bass * 0.28})`);
  beam.addColorStop(0.38, `rgba(245,244,216,${0.26 + features.energy * 0.36})`);
  beam.addColorStop(1, `rgba(64,224,216,${0.12 + features.treble * 0.24})`);
  ctx.strokeStyle = beam;
  ctx.lineWidth = (4 + features.beat * 5) * visualTuning.line;
  ctx.beginPath();
  for (let i = 0; i < timeData.length; i += 6) {
    const t = i / (timeData.length - 1);
    const wave = (timeData[i] - 128) / 128;
    const x = width * 0.02 + t * terrainWidth;
    const y = beamY + wave * height * 0.025 * sensitivity;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const peakGlow = ctx.createRadialGradient(peakX, horizon - terrainHeight * 0.45, 0, peakX, horizon - terrainHeight * 0.45, terrainHeight * 1.4);
  peakGlow.addColorStop(0, `rgba(255, 238, 176, ${0.52 + features.beat * 0.24})`);
  peakGlow.addColorStop(0.28, `rgba(255, 120, 34, ${0.34 + features.bass * 0.28})`);
  peakGlow.addColorStop(1, "rgba(255, 120, 34, 0)");
  ctx.fillStyle = peakGlow;
  ctx.beginPath();
  ctx.arc(peakX, horizon - terrainHeight * 0.45, terrainHeight * 1.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 150, 36, ${0.32 + features.bass * 0.52})`;
  ctx.lineWidth = (3 + features.beat * 3) * visualTuning.line;
  ctx.beginPath();
  for (let i = 0; i < 18; i += 1) {
    const y = horizon - terrainHeight * 1.75 - i * 10;
    const radius = 18 + Math.sin(frame * 0.04 + i) * 5 + features.bass * 18;
    ctx.moveTo(peakX + radius, y);
    ctx.ellipse(peakX, y, radius, 4 + features.bass * 7, 0, 0, Math.PI * 2);
  }
  ctx.stroke();

  for (let i = 0; i < 3; i += 1) {
    const t = (frame * 0.003 + i * 0.31) % 1;
    const x = width * (0.34 + t * 0.58);
    const y = horizon + height * (0.05 + i * 0.075) + Math.sin(frame * 0.026 + i) * 24;
    ctx.strokeStyle = `rgba(255, 92, 8, ${0.26 + features.mid * 0.38})`;
    ctx.lineWidth = (2 + features.beat * 2) * visualTuning.line;
    ctx.beginPath();
    ctx.moveTo(x - 120, y - 18);
    ctx.lineTo(x + 80, y + 16);
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = `rgba(4, 9, 9, ${0.08 + glow * 0.08})`;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawPerformanceSilhouette(width, height, alpha = 0.72) {
  const tableY = height * 0.82;
  const tableW = Math.min(width * 0.24, 230);
  const tableH = Math.max(14, height * 0.025);
  const cx = width * 0.5;

  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(cx - tableW / 2, tableY, tableW, tableH);

  for (const offset of [-0.085, 0.02, 0.105]) {
    const x = cx + width * offset;
    const headY = tableY - height * (0.085 + Math.abs(offset) * 0.12);
    ctx.beginPath();
    ctx.arc(x, headY, Math.max(7, width * 0.008), 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x, headY + height * 0.055, width * 0.018, height * 0.065, offset * -2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = `rgba(255, 255, 255, ${0.08 * alpha})`;
  ctx.fillRect(cx - tableW * 0.18, tableY + 3, tableW * 0.22, tableH * 0.52);
  ctx.restore();
}

function drawLaserBeam(x1, y1, x2, y2, hue, alpha, widthScale = 1) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const nx = (-dy / length) * 10 * widthScale;
  const ny = (dx / length) * 10 * widthScale;
  const beam = ctx.createLinearGradient(x1, y1, x2, y2);
  beam.addColorStop(0, `hsla(${hue}, 100%, 58%, 0)`);
  beam.addColorStop(0.18, `hsla(${hue}, 100%, 62%, ${alpha * 0.42})`);
  beam.addColorStop(0.52, `hsla(${hue}, 100%, 68%, ${alpha})`);
  beam.addColorStop(1, `hsla(${hue}, 100%, 62%, ${alpha * 0.18})`);

  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(x1 + nx, y1 + ny);
  ctx.lineTo(x2 + nx * 0.16, y2 + ny * 0.16);
  ctx.lineTo(x2 - nx * 0.16, y2 - ny * 0.16);
  ctx.lineTo(x1 - nx, y1 - ny);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = `hsla(${hue}, 100%, 72%, ${Math.min(1, alpha + 0.2)})`;
  ctx.lineWidth = (Math.max(1, widthScale * 1.5)) * visualTuning.line;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawLaserCathedral(width, height, features) {
  const sensitivity = Number(sensitivityInput.value);
  const baseHue = currentTheme === "aurora" ? 196 : currentTheme === "mono" ? 42 : 350;
  const accentHue = currentTheme === "aurora" ? 328 : currentTheme === "mono" ? 205 : 18;
  const centerX = width * 0.5;
  const altarY = height * 0.78;
  const apexY = height * (0.18 + features.treble * 0.04);
  const pulse = 1 + features.beat * 0.7;

  ctx.save();
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, `rgba(8, 5, 10, ${0.96 - features.energy * 0.12})`);
  bg.addColorStop(0.54, `hsla(${accentHue}, 64%, 10%, 0.92)`);
  bg.addColorStop(1, "rgba(2, 3, 8, 0.98)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  const haze = ctx.createRadialGradient(centerX, height * 0.5, 0, centerX, height * 0.5, Math.max(width, height) * 0.72);
  haze.addColorStop(0, `hsla(${accentHue}, 100%, 54%, ${0.08 + features.bass * 0.16})`);
  haze.addColorStop(0.5, `hsla(${baseHue}, 100%, 58%, ${0.03 + features.treble * 0.08})`);
  haze.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < laserSeeds.length; i += 1) {
    const seed = laserSeeds[i];
    const t = seed.lane / 10;
    const amp = (frequencyData[Math.floor(t * frequencyData.length * 0.58)] || 0) / 255;
    const sideX = seed.side < 0 ? width * (0.08 + seed.depth * 0.24) : width * (0.92 - seed.depth * 0.24);
    const sideY = height * (0.18 + t * 0.62);
    const sweep = Math.sin(frame * 0.014 + seed.phase) * width * (0.08 + features.mid * 0.11);
    const targetX = centerX + sweep * seed.side + Math.sin(frame * 0.009 + i) * amp * width * 0.12;
    const targetY = apexY + height * (0.07 + amp * 0.22);
    const hue = i % 5 === 0 ? baseHue : accentHue + amp * 24;
    const alpha = 0.16 + amp * 0.42 + features.beat * 0.22;
    drawLaserBeam(sideX, sideY, targetX, targetY, hue, alpha, 0.55 + amp * 1.5 * sensitivity * pulse);
  }

  for (let i = 0; i < 8; i += 1) {
    const x = width * (0.15 + i * 0.1);
    const amp = (frequencyData[8 + i * 6] || 0) / 255;
    drawLaserBeam(x, height * 0.12, x + Math.sin(frame * 0.018 + i) * 20, height * (0.64 + amp * 0.16), accentHue, 0.12 + amp * 0.32, 0.35 + amp * 1.2);
  }

  ctx.strokeStyle = `hsla(${accentHue}, 100%, 62%, ${0.18 + features.energy * 0.36})`;
  ctx.lineWidth = (1 + features.beat * 2) * visualTuning.line;
  ctx.beginPath();
  ctx.moveTo(width * 0.18, altarY);
  ctx.lineTo(centerX, apexY);
  ctx.lineTo(width * 0.82, altarY);
  ctx.stroke();

  drawPerformanceSilhouette(width, height, 0.78);
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawLightScanner(width, height, features) {
  const sensitivity = Number(sensitivityInput.value);
  const coolHue = currentTheme === "ember" ? 24 : 205;
  const warmHue = currentTheme === "mono" ? 44 : 338;
  const cx = width * 0.5;
  const cy = height * 0.43;
  const size = Math.min(width, height);
  const radius = size * (0.11 + features.bass * 0.08);
  const sweep = frame * 0.018;

  ctx.save();
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, `hsla(${coolHue}, 72%, 14%, 0.92)`);
  bg.addColorStop(0.56, "rgba(5, 8, 16, 0.96)");
  bg.addColorStop(1, `hsla(${warmHue}, 72%, 10%, 0.94)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  for (let side of [-1, 1]) {
    const sourceX = cx + side * width * 0.33;
    const sourceY = height * 0.68;
    const angle = sweep * side + features.mid * side;
    const targetX = cx + Math.cos(angle) * width * (0.18 + features.treble * 0.1);
    const targetY = cy + Math.sin(angle) * height * 0.12;
    drawLaserBeam(sourceX, sourceY, targetX, targetY, side < 0 ? coolHue : warmHue, 0.24 + features.energy * 0.4, 1 + features.beat * 2);
  }

  const coneAngle = Math.sin(frame * 0.012) * 0.42;
  const coneWidth = size * (0.18 + features.mid * 0.16);
  const coneLength = width * 0.46;
  const coneX = cx + Math.cos(coneAngle) * coneLength * 0.25;
  const coneY = cy + Math.sin(coneAngle) * height * 0.12;
  const cone = ctx.createLinearGradient(width * 0.16, height * 0.7, coneX + coneLength * 0.35, coneY);
  cone.addColorStop(0, `hsla(${warmHue}, 100%, 58%, ${0.08 + features.bass * 0.14})`);
  cone.addColorStop(0.5, `hsla(${warmHue}, 100%, 64%, ${0.18 + features.mid * 0.28})`);
  cone.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(cx - coneWidth * 0.2, cy);
  ctx.lineTo(cx + coneLength * 0.45, cy - coneWidth * 0.32);
  ctx.lineTo(cx + coneLength * 0.45, cy + coneWidth * 0.32);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = `hsla(${coolHue}, 100%, 76%, ${0.4 + features.treble * 0.34})`;
  ctx.lineWidth = (2 + features.beat * 3) * visualTuning.line;
  for (let i = 0; i < 5; i += 1) {
    const r = radius * (1 + i * 0.34 + features.energy * 0.12);
    ctx.beginPath();
    ctx.arc(cx, cy, r, sweep + i * 0.28, sweep + Math.PI * 1.45 + i * 0.2);
    ctx.stroke();
  }

  ctx.strokeStyle = `hsla(${warmHue}, 100%, 62%, ${0.32 + features.bass * 0.45})`;
  ctx.lineWidth = (3 + features.beat * 4) * visualTuning.line;
  ctx.beginPath();
  ctx.moveTo(cx - radius * 1.8, cy);
  ctx.lineTo(cx + radius * 1.8, cy);
  ctx.stroke();

  const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 3.2);
  glow.addColorStop(0, `hsla(${coolHue}, 100%, 74%, ${0.28 + features.energy * 0.32})`);
  glow.addColorStop(0.45, `hsla(${warmHue}, 100%, 58%, ${0.08 + features.bass * 0.2})`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 3.2, 0, Math.PI * 2);
  ctx.fill();

  drawPerformanceSilhouette(width, height, 0.68);
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawSonicVortex(width, height, features) {
  const sensitivity = Number(sensitivityInput.value);
  const theme = tunedTheme();
  const cx = width * 0.5;
  const cy = height * 0.46;
  const size = Math.min(width, height);
  const maxRadius = size * 0.54;
  const hole = size * (0.06 + features.bass * 0.055 + features.beat * 0.035);

  ctx.save();
  ctx.fillStyle = `rgba(${theme.ink}, ${0.88 - features.energy * 0.18})`;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  for (let ring = 0; ring < 46; ring += 1) {
    const depth = ring / 45;
    const radius = hole + depth * maxRadius;
    const points = 160;
    ctx.beginPath();
    for (let i = 0; i <= points; i += 1) {
      const t = i / points;
      const bin = Math.floor(t * frequencyData.length * 0.68);
      const amp = ((frequencyData[bin] || 0) / 255) ** 1.25;
      const angle = t * Math.PI * 2 + frame * (0.012 + depth * 0.018) + depth * 8.2;
      const swirl = Math.sin(t * Math.PI * 8 + frame * 0.025 + ring) * amp * size * 0.05 * sensitivity;
      const r = radius + swirl + Math.sin(angle * 3 + frame * 0.01) * features.mid * size * 0.018;
      const squash = 0.74 + depth * 0.22;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r * squash;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const hue = theme.second + depth * 140 + features.treble * 90;
    ctx.strokeStyle = `hsla(${hue}, 86%, ${42 + depth * 28}%, ${0.05 + (1 - depth) * 0.18 + features.energy * 0.1})`;
    ctx.lineWidth = (0.8 + (1 - depth) * 1.5 + features.beat * 1.8) * visualTuning.line;
    ctx.stroke();
  }

  for (let i = 0; i < 18; i += 1) {
    const angle = frame * 0.018 + i * 0.72;
    const amp = (frequencyData[10 + i * 8] || 0) / 255;
    const r1 = hole * (1.2 + amp);
    const r2 = maxRadius * (0.52 + amp * 0.28);
    ctx.strokeStyle = `hsla(${theme.base + i * 11}, 100%, 68%, ${0.06 + amp * 0.22})`;
    ctx.lineWidth = (1 + amp * 3) * visualTuning.line;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1 * 0.74);
    ctx.lineTo(cx + Math.cos(angle + features.mid) * r2, cy + Math.sin(angle + features.mid) * r2 * 0.8);
    ctx.stroke();
  }

  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, hole * 2.6);
  core.addColorStop(0, "rgba(0,0,0,0.96)");
  core.addColorStop(0.52, "rgba(0,0,0,0.86)");
  core.addColorStop(0.78, `hsla(${theme.third}, 90%, 52%, ${0.22 + features.beat * 0.24})`);
  core.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, hole * 2.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `hsla(${theme.third}, 100%, 60%, ${0.36 + features.bass * 0.42})`;
  ctx.lineWidth = (2 + features.beat * 4) * visualTuning.line;
  ctx.beginPath();
  ctx.moveTo(cx - maxRadius * 0.46, cy);
  ctx.lineTo(cx + maxRadius * 0.46, cy);
  ctx.stroke();

  drawPerformanceSilhouette(width, height, 0.52);
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawWireformSculpture(width, height, features) {
  const sensitivity = Number(sensitivityInput.value);
  const cx = width * 0.5;
  const cy = height * 0.48;
  const size = Math.min(width, height);
  const sculptureRadius = size * (0.13 + features.bass * 0.06);

  ctx.save();
  ctx.fillStyle = `rgba(2, 3, 5, ${0.92 - features.energy * 0.18})`;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  const scanAlpha = 0.06 + features.treble * 0.12;
  ctx.strokeStyle = `rgba(255, 255, 255, ${scanAlpha})`;
  ctx.lineWidth = (1) * visualTuning.line;
  for (let y = height * 0.18; y < height * 0.78; y += 13) {
    const drift = Math.sin(y * 0.03 + frame * 0.028) * features.mid * 38;
    ctx.beginPath();
    ctx.moveTo(width * 0.18, y + drift);
    ctx.lineTo(width * 0.82, y - drift * 0.42);
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(frame * 0.006) * 0.24 + features.beat * 0.12);

  for (let layer = 0; layer < 5; layer += 1) {
    const z = 1 + layer * 0.2;
    const phase = frame * (0.01 + layer * 0.002);
    ctx.beginPath();
    for (let i = 0; i <= 220; i += 1) {
      const t = i / 220;
      const angle = t * Math.PI * 2;
      const bin = Math.floor(t * frequencyData.length * 0.7);
      const amp = ((frequencyData[bin] || 0) / 255) ** 1.15;
      const folded = Math.sin(angle * (3 + layer) + phase) * sculptureRadius * 0.32 * (0.2 + amp * sensitivity);
      const twist = Math.cos(angle * 2 - phase * 0.8) * sculptureRadius * 0.22 * features.mid;
      const r = sculptureRadius * z + folded + twist;
      const x = Math.cos(angle + phase * 0.18) * r * (1.35 - layer * 0.06);
      const y = Math.sin(angle - phase * 0.13) * r * (0.72 + layer * 0.04);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + layer * 0.06 + features.energy * 0.22})`;
    ctx.lineWidth = (0.8 + layer * 0.35 + features.beat * 1.4) * visualTuning.line;
    ctx.stroke();
  }

  for (let slice = -6; slice <= 6; slice += 1) {
    const y = slice * sculptureRadius * 0.19 + Math.sin(frame * 0.018 + slice) * features.mid * 22;
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + Math.abs(slice) * 0.012 + features.treble * 0.18})`;
    ctx.lineWidth = (1 + features.beat) * visualTuning.line;
    ctx.beginPath();
    for (let i = 0; i <= 96; i += 1) {
      const t = i / 96;
      const x = (t - 0.5) * sculptureRadius * 3.2;
      const bin = Math.floor(t * frequencyData.length * 0.48);
      const amp = (frequencyData[bin] || 0) / 255;
      const yy = y + Math.sin(t * Math.PI * 5 + frame * 0.025 + slice) * amp * 44 * sensitivity;
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  ctx.restore();

  const panelX = width * 0.5;
  const panelY = height * 0.5;
  const glow = ctx.createRadialGradient(panelX, panelY, 0, panelX, panelY, size * 0.52);
  glow.addColorStop(0, `rgba(255,255,255,${0.04 + features.energy * 0.1})`);
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  drawPerformanceSilhouette(width, height, 0.7);
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawPsyFluid(width, height, features) {
  const sensitivity = Number(sensitivityInput.value);
  const cx = width * 0.5;
  const cy = height * 0.48;
  const size = Math.min(width, height);
  const baseHue = currentTheme === "mono" ? 318 : currentTheme === "ember" ? 344 : 286;
  const secondHue = currentTheme === "ember" ? 18 : 212;

  ctx.save();
  const bg = ctx.createRadialGradient(cx, cy, size * 0.04, cx, cy, size * 0.82);
  bg.addColorStop(0, `hsla(${baseHue}, 70%, 13%, 0.9)`);
  bg.addColorStop(0.42, `hsla(${secondHue}, 72%, 10%, 0.94)`);
  bg.addColorStop(1, "rgba(3, 2, 8, 0.98)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  for (let band = 0; band < 24; band += 1) {
    const depth = band / 23;
    const radius = size * (0.08 + depth * 0.52 + features.bass * 0.04);
    ctx.beginPath();
    for (let i = 0; i <= 160; i += 1) {
      const t = i / 160;
      const angle = t * Math.PI * 2 + frame * (0.006 + depth * 0.012);
      const bin = Math.floor(t * frequencyData.length * 0.62);
      const amp = ((frequencyData[bin] || 0) / 255) ** 1.12;
      const ripple = Math.sin(angle * 4 + frame * 0.028 + band) * size * 0.035 * (features.mid + amp) * sensitivity;
      const tissue = Math.sin(angle * 9 - frame * 0.014) * size * 0.015 * (0.3 + features.treble);
      const r = radius + ripple + tissue;
      const x = cx + Math.cos(angle + depth * 2.2) * r * (1.15 + depth * 0.08);
      const y = cy + Math.sin(angle - depth * 1.7) * r * (0.78 + depth * 0.12);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const hue = baseHue + depth * 86 + features.treble * 40;
    ctx.strokeStyle = `hsla(${hue}, 92%, ${48 + depth * 18}%, ${0.06 + (1 - depth) * 0.14 + features.energy * 0.14})`;
    ctx.lineWidth = (1.1 + features.beat * 1.8 + depth * 1.4) * visualTuning.line;
    ctx.stroke();
  }

  for (const seed of fluidSeeds) {
    const bin = Math.floor(seed.radius * frequencyData.length * 0.55);
    const amp = ((frequencyData[bin] || 0) / 255) ** 1.2;
    const angle = seed.angle + frame * 0.009 * (0.7 + seed.size) + amp * 0.65;
    const radius = size * seed.radius * (0.12 + amp * 0.55 + features.energy * 0.28);
    const x = cx + Math.cos(angle) * radius * 1.45;
    const y = cy + Math.sin(angle) * radius * 0.95;
    const blob = size * (0.025 + seed.size * 0.025 + amp * 0.07);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, blob * 2.8);
    grad.addColorStop(0, `hsla(${baseHue + seed.phase * 50}, 100%, 68%, ${0.12 + amp * 0.34})`);
    grad.addColorStop(0.45, `hsla(${secondHue + amp * 80}, 100%, 58%, ${0.08 + amp * 0.2})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, blob * (1.2 + amp), blob * (0.62 + features.mid), angle, 0, Math.PI * 2);
    ctx.fill();
  }

  const eyeRadius = size * (0.055 + features.bass * 0.04 + features.beat * 0.03);
  const eye = ctx.createRadialGradient(cx, cy, eyeRadius * 0.12, cx, cy, eyeRadius * 3.2);
  eye.addColorStop(0, "rgba(0,0,0,0.95)");
  eye.addColorStop(0.34, `hsla(${secondHue}, 100%, 62%, ${0.2 + features.energy * 0.25})`);
  eye.addColorStop(0.58, `hsla(${baseHue}, 100%, 56%, ${0.1 + features.mid * 0.22})`);
  eye.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = eye;
  ctx.beginPath();
  ctx.arc(cx, cy, eyeRadius * 3.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
  ctx.beginPath();
  ctx.arc(cx, cy, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  drawPerformanceSilhouette(width, height, 0.45);
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawCrystalDrift(width, height, features) {
  const sensitivity = Number(sensitivityInput.value);
  const cx = width * 0.52;
  const cy = height * 0.46;
  const size = Math.min(width, height);
  const pulse = 0.55 + features.energy * 0.55 + features.beat * 0.35;

  ctx.save();
  const bg = ctx.createRadialGradient(cx, cy, size * 0.03, cx, cy, size * 0.95);
  bg.addColorStop(0, `rgba(236, 220, 255, ${0.38 + features.mid * 0.18})`);
  bg.addColorStop(0.34, `rgba(152, 105, 248, ${0.62 + features.energy * 0.08})`);
  bg.addColorStop(0.7, "rgba(55, 37, 210, 0.86)");
  bg.addColorStop(1, "rgba(8, 18, 118, 0.98)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "lighter";

  for (let ribbon = 0; ribbon < 5; ribbon += 1) {
    const side = ribbon < 3 ? 1 : -1;
    const baseX = side > 0 ? width * (0.78 + ribbon * 0.045) : width * (-0.04 + ribbon * 0.035);
    const baseY = height * (0.12 + ribbon * 0.16);
    ctx.beginPath();
    for (let i = 0; i <= 180; i += 1) {
      const t = i / 180;
      const bin = Math.floor((t * 0.58 + ribbon * 0.06) * frequencyData.length);
      const amp = ((frequencyData[bin] || 0) / 255) ** 1.18;
      const wave = Math.sin(t * Math.PI * (2.5 + ribbon * 0.4) + frame * 0.018 + ribbon) * size * 0.12 * (0.32 + amp * sensitivity);
      const sweep = Math.cos(t * Math.PI * 1.6 - frame * 0.01) * size * 0.04 * features.mid;
      const x = baseX + side * (-t * width * 0.56 + wave * 0.48);
      const y = baseY + t * height * 0.88 + wave + sweep;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(150, 255, 153, ${0.1 + features.mid * 0.2})`;
    ctx.lineWidth = (size * (0.03 + ribbon * 0.006 + features.bass * 0.018)) * visualTuning.line;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.strokeStyle = `rgba(239, 255, 206, ${0.22 + features.treble * 0.26})`;
    ctx.lineWidth = (1.2 + features.beat * 2.2) * visualTuning.line;
    ctx.stroke();
  }

  for (const seed of crystalSeeds) {
    const parallax = 1 / seed.z;
    const driftX = Math.sin(frame * 0.006 + seed.phase) * size * 0.05 * parallax;
    const driftY = Math.cos(frame * 0.004 + seed.phase * 1.7) * size * 0.035 * parallax;
    const x = width * seed.x + driftX + Math.sin(frame * 0.002 + seed.phase) * width * 0.06;
    const y = height * seed.y + driftY;
    const bin = Math.floor(seed.x * frequencyData.length * 0.72);
    const amp = ((frequencyData[bin] || 0) / 255) ** 1.25;
    const radius = size * (0.016 + seed.z * 0.018 + amp * 0.05 + features.beat * 0.015);
    const alpha = 0.18 + amp * 0.44 + (1 / seed.z) * 0.12;
    const hue = seed.hue + features.treble * 36;

    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 3.8);
    glow.addColorStop(0, `hsla(${hue}, 100%, 74%, ${alpha * 0.5})`);
    glow.addColorStop(0.48, `hsla(${hue + 38}, 100%, 58%, ${alpha * 0.18})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 3.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(frame * (0.006 + seed.z * 0.001) + seed.phase + amp);
    ctx.scale(1.08 + amp * 0.16, 0.82 + features.mid * 0.18);
    ctx.beginPath();
    for (let i = 0; i < seed.sides; i += 1) {
      const angle = (i / seed.sides) * Math.PI * 2;
      const facet = 0.8 + Math.sin(i * 2.1 + frame * 0.02 + seed.phase) * 0.18;
      const px = Math.cos(angle) * radius * facet;
      const py = Math.sin(angle) * radius * facet;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = `hsla(${hue}, 88%, ${58 + amp * 20}%, ${0.16 + alpha * 0.5})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(246, 255, 230, ${0.34 + amp * 0.34})`;
    ctx.lineWidth = (1 + features.treble * 2) * visualTuning.line;
    ctx.stroke();

    for (let facet = 0; facet < seed.sides; facet += 2) {
      const angle = (facet / seed.sides) * Math.PI * 2 + Math.sin(frame * 0.01 + seed.phase) * 0.18;
      ctx.strokeStyle = `rgba(255, 236, 255, ${0.18 + amp * 0.32})`;
      ctx.lineWidth = (0.7) * visualTuning.line;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * radius * 0.84, Math.sin(angle) * radius * 0.84);
      ctx.stroke();
    }
    ctx.restore();
  }

  for (let i = 0; i < 160; i += 1) {
    const seed = starSeeds[i % starSeeds.length];
    const orbit = (frame * 0.002 + seed.phase) % (Math.PI * 2);
    const x = (seed.x * width + Math.sin(orbit) * width * 0.12 + width) % width;
    const y = (seed.y * height + Math.cos(orbit * 0.7) * height * 0.09 + height) % height;
    const bin = Math.floor(seed.x * frequencyData.length * 0.65);
    const amp = (frequencyData[bin] || 0) / 255;
    const dot = 1.2 + seed.size * 1.1 + amp * 5.5 * sensitivity;
    ctx.fillStyle = `rgba(255, ${220 + amp * 35}, ${130 + amp * 110}, ${0.12 + amp * 0.5 + features.treble * 0.18})`;
    ctx.beginPath();
    ctx.arc(x, y, dot, 0, Math.PI * 2);
    ctx.fill();
  }

  const wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.62);
  wash.addColorStop(0, `rgba(255, 245, 255, ${0.08 + pulse * 0.08})`);
  wash.addColorStop(0.62, `rgba(155, 112, 255, ${0.04 + features.energy * 0.08})`);
  wash.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawSkyChamber(width, height, features) {
  const sensitivity = Number(sensitivityInput.value);
  const cx = width * 0.5;
  const cy = height * 0.42;
  const size = Math.min(width, height);
  const slow = frame * 0.0035;
  const breath = 0.5 + Math.sin(slow) * 0.5;
  const apertureW = size * (0.44 + features.bass * 0.045 + features.beat * 0.018);
  const apertureH = size * (0.23 + features.mid * 0.035 + features.beat * 0.012);
  const hueA = currentTheme === "ember" ? 18 : currentTheme === "mono" ? 38 : 214;
  const hueB = currentTheme === "ember" ? 326 : currentTheme === "mono" ? 54 : 286;
  const hueC = currentTheme === "ember" ? 46 : currentTheme === "mono" ? 218 : 176;

  ctx.save();

  const room = ctx.createRadialGradient(cx, height * 0.7, size * 0.08, cx, height * 0.5, size * 0.9);
  room.addColorStop(0, `hsla(${hueB}, 58%, ${22 + features.energy * 8}%, 1)`);
  room.addColorStop(0.46, `hsla(${hueA}, 54%, ${10 + breath * 5}%, 1)`);
  room.addColorStop(1, "rgba(2, 3, 8, 1)");
  ctx.fillStyle = room;
  ctx.fillRect(0, 0, width, height);

  const wallDepth = 0.16 + features.energy * 0.08;
  ctx.fillStyle = `rgba(255, 255, 255, ${0.018 + features.mid * 0.028})`;
  ctx.beginPath();
  ctx.moveTo(width * 0.08, height);
  ctx.lineTo(width * 0.28, height * 0.28);
  ctx.lineTo(width * 0.72, height * 0.28);
  ctx.lineTo(width * 0.92, height);
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = "lighter";
  const sky = ctx.createRadialGradient(cx, cy, size * 0.02, cx, cy, apertureW * 0.74);
  sky.addColorStop(0, `hsla(${hueC + features.treble * 36}, 100%, ${72 + features.mid * 12}%, ${0.78 + features.energy * 0.08})`);
  sky.addColorStop(0.42, `hsla(${hueB + breath * 22}, 96%, ${58 + features.energy * 12}%, 0.64)`);
  sky.addColorStop(0.78, `hsla(${hueA}, 95%, ${38 + breath * 10}%, 0.48)`);
  sky.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sky;
  ctx.beginPath();
  ctx.ellipse(cx, cy, apertureW, apertureH, 0, 0, Math.PI * 2);
  ctx.fill();

  const rimAlpha = 0.22 + features.treble * 0.2 + features.beat * 0.1;
  for (let i = 0; i < 8; i += 1) {
    const t = i / 7;
    ctx.strokeStyle = `hsla(${hueC + t * 42}, 100%, ${68 + t * 12}%, ${rimAlpha * (1 - t * 0.68)})`;
    ctx.lineWidth = (1.2 + t * 5 + features.beat * 3) * visualTuning.line;
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy + t * size * 0.012,
      apertureW * (1 + t * 0.025 + features.bass * 0.02),
      apertureH * (1 + t * 0.04 + features.mid * 0.02),
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }

  for (let ring = 0; ring < 7; ring += 1) {
    const t = ring / 6;
    const y = cy + apertureH * 1.2 + t * height * 0.38;
    const half = apertureW * (1.15 + t * 0.9);
    const alpha = 0.045 + (1 - t) * 0.08 + features.energy * 0.05;
    ctx.strokeStyle = `hsla(${hueB + t * 28}, 96%, ${62 - t * 20}%, ${alpha})`;
    ctx.lineWidth = (1.2 + features.mid * 2) * visualTuning.line;
    ctx.beginPath();
    ctx.moveTo(cx - half, y);
    ctx.quadraticCurveTo(cx, y + size * (0.035 + features.bass * 0.025), cx + half, y);
    ctx.stroke();
  }

  const beam = ctx.createLinearGradient(cx, cy - apertureH, cx, height);
  beam.addColorStop(0, `hsla(${hueC}, 100%, 76%, ${0.22 + features.energy * 0.16})`);
  beam.addColorStop(0.45, `hsla(${hueB}, 100%, 66%, ${0.08 + features.mid * 0.1})`);
  beam.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(cx - apertureW * (0.54 + features.bass * 0.12), cy + apertureH * 0.15);
  ctx.bezierCurveTo(cx - apertureW * 0.42, height * 0.56, cx - width * wallDepth, height * 0.82, cx - width * 0.18, height);
  ctx.lineTo(cx + width * 0.18, height);
  ctx.bezierCurveTo(cx + width * wallDepth, height * 0.82, cx + apertureW * 0.42, height * 0.56, cx + apertureW * (0.54 + features.bass * 0.12), cy + apertureH * 0.15);
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 5; i += 1) {
    const t = i / 4;
    const drift = Math.sin(frame * 0.006 + i) * size * 0.012 * sensitivity;
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.025 + features.treble * 0.04})`;
    ctx.lineWidth = (1) * visualTuning.line;
    ctx.beginPath();
    ctx.ellipse(cx + drift, cy + t * height * 0.09, apertureW * (0.72 + t * 0.4), apertureH * (0.2 + t * 0.16), 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = `rgba(0, 0, 0, ${0.16 - features.energy * 0.06})`;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawBoilingType(width, height, features) {
  const sensitivity = Number(sensitivityInput.value);
  const size = Math.min(width, height);
  const surfaceY = height * (0.57 + features.bass * 0.035);
  const theme = tunedTheme();
  const heat = 0.42 + features.energy * 0.95 + features.beat * 0.35;
  const waveHeight = size * (0.025 + features.bass * 0.06) * sensitivity;

  ctx.save();
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, `hsla(${theme.base + 190}, 74%, 8%, 1)`);
  bg.addColorStop(0.45, `hsla(${theme.second}, 72%, ${9 + features.mid * 8}%, 1)`);
  bg.addColorStop(1, `hsla(${theme.base}, 92%, ${8 + features.energy * 10}%, 1)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const vapor = ctx.createRadialGradient(width * 0.52, surfaceY, 0, width * 0.52, surfaceY, size * 0.62);
  vapor.addColorStop(0, `rgba(205, 250, 255, ${0.08 + features.energy * 0.16})`);
  vapor.addColorStop(0.45, `rgba(118, 228, 247, ${0.04 + features.mid * 0.08})`);
  vapor.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = vapor;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "lighter";
  for (let band = 0; band < 18; band += 1) {
    const depth = band / 17;
    const y = surfaceY + depth * height * 0.38;
    ctx.beginPath();
    for (let i = 0; i <= 160; i += 1) {
      const t = i / 160;
      const bin = Math.floor(t * frequencyData.length * 0.58);
      const amp = ((frequencyData[bin] || 0) / 255) ** 1.2;
      const ripple = Math.sin(t * Math.PI * (4 + band * 0.23) + frame * (0.018 + depth * 0.025)) * waveHeight * (0.2 + amp + depth * 0.35);
      const x = width * (t - 0.04);
      const yy = y + ripple + Math.sin(frame * 0.012 + band) * features.mid * 18;
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.strokeStyle = `hsla(${theme.base + depth * 76}, 96%, ${58 + depth * 18}%, ${0.055 + (1 - depth) * 0.12 + features.treble * 0.08})`;
    ctx.lineWidth = (1 + depth * 2.4 + features.beat * 2) * visualTuning.line;
    ctx.stroke();
  }

  for (const bubble of boilingBubbles) {
    const travel = (frame * (0.0025 + bubble.z * 0.0018) + bubble.phase) % 1;
    const x = bubble.x * width + Math.sin(frame * 0.018 + bubble.phase) * size * 0.035;
    const y = surfaceY + height * 0.4 - travel * height * (0.52 + features.bass * 0.18);
    const r = bubble.radius * (1.5 + bubble.z) + features.treble * 8 + features.beat * 2;
    const alpha = 0.08 + (1 - travel) * 0.16 + features.treble * 0.2;
    ctx.strokeStyle = `rgba(210, 250, 255, ${alpha})`;
    ctx.lineWidth = (0.8 + features.treble * 1.2) * visualTuning.line;
    ctx.beginPath();
    ctx.ellipse(x, y, r * (0.8 + bubble.z * 0.18), r * 1.18, Math.sin(frame * 0.01 + bubble.phase) * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    if (travel > 0.82) {
      ctx.fillStyle = `rgba(255, 255, 255, ${(travel - 0.82) * 0.45})`;
      ctx.beginPath();
      ctx.arc(x, surfaceY + Math.sin(frame * 0.03 + bubble.phase) * 8, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const letterFont = Math.min(96, Math.max(42, width / 12));
  const tracking = letterFont * 0.62;
  const totalWidth = boilingLetters.reduce((sum, letter) => sum + (letter === " " ? tracking * 0.85 : tracking), 0);
  let cursor = width * 0.5 - totalWidth * 0.5;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${letterFont}px Inter, ui-sans-serif, system-ui, sans-serif`;

  boilingLetters.forEach((letter, index) => {
    const isSpace = letter === " ";
    const step = isSpace ? tracking * 0.85 : tracking;
    const x = cursor + step * 0.5;
    cursor += step;
    if (isSpace) return;

    const bin = Math.floor((index / boilingLetters.length) * frequencyData.length * 0.62);
    const amp = ((frequencyData[bin] || 0) / 255) ** 1.08;
    const bob = Math.sin(frame * 0.028 + index * 0.9) * size * 0.018 + amp * size * 0.055 * sensitivity;
    const y = surfaceY - size * 0.1 + bob + Math.sin(frame * 0.011 + index) * features.mid * 32;
    const skew = Math.sin(frame * 0.016 + index * 1.4) * 0.13;
    const tilt = Math.sin(frame * 0.01 + index * 0.8) * 0.08;

    ctx.save();
    ctx.translate(x, y);
    ctx.transform(1, tilt, skew, 1, 0, 0);
    ctx.fillStyle = `rgba(2, 10, 16, ${0.36 + heat * 0.18})`;
    ctx.fillText(letter, 8 + features.beat * 3, 10 + features.beat * 4);
    ctx.strokeStyle = `hsla(${theme.third + amp * 70}, 100%, 76%, ${0.22 + amp * 0.34})`;
    ctx.lineWidth = (2 + amp * 3) * visualTuning.line;
    ctx.strokeText(letter, 0, 0);
    const face = ctx.createLinearGradient(0, -letterFont * 0.55, 0, letterFont * 0.55);
    face.addColorStop(0, `hsla(${theme.base + 178}, 100%, ${82 + amp * 10}%, ${0.84 + amp * 0.12})`);
    face.addColorStop(0.55, `hsla(${theme.second}, 92%, ${62 + amp * 12}%, ${0.74 + amp * 0.18})`);
    face.addColorStop(1, `hsla(${theme.base}, 94%, 48%, ${0.68 + amp * 0.18})`);
    ctx.fillStyle = face;
    ctx.fillText(letter, 0, 0);
    ctx.restore();
  });

  ctx.globalCompositeOperation = "screen";
  const waterMask = ctx.createLinearGradient(0, surfaceY - size * 0.06, 0, height);
  waterMask.addColorStop(0, `rgba(218, 255, 255, ${0.22 + features.energy * 0.18})`);
  waterMask.addColorStop(0.22, `rgba(80, 220, 255, ${0.1 + features.mid * 0.14})`);
  waterMask.addColorStop(1, "rgba(0, 16, 44, 0.7)");
  ctx.fillStyle = waterMask;
  ctx.beginPath();
  ctx.moveTo(0, surfaceY);
  for (let i = 0; i <= 120; i += 1) {
    const t = i / 120;
    const bin = Math.floor(t * frequencyData.length * 0.55);
    const amp = (frequencyData[bin] || 0) / 255;
    const y = surfaceY + Math.sin(t * Math.PI * 5 + frame * 0.035) * waveHeight * (0.25 + amp);
    ctx.lineTo(t * width, y);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  if (features.energy > 0.06 && boilingDroplets.length < 42 && Math.random() < 0.22 + features.bass * 0.36) {
    boilingDroplets.push({
      x: Math.random() * width,
      y: surfaceY + Math.random() * 24,
      vx: (Math.random() - 0.5) * (1.5 + features.mid * 5),
      vy: -(2.5 + Math.random() * 6 + features.bass * 9),
      radius: 1.6 + Math.random() * 4 + features.treble * 5,
      life: 42 + Math.random() * 28,
    });
  }

  boilingDroplets = boilingDroplets
    .map((drop) => ({
      ...drop,
      x: drop.x + drop.vx,
      y: drop.y + drop.vy,
      vy: drop.vy + 0.18,
      life: drop.life - 1,
    }))
    .filter((drop) => drop.life > 0 && drop.y < height + 30);

  for (const drop of boilingDroplets) {
    ctx.fillStyle = `rgba(230, 255, 255, ${Math.max(0, drop.life / 70) * 0.55})`;
    ctx.beginPath();
    ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function render() {
  frame += visualTuning.speed;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const features = tunedFeatures(audioFeatures());
  const isWebglMode = currentMode === "erosion";

  document.body.classList.toggle("webgl-mode", isWebglMode);

  if (isWebglMode) {
    ctx.clearRect(0, 0, width, height);
    drawErosionFlow(features);
    requestAnimationFrame(render);
    return;
  }

  clearStage(width, height, features);
  applyCanvasTuning(width, height);

  if (currentMode === "ring") drawRing(width, height, features);
  if (currentMode === "tunnel") drawTunnel(width, height, features);
  if (currentMode === "curtain") drawCurtain(width, height, features);
  if (currentMode === "terrain") drawTerrain(width, height, features);
  if (currentMode === "laser") drawLaserCathedral(width, height, features);
  if (currentMode === "scanner") drawLightScanner(width, height, features);
  if (currentMode === "vortex") drawSonicVortex(width, height, features);
  if (currentMode === "wireform") drawWireformSculpture(width, height, features);
  if (currentMode === "psyfluid") drawPsyFluid(width, height, features);
  if (currentMode === "crystal") drawCrystalDrift(width, height, features);
  if (currentMode === "skychamber") drawSkyChamber(width, height, features);
  if (currentMode === "boiling") drawBoilingType(width, height, features);

  ctx.restore();
  ctx.filter = "none";

  requestAnimationFrame(render);
}

function resetDownload() {
  if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
  recordedVideoUrl = "";
  downloadButton.hidden = true;
}

function setAudioSource(src, label, isRemote = false) {
  if (localAudioUrl && localAudioUrl !== src) {
    URL.revokeObjectURL(localAudioUrl);
    localAudioUrl = "";
  }

  audio.pause();
  audio.removeAttribute("src");
  if (isRemote) audio.crossOrigin = "anonymous";
  else audio.removeAttribute("crossorigin");
  audio.src = src;
  audio.load();
  localAudioUrl = isRemote ? "" : src;
  trackName.textContent = label;
  trackName.dataset.customTrack = "true";
  emptyState.hidden = true;
  recordButton.disabled = false;
  knownDuration = 0;
  seekInput.value = "0";
  seekInput.disabled = true;
  currentTimeLabel.textContent = "0:00";
  durationLabel.textContent = "0:00";
  resetDownload();
}

function isPlatformPageUrl(url) {
  return /(?:youtube\.com|youtu\.be|bilibili\.com|b23\.tv)/i.test(url);
}

function looksLikeDirectAudioUrl(url) {
  return /\.(mp3|wav|ogg|oga|m4a|aac|flac)(?:[?#].*)?$/i.test(url);
}

function apiBaseUrl() {
  if (window.SEE_MUSIC_API_BASE) return window.SEE_MUSIC_API_BASE;
  if (location.protocol === "http:" || location.protocol === "https:") return location.origin;
  return "http://localhost:4177";
}

function isStaticHostedPage() {
  return /(?:^|\.)github\.io$/i.test(location.hostname);
}

async function loadVideoPageUrl(pageUrl) {
  if (isStaticHostedPage() && apiBaseUrl() === location.origin) {
    setStatus("staticResolverUnavailable");
    return;
  }

  const endpoint = `${apiBaseUrl()}/api/resolve?url=${encodeURIComponent(pageUrl)}`;
  setStatus("resolving");

  let response;
  try {
    response = await fetch(endpoint);
  } catch {
    setStatus("serviceMissing");
    return;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    statusText.textContent = payload.error || t("resolveFailed");
    return;
  }

  const streamUrl = new URL(payload.streamUrl, apiBaseUrl()).href;
  setAudioSource(streamUrl, payload.title || "视频音频", true);
  if (Number.isFinite(payload.duration) && payload.duration > 0) {
    knownDuration = payload.duration;
    seekInput.disabled = false;
    durationLabel.textContent = formatTime(knownDuration);
  }
  setStatus("resolved");
}

async function loadAudioUrl() {
  const rawUrl = urlInput.value.trim();

  if (!rawUrl) {
    setStatus("pasteUrl");
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    setStatus("badUrl");
    return;
  }

  if (isPlatformPageUrl(parsedUrl.href)) {
    await loadVideoPageUrl(parsedUrl.href);
    return;
  }

  if (!looksLikeDirectAudioUrl(parsedUrl.href)) {
    await loadVideoPageUrl(parsedUrl.href);
    return;
  }

  setAudioSource(parsedUrl.href, parsedUrl.hostname, true);
  setStatus("directLoaded");
}

async function downloadRecordedVideo() {
  if (!recordedVideoUrl) {
    setStatus("noVideo");
    return;
  }

  const response = await fetch(recordedVideoUrl);
  const blob = await response.blob();
  const fileName = `music-visualizer-${Date.now()}.webm`;

  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: "WebM Video", accept: { "video/webm": [".webm"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      setStatus("saved");
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        setStatus("saveCancelled");
        return;
      }
    }
  }

  const link = document.createElement("a");
  link.href = recordedVideoUrl;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    if (!document.hasFocus()) return;
    window.open(recordedVideoUrl, "_blank", "noopener");
  }, 400);

  setStatus("downloadTriggered");
}

function setImmersiveMode(enabled) {
  isImmersive = enabled;
  document.body.classList.toggle("immersive-mode", enabled);
  immersiveButton.setAttribute("aria-pressed", String(enabled));
  immersiveButton.textContent = enabled ? t("exit") : t("immersive");
  exitImmersiveButton.hidden = !enabled;

  if (enabled) {
    window.clearTimeout(revealTimer);
    document.body.classList.remove("controls-peek");
  }
}

function peekControls() {
  if (!isImmersive) return;

  document.body.classList.add("controls-peek");
  window.clearTimeout(revealTimer);
  revealTimer = window.setTimeout(() => {
    document.body.classList.remove("controls-peek");
  }, 1800);
}

function loadLocalAudioFile(file) {
  if (!file?.type?.startsWith("audio/")) {
    setStatus("badDrop");
    return;
  }

  const url = URL.createObjectURL(file);
  setAudioSource(url, file.name);
  setStatus("localLoaded");
}

function hasDraggedFiles(event) {
  return Array.from(event.dataTransfer?.types || []).includes("Files");
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  loadLocalAudioFile(file);
});

window.addEventListener("dragenter", (event) => {
  if (!hasDraggedFiles(event)) return;
  event.preventDefault();
  dragDepth += 1;
  document.body.classList.add("dragging-audio");
  setStatus("dragAudio");
});

window.addEventListener("dragover", (event) => {
  if (!hasDraggedFiles(event)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});

window.addEventListener("dragleave", (event) => {
  if (!hasDraggedFiles(event)) return;
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) {
    document.body.classList.remove("dragging-audio");
    if (!audio.src) setStatus("ready");
  }
});

window.addEventListener("drop", (event) => {
  if (!hasDraggedFiles(event)) return;
  event.preventDefault();
  dragDepth = 0;
  document.body.classList.remove("dragging-audio");
  const file = Array.from(event.dataTransfer.files).find((item) => item.type.startsWith("audio/"));
  loadLocalAudioFile(file);
});

loadUrlButton.addEventListener("click", loadAudioUrl);

urlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadAudioUrl();
});

audio.addEventListener("error", () => {
  setStatus("audioError");
});

audio.addEventListener("loadedmetadata", () => {
  const hasDuration = Number.isFinite(audio.duration) && audio.duration > 0;
  if (hasDuration) knownDuration = audio.duration;
  seekInput.disabled = !(knownDuration > 0);
  durationLabel.textContent = formatTime(knownDuration || audio.duration);
});

audio.addEventListener("durationchange", () => {
  const hasDuration = Number.isFinite(audio.duration) && audio.duration > 0;
  if (hasDuration) knownDuration = audio.duration;
  seekInput.disabled = !(knownDuration > 0);
  durationLabel.textContent = formatTime(knownDuration || audio.duration);
});

audio.addEventListener("timeupdate", () => {
  const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : knownDuration;
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  if (!isSeeking && duration > 0) {
    seekInput.value = String(Math.round((audio.currentTime / duration) * 1000));
  }
});

seekInput.addEventListener("input", () => {
  isSeeking = true;
  const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : knownDuration;
  if (duration > 0) {
    const nextTime = (Number(seekInput.value) / 1000) * duration;
    currentTimeLabel.textContent = formatTime(nextTime);
  }
});

seekInput.addEventListener("change", () => {
  const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : knownDuration;
  if (duration > 0) {
    audio.currentTime = (Number(seekInput.value) / 1000) * duration;
  }
  isSeeking = false;
});

audio.addEventListener("play", async () => {
  setupAudioGraph();
  if (audioContext.state === "suspended") await audioContext.resume();
  setStatus("visualizing");
});

audio.addEventListener("pause", () => {
  if (!audio.ended) setStatus("paused");
});

audio.addEventListener("ended", () => {
  setStatus("ended");
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentMode = button.dataset.mode;
    renderTuningPanel();
    document.body.classList.toggle("webgl-mode", currentMode === "erosion");
    if (currentMode === "erosion") resetErosionFeedback();
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    themeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentTheme = button.dataset.theme;
    resetErosionFeedback();
  });
});

resetTuningButton.addEventListener("click", (event) => {
  event.preventDefault();
  resetVisualTuning();
});

recordButton.addEventListener("click", () => {
  if (recorder?.state === "recording") {
    recorder.requestData();
    recorder.stop();
    recordButton.textContent = t("startRecording");
    return;
  }

  const captureCanvas = currentMode === "erosion" ? webglCanvas : canvas;

  if (!window.MediaRecorder || !captureCanvas.captureStream) {
    setStatus("unsupportedRecord");
    return;
  }

  const canvasStream = captureCanvas.captureStream(30);
  const audioStream = audio.captureStream ? audio.captureStream() : null;
  const tracks = [...canvasStream.getVideoTracks(), ...(audioStream ? audioStream.getAudioTracks() : [])];
  const mixedStream = new MediaStream(tracks);
  recordedChunks = [];
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
    ? "video/webm;codecs=vp9,opus"
    : "video/webm";
  recordedMimeType = mimeType;
  recorder = new MediaRecorder(mixedStream, { mimeType });

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) recordedChunks.push(event.data);
  });

  recorder.addEventListener("stop", () => {
    if (!recordedChunks.length) {
      resetDownload();
      setStatus("emptyRecording");
      return;
    }

    const blob = new Blob(recordedChunks, { type: recordedMimeType });
    resetDownload();
    recordedVideoUrl = URL.createObjectURL(blob);
    downloadButton.hidden = false;
    setStatus(audioStream ? "recordingDoneAudio" : "recordingDoneVideo");
  });

  recorder.start();
  recordButton.textContent = t("stopRecording");
  setStatus("recording");
});

downloadButton.addEventListener("click", downloadRecordedVideo);

immersiveButton.addEventListener("click", () => {
  setImmersiveMode(!isImmersive);
});

exitImmersiveButton.addEventListener("click", () => {
  setImmersiveMode(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isImmersive) setImmersiveMode(false);
});

document.addEventListener("pointermove", peekControls);

languageButton.addEventListener("click", () => {
  applyLanguage(currentLanguage === "zh" ? "en" : "zh");
});

window.addEventListener("resize", () => {
  resizeCanvas();
});

resizeCanvas();
applyLanguage("zh");
render();
