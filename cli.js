#!/usr/bin/env node
'use strict'

if (process.version.match(/^v(\d+)\./)[1] < 8) {
  console.error('hallmark: Node 8 or greater is required. `hallmark` did not run.')
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
  const deglob = require('deglob')
  const engine = require('unified-engine')
  const options = require('./options')

  const cwd = process.cwd()
  const glob = argv._.length ? argv._ : ['*.md']
  const pkg = getNearestPackage(cwd) || {}
  const packageOpts = Object.assign({}, pkg.hallmark)
  const repo = pkg.repository ? pkg.repository.url || pkg.repository : ''
  const ignore = [].concat(packageOpts.ignore || []).concat(argv.ignore || [])

  packageOpts.validateLinks = packageOpts.validateLinks !== false
  packageOpts.paddedTable = packageOpts.paddedTable !== false
  packageOpts.toc = packageOpts.toc !== false

  deglob(glob, { usePackageJson: false, cwd, ignore }, function (err, files) {
    if (err) throw err
    if (files.length === 0) process.exit()

    engine(options(argv, packageOpts, files, cwd, repo), function (err, code) {
      if (err) throw err
      process.exit(code)
    })
  })
}

function getNearestPackage (cwd) {
  const findRoot = require('find-root')
  const fs = require('fs')
  const path = require('path')

  try {
    const fp = path.join(findRoot(cwd), 'package.json')
    return JSON.parse(fs.readFileSync(fp, 'utf8'))
  } catch (err) {

  }
}
