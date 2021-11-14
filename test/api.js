import test from 'tape'
import tempy from 'tempy'
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import * as hallmark from '../index.js'

test('lints various', function (t) {
  run('00-various-input', '00-various-input', 'lint', {}, (err, { file, actual, expected }) => {
    t.ifError(err)
    t.is(actual, expected)
    t.same(file.messages.map(String), [
      'test.md:3:1-3:10: Marker style should be `-`',
      'test.md:4:1-4:8: Marker style should be `-`',
      'test.md:5:1-5:6: Marker style should be `-`',
      'test.md:5:3-5:6: Found reference to undefined definition',
      'test.md:6:1-6:21: Marker style should be `-`',
      'test.md:6:3-6:21: Don’t use literal URLs without angle brackets',
      'test.md:12:23: Cell should be padded',
      'test.md:16:1-16:9: Code blocks should be fenced',
      'test.md:28:5: Checked checkboxes should use `x` as a marker',
      'test.md:32:1-32:6: Rules should use `---`'
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
  const inputFile = new URL('./fixture/' + inputFixture + '.md', import.meta.url)
  const outputFile = new URL('./fixture/' + outputFixture + '.md', import.meta.url)
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
