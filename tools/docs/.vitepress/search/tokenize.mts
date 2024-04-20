import { gokumei, seimei, kanshoku } from './data.mjs'
export function tokenize(s: string): string[] {
  return s.split(' ').flatMap((i): string[] => {
    const sm = i.match(suffixMatch)
    if (sm) {
      return [sm[1], sm[2]]
    }
    const pm = i.match(prefixMatch)
    if (pm) {
      return [pm[1], pm[2]]
    }
    return [i]
  })
}

const suffixMatch = new RegExp(
  `^(.+)(${[...gokumei, ...kanshoku]
    .sort((a, b) => b.length - a.length)
    .join('|')})$`
)
const prefixMatch = new RegExp(
  `^(${seimei.sort((a, b) => b.length - a.length).join('|')})(.{2,})$`
)
