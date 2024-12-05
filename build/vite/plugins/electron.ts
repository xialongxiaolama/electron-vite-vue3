import createElectronPlugin from 'vite-plugin-electron/simple'
import fs from 'node:fs'
import path from 'node:path';
let pkg:any
try {
   pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'),'utf-8')) || {}
} catch (error) {
   
}
// console.log(`output->pkg`,pkg)
export const electronBuild = ( isBuild: boolean )=>{
  fs.rmSync('dist-electron',{ recursive:true, force:true })
  const sourcemap = !isBuild 
  
 return createElectronPlugin({
    main:{
      entry:'electron/main/index.ts',
      onstart({startup}){
        startup()
      },
      vite:{
        build: {
          sourcemap,
          minify: isBuild,
          outDir: 'dist-electron/main',
          rollupOptions: {
            // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons, 
            // we can use `external` to exclude them to ensure they work correctly.
            // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
            // Of course, this is not absolute, just this way is relatively simple. :)
            external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
          },
        },
      }
    },
    preload:{
      input: 'electron/preload/index.ts',
      vite: {
        build: {
          sourcemap: sourcemap ? 'inline' : undefined, // #332
          minify: isBuild,
          outDir: 'dist-electron/preload',
          rollupOptions: {
            external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
          },
        },
      },
    },
    renderer:{}
  })
}