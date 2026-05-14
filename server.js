import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4177);
const host = process.env.HOST || "0.0.0.0";
const parserCommand = process.env.VIDEO_PARSER || "python3";
const parserPrefixArgs = process.env.VIDEO_PARSER ? [] : ["-m", "yt_dlp"];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function safePageUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return parsed.href;
  } catch {
    return "";
  }
}

function runParser(args, response) {
  const child = spawn(parserCommand, [...parserPrefixArgs, ...args], { stdio: ["ignore", "pipe", "pipe"] });
  let stderr = "";

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  child.on("error", () => {
    sendJson(response, 500, {
      error: "本地没有找到 yt-dlp。请先运行 pip3 install yt-dlp。",
    });
  });

  return { child, getStderr: () => stderr.trim() };
}

async function handleResolve(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pageUrl = safePageUrl(requestUrl.searchParams.get("url") || "");

  if (!pageUrl) {
    sendJson(response, 400, { error: "请提供有效的视频页面链接。" });
    return;
  }

  const { child, getStderr } = runParser(["--dump-single-json", "--no-playlist", pageUrl], response);
  let stdout = "";
  let didError = false;

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });

  child.on("error", () => {
    didError = true;
  });

  child.on("close", (code) => {
    if (didError) return;
    if (code !== 0) {
      sendJson(response, 502, { error: getStderr() || "视频链接解析失败。" });
      return;
    }

    try {
      const info = JSON.parse(stdout);
      const streamUrl = `/api/stream?url=${encodeURIComponent(pageUrl)}`;
      sendJson(response, 200, {
        title: info.title || "视频音频",
        duration: info.duration || 0,
        extractor: info.extractor || "",
        streamUrl,
      });
    } catch {
      sendJson(response, 502, { error: "解析器返回了无法读取的数据。" });
    }
  });
}

async function handleStream(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pageUrl = safePageUrl(requestUrl.searchParams.get("url") || "");

  if (!pageUrl) {
    sendJson(response, 400, { error: "请提供有效的视频页面链接。" });
    return;
  }

  const args = ["-f", "bestaudio/best", "--no-playlist", "--no-part", "-o", "-", pageUrl];
  const child = spawn(parserCommand, [...parserPrefixArgs, ...args], { stdio: ["ignore", "pipe", "pipe"] });
  let stderr = "";
  let headersSent = false;
  let childClosed = false;

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  child.on("error", () => {
    if (!headersSent) {
      sendJson(response, 500, {
        error: "本地没有找到 yt-dlp。请先运行 pip3 install yt-dlp。",
      });
    }
  });

  child.stdout.once("data", (chunk) => {
    headersSent = true;
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "audio/webm",
    });
    response.write(chunk);
    child.stdout.pipe(response);
  });

  child.on("close", (code) => {
    childClosed = true;
    if (!headersSent && code !== 0) {
      sendJson(response, 502, { error: stderr.trim() || "视频音频流读取失败。" });
      return;
    }

    if (!response.destroyed) response.end();
  });

  response.on("close", () => {
    if (!childClosed) child.kill("SIGTERM");
  });
}

async function handleStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = requestUrl.pathname === "/" ? "/index.html" : decodeURIComponent(requestUrl.pathname);
  const filePath = normalize(join(root, pathname));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    await access(filePath);
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");

    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

createServer((request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  if (request.url.startsWith("/api/resolve")) {
    handleResolve(request, response);
    return;
  }

  if (request.url.startsWith("/api/stream")) {
    handleStream(request, response);
    return;
  }

  handleStatic(request, response);
}).listen(port, host, () => {
  console.log(`Music visualizer running at http://${host}:${port}`);
  console.log(`Video parser command: ${[parserCommand, ...parserPrefixArgs].join(" ")}`);
});
