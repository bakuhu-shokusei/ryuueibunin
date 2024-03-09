import Ajv from 'ajv'
import yaml from 'js-yaml'
import chalk from 'chalk'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let bookSchema = readFileSync(resolve(__dirname, './schema/book.json'))
bookSchema = JSON.parse(bookSchema.toString())
let memberSchema = readFileSync(resolve(__dirname, './schema/member.json'))
memberSchema = JSON.parse(memberSchema.toString())
const ajv = new Ajv()
const validateBook = ajv.compile(bookSchema)
const validateMember = ajv.compile(memberSchema)

export function validateSchema() {
  const books = yaml.load(readFileSync(resolve(__dirname, '../index.yml')))
  if (!Array.isArray(books)) {
    throw 'Need an array of books!'
  }

  for (const book of books) {
    const valid = validateBook(book)
    if (!valid) {
      console.log(book.book, chalk.red('Invalid book'), validateBook.errors)
      return false
    } else {
      console.log(book.book, chalk.green('Schema validation: OK!'))
      for (const position of book.positions) {
        for (const group of position.groups) {
          const members = group.members
          const path = resolve(__dirname, '../', members)
          if (!existsSync(path)) {
            console.log(book.book, chalk.red(members), ' not exist!')
            return false
          }
          const content = yaml.load(readFileSync(path))
          if (!Array.isArray(content)) {
            throw 'Need an array of members!'
          }
          for (const member of content) {
            const valid = validateMember(member)
            if (!valid) {
              console.log(
                members,
                JSON.stringify(member, null, 2),
                chalk.red('Invalid member!'),
                validateMember.errors
              )
              return false
            }
          }
        }
      }
    }
  }

  return true
}

validateSchema()
