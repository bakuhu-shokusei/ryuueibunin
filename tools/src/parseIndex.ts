import { resolve, dirname } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const indexPath = resolve(__dirname, '../../index.txt')

interface Position {
  bookNumber: number
  page: number
}

export interface Entity {
  name: string
  positions?: Position[]
  children?: Entity[]
}

interface Indexes {
  [s: string]: Entity[]
}

function readIndexFile(): string {
  return readFileSync(indexPath).toString()
}

function parseString(content: string): Indexes {
  const result: Indexes = {}
  const lines = content.split('\n')

  let kana = ''
  let parent: Entity | undefined = undefined

  lines.forEach((line) => {
    if (line.length === 0) {
      kana = ''
      parent = undefined
      return
    }
    if (line.length === 1) {
      kana = line
      return
    }
    const [name, pageInfo] = line.trim().split(' ')
    const entity: Entity = {
      name,
    }
    if (pageInfo) {
      entity.positions = parsePageInfo(pageInfo)
    }
    if (line[0] === ' ') {
      parent!.children = parent?.children || []
      parent!.children.push(entity)
    } else {
      parent = entity

      if (!result[kana]) result[kana] = []
      result[kana].push(entity)
    }
  })

  return result
}

function parsePageInfo(s: string): Position[] {
  return s.split(';').flatMap((i) => {
    const [bookNumber, _pages] = i.split(':')
    const pages = _pages.split(',')
    return pages.map((page) => ({
      bookNumber: parseInt(bookNumber),
      page: parseInt(page),
    }))
  })
}

function parse(): Indexes {
  return parseString(readIndexFile())
}

export const index = parse()

export type IndexPath = [string, number, number?] // e.g. あ, 2, 1
const reverseIndex: Record<string, IndexPath[]> = {}
Object.entries(index).forEach(([kana, entities]) => {
  entities.forEach((entity, idx1) => {
    if (entity.positions) {
      entity.positions.forEach((p) => {
        const key = `${p.bookNumber}:${p.page}`
        if (!reverseIndex[key]) reverseIndex[key] = []
        reverseIndex[key].push([kana, idx1])
      })
    }
    if (entity.children) {
      entity.children.forEach((c, idx2) => {
        if (c.positions) {
          c.positions.forEach((p) => {
            const key = `${p.bookNumber}:${p.page}`
            if (!reverseIndex[key]) reverseIndex[key] = []
            reverseIndex[key].push([kana, idx1, idx2])
          })
        }
      })
    }
  })
})
export { reverseIndex }
