/**
 * @name AutoImport
 * @description 自动导入Vue API 
 */

import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { VueRouterAutoImports } from 'unplugin-vue-router';
export const AutoImportDeps = () => {
  return AutoImport({
    dts:'types/auto-imports.d.ts',
    imports:[
      'vue',
      'pinia',
      {
        '@vueuse/core': [],
      },
      VueRouterAutoImports,
    ],
    resolvers: [ElementPlusResolver()],
  })
}