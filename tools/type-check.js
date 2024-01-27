import Ajv from 'ajv'
import yaml from 'js-yaml'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let schema = readFileSync(resolve(__dirname, './schema/books.json'))
schema = JSON.parse(schema)
const ajv = new Ajv()
const validate = ajv.compile(schema)
const books = yaml.load(readFileSync(resolve(__dirname, '../index.yml')))
if (!Array.isArray(books)) {
  throw 'Need an array of book!'
}
for (const book of books) {
  const valid = validate(book)
  if (!valid) {
    console.log(book.book, validate.errors)
  } else {
    console.log(book.book, 'OK!')
  }
}
