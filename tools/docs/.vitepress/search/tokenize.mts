export function tokenize(s: string): string[] {
  return s.split(' ').flatMap((i): string[] => {
    const length = i.length
    if (length === 5 && i.endsWith('守')) {
      return [i.substring(0, 2), i.substring(2)]
    }
    return [i]
  })
}
