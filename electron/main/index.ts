import { app, BrowserWindow, shell, ipcMain , session} from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'url';
import os from 'node:os'
// Or if you can not use ES6 imports

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

//6.1的系统禁用硬盘加速
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()
// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// 模拟COMMONJS 中的 __dirname , module中无法使用
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const ROOT_PATH = {
  // /dist
  dist: path.join(__dirname, '../..'),
  // /dist or /public
  public: path.join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}
console.log(__dirname)

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = path.join(__dirname, '../preload/index.mjs')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `${process.env['VITE_DEV_SERVER_URL']}`

const indexHtml = path.join(ROOT_PATH.dist, 'index.html')



process.env.APP_ROOT = path.join(__dirname, '../..')

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
  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})

export function createWindow() {

  win = new BrowserWindow({
    title: '桌面端',
    frame: false,//关闭边框（标题栏，工具栏等）
    titleBarStyle: 'hidden',//隐藏标题栏
    useContentSize: true,
    transparent: false,
    icon: path.join(ROOT_PATH.public, 'icon_rui.ico'),
    webPreferences: {
      sandbox: true,                // 启用沙盒模式 
      nodeIntegration: true,       // 渲染进程是否Node.js 集成
      contextIsolation: true,      //  是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本. 默认为 true
      preload, //预加载文件 可以向渲染进程暴露 Node.js API
    },
  })

  // 开发环境或者打包后的加载路径
  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
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
