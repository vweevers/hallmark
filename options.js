'use strict'

const color = require('supports-color').stdout
const extensions = require('markdown-extensions')
const processor = require('remark')

module.exports = function (argv, packageOpts, files, cwd) {
  let reporter
  let reporterOptions

  if (argv.report) {
    // Only take one --report option
    reporter = [].concat(argv.report)[0]

    if (typeof reporter !== 'string') {
      // Reporter was specified with subarg syntax
      reporterOptions = reporter
      reporter = reporter._[0]
    }
  }

  return {
    processor,
    extensions,
    color,
    files,
    cwd,
    reporter,
    reporterOptions,
    plugins: [
      [require('remark-git-contributors'), packageOpts.community || null],
      [require('remark-github')],
      [require('remark-toc'), {
        maxDepth: 2,
        tight: true
      }],
      [require('remark-collapse'), {
        test: /^table of contents$/i,
        summary: 'Click to expand'
      }],
      require('./lint')(argv.fix)
    ],
    settings: {
      // One style for code blocks, whether they have a language or not.
      fences: true,
      listItemIndent: '1'
    },
    pluginPrefix: 'remark',
    output: argv.fix,
    out: false,
    frail: true,
    quiet: true
  }
}
