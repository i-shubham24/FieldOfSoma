// Guards the house rules from CLAUDE_DESIGN_HANDOVER.md.
// Fails if any source file contains a long dash, a pill radius or a banned word.
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

// A double hyphen standing in for a dash, in written copy only (CSS variables use it legitimately).
const COPY_RULES = [{ name: 'double hyphen used as a dash', test: /\w\s?--\s?\w/ }]

function walk(path) {
  if (statSync(path).isFile()) return [path]
  return readdirSync(path).flatMap((entry) => walk(join(path, entry)))
}

const files = ROOTS.flatMap(walk).filter((file) => EXTENSIONS.has(extname(file)))
const problems = []

for (const file of files) {
  const isCopy = file.split(/[\\/]/).includes('content')
  const rules = isCopy ? [...RULES, ...COPY_RULES] : RULES
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const rule of rules) {
        if (rule.test.test(line)) problems.push(`${file}:${i + 1}  ${rule.name}  ${line.trim()}`)
      }
    })
}

if (problems.length) {
  console.error(`House rules broken in ${problems.length} place(s):\n` + problems.join('\n'))
  process.exit(1)
}

console.log(`House rules hold across ${files.length} files.`)
