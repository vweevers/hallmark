'use strict'

const test = require('tape')
const path = require('path')
const gitPullOrClone = require('git-pull-or-clone')
const rimraf = require('rimraf')
const cp = require('child_process')

const dependents = [
  // TODO: remove empty Unreleased section from these
  // 'airtap/airtap',
  // // 'deltachat/deltachat-desktop', // Failing
  // 'deltachat/deltachat-node',
  // 'Level/abstract-leveldown',
  // 'Level/bench',
  // 'Level/codec',
  // 'Level/compose',
  // // 'Level/level-js', // Failing
  // 'Level/levelup',
  // 'Level/memdown',
  // 'Level/subleveldown',
  'vweevers/detect-tabular',
  'vweevers/keyspace',
  'vweevers/node-docker-machine',
  'vweevers/win-detect-browsers',
  'vweevers/zipfian-integer'
]

for (const repo of dependents) {
  const cwd = path.join(__dirname, 'dependents', repo.toLowerCase())
  const url = `https://github.com/${repo}.git`

  test(`smoke test ${repo}`, function (t) {
    t.plan(5)

    pull(url, cwd, (err) => {
      t.ifError(err, 'no git error')

      // Pipe stdout to stderr because our stdout is for TAP
      const stdio = ['ignore', process.stderr, process.stderr, 'ipc']
      const cli = path.join(__dirname, 'cli.js')

      cp.fork(cli, { cwd, stdio }).on('exit', function (code) {
        t.is(code, 0, 'hallmark linter exited with code 0')

        // Skip CONTRIBUTORS.md for now (many dependents need updating)
        const args = ['--fix', '-i', 'CONTRIBUTORS.md']

        cp.fork(cli, args, { cwd, stdio }).on('exit', function (code) {
          t.is(code, 0, 'hallmark fixer exited with code 0')

          cp.execFile('git', ['diff', '--color'], { cwd }, function (err, stdout) {
            const diff = (stdout || '').trim()

            t.ifError(err, 'no git error')
            t.ok(diff === '', 'no diff')

            if (diff !== '') {
              console.error(diff)

              // Start fresh on the next test run
              rimraf.sync(cwd, { glob: false })
            }
          })
        })
      })
    })
  })
}

function pull (url, cwd, callback) {
  // Clone fully because we need git history for remark-git-contributors
  gitPullOrClone(url, cwd, { depth: Infinity }, function (err) {
    if (err) return callback(err)
    cp.execFile('git', ['fetch', '--tags'], { cwd }, callback)
  })
}
