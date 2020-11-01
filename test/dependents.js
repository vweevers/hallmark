'use strict'

const test = require('tape')
const path = require('path')
const gitPullOrClone = require('git-pull-or-clone')
const rimraf = require('rimraf')
const cp = require('child_process')

const dependents = [
  // 'airtap/airtap', // See vweevers/hallmark#45
  // 'deltachat/deltachat-desktop', // Failing
  // 'deltachat/deltachat-node', // Has empty releases
  'Level/abstract-leveldown',
  'Level/bench',
  'Level/codec',
  'Level/compose',
  'Level/level-js',

  // TODO: Don't use literal URLs without angle brackets
  // 'Level/levelup',

  'Level/memdown',
  'Level/subleveldown',
  'vweevers/detect-tabular',
  'vweevers/keyspace',
  'vweevers/node-docker-machine',
  'vweevers/win-detect-browsers',
  'vweevers/zipfian-integer'
]

for (const repo of dependents) {
  const cwd = path.resolve(__dirname, '..', 'dependents', repo.toLowerCase())
  const url = `https://github.com/${repo}.git`

  test(`smoke test ${repo}`, function (t) {
    pull(url, cwd, (err) => {
      t.ifError(err, 'no git error')

      // Pipe stdout to stderr because our stdout is for TAP
      const stdio = ['ignore', process.stderr, process.stderr, 'ipc']
      const cli = path.resolve(__dirname, '..', 'cli.js')

      cp.fork(cli, { cwd, stdio }).on('exit', function (code) {
        t.is(code, 0, 'hallmark linter exited with code 0')

        // Skip CONTRIBUTORS.md for now (many dependents need updating)
        const args = ['--fix', '-i', 'CONTRIBUTORS.md']

        cp.fork(cli, args, { cwd, stdio }).on('exit', function (code) {
          t.is(code, 0, 'hallmark fixer exited with code 0')

          cp.execFile('git', ['diff', '--color'], { cwd }, function (err, stdout) {
            t.ifError(err, 'no git error')

            const diff = (stdout || '').trim()

            if (diff === '') {
              t.end()
              return
            }

            // Just print the diff for debugging; don't make assertions
            console.error(diff)

            // Check that fixed markdown is still valid
            cp.fork(cli, { cwd, stdio }).on('exit', function (code) {
              t.is(code, 0, 'hallmark linter on fixed markdown exited with code 0')

              // Start fresh on the next test run
              rimraf(cwd, { glob: false }, function (err) {
                if (err) throw err
                t.end()
              })
            })
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
