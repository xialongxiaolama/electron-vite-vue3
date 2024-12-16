import { createRouter, createWebHashHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import layout from './layout'

layout[0].children = routes

const router = createRouter({
  history: createWebHashHistory(),
  routes: layout,
})

if (import.meta.hot) {
  handleHotUpdate(router)
}
router.beforeEach((to, from, next) => {
  console.log(`output->to`,to)
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
