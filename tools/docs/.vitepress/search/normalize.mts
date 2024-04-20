import { old2NewMap } from './data.mjs'

export function processTerm(s: string): string {
  s = s.replace(/[〔〕\(\)]/g, '') // TODO
  return old2New(s)
}

export function old2New(s: string): string {
  return s
    .split('')
    .map((i) => {
      if (old2NewMap[i]) return old2NewMap[i]
      return i
    })
    .join('')
}
