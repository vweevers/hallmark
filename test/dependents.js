import test from 'tape'
import path from 'path'
import pull from 'git-pull-or-clone'
import cp from 'child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const dependents = [
  'airtap/airtap',
  'Level/abstract-level',
  'Level/bench',
  'Level/transcoder',
  'Level/compose',
  'Level/classic-level',
  'Level/browser-level',
  'Level/memory-level',
  'Level/rave-level',
  'Level/many-level',
  'prebuild/prebuild-install',
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
      const cli = path.resolve(__dirname, '..', 'cli-dist.js')

      cp.fork(cli, { cwd, stdio }).on('exit', function (code) {
        t.is(code, 0, 'hallmark linter exited with code 0')

        cp.fork(cli, ['--fix'], { cwd, stdio }).on('exit', function (code) {
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
              cp.execFile('git', ['checkout', '.'], { cwd }, function (err) {
                t.ifError(err, 'no git checkout error')
                t.end()
              })
            })
          })
        })
      })
    })
  })
}
