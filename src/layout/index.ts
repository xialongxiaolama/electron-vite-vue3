//TODO:动态加载不成功
// eager true 同步加载组件 false 异步加载组件
// const modules:any = import.meta.glob('./*.vue',{ eager: true , import:'default' })

// const loadModules: Record<string, any> = {}
// Object.keys(modules).forEach((key)=>{
//   const name = key.replace(/^.*\/|\.vue$/g, '')
//   loadModules[name] = modules[key]
// })
// export  default loadModules
 
export { default as Main } from './components/Main.vue'
export { default as Aside } from './components/Aside.vue'
export { default as Header } from './components/Header.vue'
export { default as Footer } from './components/Footer.vue'