/**
 * @name vueRouterPlugin
 * @description: 动态生成路由
 */

import VueRouter from 'unplugin-vue-router/vite'
// import Layouts from 'vite-plugin-vue-layouts';
/**
 *  为自动生成的路由生成 外层layout布局
 * 
 * src/
    ├── layouts/
    │   ├── DefaultLayout.vue   // 默认布局
    │   ├── AdminLayout.vue     // 管理后台布局
    ├── pages/
    │   ├── Home.vue
    │   ├── About.vue
    │   ├── admin/
    │   │   ├── Dashboard.vue
    │   │   ├── Settings.vue
 * 
 *  */
// 未生效
// export const vueRouterLayoutPlugin = () => {
//   return Layouts({
//     layoutsDirs: '/src/layout',
//     pagesDirs: '/src/views'
//   })
// }

export const vueRouterPlugin = () => {
  return VueRouter({
    routesFolder: [
      // {
      //   src: 'src/layout',
      //   path: '',
      //   // exclude: ['**/components/**'],
      // },
      {
        src: 'src/views',
        path: '',
      },
    ], //生成路由文件夹
    dts: 'types/typed-router.d.ts', //生成路由类型文件
    extensions: ['.page.vue', '.vue', '.md'], //生成路由的扩展名
    exclude: ['**/components/**'], //排除生成路由的文件夹
  })
}
