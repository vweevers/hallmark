'use strict'

const deglob = require('deglob')
const closest = require('read-closest-package')
const engine = require('unified-engine')
const color = require('supports-color').stdout
const processor = require('remark')

module.exports = function hallmark (options, callback) {
  if (typeof options === 'function') {
    return hallmark({}, options)
  }

  const fix = !!options.fix
  const cwd = options.cwd || process.cwd()
  const pkg = closest.sync({ cwd }) || {}
  const packageOpts = pkg.hallmark || {}
  const globs = options.files && options.files.length ? options.files : ['*.md']
  const repository = repo(options.repository) || repo(packageOpts.repository) || repo(pkg.repository) || originRepo(cwd) || ''
  const ignore = concat('ignore', packageOpts, options)

  deglob(globs, { usePackageJson: false, cwd, ignore }, function (err, files) {
    if (err) throw err

    if (!files.length) {
      callback(null, 0)
      return
    }

    let reporter
    let reporterOptions

    if (options.report) {
      // Only take one --report option
      reporter = [].concat(options.report)[0]

      if (typeof reporter !== 'string') {
        // Reporter was specified with subarg syntax
        reporterOptions = reporter
        reporter = reporter._[0]
      }
    }

    const paddedTable = packageOpts.paddedTable !== false
    const validateLinks = packageOpts.validateLinks !== false
    const toc = packageOpts.toc !== false

    const contributors = 'contributors' in packageOpts
      ? packageOpts.contributors
      : packageOpts.community

    const changelogOptions = Object.assign({}, packageOpts.changelog, options.changelog)
    const plugins = { plugins: concat('plugins', packageOpts, options) }
    const fixers = { plugins: concat('fixers', packageOpts, options) }

    engine({
      processor,
      extensions: [
        // TODO (next major): only support md and markdown
        'md',
        'markdown',
        'mdown',
        'mkdn',
        'mkd',
        'mdwn',
        'mkdown'
      ],
      color,
      files,
      cwd,
      reporter,
      reporterOptions,
      plugins: [
        // Skip updating contributors table in lint mode
        fix && contributors !== false && options.contributors !== false
          ? [require('remark-git-contributors'), {
              contributors: contributors || null
            }]
          : null,

        [require('remark-changelog'), { cwd, fix, pkg, repository, ...changelogOptions }],
        [require('remark-github'), { repository }],

        // TODO: https://github.com/vweevers/hallmark/issues/36
        toc ? [require('remark-toc'), { tight: true }] : null,
        toc ? [require('remark-collapse'), collapseToc()] : null,

        fix ? fixers : null,
        require('./lint.js')({ fix, repository, paddedTable, validateLinks }),
        plugins
      ].filter(Boolean),
      settings: {
        // One style for code blocks, whether they have a language or not.
        fences: true,
        listItemIndent: '1',

        // Allow disabling padding because on big tables it creates noise.
        tablePipeAlign: paddedTable,

        // In addition, use fixed width columns.
        stringLength: paddedTable ? (s) => String(s).length : () => 3
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
    }, callback)
  })
}

function repo (repository) {
  return repository ? repository.url || repository : null
}

function concat (key, packageOpts, options) {
  return [].concat(packageOpts[key] || []).concat(options[key] || [])
}

function collapseToc () {
  return {
    test: /^table of contents$/i,
    summary: 'Click to expand'
  }
}

function originRepo (cwd) {
  // Don't pass cwd for now (jonschlinkert/parse-git-config#13)
  const origin = require('remote-origin-url').sync(/* cwd */)
  const ghurl = require('github-url-from-git')

  return origin ? ghurl(origin) : null
}
