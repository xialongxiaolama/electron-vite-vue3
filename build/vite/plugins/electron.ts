import createElectronPlugin from 'vite-plugin-electron/simple'
import fs from 'node:fs'
import path from 'node:path';

let pkg:any
try {
   pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'),'utf-8')) || {}
} catch (error) {
   
}
fs.rmSync('dist',{ recursive:true, force:true })
// console.log(`output->pkg`,pkg)
export const electronBuild = ( isBuild: boolean )=>{

 return createElectronPlugin({
    main:{
      entry:'electron/main/index.ts',
      vite:{
        build: {
          minify: isBuild,
          outDir: 'dist/electron/main',
        },
      }
    },
    preload:{
      input: 'electron/preload/index.ts',
      vite: {
        build: {
          sourcemap: 'inline',
          minify: isBuild,
          outDir: 'dist/electron/preload'
        },
      },
    },
    renderer:{}
  })
}