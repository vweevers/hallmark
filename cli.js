#!/usr/bin/env node

import subarg from 'subarg'
import fs from 'node:fs'
import * as hallmark from './index.js'

if (process.version.match(/^v(\d+)\./)[1] < 16) {
  // Return silently to support hallmark in 'npm test'
  console.error('Skipping hallmark: Node 16 or greater is required.')
  process.exit(0)
}

const argv = subarg(process.argv.slice(2), {
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
  const fp = new URL('./package.json', import.meta.url)
  console.log(JSON.parse(fs.readFileSync(fp, 'utf8')).version)
} else {
  const { commits, _: rest, ...options } = argv

  if (rest[0] === 'lint') {
    options.files = files(rest.slice(1))
    hallmark.lint(options, done)
  } else if (rest[0] === 'fix') {
    options.files = files(rest.slice(1))
    hallmark.fix(options, done)
  } else if (rest[0] === 'bump') {
    console.error("Error: the 'bump' command has been renamed to 'cc add'.\n")
    usage(1)
  } else if (rest[0] === 'cc') {
    if (rest[1] === 'add') {
      const targets = rest.slice(2)
      if (!targets.length || !targets.every(Boolean)) usage(1)
      hallmark.cc.add(targets, { ...options, commits }, done)
    } else if (rest[1] === 'init') {
      const { gte, lte, ...rest } = options
      hallmark.cc.add({ gte, lte }, { ...rest, commits }, done)
    } else {
      console.error('Error: unknown command.')
      usage(1)
    }
  } else {
    // Old usage (no commands)
    // TODO: deprecate?
    options.files = files(rest)
    hallmark[options.fix ? 'fix' : 'lint'](options, done)
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
  const fp = new URL('./USAGE', import.meta.url)
  const usage = fs.readFileSync(fp, 'utf8').trim()

  if (exitCode) {
    console.error(usage)
    process.exit(exitCode)
  } else {
    console.log(usage)
    process.exit()
  }
}
