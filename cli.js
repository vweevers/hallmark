#!/usr/bin/env node
'use strict'

if (process.version.match(/^v(\d+)\./)[1] < 10) {
  console.error('hallmark: Node 10 or greater is required. `hallmark` did not run.')
  process.exit(0)
}

const argv = require('subarg')(process.argv.slice(2), {
  boolean: ['fix', 'help', 'version'],
  string: ['report'],
  default: {
    fix: false,
    help: false,
    version: false
  },
  alias: {
    h: 'help',
    v: 'version',
    i: 'ignore'
  }
})

if (argv.help) {
  const fs = require('fs')
  const path = require('path')
  const usage = path.join(__dirname, 'USAGE')

  fs.createReadStream(usage).pipe(process.stdout)
} else if (argv.version) {
  console.log(require('./package.json').version)
} else {
  argv.files = argv._

  require('./index.js')(argv, function (err, code) {
    if (err) throw err
    process.exit(code)
  })
}
