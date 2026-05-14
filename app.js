const canvas = document.querySelector("#visualizer");
const ctx = canvas.getContext("2d");
const audio = document.querySelector("#audio");
const fileInput = document.querySelector("#fileInput");
const urlInput = document.querySelector("#urlInput");
const loadUrlButton = document.querySelector("#loadUrlButton");
const trackName = document.querySelector("#trackName");
const emptyState = document.querySelector("#emptyState");
const modeButtons = document.querySelectorAll(".mode-button");
const themeButtons = document.querySelectorAll(".theme-button");
const sensitivityInput = document.querySelector("#sensitivity");
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

const galaxySeeds = Array.from({ length: 620 }, (_, index) => {
  const ring = index % 5;
  return {
    t: (Math.sin(index * 12.9898) * 43758.5453) % 1,
    a: index * 2.399963 + ring * 0.22,
    r: 0.22 + ring * 0.16 + (((index * 29) % 100) / 100) * 0.16,
    z: 0.56 + (((index * 47) % 100) / 100) * 0.7,
    phase: index * 0.41,
  };
});

const noteGlyphs = ["♪", "♫", "♬", "♩"];
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
    modeStellar: "星河声线",
    modeTerrain: "声波地貌",
    modeLaser: "激光厅",
    modeScanner: "光环扫描",
    modeVortex: "声波漩涡",
    modeWireform: "线场雕塑",
    modePsyfluid: "迷幻流体",
    themeAurora: "极光",
    themeEmber: "炽热",
    themeMono: "黑金",
    sensitivity: "灵敏度",
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
    ready: "选择音乐后即可开始。",
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
    modeStellar: "Stellar Line",
    modeTerrain: "Sound Terrain",
    modeLaser: "Laser Cathedral",
    modeScanner: "Light Scanner",
    modeVortex: "Sonic Vortex",
    modeWireform: "Wireform Sculpture",
    modePsyfluid: "Psy Fluid",
    themeAurora: "Aurora",
    themeEmber: "Ember",
    themeMono: "Black Gold",
    sensitivity: "Sensitivity",
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
    ready: "Choose music to begin.",
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
  const theme = themes[currentTheme];
  const alpha = 0.28;
  ctx.fillStyle = `rgba(${theme.ink}, ${alpha + features.energy * 0.12})`;
  ctx.fillRect(0, 0, width, height);
}

function drawRing(width, height, features) {
  const theme = themes[currentTheme];
  const cx = width / 2;
  const cy = height / 2;
  const size = Math.min(width, height);
  const radius = size * (0.18 + features.bass * 0.12 + features.beat * 0.025);
  const bars = 160;
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
    ctx.lineWidth = 2;
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
  const theme = themes[currentTheme];
  const cx = width / 2;
  const cy = height / 2;
  const rings = 34;
  const sensitivity = Number(sensitivityInput.value);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(frame * 0.006) * 0.08 + features.beat * 0.04);

  for (let r = rings; r > 0; r -= 1) {
    const depth = r / rings;
    const radius = Math.min(width, height) * (0.06 + depth * 0.58);
    const points = 96;
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
    ctx.lineWidth = 1 + depth * 2.2 + features.bass * 3 + features.beat * 2.5;
    ctx.stroke();
  }

  ctx.restore();
}

function drawCurtain(width, height, features) {
  const theme = themes[currentTheme];
  const cx = width / 2;
  const cy = height / 2;
  const baseWidth = Math.min(width * 0.82, 980);
  const columns = 112;
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
      ctx.lineWidth = 1.2 + amp * 3.5 + features.beat * 1.8;
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

  ctx.lineWidth = 2;
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
    ctx.lineWidth = 1 + features.beat * 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.78, radius * 0.36, Math.sin(frame * 0.004) * 0.08, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawStellar(width, height, features) {
  const cx = width * 0.58;
  const cy = height * 0.54;
  const size = Math.min(width, height);
  const sensitivity = Number(sensitivityInput.value);
  const baseline = height * 0.56;
  const leftEdge = width * 0.05;
  const rightEdge = width * 0.96;
  const waveHeight = size * (0.035 + features.mid * 0.08) * sensitivity;
  const galaxyRadius = size * (0.2 + features.bass * 0.08 + features.beat * 0.05);

  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${0.5 - Math.min(features.energy * 0.18, 0.18)})`;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  for (const star of starSeeds) {
    const twinkle = Math.sin(frame * 0.035 + star.phase) * 0.5 + 0.5;
    const x = star.x * width;
    const y = star.y * height;
    const radius = star.size + twinkle * features.treble * 3;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.18 + twinkle * 0.34 + features.treble * 0.22})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    if (twinkle > 0.86) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + features.treble * 0.28})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - radius * 3, y);
      ctx.lineTo(x + radius * 3, y);
      ctx.moveTo(x, y - radius * 3);
      ctx.lineTo(x, y + radius * 3);
      ctx.stroke();
    }
  }

  ctx.lineCap = "round";
  for (let pass = 0; pass < 4; pass += 1) {
    ctx.beginPath();
    for (let i = 0; i < timeData.length; i += 5) {
      const t = i / (timeData.length - 1);
      const wave = (timeData[i] - 128) / 128;
      const x = leftEdge + t * (rightEdge - leftEdge);
      const drift = Math.sin(t * Math.PI * 7 + frame * 0.018 + pass) * features.treble * 10;
      const y = baseline + wave * waveHeight * (1 + pass * 0.22) + drift;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.18 + pass * 0.12 + features.energy * 0.28})`;
    ctx.lineWidth = 1.4 + pass * 1.4 + features.beat * 3;
    ctx.stroke();
  }

  const pulseX = width * (0.2 + ((frame * 0.0018) % 0.7));
  const pulseY = baseline + Math.sin(frame * 0.027) * size * 0.08;
  const beamGradient = ctx.createLinearGradient(pulseX - 120, pulseY, pulseX + 90, pulseY);
  beamGradient.addColorStop(0, "rgba(255,255,255,0)");
  beamGradient.addColorStop(0.55, `rgba(255,255,255,${0.34 + features.beat * 0.48})`);
  beamGradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = beamGradient;
  ctx.lineWidth = 8 + features.beat * 8;
  ctx.beginPath();
  ctx.moveTo(pulseX - 150, pulseY - features.mid * 40);
  ctx.lineTo(pulseX + 80, pulseY + features.mid * 28);
  ctx.stroke();

  for (const seed of galaxySeeds) {
    const bin = Math.floor(seed.t * frequencyData.length * 0.68);
    const amp = ((frequencyData[bin] || 0) / 255) ** 1.15;
    const angle = seed.a + frame * 0.0025 * seed.z + amp * 0.6;
    const radius = galaxyRadius * seed.r * (0.86 + amp * sensitivity * 0.75);
    const spiral = angle + radius * 0.012;
    const x = cx + Math.cos(spiral) * radius * 1.58;
    const y = cy + Math.sin(spiral) * radius * 0.76 + Math.sin(frame * 0.012 + seed.phase) * amp * 18;
    const dot = 0.65 + amp * 2.9 + features.beat * 1.6;
    const alpha = 0.14 + amp * 0.78;

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, dot, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 22; i += 1) {
    const t = i / 21;
    const bin = Math.floor(t * frequencyData.length * 0.4);
    const amp = (frequencyData[bin] || 0) / 255;
    const x = width * (0.08 + t * 0.82);
    const y = baseline + Math.sin(frame * 0.018 + i) * size * 0.12 - amp * size * 0.18;
    const length = 18 + amp * 120 * sensitivity;
    ctx.strokeStyle = `rgba(255,255,255,${0.14 + amp * 0.54})`;
    ctx.lineWidth = 1 + amp * 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length * 0.38, y - length);
    ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${0.3 + amp * 0.64})`;
    ctx.beginPath();
    ctx.arc(x, y, 2 + amp * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (features.energy > 0.16) {
    ctx.font = `${Math.round(18 + features.energy * 24)}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 5; i += 1) {
      const bin = 20 + i * 28;
      const amp = (frequencyData[bin] || 0) / 255;
      if (amp < 0.22) continue;
      const x = cx + Math.cos(frame * 0.006 + i * 1.4) * galaxyRadius * (0.45 + i * 0.13);
      const y = cy + Math.sin(frame * 0.008 + i * 1.7) * galaxyRadius * 0.48;
      ctx.fillStyle = `rgba(255,255,255,${0.18 + amp * 0.52})`;
      ctx.fillText(noteGlyphs[i % noteGlyphs.length], x, y);
    }
  }

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, galaxyRadius * 2.2);
  glow.addColorStop(0, `rgba(255,255,255,${0.03 + features.energy * 0.12})`);
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

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
    ctx.lineWidth = 0.8 + (1 - depth) * 1.1 + features.beat * 1.4;
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
    ctx.lineWidth = 0.8 + amp * 1.2;
    ctx.stroke();
  }

  const beamY = horizon + Math.sin(frame * 0.017) * 10;
  const beam = ctx.createLinearGradient(0, beamY, width, beamY);
  beam.addColorStop(0, `rgba(255,196,94,${0.18 + features.bass * 0.28})`);
  beam.addColorStop(0.38, `rgba(245,244,216,${0.26 + features.energy * 0.36})`);
  beam.addColorStop(1, `rgba(64,224,216,${0.12 + features.treble * 0.24})`);
  ctx.strokeStyle = beam;
  ctx.lineWidth = 4 + features.beat * 5;
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
  ctx.lineWidth = 3 + features.beat * 3;
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
    ctx.lineWidth = 2 + features.beat * 2;
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
  ctx.lineWidth = Math.max(1, widthScale * 1.5);
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
  ctx.lineWidth = 1 + features.beat * 2;
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
  ctx.lineWidth = 2 + features.beat * 3;
  for (let i = 0; i < 5; i += 1) {
    const r = radius * (1 + i * 0.34 + features.energy * 0.12);
    ctx.beginPath();
    ctx.arc(cx, cy, r, sweep + i * 0.28, sweep + Math.PI * 1.45 + i * 0.2);
    ctx.stroke();
  }

  ctx.strokeStyle = `hsla(${warmHue}, 100%, 62%, ${0.32 + features.bass * 0.45})`;
  ctx.lineWidth = 3 + features.beat * 4;
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
  const theme = themes[currentTheme];
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
    ctx.lineWidth = 0.8 + (1 - depth) * 1.5 + features.beat * 1.8;
    ctx.stroke();
  }

  for (let i = 0; i < 18; i += 1) {
    const angle = frame * 0.018 + i * 0.72;
    const amp = (frequencyData[10 + i * 8] || 0) / 255;
    const r1 = hole * (1.2 + amp);
    const r2 = maxRadius * (0.52 + amp * 0.28);
    ctx.strokeStyle = `hsla(${theme.base + i * 11}, 100%, 68%, ${0.06 + amp * 0.22})`;
    ctx.lineWidth = 1 + amp * 3;
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
  ctx.lineWidth = 2 + features.beat * 4;
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
  ctx.lineWidth = 1;
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
    ctx.lineWidth = 0.8 + layer * 0.35 + features.beat * 1.4;
    ctx.stroke();
  }

  for (let slice = -6; slice <= 6; slice += 1) {
    const y = slice * sculptureRadius * 0.19 + Math.sin(frame * 0.018 + slice) * features.mid * 22;
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + Math.abs(slice) * 0.012 + features.treble * 0.18})`;
    ctx.lineWidth = 1 + features.beat;
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
    ctx.lineWidth = 1.1 + features.beat * 1.8 + depth * 1.4;
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

function render() {
  frame += 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const features = audioFeatures();

  clearStage(width, height, features);

  if (currentMode === "ring") drawRing(width, height, features);
  if (currentMode === "tunnel") drawTunnel(width, height, features);
  if (currentMode === "curtain") drawCurtain(width, height, features);
  if (currentMode === "stellar") drawStellar(width, height, features);
  if (currentMode === "terrain") drawTerrain(width, height, features);
  if (currentMode === "laser") drawLaserCathedral(width, height, features);
  if (currentMode === "scanner") drawLightScanner(width, height, features);
  if (currentMode === "vortex") drawSonicVortex(width, height, features);
  if (currentMode === "wireform") drawWireformSculpture(width, height, features);
  if (currentMode === "psyfluid") drawPsyFluid(width, height, features);

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

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  setAudioSource(url, file.name);
  setStatus("localLoaded");
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
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    themeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentTheme = button.dataset.theme;
  });
});

recordButton.addEventListener("click", () => {
  if (recorder?.state === "recording") {
    recorder.requestData();
    recorder.stop();
    recordButton.textContent = t("startRecording");
    return;
  }

  if (!window.MediaRecorder || !canvas.captureStream) {
    setStatus("unsupportedRecord");
    return;
  }

  const canvasStream = canvas.captureStream(30);
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
