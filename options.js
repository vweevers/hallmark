'use strict'

const color = require('supports-color').stdout
const extensions = require('markdown-extensions')
const processor = require('remark')

module.exports = function (argv, packageOpts, files, cwd, repository) {
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

  const fix = argv.fix
  const contributors = packageOpts.community || packageOpts.contributors || null

  return {
    processor,
    extensions,
    color,
    files,
    cwd,
    reporter,
    reporterOptions,
    plugins: [
      // Skip updating contributors table in lint mode
      fix ? [require('remark-git-contributors'), { contributors }] : null,
      [require('remark-github'), { repository }],

      // TODO: https://github.com/vweevers/hallmark/issues/36
      packageOpts.toc ? [require('remark-toc'), {
        maxDepth: 2,
        tight: true
      }] : null,
      packageOpts.toc ? [require('remark-collapse'), {
        test: /^table of contents$/i,
        summary: 'Click to expand'
      }] : null,

      require('./lint')(fix, cwd, packageOpts, repository)
    ].filter(Boolean),
    settings: {
      // One style for code blocks, whether they have a language or not.
      fences: true,
      listItemIndent: '1',

      // Allow disabling padding because on big tables it creates noise.
      paddedTable: packageOpts.paddedTable,

      // In addition, use fixed width columns.
      stringLength: packageOpts.paddedTable ? (s) => String(s).length : () => 3
    },
    pluginPrefix: 'remark',
    // "Whether to write successfully processed files"
    output: fix,
    // "Whether to write the processed file to streamOut"
    out: false,
    // "Call back with an unsuccessful (1) code on warnings as well as errors"
    frail: true,
    // "Do not report successful files"
    quiet: true
  }
}
