import yaml from 'js-yaml'
import { stringify } from 'csv-stringify/sync'
import chalk from 'chalk'
import {
  readFileSync,
  rmSync,
  existsSync,
  mkdirSync,
  appendFileSync,
} from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateSchema } from './check-type.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const csvFolder = resolve(__dirname, '../csv')
function prepareFiles() {
  if (existsSync(csvFolder)) {
    rmSync(csvFolder, { recursive: true, force: true })
  }
  mkdirSync(csvFolder)
}

function writeBook(record) {
  const content = stringify(record, {
    header: true,
    columns: [
      { key: 'book', header: '卷' },
      { key: 'index', header: '目次' },
    ],
  })
  appendFileSync(resolve(csvFolder, 'books.csv'), content, { encoding: 'utf8' })
}

function writePositions(record) {
  const content = stringify(record, {
    header: true,
    columns: [
      { key: 'book', header: '卷' },
      { key: 'bookOpening', header: '卷-補足説明1' },
      { key: 'name', header: '職名' },
      { key: 'name2', header: '職名2' },
      { key: 'note', header: '職名-補足説明1' },
      { key: 'opening', header: '職名-補足説明2' },
      { key: 'opening2', header: '職名-補足説明3' },
      { key: 'ending', header: '職名-補足説明4' },
      { key: 'groupName', header: '組' },
      { key: 'groupNote', header: '組-補足説明1' },
      { key: 'groupOpening', header: '組-補足説明2' },
      { key: 'groupOpening2', header: '組-補足説明3' },
      { key: 'groupEnding', header: '組-補足説明4' },
      { key: 'page', header: 'ページ' },
    ],
  })
  appendFileSync(resolve(csvFolder, 'positions.csv'), content, {
    encoding: 'utf8',
  })
}

let hasHeader = false
function writeMembers(record) {
  const content = stringify(record, {
    header: !hasHeader,
    columns: [
      { key: 'book', header: '卷' },
      { key: 'name2', header: '職名' },
      { key: 'groupName', header: '組' },
      { key: 'note', header: '履歴' },
      { key: 'info', header: '名前' },
      { key: 'page', header: 'ページ' },
    ],
  })
  appendFileSync(resolve(csvFolder, 'members.csv'), content, {
    encoding: 'utf8',
  })
  hasHeader = true
}

function convert() {
  const books = yaml.load(readFileSync(resolve(__dirname, '../index.yml')))
  const recordsBooks = []
  const recordsPositions = []

  for (const book of books) {
    recordsBooks.push({
      book: book.book,
      index: book.index.join('\n'),
    })

    for (const position of book.positions) {
      const recordsMembers = []
      const p = {
        book: book.book,
        bookOpening: (book.opening || []).join('\n'),
        name: position.name,
        name2: position.name2 || position.name,
        note: (position.note || []).join('\n'),
        opening: (position.opening || []).join('\n'),
        opening2: (position.opening2 || []).join('\n'),
        ending: (position.ending || []).join('\n'),
      }
      for (const group of position.groups) {
        const members = yaml.load(
          readFileSync(resolve(__dirname, '../', group.members))
        )
        if (members.length === 0) continue
        const g = {
          ...p,
          groupName: group.name,
          groupNote: (group.note || []).join('\n'),
          groupOpening: (group.opening || []).join('\n'),
          groupOpening2: (group.opening2 || []).join('\n'),
          groupEnding: (group.ending || []).join('\n'),
          page: members[0].page + '-' + members[members.length - 1].page,
        }
        recordsPositions.push(g)
        for (const member of members) {
          recordsMembers.push({
            book: book.book,
            name2: position.name2 || position.name,
            groupName: group.name,
            note: (member.note || []).join('\n'),
            info: member.info.join('\n'),
            page: member.page,
          })
        }
      }
      writeMembers(recordsMembers)
    }
  }
  writeBook(recordsBooks)
  writePositions(recordsPositions)
}

prepareFiles()
convert()
