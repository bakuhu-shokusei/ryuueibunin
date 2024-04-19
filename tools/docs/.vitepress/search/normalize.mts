import { old2NewMap } from './data.mjs'

export function processTerm(s: string): string {
  return s
    .replace(/[〔〕\(\)]/g, '')
    .split('')
    .map((i) => {
      if (old2NewMap[i]) return old2NewMap[i]
      return i
    })
    .join('')
}

export const new2OldMap: Record<string, string> = {}
for (const [k, v] of Object.entries(old2NewMap)) {
  new2OldMap[v] = (new2OldMap[v] || '') + k
}
