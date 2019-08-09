module.exports = function (fix, validateLinks, repo) {
  const preset = {
    plugins: [
      require('remark-lint'),

      // These are not automatically fixed by remark-stringify
      require('remark-lint-no-undefined-references'),
      require('remark-lint-no-unused-definitions'),
      require('remark-lint-no-duplicate-definitions'),
      require('remark-lint-no-inline-padding'),
      [require('remark-lint-blockquote-indentation'), 2], // Means 1 space.
      require('remark-lint-checkbox-content-indent')

      // Disabled for now because of frequent false positives
      // require('remark-lint-no-dead-urls'),

      // TBD
      // require('remark-lint-no-shortcut-reference-image'),
      // require('remark-lint-no-shortcut-reference-link')
    ]
  }

  if (!fix) {
    preset.plugins.push(
      require('remark-lint-final-newline'),
      require('remark-lint-list-item-bullet-indent'),
      [require('remark-lint-list-item-indent'), 'space'],
      require('remark-lint-no-auto-link-without-protocol'),
      require('remark-lint-no-blockquote-without-marker'),
      require('remark-lint-no-literal-urls'),
      require('remark-lint-no-heading-content-indent'),
      require('remark-lint-hard-break-spaces'),
      [require('remark-lint-code-block-style'), 'fenced'],
      [require('remark-lint-table-cell-padding'), 'padded'],
      require('remark-lint-table-pipes'),
      [require('remark-lint-checkbox-character-style'), {
        checked: 'x', unchecked: ' '
      }],
      require('remark-lint-definition-case')
    )
  }

  // Temporarily allow skipping link validation, because remark does not parse
  // HTML anchors - as used in various Level readme's. Those readme's should be
  // updated to use markdown only.
  if (validateLinks) {
    preset.plugins.push([require('remark-validate-links'), {
      // If we don't pass this, remark-validate-links tries to get the repo url
      // from `git remote -v` which is not desirable for forks.
      repository: repo || false
    }])
  }

  return preset
}
