#!/usr/bin/env node
'use strict'

if (process.version.match(/^v(\d+)\./)[1] < 10) {
  console.error('hallmark: Node 10 or greater is required. `hallmark` did not run.')
  process.exit(0)
}

const argv = require('subarg')(process.argv.slice(2), {
  boolean: ['fix', 'help', 'version', 'commits'],
  string: ['report'],
  default: {
    fix: false,
    help: false,
    version: false,
    commits: true
  },
  alias: {
    h: 'help',
    v: 'version',
    i: 'ignore'
  }
})

if (argv.help) {
  usage(0)
} else if (argv.version) {
  console.log(require('./package.json').version)
} else {
  const { commits, _: rest, ...options } = argv

  if (rest[0] === 'lint') {
    options.files = files(rest.slice(1))
    require('./index.js').lint(options, done)
  } else if (rest[0] === 'fix') {
    options.files = files(rest.slice(1))
    require('./index.js').fix(options, done)
  } else if (rest[0] === 'bump') {
    console.error("Error: the 'bump' command has been renamed to 'cc add'.\n")
    usage(1)
  } else if (rest[0] === 'cc') {
    if (rest[1] === 'add') {
      const target = rest[2]
      if (!target) usage(1)
      options.files = files(rest.slice(3))
      require('./index.js').cc.add(target, { ...options, commits }, done)
    } else {
      console.error('Error: unknown command.')
      usage(1)
    }
  } else {
    // Old usage (no commands)
    // TODO: deprecate?
    options.files = files(rest)
    require('./index.js')[options.fix ? 'fix' : 'lint'](options, done)
  }
}

function files (rest) {
  return rest.length ? rest : null
}

function done (err, result) {
  if (err) throw err
  process.exit(result.code)
}

function usage (exitCode) {
  const fs = require('fs')
  const path = require('path')
  const usage = fs.readFileSync(path.join(__dirname, 'USAGE'), 'utf8').trim()

  if (exitCode) {
    console.error(usage)
    process.exit(exitCode)
  } else {
    console.log(usage)
    process.exit()
  }
}
