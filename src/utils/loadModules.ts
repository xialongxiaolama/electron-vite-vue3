import { ImportGlobOptions } from 'vite'

/**
 * @description: 动态加载模块
 * @param {string | string[]} pattern
 * @param {ImportGlobOptions<boolean, any>} options
 * @return {*}
 */
// const modules:any = import.meta.glob('./*.vue',{ eager: true , import:'default' })

// const loadModules: Record<string, any> = {}
// Object.keys(modules).forEach((key)=>{
//   const name = key.replace(/^.*\/|\.vue$/g, '')
//   loadModules[name] = modules[key]
// })
// export  default loadModules