import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { books, readMember, kan2Book } from './search.js'
import { Entity, Position, index } from './parseIndex.js'
import { compareTwoStrings } from 'string-similarity'
import { Book } from './type.js'

import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface Output {
  [s: string]: {
    book: number
    kan: number
    startPage: number
    endPage: number
    path: string
    displayName: string
    names: Set<string>
    positions: Book['positions']
  }[]
}

const output: Output = {}

books.forEach((book, idx1) => {
  const bookPath = resolve(resolve(__dirname, '../docs/content'), `${idx1 + 1}`)
  output[book.book] = []
  rmSync(bookPath, { recursive: true, force: true })
  mkdirSync(bookPath, { recursive: true })

  let previousInfo: Output[string][number] | undefined
  let previousPositions: Book['positions'] = []
  book.positions.forEach((position, idx2) => {
    const name = position.name2 || position.name
    const [_book, _page] = position.groups[0].id.split('-')
    const lastGroupMembers = readMember(
      position.groups[position.groups.length - 1].members
    )
    const endPage =
      lastGroupMembers[lastGroupMembers.length - 1]?.page || parseInt(_page)

    const initInfo = () => {
      previousInfo = {
        book: parseInt(_book),
        kan: idx1 + 1,
        startPage: parseInt(_page),
        endPage,
        path: '',
        displayName: name,
        names: new Set(
          [position.name, position.name2 || '', position.name3 || ''].filter(
            Boolean
          )
        ),
        positions: [],
      }
    }

    if (previousInfo === undefined) {
      initInfo()
      previousPositions.push(position)
      if (idx2 === book.positions.length - 1) {
        previousInfo!.positions.push(...previousPositions)
        output[book.book].push(previousInfo!)
      }
      return
    }

    if (name === previousInfo.displayName) {
      previousInfo.endPage = endPage
      ;[position.name, position.name2 || '', position.name3 || '']
        .filter(Boolean)
        .forEach((i) => previousInfo!.names.add(i))
      previousPositions.push(position)
    } else {
      const ppInfo = output[book.book][output[book.book].length - 1]
      if (previousInfo.endPage === ppInfo?.endPage) {
        ppInfo.positions.push(...previousPositions)
        ppInfo.displayName += `-${previousInfo.displayName}`
        for (const name of previousInfo.names) {
          ppInfo.names.add(name)
        }
        ppInfo.endPage = previousInfo.endPage
        previousInfo = ppInfo
      } else {
        previousInfo.positions.push(...previousPositions)
        output[book.book].push(previousInfo)
      }
      previousPositions = [position]
      initInfo()
    }

    if (idx2 === book.positions.length - 1) {
      const ppInfo = output[book.book][output[book.book].length - 1]
      if (previousInfo.endPage === ppInfo?.endPage) {
        ppInfo.positions.push(...previousPositions)
        ppInfo.displayName += `-${previousInfo.displayName}`
        for (const name of previousInfo.names) {
          ppInfo.names.add(name)
        }
        ppInfo.endPage = previousInfo.endPage
        previousInfo = ppInfo
      } else {
        previousInfo.positions.push(...previousPositions)
        output[book.book].push(previousInfo)
      }
    }
  })
})

function writeMdFiles() {
  Object.values(output)
    .flat()
    .forEach((i) => {
      i.path += `${i.book}-${String(i.startPage).padStart(3, '0')}-${String(
        i.endPage
      ).padStart(3, '0')}.md`
      const path = resolve(
        resolve(__dirname, '../docs/content'),
        `${i.kan}/${i.path}`
      )
      writeFileSync(path, i.positions.map(createMd).join('\n\n'))
    })
}
writeMdFiles()

function createMd(p: Book['positions'][number]) {
  const buffer: string[] = []

  buffer.push(`# ${p.name}`)

  if (p.note) {
    buffer.push(
      `<Note type="tip">
${p.note.join('<br>\n')}
</Note>`
    )
  }

  if (p.opening) {
    buffer.push(
      `<Note type="info">
${p.opening.join('<br>\n')}
</Note>`
    )
  }

  p.groups.forEach((g) => {
    if (g.name) {
      buffer.push(`## ${g.name}`)
    }

    if (g.note) {
      buffer.push(
        `<Note type="tip">
${g.note.join('<br>\n')}
</Note>`
      )
    }

    if (g.opening) {
      buffer.push(
        `<Note type="info">
${g.opening.join('<br>\n')}
</Note>`
      )
    }

    const members = readMember(g.members)
    if (members.length > 0) {
      const table: string[] = []
      table.push('| 任免 | 姓名 |')
      table.push('| :--- | ---: |')
      function createTableData(s: string[] | undefined): string {
        if (!s) return ''
        return s.map((i) => i.replace(/(?<!\\)\|/g, '\\|')).join('<br>')
      }
      members.forEach((m) => {
        table.push(
          `| ${createTableData(m.note)} | ${createTableData(m.info)} |`
        )
      })
      buffer.push(table.join('\n'))
    }

    if (g.ending) {
      buffer.push(
        `<Note type="info">
${g.ending.join('<br>\n')}
</Note>`
      )
    }
  })

  return buffer.join('\n\n')
}

function createNavs() {
  const navs = Object.keys(output).map((book, idx) => {
    return {
      text: book,
      collapsed: false,
      items: output[book].map((i) => {
        return {
          text: i.displayName,
          link: `${idx + 1}/` + i.path.replace('.md', ''),
        }
      }),
    }
  })
  writeFileSync(
    resolve(__dirname, '../docs/.vitepress/sidebar.json'),
    JSON.stringify(navs, null, 2)
  )
}

function createIndex() {
  const buffer: string[] = []
  buffer.push(['---', 'layout: doc', '---'].join('\n'))

  buffer.push(`# 役職名`)

  for (const kana of Object.keys(index)) {
    const tmp: string[] = []
    tmp.push(`## ${kana}`)
    for (const entity of index[kana]) {
      tmp.push(renderEntity(entity))
    }
    buffer.push(tmp.join('\n'))
  }

  writeFileSync(resolve(__dirname, '../docs/index.md'), buffer.join('\n\n'))
}

function renderEntity(entity: Entity, parentName = ''): string {
  let result = `${entity.name}`
  if (entity.positions) {
    result = [result]
      .concat(
        entity.positions.map((p, idx) => {
          return `[${idx + 1}](${position2Link(p, parentName + entity.name)})`
        })
      )
      .join(' ')
  }
  result += '\n\n'
  if (entity.children) {
    for (const e of entity.children) {
      let parentName = entity.name
      // ignore parent name in certain cases
      if (e.name.endsWith('番組')) parentName = ''
      result += '&emsp;' + renderEntity(e, parentName)
    }
  }
  return result
}

function position2Link(position: Position, name: string): string {
  const array = Object.values(output).flat()
  let rs = array.filter((i) => {
    return (
      i.book === position.bookNumber &&
      position.page >= i.startPage &&
      position.page <= i.endPage
    )
  })
  if (rs.length === 0) {
    console.log(position, name)
    throw 'No match found!'
  }

  const candidates: { link: string; similarity: number }[] = []
  for (const r of rs) {
    const base = `/content/${r.kan}/${r.path}`
    if (r.names.has(name)) {
      return base
    }
    for (const p of r.positions) {
      candidates.push({
        link: base,
        similarity: compareTwoStrings(name, p.name),
      })
      candidates.push({
        link: base,
        similarity: compareTwoStrings(name, p.name2 || ''),
      })
      candidates.push({
        link: base,
        similarity: compareTwoStrings(name, p.name3 || ''),
      })
      if (p.note) {
        candidates.push({
          link: base,
          similarity: compareTwoStrings(name, p.note.join(' ')),
        })
      }
      p.groups.forEach((g, idx) => {
        if (!g.name) return

        let extraScore = 0
        const [, _page] = g.id.split('-')
        const currentPage = parseInt(_page)
        if (position.page >= currentPage) {
          extraScore += 1
        }
        const next = p.groups[idx + 1]
        if (next) {
          const [, _page] = g.id.split('-')
          const nextPage = parseInt(_page)
          if (position.page > nextPage) {
            extraScore -= 1
          }
        }

        candidates.push({
          link: `${base}#${encodeURIComponent(g.name.replace(/ /g, '-'))}`,
          similarity: compareTwoStrings(name, g.name) + extraScore,
        })
      })
    }
  }
  return candidates.sort((a, b) => b.similarity - a.similarity)[0].link
}

createNavs()
createIndex()
