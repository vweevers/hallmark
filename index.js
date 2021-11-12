'use strict'

const deglob = require('deglob')
const find = require('find-file-up')
const engine = require('unified-engine')
const color = require('supports-color').stdout
const fromCallback = require('catering').fromCallback
const processor = require('remark')
const path = require('path')
const fs = require('fs')

function hallmark (options, callback) {
  callback = fromCallback(callback)

  const fix = !!options.fix
  const cwd = path.resolve(options.cwd || '.')
  const pkg = read('package.json', cwd) || {}
  const rc = Object.assign({}, read('.hallmarkrc', cwd), pkg.hallmark)
  const files = first('files', options, rc) || ['*.md']
  const repository = repo(first('repository', options, rc, pkg)) || originRepo(cwd) || ''
  const ignore = concat('ignore', rc, options)

  deglob(files, { usePackageJson: false, cwd, ignore }, function (err, files) {
    if (err) return callback(err)

    if (!files.length) {
      callback(null, { code: 0, files: [] })
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

    const paddedTable = rc.paddedTable !== false
    const validateLinks = rc.validateLinks !== false
    const toc = rc.toc !== false
    const changelog = Object.assign({}, rc.changelog, options.changelog)
    const plugins = { plugins: concat('plugins', rc, options) }
    const fixers = { plugins: concat('fixers', rc, options) }

    if ('contributors' in rc) {
      return callback(new Error("The 'contributors' option has been removed"))
    }

    if ('community' in rc) {
      return callback(new Error("The 'community' option has been removed"))
    }

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
        [require('remark-common-changelog'), { cwd, fix, pkg, repository, ...changelog }],
        [require('remark-github'), { repository }],

        // Does nothing unless configured
        rc.autolinkReferences
          ? [require('remark-autolink-references'), {
              ...rc.autolinkReferences,
              fix
            }]
          : null,

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
    }, function (err, code, context) {
      if (err) return callback(err)
      callback(null, { code, files: context.files })
    })
  })

  return callback.promise
}

exports.lint = function (options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  return hallmark({ ...options, fix: false }, callback)
}

exports.fix = function (options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  return hallmark({ ...options, fix: true }, callback)
}

exports.bump = function (target, options, callback) {
  if (!target) {
    throw new TypeError('First argument "target" is required')
  } else if (typeof target !== 'string') {
    throw new TypeError('First argument "target" must be a string')
  }

  if (typeof options === 'function') {
    callback = options
    options = {}
  } else if (options == null) {
    options = {}
  }

  const changelog = {
    ...options.changelog,
    add: target
  }

  return hallmark({ ...options, changelog, fix: true }, callback)
}

function read (file, cwd) {
  const fp = find.sync(file, cwd, 100)
  return fp ? JSON.parse(fs.readFileSync(fp, 'utf8')) : null
}

function first (key, ...sources) {
  for (const src of sources) {
    if (src[key]) return src[key]
  }
}

function repo (repository) {
  return repository ? repository.url || repository : null
}

function concat (key, rc, options) {
  return [].concat(rc[key] || []).concat(options[key] || [])
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
