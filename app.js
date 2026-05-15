const canvas = document.querySelector("#visualizer");
const ctx = canvas.getContext("2d");
const webglCanvas = document.querySelector("#webglVisualizer");
const audio = document.querySelector("#audio");
const fileInput = document.querySelector("#fileInput");
const urlInput = document.querySelector("#urlInput");
const visualTextInput = document.querySelector("#visualTextInput");
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
    visualTextPlaceholder: "输入视觉文字，例如：看见音乐之美",
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
    modeTypeFlow: "字浪流体",
    modeErosion: "侵蚀流域",
    modeSeascape: "海面光景",
    modeSunWater: "柔浪日海",
    modeCoastal: "海岸风景",
    modeCatDivision: "猫影分割",
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
    defaultVisualText: "看见音乐之美",
  },
  en: {
    brand: "See Music",
    heroTitle: "See the Beauty of Music",
    chooseMusic: "Choose Music",
    urlPlaceholder: "Paste an audio or video link",
    visualTextPlaceholder: "Enter visual text, e.g. See the Beauty of Music",
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
    modeTypeFlow: "Type Tide",
    modeErosion: "Erosion Flow",
    modeSeascape: "Sea Light",
    modeSunWater: "Sunlit Water",
    modeCoastal: "Coastal Landscape",
    modeCatDivision: "Cat Division",
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
    defaultVisualText: "See the Beauty of Music",
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
const typeFlowDust = Array.from({ length: 150 }, (_, index) => ({
  x: (Math.sin(index * 47.23) * 0.5 + 0.5) % 1,
  y: (Math.sin(index * 91.17 + 1.7) * 0.5 + 0.5) % 1,
  size: 0.45 + ((index * 19) % 13) / 8,
  phase: index * 0.57,
}));

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
let seascapeState;
let sunWaterState;
let coastalState;
let catDivisionState;
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
  typeflow: [
    { key: "size", zh: "文字尺度", en: "Type Scale", min: 0.65, max: 1.7, step: 0.05 },
    { key: "density", zh: "碎片密度", en: "Fragment Density", min: 0.35, max: 2.2, step: 0.05 },
    { key: "line", zh: "描边粗细", en: "Outline Width", min: 0.4, max: 2.4, step: 0.05 },
    { key: "gradient", zh: "折射渐变", en: "Refraction Gradient", min: 0.4, max: 1.9, step: 0.05 },
    { key: "saturation", zh: "文字色彩", en: "Type Color", min: 0.35, max: 1.9, step: 0.05 },
    { key: "sharpness", zh: "碎裂锐度", en: "Shard Sharpness", min: 0.35, max: 1.9, step: 0.05 },
    { key: "speed", zh: "漂浮速度", en: "Float Speed", min: 0.2, max: 2.4, step: 0.05 },
    { key: "vibration", zh: "字浪律动", en: "Type Tide", min: 0, max: 2.4, step: 0.05 },
    { key: "hue", zh: "文字色相", en: "Type Hue", min: -180, max: 180, step: 5 },
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
  seascape: [
    { key: "size", zh: "镜头距离", en: "Camera Distance", min: 0.65, max: 1.65, step: 0.05 },
    { key: "density", zh: "浪纹细节", en: "Wave Detail", min: 0.45, max: 2.2, step: 0.05 },
    { key: "line", zh: "浪尖锐度", en: "Wave Choppiness", min: 0.45, max: 2.5, step: 0.05 },
    { key: "gradient", zh: "天空渐变", en: "Sky Gradient", min: 0.4, max: 1.8, step: 0.05 },
    { key: "saturation", zh: "海水色彩", en: "Water Color", min: 0.35, max: 1.8, step: 0.05 },
    { key: "sharpness", zh: "反光锐度", en: "Specular Sharpness", min: 0.35, max: 1.8, step: 0.05 },
    { key: "vibration", zh: "浪高律动", en: "Wave Energy", min: 0, max: 2.4, step: 0.05 },
    { key: "hue", zh: "海面色相", en: "Sea Hue", min: -180, max: 180, step: 5 },
  ],
  sunwater: [
    { key: "size", zh: "镜头亲近", en: "Camera Closeness", min: 0.65, max: 1.55, step: 0.05 },
    { key: "density", zh: "细浪层次", en: "Ripple Layers", min: 0.45, max: 2.1, step: 0.05 },
    { key: "line", zh: "水面牵引", en: "Wave Drag", min: 0.35, max: 2.0, step: 0.05 },
    { key: "gradient", zh: "日光高度", en: "Sun Height", min: 0.35, max: 1.65, step: 0.05 },
    { key: "saturation", zh: "海水浓度", en: "Water Saturation", min: 0.35, max: 1.6, step: 0.05 },
    { key: "sharpness", zh: "闪光柔度", en: "Glint Softness", min: 0.35, max: 1.6, step: 0.05 },
    { key: "vibration", zh: "浪涛律动", en: "Wave Rhythm", min: 0, max: 1.8, step: 0.05 },
    { key: "hue", zh: "晨昏色相", en: "Dawn Hue", min: -180, max: 180, step: 5 },
  ],
  coastal: [
    { key: "size", zh: "景别尺度", en: "Scene Scale", min: 0.7, max: 1.6, step: 0.05 },
    { key: "density", zh: "分段密度", en: "Mosaic Density", min: 0.45, max: 2.1, step: 0.05 },
    { key: "line", zh: "笔触粗细", en: "Stroke Width", min: 0.45, max: 2.2, step: 0.05 },
    { key: "gradient", zh: "天空色带", en: "Sky Palette", min: 0.35, max: 1.8, step: 0.05 },
    { key: "saturation", zh: "风景色彩", en: "Landscape Color", min: 0.35, max: 1.7, step: 0.05 },
    { key: "sharpness", zh: "拼贴锐度", en: "Mosaic Edge", min: 0.35, max: 1.7, step: 0.05 },
    { key: "vibration", zh: "海风律动", en: "Coastal Breeze", min: 0, max: 1.9, step: 0.05 },
    { key: "hue", zh: "季节色相", en: "Season Hue", min: -180, max: 180, step: 5 },
  ],
  catdivision: [
    { key: "size", zh: "构图尺度", en: "Composition Scale", min: 0.75, max: 1.55, step: 0.05 },
    { key: "density", zh: "分割层数", en: "Division Rows", min: 0.45, max: 2.0, step: 0.05 },
    { key: "line", zh: "线条厚度", en: "Line Weight", min: 0.45, max: 2.2, step: 0.05 },
    { key: "gradient", zh: "明暗反差", en: "Contrast", min: 0.35, max: 1.8, step: 0.05 },
    { key: "saturation", zh: "黑白纯度", en: "Monochrome Purity", min: 0.35, max: 1.5, step: 0.05 },
    { key: "sharpness", zh: "边缘锐度", en: "Edge Sharpness", min: 0.35, max: 1.8, step: 0.05 },
    { key: "vibration", zh: "猫影律动", en: "Cat Rhythm", min: 0, max: 1.9, step: 0.05 },
    { key: "hue", zh: "纸面色相", en: "Paper Tint", min: -180, max: 180, step: 5 },
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
    beat: Math.min(1.8, features.beat * (0.5 + vibration * 0.5)),
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
  const gl = webglState?.gl || seascapeState?.gl || sunWaterState?.gl || coastalState?.gl || catDivisionState?.gl;
  if (gl) {
    gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
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

void main() {
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
uniform float u_scale;
uniform float u_density;
uniform float u_gradient;
uniform float u_saturation;
uniform float u_sharpness;
uniform float u_line;

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
  float contours = 1.0 - smoothstep(0.0, (0.04 + u_mid * 0.02) / max(u_line, 0.2), abs(fract(h * (7.0 * u_density + pulse * 5.0)) - 0.5));
  float sediment = fbm(p * ((7.5 + pulse * 2.0) * u_density) + vec2(sin(u_time * 0.24), cos(u_time * 0.18)) * 0.18);
  float grain = hash(gl_FragCoord.xy + floor(u_time * 30.0)) - 0.5;

  vec3 deep = hsv2rgb(vec3(u_theme.x + 0.48 * u_gradient, 0.72, 0.08 + u_energy * 0.05));
  vec3 silt = hsv2rgb(vec3(u_theme.y, 0.66, 0.22 + h * 0.24 + u_bass * 0.12));
  vec3 ridge = hsv2rgb(vec3(u_theme.z, 0.86, 0.62 + u_treble * 0.2));
  vec3 water = hsv2rgb(vec3(u_theme.x, 0.82, 0.48 + u_mid * 0.2));

  vec3 color = mix(deep, silt, smoothstep(-0.15, 0.78, h));
  color = mix(color, ridge, smoothstep(0.52, 0.9, h) * (0.28 + shade * 0.34));
  color = mix(color, water, channels * (0.46 + pulse * 0.28));
  color += ridge * contours * (0.1 + u_treble * 0.2 + pulse * 0.1);
  color += water * pow(channels, 2.0) * (0.12 + pulse * 0.18 + u_beat * 0.18);
  color *= 0.58 + shade * 0.72;
  color += sediment * 0.035 + grain * (0.025 + u_treble * 0.04);
  color += vec3(1.0, 0.88, 0.62) * u_beat * 0.12;
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, u_saturation);
  color = mix(vec3(0.5), color, u_sharpness);

  float vignette = smoothstep(1.55, 0.18, length(uv - 0.5));
  color *= 0.38 + vignette * 0.9;
  gl_FragColor = vec4(color, 1.0);
}
`;

const seascapeFragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_energy;
uniform float u_beat;
uniform vec3 u_theme;
uniform float u_scale;
uniform float u_density;
uniform float u_gradient;
uniform float u_saturation;
uniform float u_sharpness;
uniform float u_line;

const int TRACE_STEPS = 28;
const float PI = 3.14159265359;
const mat2 OCTAVE_M = mat2(1.62, 1.18, -1.18, 1.62);

mat3 fromEuler(vec3 ang) {
  vec2 a1 = vec2(sin(ang.x), cos(ang.x));
  vec2 a2 = vec2(sin(ang.y), cos(ang.y));
  vec2 a3 = vec2(sin(ang.z), cos(ang.z));
  mat3 m;
  m[0] = vec3(a1.y * a3.y + a1.x * a2.x * a3.x, a1.y * a2.x * a3.x + a3.y * a1.x, -a2.y * a3.x);
  m[1] = vec3(-a2.y * a1.x, a1.y * a2.y, a2.x);
  m[2] = vec3(a3.y * a1.x * a2.x + a1.y * a3.x, a1.x * a3.x - a1.y * a3.y * a2.x, a2.y * a3.y);
  return m;
}

float hash(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return -1.0 + 2.0 * mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
}

float diffuse(vec3 n, vec3 l, float p) {
  return pow(dot(n, l) * 0.4 + 0.6, p);
}

float specular(vec3 n, vec3 l, vec3 e, float s) {
  float nrm = (s + 8.0) / (PI * 8.0);
  return pow(max(dot(reflect(e, n), l), 0.0), s) * nrm;
}

vec3 skyColor(vec3 e) {
  float y = (max(e.y, 0.0) * 0.75 + 0.2) * (0.75 + u_gradient * 0.16);
  vec3 dawn = hsv2rgb(vec3(u_theme.z, 0.36 + u_mid * 0.18, 0.5));
  vec3 zenith = hsv2rgb(vec3(u_theme.x + 0.08, 0.42, 0.1 + u_energy * 0.04));
  vec3 horizon = hsv2rgb(vec3(u_theme.y, 0.5, 0.72 + u_beat * 0.08));
  vec3 color = mix(horizon, zenith, smoothstep(0.08, 1.0, y));
  color = mix(color, dawn, pow(1.0 - y, 2.0) * 0.48 * u_gradient);
  return color;
}

float seaOctave(vec2 uv, float choppy) {
  uv += noise(uv);
  vec2 wv = 1.0 - abs(sin(uv));
  vec2 swv = abs(cos(uv));
  wv = mix(wv, swv, wv);
  return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
}

float seaHeight(vec3 p, int detail) {
  float freq = 0.135 * max(u_density, 0.2);
  float amp = 0.42 + u_bass * 0.36 + u_energy * 0.12;
  float choppy = 1.8 + u_line * 2.35 + u_treble * 1.1;
  float seaTime = 1.0 + u_time * (0.62 + u_mid * 0.35);
  vec2 uv = p.xz;
  uv.x *= 0.78;

  float h = 0.0;
  for (int i = 0; i < 5; i++) {
    if (i >= detail) break;
    float d = seaOctave((uv + seaTime) * freq, choppy);
    d += seaOctave((uv - seaTime * 0.92) * freq, choppy);
    h += d * amp;
    uv = OCTAVE_M * uv;
    freq *= 1.88;
    amp *= 0.23;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return h;
}

float mapSea(vec3 p) {
  return p.y - seaHeight(p, 3);
}

float mapSeaDetailed(vec3 p) {
  return p.y - seaHeight(p, 5);
}

vec3 seaNormal(vec3 p, float eps) {
  vec3 n;
  n.y = mapSeaDetailed(p);
  n.x = mapSeaDetailed(vec3(p.x + eps, p.y, p.z)) - n.y;
  n.z = mapSeaDetailed(vec3(p.x, p.y, p.z + eps)) - n.y;
  n.y = eps;
  return normalize(n);
}

float traceHeight(vec3 ori, vec3 dir, out vec3 p) {
  float tm = 0.0;
  float tx = 800.0;
  float hx = mapSea(ori + dir * tx);
  if (hx > 0.0) {
    p = ori + dir * tx;
    return tx;
  }
  float hm = mapSea(ori);
  for (int i = 0; i < TRACE_STEPS; i++) {
    float tmid = mix(tm, tx, hm / (hm - hx));
    p = ori + dir * tmid;
    float hmid = mapSea(p);
    if (hmid < 0.0) {
      tx = tmid;
      hx = hmid;
    } else {
      tm = tmid;
      hm = hmid;
    }
    if (abs(hmid) < 0.001) break;
  }
  return mix(tm, tx, hm / (hm - hx));
}

vec3 seaColor(vec3 p, vec3 n, vec3 light, vec3 eye, vec3 dist) {
  float fresnel = clamp(1.0 - dot(n, -eye), 0.0, 1.0);
  fresnel = min(fresnel * fresnel * fresnel, 0.55);

  vec3 reflected = skyColor(reflect(eye, n));
  vec3 deep = hsv2rgb(vec3(u_theme.x + 0.04, 0.72, 0.08 + u_energy * 0.04));
  vec3 foam = hsv2rgb(vec3(u_theme.z, 0.42, 0.58 + u_treble * 0.18));
  vec3 water = deep + diffuse(n, light, 72.0) * foam * 0.12;
  vec3 color = mix(water, reflected, fresnel);

  float atten = max(1.0 - dot(dist, dist) * 0.001, 0.0);
  color += foam * (p.y - 0.45) * 0.16 * atten;
  color += foam * specular(n, light, eye, 320.0 * u_sharpness * inversesqrt(max(dot(dist, dist), 0.01))) * (0.55 + u_beat * 0.45);
  return color;
}

vec3 renderPixel(vec2 coord) {
  vec2 uv = coord / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;
  uv /= max(u_scale, 0.25);

  float cameraBeat = u_beat * 0.035;
  float time = u_time * 0.28;
  vec3 ang = vec3(
    sin(time * 3.0) * 0.05 + cameraBeat,
    sin(time) * 0.1 + 0.24 + u_mid * 0.05,
    time + u_bass * 0.04
  );
  vec3 ori = vec3(0.0, 3.2 + u_bass * 0.6, u_time * (3.0 + u_mid * 1.6));
  vec3 dir = normalize(vec3(uv.xy, -2.05));
  dir.z += length(uv) * (0.09 + u_energy * 0.04);
  dir = normalize(fromEuler(ang) * dir);

  vec3 p;
  traceHeight(ori, dir, p);
  vec3 dist = p - ori;
  vec3 n = seaNormal(p, dot(dist, dist) * (0.08 / max(u_resolution.x, 1.0)));
  vec3 light = normalize(vec3(-0.18, 1.0, 0.72));
  float horizon = pow(smoothstep(0.0, -0.02, dir.y), 0.2);
  return mix(skyColor(dir), seaColor(p, n, light, dir, dist), horizon);
}

void main() {
  vec3 color = renderPixel(gl_FragCoord.xy);
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, u_saturation);
  color = mix(vec3(0.5), color, 0.72 + u_sharpness * 0.22);
  color = color / (color + vec3(0.74));
  color = pow(max(color, vec3(0.0)), vec3(0.72));
  gl_FragColor = vec4(color, 1.0);
}
`;

// Adapted from user-provided Shadertoy code by afl_ext (2017-2024), MIT License.
const sunWaterFragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_energy;
uniform float u_beat;
uniform vec3 u_theme;
uniform float u_scale;
uniform float u_density;
uniform float u_gradient;
uniform float u_saturation;
uniform float u_sharpness;
uniform float u_line;

mat3 rotationAxisAngle(vec3 axis, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat3(
    oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c
  );
}

vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
}

vec2 waveDx(vec2 position, vec2 direction, float frequency, float timeShift) {
  float x = dot(direction, position) * frequency + timeShift;
  float wave = exp(sin(x) - 1.0);
  float dx = wave * cos(x);
  return vec2(wave, -dx);
}

float getWaves(vec2 position, int iterations) {
  float phaseShift = length(position) * 0.08;
  float iter = 0.0;
  float frequency = 1.0 + u_treble * 0.16;
  float timeMultiplier = 1.55 + u_mid * 0.28;
  float weight = 1.0;
  float valueSum = 0.0;
  float weightSum = 0.0;
  float drag = 0.08 + u_line * 0.12;
  float detailBoost = max(u_density, 0.2);

  for (int i = 0; i < 36; i++) {
    if (i >= iterations) break;
    vec2 direction = vec2(sin(iter), cos(iter));
    vec2 res = waveDx(position, direction, frequency * detailBoost, u_time * timeMultiplier + phaseShift);
    position += direction * res.y * weight * drag;
    valueSum += res.x * weight;
    weightSum += weight;
    weight = mix(weight, 0.0, 0.2);
    frequency *= 1.18;
    timeMultiplier *= 1.055;
    iter += 1232.399963;
  }

  return valueSum / max(weightSum, 0.001);
}

float intersectPlane(vec3 origin, vec3 direction, vec3 point, vec3 normal) {
  return clamp(dot(point - origin, normal) / dot(direction, normal), -1.0, 9991999.0);
}

float raymarchWater(vec3 camera, vec3 start, vec3 end, float depth) {
  vec3 pos = start;
  vec3 dir = normalize(end - start);
  for (int i = 0; i < 54; i++) {
    float height = getWaves(pos.xz, 12) * depth - depth;
    if (height + 0.01 > pos.y) {
      return distance(pos, camera);
    }
    pos += dir * (pos.y - height);
  }
  return distance(start, camera);
}

vec3 waterNormal(vec2 pos, float e, float depth) {
  vec2 ex = vec2(e, 0.0);
  float h = getWaves(pos.xy, 30) * depth;
  vec3 a = vec3(pos.x, h, pos.y);
  return normalize(
    cross(
      a - vec3(pos.x - e, getWaves(pos.xy - ex.xy, 30) * depth, pos.y),
      a - vec3(pos.x, getWaves(pos.xy + ex.yx, 30) * depth, pos.y + e)
    )
  );
}

vec3 sunDirection() {
  float height = 0.24 + u_gradient * 0.28 + sin(u_time * 0.035) * 0.035 + u_energy * 0.03;
  return normalize(vec3(-0.08, height, 0.58));
}

vec3 atmosphere(vec3 rayDir, vec3 sunDir) {
  float safeY = max(rayDir.y, -0.08);
  float horizonGlow = 1.0 / (safeY + 0.16);
  float sunLift = 1.0 / (sunDir.y * 10.0 + 1.0);
  float raySun = pow(abs(dot(sunDir, rayDir)), 2.0);
  float sunDot = pow(max(0.0, dot(sunDir, rayDir)), 8.0);
  vec3 sunColor = mix(vec3(1.0), vec3(0.76, 0.58, 0.36), clamp(sunLift, 0.0, 1.0));
  vec3 skyBlue = vec3(0.25, 0.58, 1.0) * sunColor;
  vec3 haze = max(vec3(0.0), skyBlue - vec3(0.013, 0.032, 0.056) * (horizonGlow - 5.2 * sunDir.y * sunDir.y));
  haze *= horizonGlow * (0.16 + raySun * 0.2);
  haze += sunColor * sunDot * horizonGlow * 0.045;
  return haze * (0.52 + 0.34 * pow(1.0 - rayDir.y, 3.0));
}

float sunDisc(vec3 dir) {
  float softness = mix(420.0, 170.0, clamp(u_sharpness, 0.0, 1.6) / 1.6);
  return pow(max(0.0, dot(dir, sunDirection())), softness) * (28.0 + u_treble * 22.0);
}

vec3 acesToneMap(vec3 color) {
  mat3 m1 = mat3(
    0.59719, 0.07600, 0.02840,
    0.35458, 0.90834, 0.13383,
    0.04823, 0.01566, 0.83777
  );
  mat3 m2 = mat3(
    1.60475, -0.10208, -0.00327,
    -0.53108, 1.10813, -0.07276,
    -0.07367, -0.00605, 1.07602
  );
  vec3 v = m1 * color;
  vec3 a = v * (v + 0.0245786) - 0.000090537;
  vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
  return pow(clamp(m2 * (a / b), 0.0, 1.0), vec3(1.0 / 2.2));
}

vec3 cameraRay(vec2 fragCoord) {
  vec2 uv = ((fragCoord / u_resolution.xy) * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
  uv /= max(u_scale, 0.3);
  vec3 proj = normalize(vec3(uv.x, uv.y - 0.28 - u_bass * 0.025, 1.55));
  float yaw = sin(u_time * 0.045) * 0.035 + u_mid * 0.012;
  float pitch = -0.18 + sin(u_time * 0.06) * 0.018 - u_beat * 0.012;
  return rotationAxisAngle(vec3(0.0, -1.0, 0.0), yaw) * rotationAxisAngle(vec3(1.0, 0.0, 0.0), pitch) * proj;
}

void main() {
  vec3 ray = cameraRay(gl_FragCoord.xy);
  vec3 sunDir = sunDirection();
  vec3 warmTint = hsv2rgb(vec3(u_theme.z, 0.28, 1.0));

  if (ray.y >= 0.0) {
    vec3 sky = atmosphere(ray, sunDir) + sunDisc(ray) * warmTint * 0.56;
    vec3 color = acesToneMap(sky * 1.35);
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    gl_FragColor = vec4(mix(vec3(luma), color, u_saturation), 1.0);
    return;
  }

  float depth = 0.82 + u_bass * 0.1 + u_energy * 0.06;
  vec3 origin = vec3(u_time * (0.045 + u_mid * 0.018), 1.34 + u_bass * 0.05, 1.0);
  vec3 highPlane = vec3(0.0, 0.0, 0.0);
  vec3 lowPlane = vec3(0.0, -depth, 0.0);
  float highHit = intersectPlane(origin, ray, highPlane, vec3(0.0, 1.0, 0.0));
  float lowHit = intersectPlane(origin, ray, lowPlane, vec3(0.0, 1.0, 0.0));
  vec3 highPos = origin + ray * highHit;
  vec3 lowPos = origin + ray * lowHit;
  float dist = raymarchWater(origin, highPos, lowPos, depth);
  vec3 hit = origin + ray * dist;

  vec3 n = waterNormal(hit.xz, 0.01, depth);
  n = mix(n, vec3(0.0, 1.0, 0.0), 0.84 * min(1.0, sqrt(dist * 0.01) * 1.08));
  float fresnel = 0.04 + 0.96 * pow(1.0 - max(0.0, dot(-n, ray)), 5.0);

  vec3 reflectedRay = normalize(reflect(ray, n));
  reflectedRay.y = abs(reflectedRay.y);
  vec3 reflection = atmosphere(reflectedRay, sunDir) + sunDisc(reflectedRay) * warmTint * (0.42 + u_beat * 0.12);
  vec3 waterTone = hsv2rgb(vec3(u_theme.x + 0.03, 0.65, 0.22));
  vec3 scattering = waterTone * 0.11 * (0.2 + (hit.y + depth) / depth) * (0.86 + u_bass * 0.18);
  vec3 color = fresnel * reflection + scattering;
  color += warmTint * pow(max(0.0, dot(reflectedRay, sunDir)), 32.0) * (0.015 + u_treble * 0.018);
  color = acesToneMap(color * 1.45);

  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, u_saturation);
  color = mix(vec3(0.5), color, 0.82 + u_sharpness * 0.12);
  gl_FragColor = vec4(color, 1.0);
}
`;

const coastalFragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_energy;
uniform float u_beat;
uniform vec3 u_theme;
uniform float u_scale;
uniform float u_density;
uniform float u_gradient;
uniform float u_saturation;
uniform float u_sharpness;
uniform float u_line;

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

vec3 skyPalette(float t) {
  vec3 base = palette(
    t,
    vec3(0.26, 0.76, 0.77),
    vec3(1.0, 0.3, 1.0),
    vec3(0.8, 0.4, 0.7),
    vec3(0.0, 0.12, 0.54)
  );
  vec3 themeTint = palette(u_theme.x + t * 0.12, vec3(0.52), vec3(0.35), vec3(1.0), vec3(0.0, 0.24, 0.4));
  return mix(base, themeTint, 0.18 * u_gradient);
}

vec3 hueColor(float v) {
  return 0.6 + 0.76 * cos(6.3 * v + vec3(0.0, 23.0, 21.0));
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

vec2 rotate2D(vec2 st, float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c) * st;
}

float softBar(float a, float b, float s) {
  return smoothstep(a - s, a + s, b);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)), dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float musicPulse() {
  return clamp(u_bass * 0.45 + u_mid * 0.28 + u_treble * 0.14 + u_beat * 0.34, 0.0, 1.25);
}

float phaseWeight(float target) {
  float phaseTime = u_time / 30.0;
  float current = floor(mod(phaseTime, 5.0));
  float next = mod(current + 1.0, 5.0);
  float fade = smoothstep(0.82, 1.0, fract(phaseTime));
  float currentMask = 1.0 - step(0.5, abs(current - target));
  float nextMask = 1.0 - step(0.5, abs(next - target));
  return mix(currentMask, nextMask, fade);
}

vec3 drawSky(vec2 uv, vec2 sunShift, float sm, float skyPhase) {
  float pulse = musicPulse() * skyPhase;
  vec2 u = uv + sunShift;
  float rings = 38.0 + u_density * 24.0;
  vec2 id = vec2((length(u) + 0.01) * rings, 0.0);
  float segments = max(3.0, floor(id.x) * (0.065 + u_density * 0.025));
  float ringShift = (hash12(floor(id.xx)) * 0.5 + 0.25) * (u_time + 10.0) * (0.16 + pulse * 0.018);
  vec2 turned = rotate2D(u, ringShift);
  id.y = atan(turned.y, turned.x) * segments;
  vec2 local = fract(id);
  id -= local;

  vec2 center = vec2(
    cos((id.y + 0.5) / segments) * (id.x + 0.5) / rings,
    sin((id.y + 0.5) / segments) * (id.x + 0.5) / rings
  );
  center = rotate2D(center, -ringShift) - sunShift;

  float cloud = noise2(center * vec2(0.5, 1.0) - vec2(u_time * 0.1, 0.0));
  cloud *= step(-0.25, center.y);
  cloud = smoothstep(0.038, 0.062, cloud + pulse * 0.018);
  local += noise2(local * vec2(1.0, 4.0) + id) * vec2(0.7, 0.2);

  vec3 sky = skyPalette(sin(length(u) - 0.1 + u_theme.x * 0.18)) * 0.36;
  vec3 tile = mix(skyPalette(sin(length(u) - 0.1) + (hash12(id) - 0.5) * 0.15), vec3(1.0), cloud * 0.85);
  float mask = softBar(abs(local.x - 0.5), 0.4, sm * rings / max(u_line, 0.2))
    * softBar(abs(local.y - 0.5), 0.48, sm * segments / max(u_line, 0.2));
  return mix(sky, tile * (1.0 + pulse * 0.08), mask);
}

vec3 drawWater(vec3 color, vec2 uv, vec2 sunShift, float sm, float tidePhase) {
  float pulse = musicPulse() * tidePhase;
  float cloud = noise2(-sunShift * vec2(0.5, 1.0) - vec2(u_time * 0.1, 0.0));
  cloud = 1.0 - smoothstep(0.0, 0.15, cloud) * 0.5;
  vec2 u = uv * vec2(1.0, 15.0);
  vec2 id = floor(u);

  for (int j = 0; j < 3; j++) {
    float offset = 1.0 - float(j);
    if (id.y + offset < -5.0) {
      vec2 local = fract(u) - 0.5;
      float wave = sin(uv.x * (9.0 + u_density * 4.0) - u_time * 1.0 + id.y + offset);
      local.y = (local.y + wave * (0.16 + pulse * 0.035) - offset) * 4.0;
      float seed = hash12(vec2(id.y + offset, floor(local.y)));
      float xDensity = 5.0 + seed * 4.0 + u_density * 2.0;
      float yDensity = 24.0 + u_density * 8.0;
      local.x = uv.x * xDensity + sunShift.x * 8.0 + sin(u_time * (0.22 + seed * 0.7)) * 0.45;
      float track = 0.78 * smoothstep(5.0, 0.0, abs(floor(local.x))) * cloud + 0.08 + pulse * 0.045;
      vec3 baseWater = mix(vec3(0.0, 0.08, 0.42), vec3(0.32, 0.32, 0.02), track);
      color = mix(color, baseWater, softBar(local.y, 0.0, sm * yDensity / max(u_line, 0.2)));
      local += noise2(local * vec2(3.0, 0.5)) * vec2(0.1, 0.6);
      vec3 stroke = mix(hueColor(hash12(floor(local)) * 0.1 + 0.56 + u_theme.y * 0.04) * (1.05 + floor(local.y) * 0.14), vec3(1.0, 0.95, 0.08), track);
      float strokeMask = softBar(local.y, 0.0, sm * xDensity / max(u_line, 0.2))
        * softBar(abs(fract(local.x) - 0.5), 0.48, sm * xDensity / max(u_line, 0.2))
        * softBar(abs(fract(local.y) - 0.5), 0.3, sm * yDensity / max(u_line, 0.2));
      color = mix(color, stroke * (1.0 + pulse * 0.12), strokeMask);
    }
  }

  return color;
}

vec4 drawGrassBlade(vec2 u, vec2 id, vec3 grassColor, float sm, float grassPhase) {
  float pulse = musicPulse() * grassPhase;
  float seed = (hash12(id) - 0.5) * 0.25 + 0.5;
  vec2 local = u;
  local -= vec2(0.3, 0.5 - seed * 0.4);
  float breeze = sin((u_time * 0.7 + seed * 2.0 - id.x * 0.05 - id.y * 0.05) * 2.0 + id.y * 0.5 + pulse * 1.2);
  local.x += breeze * (local.y + 0.5) * (0.28 + pulse * 0.08);
  vec2 d = abs(local) - vec2(0.02, 0.5 - seed * 0.5);
  float blade = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  blade -= noise2(local * 7.0 + id) * 0.1;
  float alpha = softBar(blade, 0.1, sm * 5.2);
  vec3 outline = grassColor * 0.24;
  vec3 fill = grassColor * (1.05 + local.y * 1.8) * (1.7 - seed * 2.1);
  vec3 c = mix(outline, fill, softBar(blade, 0.04, sm * 5.2));
  return vec4(c * (1.0 + pulse * 0.08), alpha);
}

vec4 drawTree(vec2 uv, vec2 treePos, float sm, float treePhase) {
  float pulse = musicPulse() * treePhase;
  float swing = sin(u_time * 0.22 + pulse * 0.9);
  vec2 u = uv + treePos;
  u.x -= sin(u.y + 1.0) * (0.16 + pulse * 0.035) * (swing + 0.75);
  u += noise2(u * 4.5 - 7.0) * 0.18;

  vec2 trunkGrid = u * vec2(10.0, 60.0);
  float trunkSeed = hash12(floor(trunkGrid.yy));
  trunkGrid.x += trunkSeed * 0.01;
  vec2 trunkLocal = fract(trunkGrid);
  float trunkMask = softBar(abs(trunkGrid.x - 0.5), 0.5, sm * 10.0) * step(abs(trunkGrid.y + 20.0), 45.0);
  vec3 trunk = mix(vec3(0.07), vec3(0.5, 0.3, 0.02) * (0.4 + trunkSeed * 0.4), softBar(abs(trunkLocal.y - 0.5), 0.4, sm * 60.0) * softBar(abs(trunkLocal.x - 0.5), 0.45, sm * 10.0));
  vec4 result = vec4(trunk, trunkMask);

  for (int layer = 0; layer < 4; layer++) {
    float xs = float(layer);
    vec2 crown = uv + treePos + vec2(xs / 30.0 * 0.5 - (swing + 0.75) * (0.12 + pulse * 0.018), -0.7);
    crown += noise2(crown * vec2(2.0, 1.0) + vec2(-u_time * (0.32 + pulse * 0.04) + xs * 0.05, 0.0)) * vec2(-0.2, 0.08) * smoothstep(0.5, -1.0, crown.y + 0.7);
    vec2 tile = crown * vec2(30.0, 1.0);
    float rowSeed = hash12(floor(tile.xx) + xs * 1.4);
    float rows = 5.0 + rowSeed * 7.0;
    tile.y *= rows;
    vec2 tileSave = tile;
    vec2 local = fract(tile);
    float tileSeed = hash12(tile - local);
    vec2 cell = (tile - local) / vec2(30.0, rows) + vec2(0.0, 0.7);
    float top = step(0.0, cell.y) * step(length(cell), 0.45);
    float bottom = step(cell.y, 0.0) * step(-0.7 + sin((floor(crown.x) + xs * 0.5) * 15.0) * 0.2, cell.y);
    float mask = (top + bottom) * step(abs(cell.x), 0.5) * softBar(abs(local.x - 0.5), 0.35, sm * 15.0);
    local += noise2(tileSave * vec2(1.0, 3.0)) * vec2(0.3);
    vec3 leaf = hueColor((tileSeed + (sin(u_time * 0.08) * 0.5 + 0.5)) * 0.2 + u_theme.z * 0.1) - cell.x;
    vec3 crownColor = mix(leaf * 0.15, leaf * 0.58 * (0.7 + xs * 0.2) * (1.0 + pulse * 0.08), softBar(abs(local.y - 0.5), 0.47, sm * rows) * softBar(abs(local.x - 0.5), 0.2, sm * 30.0));
    result = mix(result, vec4(crownColor, mask), mask);
  }

  return result;
}

float fishShape(vec2 p, float tailWave, float sm) {
  vec2 bodyP = p / vec2(1.18, 0.42);
  float body = 1.0 - smoothstep(0.92, 1.02, length(bodyP));
  vec2 tailP = p - vec2(-1.05, 0.0);
  tailP.y += tailWave * 0.12;
  float tail = 1.0 - smoothstep(0.0, 0.08 + sm * 20.0, abs(tailP.x) * 1.2 + abs(tailP.y) * 2.0 - 0.55);
  float head = 1.0 - smoothstep(0.1, 0.16 + sm * 12.0, length((p - vec2(0.86, 0.0)) / vec2(0.35, 0.3)));
  return clamp(max(body, tail) + head * 0.18, 0.0, 1.0);
}

vec4 drawFish(vec2 uv, float seed, float sm, float fishPhase) {
  float music = clamp(u_bass * 0.75 + u_mid * 0.35 + u_beat * 0.9, 0.0, 1.8) * (0.24 + fishPhase * 0.76);
  float swim = u_time * (0.055 + seed * 0.025) + music * 0.035;
  vec2 pos = vec2(
    mix(-1.12, 1.08, fract(seed * 7.31 + swim)),
    -0.48 - seed * 0.28 + sin(u_time * (0.16 + seed * 0.08) + seed * 8.0) * 0.025
  );
  float appear = smoothstep(-0.2, 0.55, sin(u_time * (0.34 + seed * 0.18) + seed * 12.0 + music * 1.8));
  appear *= smoothstep(-0.92, -0.82, pos.x) * (1.0 - smoothstep(0.82, 1.02, pos.x));
  float scale = 0.048 + seed * 0.018 + music * 0.008;
  vec2 p = (uv - pos) / scale;
  float tailWave = sin(u_time * (2.2 + seed * 1.8) + music * 4.5 + seed * 9.0);
  float shape = fishShape(p, tailWave, sm);
  float mosaic = softBar(abs(fract((p.x * 2.0 + p.y * 4.0 + seed * 3.0)) - 0.5), 0.36, sm * 46.0);
  vec3 base = hueColor(0.52 + seed * 0.08 + u_theme.x * 0.08);
  vec3 light = mix(base * 0.28, base * (0.82 + u_treble * 0.28), mosaic);
  light = mix(light, vec3(1.0, 0.92, 0.28), 0.12 + music * 0.08);
  float alpha = shape * appear * (0.22 + music * 0.28);
  return vec4(light, alpha);
}

void main() {
  vec2 r = u_resolution.xy;
  vec2 uv = (gl_FragCoord.xy * 2.0 - r) / r.y;
  uv /= max(u_scale, 0.25);
  float sm = 3.0 / r.y;
  float aspect = r.x / r.y;
  float skyPhase = phaseWeight(0.0);
  float grassPhase = phaseWeight(1.0);
  float treePhase = phaseWeight(2.0);
  float tidePhase = phaseWeight(3.0);
  float fishPhase = phaseWeight(4.0);
  vec2 sunPos = vec2(aspect * 0.42, -0.53);
  vec2 treePos = vec2(-aspect * 0.42, -0.2);
  vec2 sunShift = rotate2D(sunPos, noise2(uv + u_time * 0.1) * (0.18 + musicPulse() * skyPhase * 0.035));

  vec3 color = drawSky(uv, sunShift, sm, skyPhase);
  if (uv.y < -0.35) {
    color = drawWater(color, uv, sunShift, sm, tidePhase);
    for (int i = 0; i < 5; i++) {
      vec4 fish = drawFish(uv, 0.13 + float(i) * 0.19, sm, fishPhase);
      color = mix(color, fish.rgb, fish.a);
    }
  }

  vec2 grassUv = uv + noise2(uv * 2.0) * 0.1 + vec2(0.0, sin(uv.x + 3.0) * 0.36 + 0.8);
  vec3 grassColor = mix(vec3(0.7, 0.6, 0.2), vec3(0.03, 0.78, 0.12), sin(u_time * 0.08) * 0.5 + 0.5);
  color = mix(color, grassColor * 0.38, step(grassUv.y, 0.0));

  float grassMask = 0.0;
  vec2 grassGrid = grassUv * vec2(60.0, 60.0 / 3.5);
  if (grassGrid.y < 1.2) {
    for (int yi = 0; yi < 3; yi++) {
      for (int xi = 0; xi < 5; xi++) {
        vec2 id = floor(grassGrid) + vec2(float(xi) - 2.0, -float(yi));
        vec2 local = (fract(grassGrid) + vec2(1.0 - (float(xi) - 2.0), float(yi))) / vec2(5.0, 3.0);
        vec4 blade = drawGrassBlade(local, id, grassColor, sm, grassPhase);
        float front = step(id.y, -1.0);
        color = mix(color, blade.rgb, blade.a * front);
        grassMask = max(grassMask, blade.a * step(id.y, -5.0));
      }
    }
  }

  if (abs(uv.x + treePos.x - 0.1 - sin(u_time * 0.22) * 0.08) < 0.6) {
    vec4 tree = drawTree(uv, treePos, sm, treePhase);
    color = mix(color, tree.rgb, tree.a * (1.0 - grassMask));
  }

  color *= 0.72 + 0.2 * u_gradient;
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, u_saturation);
  color = mix(vec3(0.5), color, 0.74 + u_sharpness * 0.18);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

const catDivisionFragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_energy;
uniform float u_beat;
uniform vec3 u_theme;
uniform float u_scale;
uniform float u_density;
uniform float u_gradient;
uniform float u_saturation;
uniform float u_sharpness;
uniform float u_line;

float lineField;
float yP;
vec3 catPos;
vec3 catSize;

float fastTanh(float x) {
  float e = exp(2.0 * clamp(x, -8.0, 8.0));
  return (e - 1.0) / (e + 1.0);
}

float thCos(float a, float b) {
  return fastTanh(a * cos(b)) / fastTanh(a);
}

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)), dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float smin(float a, float b, float k) {
  k *= 4.0;
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float sdParabola(vec2 pos, float k) {
  pos.x = abs(pos.x);
  float p = (pos.y * k - 0.5) / 3.0;
  float q = pos.x * k / 4.0;
  float h = q * q - p * p * p;
  float x;

  if (h > 0.0) {
    float r = pow(q + sqrt(h), 1.0 / 3.0);
    x = r + p / r;
  } else {
    float r = sqrt(max(p, 0.0001));
    float denom = max(abs(p * r), 0.0001);
    x = 2.0 * r * cos(acos(clamp(q / denom, -1.0, 1.0)) / 3.0);
  }

  vec2 d = pos - vec2(x, x * x) / k;
  return length(d) * sign(d.x);
}

float catShape(vec2 p) {
  p.y += yP;

  float x = mix(catPos.x, catPos.y, catPos.z) * 20.0;
  float y = -4.0 + catSize.x;
  float k = (-0.5 - yP) * 0.3;

  x += x * k;
  p.x += p.x * k;
  k = 2.0;
  p.x += mix(0.0, catPos.x - catPos.y, 0.5 - abs(catPos.z - 0.5)) * p.y * 1.5;

  return -smin(
    -sdParabola(-p - vec2(x, y), k + catSize.y),
    sdParabola(p + vec2(x, -1.5 - catSize.z), k + catSize.y * 0.5),
    0.01
  );
}

float catLine(vec2 p, float seed, float rhythm) {
  p *= 2.0;
  lineField = p.y
    - noise2(vec2(p.x * 0.2 + sin(u_time * 0.28 + seed) * 0.5, u_time * 0.42 + seed * 0.5)) * (6.7 + rhythm * 1.15) * smoothstep(15.0, 0.0, abs(p.x))
    + noise2(vec2(p.x, u_time + seed)) * (0.38 + rhythm * 0.16);
  return smin(lineField, catShape(p + vec2(0.0, lineField * 0.25)), 0.1);
}

float catEyes(vec2 p, float rhythm) {
  p += vec2(
    mix(catPos.x, catPos.y, catPos.z) * 10.0 + mix(0.0, catPos.x - catPos.y, 0.5 - abs(catPos.z - 0.5)) * p.y * 1.5,
    yP - 0.3 + catSize.z * 2.0 + lineField * 0.2
  );
  p.x *= 1.0 + catSize.z;

  float blink = abs(sin(u_time * (1.35 + rhythm * 0.65)));
  float eyes = length(abs(p + vec2(sin(u_time * 1.2) * 0.2, 0.0)) + vec2(-0.3, abs(sin(u_time * 1.2) * 0.05))) - (0.09 + rhythm * 0.02) + blink * 0.015;

  p += vec2(sin(u_time * 1.2) * 0.3, 0.2);
  float nose = sin(atan(p.x, p.y) - 1.6) / 3.12415 * 12.0;
  return min(eyes, length(p) - 0.15 + catSize.z * 0.2 + sin(nose) * 0.025);
}

void main() {
  vec2 r = u_resolution.xy;
  vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y) * (8.0 / max(u_scale, 0.3));
  vec3 ink = vec3(0.0);
  vec3 paperTint = 0.94 + 0.06 * cos(6.28318 * (u_theme.x + vec3(0.0, 0.12, 0.24)));
  vec3 color = ink;

  float rhythm = clamp(u_bass * 0.55 + u_mid * 0.25 + u_beat * 0.65, 0.0, 1.35);
  float rows = 6.0 + u_density * 4.0;
  float ms = (20.0 / min(r.x, r.y)) / max(u_line, 0.25);

  if (max(abs(p.x), abs(p.y)) < 8.0) {
    for (int row = 0; row < 12; row++) {
      float lane = 4.0 - float(row) * (8.0 / 11.0);
      float nl = floor(p.y * rows * 0.12) + lane * 0.5;
      float cycle = 8.0 + hash11(nl) * 4.0;
      float localTime = u_time * (0.86 + rhythm * 0.18) + hash11(nl) * 1000.0;
      float n = hash11(floor(localTime / cycle));

      catPos = vec3(
        n - 0.5,
        hash11(floor(localTime / cycle + 1.0)) - 0.5,
        smoothstep(0.35, 0.68, mod(localTime, cycle) / cycle)
      );
      yP = (1.0 - thCos(4.6 + rhythm * 0.65, (localTime + cycle * 0.5) / cycle * 6.28318)) * (3.4 + rhythm * 0.42) - 0.55;
      catSize = vec3(hash11(n) - 1.5, hash11(n + 0.1) - 0.5, hash11(n + 0.2) * 0.25);

      vec2 local = vec2(p.x, fract(p.y * rows * 0.12) - lane * 0.5);
      float k = catLine(local, nl, rhythm);
      float stroke = smoothstep(ms, -ms, abs(k) - max(ms, 0.035 / max(u_line, 0.25)));
      float eyes = smoothstep(ms, -ms, catEyes(local, rhythm));
      float laneMask = smoothstep(7.9, 7.2, abs(p.x)) * smoothstep(7.9, 7.2, abs(p.y));

      color = mix(color, paperTint, max(stroke, eyes) * laneMask);
    }
  }

  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, u_saturation);
  color = mix(vec3(0.5), color, 0.68 + u_sharpness * 0.22);
  color = mix(ink, color, 0.72 + u_gradient * 0.24);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
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

function resetErosionFeedback() {
  // Kept for callers that reset WebGL state when switching modes or resizing.
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
      buffer,
      position: gl.getAttribLocation(program, "a_position"),
      uniforms: {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        time: gl.getUniformLocation(program, "u_time"),
        bass: gl.getUniformLocation(program, "u_bass"),
        mid: gl.getUniformLocation(program, "u_mid"),
        treble: gl.getUniformLocation(program, "u_treble"),
        energy: gl.getUniformLocation(program, "u_energy"),
        beat: gl.getUniformLocation(program, "u_beat"),
        theme: gl.getUniformLocation(program, "u_theme"),
        scale: gl.getUniformLocation(program, "u_scale"),
        density: gl.getUniformLocation(program, "u_density"),
        gradient: gl.getUniformLocation(program, "u_gradient"),
        saturation: gl.getUniformLocation(program, "u_saturation"),
        sharpness: gl.getUniformLocation(program, "u_sharpness"),
        line: gl.getUniformLocation(program, "u_line"),
      },
    };
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
  const { gl, program, buffer, position, uniforms } = state;
  const theme = tunedTheme();
  const sensitivity = Number(sensitivityInput.value);
  gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(uniforms.resolution, webglCanvas.width, webglCanvas.height);
  gl.uniform1f(uniforms.time, frame / 60);
  gl.uniform1f(uniforms.bass, Math.min(1, features.bass * sensitivity));
  gl.uniform1f(uniforms.mid, Math.min(1, features.mid * sensitivity));
  gl.uniform1f(uniforms.treble, Math.min(1, features.treble * sensitivity));
  gl.uniform1f(uniforms.energy, Math.min(1, features.energy * sensitivity));
  gl.uniform1f(uniforms.beat, features.beat);
  gl.uniform3f(uniforms.theme, (theme.base % 360) / 360, (theme.second % 360) / 360, (theme.third % 360) / 360);
  gl.uniform1f(uniforms.scale, visualTuning.size);
  gl.uniform1f(uniforms.density, visualTuning.density);
  gl.uniform1f(uniforms.gradient, visualTuning.gradient);
  gl.uniform1f(uniforms.saturation, visualTuning.saturation);
  gl.uniform1f(uniforms.sharpness, visualTuning.sharpness);
  gl.uniform1f(uniforms.line, visualTuning.line);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initSeascapeWebgl() {
  if (seascapeState || !webglSupported) return seascapeState;
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
    const program = createProgram(gl, erosionVertexShader, seascapeFragmentShader);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    seascapeState = {
      gl,
      program,
      buffer,
      position: gl.getAttribLocation(program, "a_position"),
      uniforms: {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        time: gl.getUniformLocation(program, "u_time"),
        bass: gl.getUniformLocation(program, "u_bass"),
        mid: gl.getUniformLocation(program, "u_mid"),
        treble: gl.getUniformLocation(program, "u_treble"),
        energy: gl.getUniformLocation(program, "u_energy"),
        beat: gl.getUniformLocation(program, "u_beat"),
        theme: gl.getUniformLocation(program, "u_theme"),
        scale: gl.getUniformLocation(program, "u_scale"),
        density: gl.getUniformLocation(program, "u_density"),
        gradient: gl.getUniformLocation(program, "u_gradient"),
        saturation: gl.getUniformLocation(program, "u_saturation"),
        sharpness: gl.getUniformLocation(program, "u_sharpness"),
        line: gl.getUniformLocation(program, "u_line"),
      },
    };
  } catch (error) {
    console.error(error);
    webglSupported = false;
    return null;
  }

  return seascapeState;
}

function drawSeascape(features) {
  const state = initSeascapeWebgl();
  if (!state) return;
  const { gl, program, buffer, position, uniforms } = state;
  const theme = tunedTheme();
  const sensitivity = Number(sensitivityInput.value);
  gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(uniforms.resolution, webglCanvas.width, webglCanvas.height);
  gl.uniform1f(uniforms.time, frame / 60);
  gl.uniform1f(uniforms.bass, Math.min(1, features.bass * sensitivity));
  gl.uniform1f(uniforms.mid, Math.min(1, features.mid * sensitivity));
  gl.uniform1f(uniforms.treble, Math.min(1, features.treble * sensitivity));
  gl.uniform1f(uniforms.energy, Math.min(1, features.energy * sensitivity));
  gl.uniform1f(uniforms.beat, features.beat);
  gl.uniform3f(uniforms.theme, (theme.base % 360) / 360, (theme.second % 360) / 360, (theme.third % 360) / 360);
  gl.uniform1f(uniforms.scale, visualTuning.size);
  gl.uniform1f(uniforms.density, visualTuning.density);
  gl.uniform1f(uniforms.gradient, visualTuning.gradient);
  gl.uniform1f(uniforms.saturation, visualTuning.saturation);
  gl.uniform1f(uniforms.sharpness, visualTuning.sharpness);
  gl.uniform1f(uniforms.line, visualTuning.line);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initSunWaterWebgl() {
  if (sunWaterState || !webglSupported) return sunWaterState;
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
    const program = createProgram(gl, erosionVertexShader, sunWaterFragmentShader);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    sunWaterState = {
      gl,
      program,
      buffer,
      position: gl.getAttribLocation(program, "a_position"),
      uniforms: {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        time: gl.getUniformLocation(program, "u_time"),
        bass: gl.getUniformLocation(program, "u_bass"),
        mid: gl.getUniformLocation(program, "u_mid"),
        treble: gl.getUniformLocation(program, "u_treble"),
        energy: gl.getUniformLocation(program, "u_energy"),
        beat: gl.getUniformLocation(program, "u_beat"),
        theme: gl.getUniformLocation(program, "u_theme"),
        scale: gl.getUniformLocation(program, "u_scale"),
        density: gl.getUniformLocation(program, "u_density"),
        gradient: gl.getUniformLocation(program, "u_gradient"),
        saturation: gl.getUniformLocation(program, "u_saturation"),
        sharpness: gl.getUniformLocation(program, "u_sharpness"),
        line: gl.getUniformLocation(program, "u_line"),
      },
    };
  } catch (error) {
    console.error(error);
    webglSupported = false;
    return null;
  }

  return sunWaterState;
}

function drawSunWater(features) {
  const state = initSunWaterWebgl();
  if (!state) return;
  const { gl, program, buffer, position, uniforms } = state;
  const theme = tunedTheme();
  const sensitivity = Number(sensitivityInput.value);
  gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(uniforms.resolution, webglCanvas.width, webglCanvas.height);
  gl.uniform1f(uniforms.time, frame / 60);
  gl.uniform1f(uniforms.bass, Math.min(1, features.bass * sensitivity));
  gl.uniform1f(uniforms.mid, Math.min(1, features.mid * sensitivity));
  gl.uniform1f(uniforms.treble, Math.min(1, features.treble * sensitivity));
  gl.uniform1f(uniforms.energy, Math.min(1, features.energy * sensitivity));
  gl.uniform1f(uniforms.beat, features.beat);
  gl.uniform3f(uniforms.theme, (theme.base % 360) / 360, (theme.second % 360) / 360, (theme.third % 360) / 360);
  gl.uniform1f(uniforms.scale, visualTuning.size);
  gl.uniform1f(uniforms.density, visualTuning.density);
  gl.uniform1f(uniforms.gradient, visualTuning.gradient);
  gl.uniform1f(uniforms.saturation, visualTuning.saturation);
  gl.uniform1f(uniforms.sharpness, visualTuning.sharpness);
  gl.uniform1f(uniforms.line, visualTuning.line);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initCoastalWebgl() {
  if (coastalState || !webglSupported) return coastalState;
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
    const program = createProgram(gl, erosionVertexShader, coastalFragmentShader);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    coastalState = {
      gl,
      program,
      buffer,
      position: gl.getAttribLocation(program, "a_position"),
      uniforms: {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        time: gl.getUniformLocation(program, "u_time"),
        bass: gl.getUniformLocation(program, "u_bass"),
        mid: gl.getUniformLocation(program, "u_mid"),
        treble: gl.getUniformLocation(program, "u_treble"),
        energy: gl.getUniformLocation(program, "u_energy"),
        beat: gl.getUniformLocation(program, "u_beat"),
        theme: gl.getUniformLocation(program, "u_theme"),
        scale: gl.getUniformLocation(program, "u_scale"),
        density: gl.getUniformLocation(program, "u_density"),
        gradient: gl.getUniformLocation(program, "u_gradient"),
        saturation: gl.getUniformLocation(program, "u_saturation"),
        sharpness: gl.getUniformLocation(program, "u_sharpness"),
        line: gl.getUniformLocation(program, "u_line"),
      },
    };
  } catch (error) {
    console.error(error);
    webglSupported = false;
    return null;
  }

  return coastalState;
}

function drawCoastalLandscape(features) {
  const state = initCoastalWebgl();
  if (!state) return;
  const { gl, program, buffer, position, uniforms } = state;
  const theme = tunedTheme();
  const sensitivity = Number(sensitivityInput.value);
  gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(uniforms.resolution, webglCanvas.width, webglCanvas.height);
  gl.uniform1f(uniforms.time, frame / 60);
  gl.uniform1f(uniforms.bass, Math.min(1, features.bass * sensitivity));
  gl.uniform1f(uniforms.mid, Math.min(1, features.mid * sensitivity));
  gl.uniform1f(uniforms.treble, Math.min(1, features.treble * sensitivity));
  gl.uniform1f(uniforms.energy, Math.min(1, features.energy * sensitivity));
  gl.uniform1f(uniforms.beat, features.beat);
  gl.uniform3f(uniforms.theme, (theme.base % 360) / 360, (theme.second % 360) / 360, (theme.third % 360) / 360);
  gl.uniform1f(uniforms.scale, visualTuning.size);
  gl.uniform1f(uniforms.density, visualTuning.density);
  gl.uniform1f(uniforms.gradient, visualTuning.gradient);
  gl.uniform1f(uniforms.saturation, visualTuning.saturation);
  gl.uniform1f(uniforms.sharpness, visualTuning.sharpness);
  gl.uniform1f(uniforms.line, visualTuning.line);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initCatDivisionWebgl() {
  if (catDivisionState || !webglSupported) return catDivisionState;
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
    const program = createProgram(gl, erosionVertexShader, catDivisionFragmentShader);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    catDivisionState = {
      gl,
      program,
      buffer,
      position: gl.getAttribLocation(program, "a_position"),
      uniforms: {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        time: gl.getUniformLocation(program, "u_time"),
        bass: gl.getUniformLocation(program, "u_bass"),
        mid: gl.getUniformLocation(program, "u_mid"),
        treble: gl.getUniformLocation(program, "u_treble"),
        energy: gl.getUniformLocation(program, "u_energy"),
        beat: gl.getUniformLocation(program, "u_beat"),
        theme: gl.getUniformLocation(program, "u_theme"),
        scale: gl.getUniformLocation(program, "u_scale"),
        density: gl.getUniformLocation(program, "u_density"),
        gradient: gl.getUniformLocation(program, "u_gradient"),
        saturation: gl.getUniformLocation(program, "u_saturation"),
        sharpness: gl.getUniformLocation(program, "u_sharpness"),
        line: gl.getUniformLocation(program, "u_line"),
      },
    };
  } catch (error) {
    console.error(error);
    webglSupported = false;
    return null;
  }

  return catDivisionState;
}

function drawCatDivision(features) {
  const state = initCatDivisionWebgl();
  if (!state) return;
  const { gl, program, buffer, position, uniforms } = state;
  const theme = tunedTheme();
  const sensitivity = Number(sensitivityInput.value);
  gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(uniforms.resolution, webglCanvas.width, webglCanvas.height);
  gl.uniform1f(uniforms.time, frame / 60);
  gl.uniform1f(uniforms.bass, Math.min(1, features.bass * sensitivity));
  gl.uniform1f(uniforms.mid, Math.min(1, features.mid * sensitivity));
  gl.uniform1f(uniforms.treble, Math.min(1, features.treble * sensitivity));
  gl.uniform1f(uniforms.energy, Math.min(1, features.energy * sensitivity));
  gl.uniform1f(uniforms.beat, features.beat);
  gl.uniform3f(uniforms.theme, (theme.base % 360) / 360, (theme.second % 360) / 360, (theme.third % 360) / 360);
  gl.uniform1f(uniforms.scale, visualTuning.size);
  gl.uniform1f(uniforms.density, visualTuning.density);
  gl.uniform1f(uniforms.gradient, visualTuning.gradient);
  gl.uniform1f(uniforms.saturation, visualTuning.saturation);
  gl.uniform1f(uniforms.sharpness, visualTuning.sharpness);
  gl.uniform1f(uniforms.line, visualTuning.line);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function isWebglModeName(mode) {
  return mode === "erosion" || mode === "seascape" || mode === "sunwater" || mode === "coastal" || mode === "catdivision";
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

function visualTextCharacters() {
  const value = visualTextInput?.value.trim() || t("defaultVisualText");
  const normalized = value.replace(/\s+/g, " ").slice(0, 32);
  const chars = Array.from(normalized);
  return chars.length ? chars : Array.from(t("defaultVisualText"));
}

function drawTypeFlow(width, height, features) {
  const sensitivity = Number(sensitivityInput.value);
  const theme = tunedTheme();
  const size = Math.min(width, height);
  const chars = visualTextCharacters();
  const visibleChars = chars.slice(0, 32);
  const asciiCount = visibleChars.filter((char) => /[A-Za-z0-9]/.test(char)).length;
  const fontRatio = asciiCount > visibleChars.length * 0.55 ? 0.68 : 1.04;
  const maxTextWidth = width * 0.72;
  const baseFont = Math.min(size * 0.15, Math.max(38, maxTextWidth / Math.max(visibleChars.length * fontRatio, 4)));
  const fontSize = Math.min(118, Math.max(34, baseFont));
  const tracking = fontSize * (asciiCount > visibleChars.length * 0.55 ? 0.58 : 0.86);
  const totalWidth = visibleChars.reduce((sum, char) => sum + (char === " " ? tracking * 0.55 : tracking), 0);
  const centerX = width * 0.5;
  const centerY = height * 0.47;
  const hueA = theme.base + visualTuning.hue;
  const hueB = theme.second + visualTuning.hue * 0.45;
  const hueC = theme.third - visualTuning.hue * 0.25;
  const tide = features.bass * 0.9 + features.mid * 0.45 + features.beat * 0.35;

  ctx.save();
  const bg = ctx.createRadialGradient(centerX, centerY, size * 0.04, centerX, centerY, size * 0.82);
  bg.addColorStop(0, `hsla(${hueB}, 78%, ${12 + features.mid * 9}%, 1)`);
  bg.addColorStop(0.48, `hsla(${hueA + 190}, 76%, ${7 + features.energy * 8}%, 1)`);
  bg.addColorStop(1, `hsla(${hueA}, 86%, 4%, 1)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "screen";
  for (let band = 0; band < 18; band += 1) {
    const depth = band / 17;
    const y = centerY + size * (0.1 + depth * 0.36);
    ctx.beginPath();
    for (let i = 0; i <= 150; i += 1) {
      const t = i / 150;
      const bin = Math.floor(t * frequencyData.length * 0.62);
      const amp = ((frequencyData[bin] || 0) / 255) ** 1.15;
      const wave = Math.sin(t * Math.PI * (4.6 + band * 0.18) + frame * (0.017 + depth * 0.018)) * size * (0.012 + amp * 0.024 + features.bass * 0.018) * sensitivity;
      const slow = Math.sin(frame * 0.008 + depth * 5.4 + t * 3.2) * features.mid * size * 0.012;
      const x = width * (t - 0.04);
      const yy = y + wave + slow;
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.strokeStyle = `hsla(${hueA + depth * 68}, 96%, ${58 + depth * 18}%, ${0.035 + (1 - depth) * 0.1 + features.treble * 0.055})`;
    ctx.lineWidth = (0.8 + depth * 1.8) * visualTuning.line;
    ctx.stroke();
  }

  ctx.font = `900 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let ghost = 5; ghost >= 1; ghost -= 1) {
    const opacity = 0.018 + ghost * 0.011 * visualTuning.gradient;
    const offset = ghost * size * (0.025 + features.mid * 0.018);
    let xCursor = centerX - totalWidth * 0.5;
    for (let index = 0; index < visibleChars.length; index += 1) {
      const char = visibleChars[index];
      const step = char === " " ? tracking * 0.55 : tracking;
      const x = xCursor + step * 0.5;
      xCursor += step;
      if (char === " ") continue;
      const phase = index * 0.9 + ghost * 0.64;
      const y = centerY + Math.sin(frame * 0.018 + phase) * offset + ghost * size * 0.018;
      ctx.fillStyle = `hsla(${hueC + ghost * 18}, 96%, 70%, ${opacity})`;
      ctx.fillText(char, x + Math.sin(frame * 0.01 + phase) * offset * 0.35, y);
    }
  }

  let cursor = centerX - totalWidth * 0.5;
  for (let index = 0; index < visibleChars.length; index += 1) {
    const char = visibleChars[index];
    const step = char === " " ? tracking * 0.55 : tracking;
    const x = cursor + step * 0.5;
    cursor += step;
    if (char === " ") continue;

    const bin = Math.floor((index / Math.max(1, visibleChars.length - 1)) * frequencyData.length * 0.68);
    const amp = ((frequencyData[bin] || 0) / 255) ** 1.08;
    const lift = amp * size * 0.09 * sensitivity + tide * size * 0.018;
    const drift = Math.sin(frame * 0.018 + index * 0.83) * size * 0.018 + features.mid * Math.sin(index * 1.7) * size * 0.03;
    const y = centerY - lift + Math.sin(frame * 0.013 + index * 1.1) * size * 0.025;
    const shear = Math.sin(frame * 0.012 + index * 0.7) * (0.08 + features.mid * 0.12);
    const rotate = Math.sin(frame * 0.009 + index) * 0.08 + features.beat * 0.035;

    ctx.save();
    ctx.translate(x + drift, y);
    ctx.rotate(rotate);
    ctx.transform(1, features.mid * 0.04, shear, 1, 0, 0);
    ctx.fillStyle = `rgba(0, 0, 0, ${0.35 + features.bass * 0.22})`;
    ctx.fillText(char, fontSize * 0.07, fontSize * 0.09);
    ctx.lineWidth = (1.6 + amp * 3.5 + features.beat * 1.2) * visualTuning.line;
    ctx.strokeStyle = `hsla(${hueC + amp * 80}, 100%, 78%, ${0.24 + amp * 0.42})`;
    ctx.strokeText(char, 0, 0);
    const face = ctx.createLinearGradient(0, -fontSize * 0.62, 0, fontSize * 0.64);
    face.addColorStop(0, `hsla(${hueA + amp * 48}, 100%, ${84 + amp * 8}%, ${0.82 + amp * 0.16})`);
    face.addColorStop(0.48, `hsla(${hueB}, 94%, ${62 + amp * 14}%, ${0.74 + amp * 0.18})`);
    face.addColorStop(1, `hsla(${hueC}, 95%, ${44 + features.bass * 16}%, ${0.62 + amp * 0.18})`);
    ctx.fillStyle = face;
    ctx.fillText(char, 0, 0);

    const shardCount = Math.round((4 + amp * 10 + features.treble * 14) * visualTuning.density);
    for (let shard = 0; shard < shardCount; shard += 1) {
      const seed = typeFlowDust[(index * 11 + shard * 7) % typeFlowDust.length];
      const angle = seed.phase + frame * 0.018 + features.treble * 1.8;
      const distance = fontSize * (0.34 + seed.x * 0.55) * (0.4 + features.treble + amp * 0.7);
      const sx = Math.cos(angle) * distance;
      const sy = Math.sin(angle * 1.27) * distance * 0.55 + fontSize * (seed.y - 0.5) * 0.7;
      ctx.fillStyle = `hsla(${hueA + seed.phase * 24}, 100%, 78%, ${0.04 + features.treble * 0.23 + amp * 0.12})`;
      ctx.fillRect(sx, sy, seed.size * (1 + features.treble * 2.5) * visualTuning.sharpness, 1.1 * visualTuning.line);
    }
    ctx.restore();
  }

  const waterline = centerY + size * (0.18 + features.bass * 0.035);
  const water = ctx.createLinearGradient(0, waterline - size * 0.14, 0, height);
  water.addColorStop(0, `hsla(${hueC}, 100%, 78%, ${0.18 + features.energy * 0.12})`);
  water.addColorStop(0.24, `hsla(${hueA + 170}, 96%, 54%, ${0.1 + features.mid * 0.1})`);
  water.addColorStop(1, "rgba(0, 10, 28, 0.74)");
  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.moveTo(0, waterline);
  for (let i = 0; i <= 130; i += 1) {
    const t = i / 130;
    const bin = Math.floor(t * frequencyData.length * 0.58);
    const amp = (frequencyData[bin] || 0) / 255;
    const y = waterline + Math.sin(t * Math.PI * 4.4 + frame * 0.032) * size * (0.018 + amp * 0.035) * sensitivity;
    ctx.lineTo(t * width, y);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  for (const dust of typeFlowDust) {
    if (dust.x > visualTuning.density * 0.55) continue;
    const x = (dust.x * 1.18 - 0.09) * width + Math.sin(frame * 0.008 + dust.phase) * size * 0.025;
    const y = (dust.y * 0.82 + 0.08) * height + Math.cos(frame * 0.011 + dust.phase) * features.mid * size * 0.06;
    const alpha = 0.025 + features.treble * 0.12 + features.beat * 0.04;
    ctx.fillStyle = `hsla(${hueB + dust.phase * 13}, 96%, 76%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, dust.size * (0.8 + features.treble * 1.7), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
  const vignette = ctx.createRadialGradient(centerX, centerY, size * 0.18, centerX, centerY, size * 0.88);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.52)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function render() {
  frame += visualTuning.speed;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const features = tunedFeatures(audioFeatures());
  const isWebglMode = isWebglModeName(currentMode);

  document.body.classList.toggle("webgl-mode", isWebglMode);

  if (isWebglMode) {
    ctx.clearRect(0, 0, width, height);
    if (currentMode === "erosion") drawErosionFlow(features);
    if (currentMode === "seascape") drawSeascape(features);
    if (currentMode === "sunwater") drawSunWater(features);
    if (currentMode === "coastal") drawCoastalLandscape(features);
    if (currentMode === "catdivision") drawCatDivision(features);
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
  if (currentMode === "typeflow") drawTypeFlow(width, height, features);

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
    document.body.classList.toggle("webgl-mode", isWebglModeName(currentMode));
    if (isWebglModeName(currentMode)) resetErosionFeedback();
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

  const captureCanvas = isWebglModeName(currentMode) ? webglCanvas : canvas;

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
