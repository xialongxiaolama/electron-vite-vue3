import { defineStore } from 'pinia'
import { layout , asideType } from './types'
 const useLayoutStore = defineStore('layout', {
  state: ():layout => ({
    asideDisplay: 'none',
    headerDisplay: true,
    footerDisplay: true,
    isFullScreen: false,
  }),
  persist: {
    key: 'layout',
    storage: localStorage,
    paths:['layout']
  },
  actions: {
    setAsidePosition(position: asideType) {
      this.asidePosition = position
    }
  }
})

export default useLayoutStore