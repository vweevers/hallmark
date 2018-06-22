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
      ['git-contributors', packageOpts.community || null],
      ['github'],
      ['toc', {
        maxDepth: 2,
        tight: true
      }],
      ['collapse', {
        test: /^table of contents$/i,
        summary: 'Click to expand'
      }],
      ['validate-links'],

      // Disabled for now because of frequent false positives
      // ['lint-no-dead-urls'],

      ['lint-hard-break-spaces'],
      ['lint-no-duplicate-definitions'],
      ['lint-no-inline-padding'],
      ['lint-no-undefined-references'],
      ['lint-no-unused-definitions']
    ],
    settings: {
      // One style for code blocks, whether they have a language or not.
      fences: true,

      // Less diff noise
      paddedTable: false,
      listItemIndent: '1'
    },
    pluginPrefix: 'remark',
    output: argv.fix,
    out: false,
    frail: true,
    quiet: true
  }
}
