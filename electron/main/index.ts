import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
// import.meta.url 当前文件的路径
// fileURLToPath 将url转换为文件路径 可以兼容跨平台
// file:///D:/workspace/electron/electron-vite-vue/dist-electron/main/index.js 转化为 D:\workspace\electron\electron-vite-vue\dist-electron\main
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')

// 热更新文件路径
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
//打包静态文件
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
//vite 本地开发地址
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL //http://localhost:7366/


// public目录 开发环境/生产环境
const VITE_PUBLIC = (process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST)

//6.1的系统禁用硬盘加速
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

//获取实例锁 ,获取失败代表已经有一个实例,则退出
const getLock = app.requestSingleInstanceLock()
if (!getLock) {
  app.quit()
  process.exit(0)
} else {
  // 试图创建第二实例时 , 如果应用最小化恢复窗口 , 或者聚焦
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

app.on('activate',()=>{
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length===0) {
    createWindow()
  }else{
    allWindows[0].focus()
  }
})

// handle 异步返回ipcRenderer渲染进程的请求信息
ipcMain.handle('open-win',(_,arg)=>{
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      sandbox: true
    },
  })
  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

export function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    frame: false,//关闭边框（标题栏，工具栏等）
    titleBarStyle: 'hidden',//隐藏标题栏
    useContentSize: true,
    transparent: false,
    icon: path.join(VITE_PUBLIC, 'icon_rui.ico'),
    webPreferences: {
      sandbox: true,                // 启用沙盒模式 
      nodeIntegration: false,       // 渲染进程是否Node.js 集成
      contextIsolation: true,      //  是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本. 默认为 true
      preload, //预加载文件 可以向渲染进程暴露 Node.js API
    },
  })

  // 开发环境或者打包后的加载路径
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win?.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  //加载完成
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // 渲染进程中请求创建一个新窗口之前被调用
  win.webContents.setWindowOpenHandler(({ url }) => {
    // 使用桌面默认的应用打开
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}
