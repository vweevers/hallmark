'use strict'

const test = require('tape')
const fs = require('fs')
const path = require('path')
const tempy = require('tempy') // Locked to 0.2.1 for node 6 support
const execFileSync = require('child_process').execFileSync
const hallmark = require('..')

test('lints various', function (t) {
  run('00-various-input', '00-various-input', 'lint', {}, (err, { file, actual, expected }) => {
    t.ifError(err)
    t.is(actual, expected)
    t.same(file.messages.map(String), [
      'test.md:5:3-5:6: Found reference to undefined definition',
      'test.md:6:3-6:21: Don’t use literal URLs without angle brackets',
      'test.md:12:23: Cell should be padded',
      'test.md:16:1-16:9: Code blocks should be fenced',
      'test.md:28:4-28:5: Checked checkboxes should use `x` as a marker'
    ])
    t.end()
  })
})

test('fixes various', function (t) {
  run('00-various-input', '00-various-output', 'fix', {}, (err, { file, actual, expected }) => {
    t.ifError(err)
    t.is(actual, expected)
    t.same(file.messages.map(String), [
      // This can't be fixed automatically
      'test.md:5:3-5:6: Found reference to undefined definition'
    ])
    t.end()
  })
})

function run (inputFixture, outputFixture, method, opts, test) {
  const cwd = tempy.directory()
  const inputFile = path.join(__dirname, 'fixture', inputFixture + '.md')
  const outputFile = path.join(__dirname, 'fixture', outputFixture + '.md')
  const pkgFile = path.join(cwd, 'package.json')
  const mdFile = path.join(cwd, 'test.md')
  const options = opts.options || {}
  const stdio = 'ignore'

  const pkg = {
    name: 'test',
    version: '0.0.0',
    repository: 'https://github.com/test/test.git',
    private: true
  }

  execFileSync('git', ['init', '.'], { cwd, stdio })

  const input = readNormal(inputFile)
  const expected = readNormal(outputFile)

  fs.writeFileSync(pkgFile, JSON.stringify(pkg))
  fs.writeFileSync(mdFile, input)

  options.cwd = cwd
  options.files = ['test.md']

  hallmark[method](options, function (err, result) {
    if (err) return test(err)

    const file = result && result.files[0]
    const actual = readNormal(mdFile)

    test(err, { file, cwd, actual, expected })
  })
}

function readNormal (fp) {
  return fs.readFileSync(fp, 'utf8').replace(/\r\n/g, '\n')
}
