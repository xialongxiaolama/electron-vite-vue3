import { Plugin } from 'vite'
export const customConsoleLog = ():Plugin => {
  return {
    name:'vite-plugin-custom-log',
    transform(code, id) {
      // 确保只处理 JS/TS 文件，避免干扰其他文件类型
      if (/\.(js|ts|vue)$/.test(id)) {
        // 使用正则表达式查找并替换 console.log 调用
        const transformedCode = code.replace(/console\.log\(([^)]+)\)/g, (match, p1) => {
          // 输出格式化后的 console.log 调用，带有自定义样式
          return `console.log('%cCustom Log:', 'color: blue; font-weight: bold;', ${p1})`;
        });
        return {
          code: transformedCode,
          map: null // 可选的 source map 支持
        };
      }
      return null; // 如果不匹配，返回 null，表示不处理
    }
  }
}