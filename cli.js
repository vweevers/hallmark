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
  usage()
} else if (argv.version) {
  console.log(require('./package.json').version)
} else {
  const rest = argv._

  if (rest[0] === 'lint') {
    argv.files = files(rest.slice(1))
    require('./index.js').lint(argv, done)
  } else if (rest[0] === 'fix') {
    argv.files = files(rest.slice(1))
    require('./index.js').fix(argv, done)
  } else if (rest[0] === 'bump') {
    const target = rest[1]

    if (!target) {
      usage()
      process.exit(1)
    }

    argv.files = files(rest.slice(2))
    require('./index.js').bump(target, argv, done)
  } else {
    // Old usage (no commands)
    // TODO: deprecate?
    argv.files = files(rest)
    require('./index.js')[argv.fix ? 'fix' : 'lint'](argv, done)
  }
}

function files (rest) {
  return rest.length ? rest : null
}

function done (err, result) {
  if (err) throw err
  process.exit(result.code)
}

function usage () {
  const fs = require('fs')
  const path = require('path')
  const usage = path.join(__dirname, 'USAGE')

  fs.createReadStream(usage).pipe(process.stdout)
}
