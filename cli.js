#!/usr/bin/env node
'use strict'

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
    v: 'version'
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
  const deglob = require('deglob')
  const engine = require('unified-engine')
  const pkgConfig = require('pkg-config')
  const options = require('./options')

  const cwd = process.cwd()
  const glob = argv._.length ? argv._ : ['*.md']
  const configKey = 'hallmark'
  const packageOpts = pkgConfig(configKey, { root: false, cwd }) || {}

  deglob(glob, { configKey, cwd }, function (err, files) {
    if (err) throw err
    if (files.length === 0) process.exit()

    engine(options(argv, packageOpts, files, cwd), function (err, code) {
      if (err) throw err
      process.exit(code)
    })
  })
}
