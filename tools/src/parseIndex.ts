import { resolve, dirname } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const indexPath = resolve(__dirname, '../../content/index.txt')

export interface Position {
  bookNumber: number
  page: number
}

export interface Entity {
  name: string
  name2?: string
  positions?: Position[]
  children?: Entity[]
}

interface Indexes {
  [s: string]: Entity[]
}

function readIndexFile(): string {
  return readFileSync(indexPath).toString()
}

function parseString(content: string): {
  indexes: Indexes
  newNames: Set<string>
} {
  const result: Indexes = {}
  const lines = content.split('\n')
  const newNames = new Set<string>()

  let kana = ''
  let parent: Entity | undefined = undefined

  lines.forEach((line) => {
    line = line.trimEnd()

    // empty line: reset
    if (line.length === 0) {
      kana = ''
      parent = undefined
      return
    }

    // あいうえお
    if (/^[\u3040-\u309F]+$/.test(line)) {
      kana = line
      return
    }

    let [name, pageInfo] = line.trim().split(' ')
    const entity: Entity = {
      name,
    }
    if (name.includes('=')) {
      const [a, b] = name.split('=')
      entity.name = a
      entity.name2 = b
      const filter = (s: string) => {
        return s && !s.startsWith('家') && s !== '伽'
      }
      if (filter(a) && filter(b)) {
        newNames.add(b)
      }
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

  return { indexes: result, newNames }
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

function parse(): {
  indexes: Indexes
  newNames: Set<string>
  newNameMapping: Record<string, string>
} {
  const { indexes, newNames } = parseString(readIndexFile())
  const _newNames = new Set<string>()
  const newNameMapping: Record<string, string> = {}
  Object.values(indexes)
    .flat()
    .forEach((e) => {
      if (e.name2) return
      const name = e.name.split('(')[0]
      if (newNames.has(name)) {
        _newNames.add(e.name)
        newNameMapping[name] = e.name
      }
    })
  return { indexes, newNames: _newNames, newNameMapping }
}

const { indexes: index, newNames, newNameMapping } = parse()
export { index, newNames, newNameMapping }
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
