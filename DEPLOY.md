# 看见音乐对外访问部署说明

当前项目已经整理成一个对外展示网站，可以通过 Node.js 服务对外提供访问。推荐使用服务端部署，因为这样能保留 YouTube、B 站等公开视频页面的音频解析能力。

## 本地访问

```bash
cd /Users/shenjiwei/看见音乐
npm run start
```

打开：

```text
http://localhost:4177
```

## 对外访问方式

### 方式一：Render

项目已提供 `render.yaml`，适合直接部署为 Web Service。

建议流程：

1. 把本目录推送到 GitHub 仓库。
2. 在 Render 创建 Blueprint 或 Web Service。
3. Build Command 使用：

```bash
npm install && pip3 install --user yt-dlp
```

4. Start Command 使用：

```bash
npm run start
```

5. 环境变量保留：

```text
HOST=0.0.0.0
```

Render 会自动注入 `PORT`，项目已经在 `server.js` 中读取 `process.env.PORT`。

部署后平台会提供公网 URL，可再绑定自定义域名。

### 方式二：Railway / Fly.io / 其他 Node.js 平台

适合当前版本，因为项目包含视频链接解析服务。

部署配置：

- Build Command: `npm install && pip3 install --user yt-dlp`
- Start Command: `npm run start`
- Port: 使用平台自动注入的 `PORT`

### 方式三：部署到自己的服务器

```bash
git clone <repo>
cd 看见音乐
pip3 install yt-dlp
npm run start
```

然后用 Nginx / Caddy 把公网域名反向代理到：

```text
http://127.0.0.1:4177
```

### 方式四：只部署静态页面

如果只需要本地上传和音频直链，可以把以下文件部署到任意静态托管：

- `index.html`
- `styles.css`
- `app.js`
- `favicon.svg`
- `site.webmanifest`
- `robots.txt`

限制：静态托管无法解析 YouTube / B 站等视频页面链接，因为这需要 `server.js` 和 `yt-dlp`。

## 依赖

- Node.js
- Python 3
- yt-dlp：用于解析公开视频页面音频流

```bash
pip3 install yt-dlp
```

## 发布前检查

```bash
npm run start
```

打开公网或本地地址后确认：

- 页面标题显示“看见音乐”。
- 首屏文案显示“看见音乐之美”。
- 可以上传本地音频并播放。
- 可以切换五种视觉模式和三种主题。
- 可以进入沉浸模式。
- 如部署了服务端，可以解析公开视频页面链接。
