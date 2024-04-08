import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  writeSync,
} from 'node:fs'
import { books, readMember, kan2Book } from './search.js'
import { Book } from './type.js'

import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const vitePressPath = resolve(__dirname, '../../vitepress')

interface Output {
  [s: string]: {
    book: number
    startPage: number
    endPage: number
    path: string
    displayName: string
    names: Set<string>
  }[]
}

const output: Output = {}

books.forEach((book, idx1) => {
  const bookPath = resolve(vitePressPath, `${idx1 + 1}`)
  output[book.book] = []
  rmSync(bookPath, { recursive: true, force: true })
  mkdirSync(bookPath)

  let previousInfo: Output[string][number] | undefined
  let previousMd: string[] = []
  book.positions.forEach((position, idx2) => {
    const name = position.name2 || position.name
    const currentMd = createMd(position)

    const [_book, _page] = position.groups[0].id.split('-')
    const lastGroupMembers = readMember(
      position.groups[position.groups.length - 1].members
    )
    const endPage =
      lastGroupMembers[lastGroupMembers.length - 1]?.page || parseInt(_page)

    const initInfo = () => {
      previousInfo = {
        book: parseInt(_book),
        startPage: parseInt(_page),
        endPage,
        path: '',
        displayName: name,
        names: new Set(
          [position.name, position.name2 || '', position.name3 || ''].filter(
            Boolean
          )
        ),
      }
    }

    const path = () => {
      return `${kan2Book(idx1)}-${String(previousInfo!.startPage).padStart(
        3,
        '0'
      )}-${String(previousInfo!.endPage).padStart(3, '0')}.md`
    }

    if (previousInfo === undefined) {
      initInfo()
      previousMd.push(currentMd)
      if (idx2 === book.positions.length - 1) {
        previousInfo!.path = path()
        writeFileSync(resolve(bookPath, path()), previousMd.join('\n\n'))
        output[book.book].push(previousInfo!)
      }
      return
    }

    if (name === previousInfo.displayName) {
      previousInfo.endPage = endPage
      ;[position.name, position.name2 || '', position.name3 || '']
        .filter(Boolean)
        .forEach((i) => previousInfo!.names.add(i))
      previousMd.push(currentMd)
    } else {
      previousInfo.path = path()
      const ppInfo = output[book.book][output[book.book].length - 1]
      if (previousInfo.endPage === ppInfo?.endPage) {
        appendFileSync(
          resolve(bookPath, ppInfo.path),
          '\n\n' + previousMd.join('\n\n')
        )
        ppInfo.displayName += `-${previousInfo.displayName}`
        for (const name of previousInfo.names) {
          ppInfo.names.add(name)
        }
        previousInfo = ppInfo
      } else {
        const targetPath = resolve(bookPath, previousInfo.path)
        if (existsSync(targetPath)) {
          throw 'Cannot overwrite'
        }
        writeFileSync(targetPath, previousMd.join('\n\n'))
        output[book.book].push(previousInfo)
      }
      previousMd = [currentMd]
      initInfo()
    }

    if (idx2 === book.positions.length - 1) {
      const ppInfo = output[book.book][output[book.book].length - 1]
      if (previousInfo.endPage === ppInfo?.endPage) {
        appendFileSync(
          resolve(bookPath, ppInfo.path),
          '\n\n' + previousMd.join('\n\n')
        )
        ppInfo.displayName += `-${previousInfo.displayName}`
        for (const name of previousInfo.names) {
          ppInfo.names.add(name)
        }
      } else {
        previousInfo.path = path()
        writeFileSync(resolve(bookPath, path()), previousMd.join('\n\n'))
        output[book.book].push(previousInfo)
      }
    }
  })
})

function createMd(p: Book['positions'][number]) {
  const buffer: string[] = []

  buffer.push(`# ${p.name}`)

  if (p.note) {
    buffer.push(
      `::: raw
<div class="tip custom-block ryuu-text">
${p.note.join('<br>')}
</div>
:::`
    )
  }

  if (p.opening) {
    buffer.push(
      `::: raw
<div class="info custom-block ryuu-text">
${p.opening.join('<br>')}
</div>
:::`
    )
  }

  return buffer.join('\n\n')
}

function createNavs() {
  const navs = Object.keys(output).map((book, idx) => {
    return {
      text: book,
      items: output[book].map((i) => {
        return {
          text: i.displayName,
          link: `/${idx + 1}/` + i.path.replace('.md', ''),
        }
      }),
    }
  })
  writeFileSync(
    resolve(vitePressPath, '.vitepress/sidebar.json'),
    JSON.stringify(navs, null, 2)
  )
}
createNavs()
