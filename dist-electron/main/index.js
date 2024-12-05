import { app, BrowserWindow, ipcMain, shell } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "../..");
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const VITE_PUBLIC = process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();
let win = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});
const getLock = app.requestSingleInstanceLock();
if (!getLock) {
  app.quit();
  process.exit(0);
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length === 0) {
    createWindow();
  } else {
    allWindows[0].focus();
  }
});
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      sandbox: true
    }
  });
  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    frame: false,
    //关闭边框（标题栏，工具栏等）
    titleBarStyle: "hidden",
    //隐藏标题栏
    useContentSize: true,
    transparent: false,
    icon: path.join(VITE_PUBLIC, "icon_rui.ico"),
    webPreferences: {
      sandbox: true,
      // 启用沙盒模式 
      nodeIntegration: false,
      // 渲染进程是否Node.js 集成
      contextIsolation: true,
      //  是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本. 默认为 true
      preload
      //预加载文件 可以向渲染进程暴露 Node.js API
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win == null ? void 0 : win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL,
  createWindow
};
//# sourceMappingURL=index.js.map
