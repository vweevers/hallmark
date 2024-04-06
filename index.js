import deglob from 'deglob'
import find from 'find-file-up'
import Githost from 'find-githost'
import { engine } from 'unified-engine'
import supportsColor from 'supports-color'
import { fromCallback } from 'catering'
import defaultReporter from 'vfile-reporter-shiny'
import { remark as processor } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkCommonChangelog from 'remark-common-changelog'
import remarkGithub from 'remark-github'
import remarkAutolinkReferences from 'remark-autolink-references'
import path from 'node:path'
import fs from 'node:fs'
import linter from './lint.js'

const kPromise = Symbol('promise')

function hallmark (options, callback) {
  callback = fromCallback(callback, kPromise)

  const fix = !!options.fix
  const cwd = path.resolve(options.cwd || '.')
  const pkg = read('package.json', cwd) || {}
  const rc = Object.assign({}, read('.hallmarkrc', cwd), pkg.hallmark)
  const files = first('files', options, rc) || ['*.md']
  const repository = repo(cwd, options, rc, pkg)
  const ignore = concat('ignore', rc, options)

  deglob(files, { usePackageJson: false, cwd, ignore }, function (err, files) {
    if (err) return callback(err)

    if (!files.length) {
      callback(null, { code: 0, files: [] })
      return
    }

    let reporter
    let reporterOptions

    if (options.report === false) {
      reporter = function noop () {}
    } else if (options.report) {
      // Only take one --report option
      reporter = [].concat(options.report)[0]

      if (typeof reporter !== 'string') {
        // Reporter was specified with subarg syntax
        reporterOptions = reporter
        reporter = reporter._[0]
      }
    } else {
      reporter = defaultReporter
    }

    const paddedTable = rc.paddedTable !== false
    const validateLinks = rc.validateLinks !== false
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
      extensions: ['md', 'markdown'],
      color: supportsColor.stdout,
      files,
      cwd,
      reporter,
      reporterOptions,
      plugins: [
        [remarkGfm, {
          tableCellPadding: true,

          // Allow disabling padding because on big tables it creates noise.
          tablePipeAlign: paddedTable,

          // In addition, use fixed width columns. TODO: use string-width package
          stringLength: paddedTable ? (s) => String(s).length : () => 3
        }],
        [remarkCommonChangelog, { cwd, fix, pkg, repository, ...changelog }],
        [remarkGithub, { repository }],

        // Does nothing unless configured
        rc.autolinkReferences
          ? [remarkAutolinkReferences, {
              ...rc.autolinkReferences,
              fix
            }]
          : null,

        fix ? fixers : null,
        linter({ fix, repository, paddedTable, validateLinks }),
        plugins
      ].filter(Boolean),
      settings: {
        // One style for code blocks, whether they have a language or not.
        fences: true,

        // Whether to indent the content of list items with the size of the bullet plus one space
        listItemIndent: 'one',

        // Marker to use for bullets of items in unordered lists
        bullet: '-',

        // Marker to use for thematic breaks
        rule: '-',

        // Marker to use to serialize emphasis
        emphasis: '_',

        // Marker to use to serialize strong
        strong: '*'
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

  return callback[kPromise]
}

export function lint (options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  return hallmark({ ...options, fix: false }, callback)
}

export function fix (options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  return hallmark({ ...options, fix: true }, callback)
}

export const cc = {
  add: function (target, options, callback) {
    if (!target) {
      throw new TypeError('First argument "target" is required')
    } else if (Array.isArray(target)) {
      if (!target.every(t => typeof t === 'string' && t.trim() !== '')) {
        throw new TypeError('First argument "target" must be a string or array of strings')
      }
    } else if (typeof target === 'object' && target !== null) {
      // Range
    } else if (typeof target !== 'string') {
      throw new TypeError('First argument "target" must be a string or array of strings')
    }

    if (typeof options === 'function') {
      callback = options
      options = {}
    } else if (options == null) {
      options = {}
    }

    const files = ['CHANGELOG.md']
    const fp = path.join(options.cwd || '.', files[0])

    if (!fs.existsSync(fp)) {
      fs.writeFileSync(fp, '# Changelog\n')
    }

    const changelog = {
      commits: options.commits !== false,
      ...options.changelog,
      add: target
    }

    return hallmark({ ...options, files, changelog, fix: true }, callback)
  }
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

function repo (cwd, options, rc, pkg) {
  const override = options.repository || rc.repository
  const committish = false

  if (override) {
    return Githost.fromUrl(override, { committish }).https()
  }

  const host = (
    Githost.fromPkg(pkg, { committish, optional: true }) ||
    Githost.fromGit(cwd, { committish })
  )

  return host.https()
}

function concat (key, rc, options) {
  return [].concat(rc[key] || []).concat(options[key] || [])
}
