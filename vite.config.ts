import { UserConfig , defineConfig , ConfigEnv, loadEnv} from 'vite'
import path from 'node:path'
import { createVitePlugins } from './build/vite/plugins/index'
import { wrapperEnv } from './build/utils'

// https://vite.dev/config/
export default defineConfig(( { command, mode } : ConfigEnv): UserConfig => {
  const isBuild = command === 'build'
  const root = process.cwd() // node 命令执行的目录  __dirname 文件模块执行的实际目录
  const env = loadEnv(mode, root) //加载指定模式下的.env文件 .类似于dotenv
  const viteEnv = wrapperEnv(env)
  return {
    resolve:{
      alias:{
        '@': path.resolve(__dirname,'./src'),
        '#': path.resolve(__dirname,'./types'),
      }
    },
    build:{
      minify: 'esbuild',
      rollupOptions: {
        treeshake: true,
      },
    },
    server:{
      port:  7366,//端口号 vite 默认5177
      host:true , //暴露ip
      cors:true,
    },
    plugins: createVitePlugins(viteEnv,isBuild),
    css:{
      preprocessorOptions:{
        scss:{
          api:'modern-compiler'
        }
      }
    }
  } 
})
