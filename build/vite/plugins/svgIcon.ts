/**
 * @name SvgIconsPlugin
 * @description svg图标自动按需引入
 */
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export const SvgIconsPlugin = (isBuild: boolean) => {

   return createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',
    svgoOptions: isBuild,
  });
}