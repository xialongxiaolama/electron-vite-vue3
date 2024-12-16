import { devtools } from '@vue/devtools'
import { createApp } from 'vue'
import '@/assets/styles/style.css'
import router from './router'
import App from './App.vue'
import pinia from '@/store/index'
import i18n from './i18n'

// 导入svg 引入文件
import 'virtual:svg-icons-register'
import 'uno.css'
import 'virtual:uno.css'

if (process.env.NODE_ENV === 'development') {
  devtools.connect()
}
const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(pinia)
// 加载完成清除preload中加载等待
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})

