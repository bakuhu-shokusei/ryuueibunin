// https://shellyln.github.io/tynder/playground.html
export interface Book {
  book: string
  index: string[]
  opening?: string[]
  positions: {
    name: string
    name2?: string
    name3?: string
    note?: string[]
    opening?: string[]
    indexPath: string
    groups: {
      name?: string
      members: string
      note?: string[]
      opening?: string[]
      ending?: string[]
    }[]
  }[]
}

export interface Member {
  page: number
  note?: string[]
  info: string[]
  tree?: string // e.g. "xxx,2,2", "xx,2"
}
