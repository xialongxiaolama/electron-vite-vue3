import type { VNodeChild } from 'vue'

declare global {
  export type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }

  declare type Recordable<T = any> = Record<string, T>
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }

  declare interface ViteEnv {
    VITE_OPEN_PROXY?: Boolean
    VITE_USE_COMPRESS: Boolean
    VITE_USE_MOCK: Boolean
    command: string
  }
}
