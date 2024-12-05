export interface theme {
  theme: 'light' | 'dark'
  asideBg: string
  headerBg: string
  mainBg: string
  [key: string]: unknown
}
export type asideType = 'left' | 'right'| 'none'

export interface layout{
  asideDisplay: asideType,
  [key: string]: unknown
}