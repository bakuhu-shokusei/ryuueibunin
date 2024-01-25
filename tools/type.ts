interface Book {
  book: string
  index: string[]
  content: {
    name: string
    name2?: string
    note?: string
    groups: {
      name?: string
      members: string
      note?: string
      opening?: string[]
      ending?: string[]
      page_start: number
      page_end: number
    }[]
  }[]
}
