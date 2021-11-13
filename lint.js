import remarkLint from 'remark-lint'
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references'
import remarkLintNoUnusedDefinitions from 'remark-lint-no-unused-definitions'
import remarkLintNoDuplicateDefinitions from 'remark-lint-no-duplicate-definitions'
import remarkLintNoInlinePadding from 'remark-lint-no-inline-padding'
import remarkLintBlockquoteIndentation from 'remark-lint-blockquote-indentation'
import remarkLintCheckboxContentIndent from 'remark-lint-checkbox-content-indent'
import remarkLintFinalNewline from 'remark-lint-final-newline'
import remarkLintListItemBulletIndent from 'remark-lint-list-item-bullet-indent'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintNoAutoLinkWithoutProtocol from 'remark-lint-no-auto-link-without-protocol'
import remarkLintNoBlockquoteWithoutMarker from 'remark-lint-no-blockquote-without-marker'
import remarkLintNoLiteralUrls from 'remark-lint-no-literal-urls'
import remarkLintNoHeadingContentIndent from 'remark-lint-no-heading-content-indent'
import remarkLintHardBreakSpaces from 'remark-lint-hard-break-spaces'
import remarkLintCodeBlockStyle from 'remark-lint-code-block-style'
import remarkLintTableCellPadding from 'remark-lint-table-cell-padding'
import remarkLintTablePipes from 'remark-lint-table-pipes'
import remarkLintCheckboxCharacterStyle from 'remark-lint-checkbox-character-style'
import remarkLintDefinitionCase from 'remark-lint-definition-case'
import remarkValidateLinks from 'remark-validate-links'

export default function ({ fix, repository, paddedTable, validateLinks }) {
  const preset = {
    plugins: [
      remarkLint,

      // These are not automatically fixed by remark-stringify
      remarkLintNoUndefinedReferences,
      remarkLintNoUnusedDefinitions,
      remarkLintNoDuplicateDefinitions,
      remarkLintNoInlinePadding,
      [remarkLintBlockquoteIndentation, 2], // Means 1 space.
      remarkLintCheckboxContentIndent

      // TBD
      // require('remark-lint-no-shortcut-reference-image'),
      // require('remark-lint-no-shortcut-reference-link')
    ]
  }

  if (!fix) {
    preset.plugins.push(
      remarkLintFinalNewline,
      remarkLintListItemBulletIndent,
      [remarkLintListItemIndent, 'space'],
      remarkLintNoAutoLinkWithoutProtocol,
      remarkLintNoBlockquoteWithoutMarker,
      remarkLintNoLiteralUrls,
      remarkLintNoHeadingContentIndent,
      remarkLintHardBreakSpaces,
      [remarkLintCodeBlockStyle, 'fenced'],

      // TODO: support fixed-width columns (https://github.com/remarkjs/remark-lint/issues/217)
      paddedTable ? [remarkLintTableCellPadding, 'padded'] : null,

      remarkLintTablePipes,
      [remarkLintCheckboxCharacterStyle, {
        checked: 'x', unchecked: ' '
      }],
      remarkLintDefinitionCase
    )
  }

  // Temporarily allow skipping link validation, because remark does not parse
  // HTML anchors - as used in various Level readme's. Those readme's should be
  // updated to use markdown only.
  if (validateLinks) {
    preset.plugins.push([remarkValidateLinks, {
      // If we don't pass this, remark-validate-links tries to get the repo url
      // from `git remote -v` which is not desirable for forks.
      repository: repository || false
    }])
  }

  preset.plugins = preset.plugins.filter(Boolean)
  return preset
}
