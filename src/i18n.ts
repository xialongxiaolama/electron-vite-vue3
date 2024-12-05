import { createI18n } from 'vue-i18n'
//加载所有语言包
const modules: any = import.meta.glob('./locales/*.json', {
  eager: true,
  import: 'default',
})

const messages: Record<string, any> = {}
Object.keys(modules).forEach((key) => {
  const name = key.replace(/^.*\/|\.json$/g, '')
  messages[name] = modules[key]
})

export default createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages,
})
