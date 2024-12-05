import type { RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'

const router: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: Layout,
    children: [],
  },
]

export default router
