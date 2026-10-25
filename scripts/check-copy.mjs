// Guards the site's house rules for written copy.
// Fails if any source file contains a long dash, a pill radius or a banned word, or if
// visible copy uses a spaced hyphen or a double hyphen in place of a dash.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

const ROOTS = ['src', 'index.html']
const EXTENSIONS = new Set(['.js', '.jsx', '.css', '.html'])

const RULES = [
  { name: 'em dash', test: new RegExp(String.fromCharCode(0x2014)) },
  { name: 'en dash', test: new RegExp(String.fromCharCode(0x2013)) },
  { name: 'pill radius (rounded-full)', test: /rounded-full/ },
  {
    name: 'banned word',
    test: /\b(elevate|seamless(ly)?|unleash|next-gen|revolutioni[sz]e|revolutionary|dive in)\b/i,
  },
]

// Checked only in written copy: text inside quotes, and plain lines of JSX text.
// Code is left alone, so subtraction and CSS variables never trip these.
const COPY_RULES = [
  { name: 'spaced hyphen used as a dash', test: /\S\s-\s\S/ },
  { name: 'double hyphen used as a dash', test: /\w\s?--\s?\w/ },
]

const STRING = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g
const looksLikeCode = (text) => /calc\(|var\(|^--|\$\{|^\s*$/.test(text)

function copyIn(line) {
  const trimmed = line.trim()
  // Comments are notes for developers, not copy
  if (/^(\/\/|\/\*|\*|\{\/\*)/.test(trimmed)) return []
  const pieces = [...line.matchAll(STRING)].map((match) => match[2]).filter((text) => !looksLikeCode(text))
  // A line of plain JSX text has words but no code characters
  if (!/[=<>{}();]/.test(trimmed) && /[a-z]/i.test(trimmed)) pieces.push(trimmed)
  return pieces
}

function walk(path) {
  if (statSync(path).isFile()) return [path]
  return readdirSync(path).flatMap((entry) => walk(join(path, entry)))
}

const files = ROOTS.flatMap(walk).filter((file) => EXTENSIONS.has(extname(file)))
const problems = []

for (const file of files) {
  const checkCopy = extname(file) !== '.css'
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const rule of RULES) {
        if (rule.test.test(line)) problems.push(`${file}:${i + 1}  ${rule.name}  ${line.trim()}`)
      }
      if (!checkCopy) return
      for (const text of copyIn(line)) {
        for (const rule of COPY_RULES) {
          if (rule.test.test(text)) problems.push(`${file}:${i + 1}  ${rule.name}  ${text.trim()}`)
        }
      }
    })
}

if (problems.length) {
  console.error(`House rules broken in ${problems.length} place(s):\n` + problems.join('\n'))
  process.exit(1)
}

console.log(`House rules hold across ${files.length} files.`)
