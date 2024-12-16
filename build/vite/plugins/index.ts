import vue from '@vitejs/plugin-vue'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { electronBuild } from './electron'
import { PluginOption } from 'vite'
import { vueRouterPlugin } from './vueRouter'
import { AutoImportDeps } from './autoImport';
import { AutoRegistryComponents } from './components'
import { ConfigProgressPlugin } from './progress'
import { ConfigRestartPlugin } from './restart';
import { SvgIconsPlugin } from './svgIcon';
import { configUnocss } from './unocss';
import { ConfigCompressPlugin } from './compress';
// import { customConsoleLog } from './log'
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_USE_MOCK, VITE_USE_COMPRESS } = viteEnv;
  // console.log('扩展参数', viteEnv)
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    //自动生成路由 要放在vue前
    vueRouterPlugin(),
    
    vue(),

    // setup自动导入ref等语法糖
    vueSetupExtend(),
  ]
  
  //自动引入SVG图标
  vitePlugins.push(SvgIconsPlugin(isBuild))
  
  //自动导入Vue API ref 等
  vitePlugins.push(AutoImportDeps())

  //自动导入组件
  vitePlugins.push(AutoRegistryComponents())

  // electron 构建
  vitePlugins.push(electronBuild(isBuild))
  
  // 自动重启
  vitePlugins.push(ConfigRestartPlugin())

  // UnoCSS支持
  vitePlugins.push(configUnocss())

  // 自定义打印 不需要
  // vitePlugins.push(customConsoleLog())

  //构建显示进度条
  vitePlugins.push(ConfigProgressPlugin())

  // if (isBuild) {
  //   // gz压缩  rollup-plugin-gzip
  //   vitePlugins.push(ConfigCompressPlugin());
  // }

  return vitePlugins
}
