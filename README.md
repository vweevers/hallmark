# hallmark

> **Markdown Style Guide, with linter and automatic fixer.** :sparkles:  
> Powered by [`remark`][remark].

[![npm status](http://img.shields.io/npm/v/hallmark.svg)](https://www.npmjs.org/package/hallmark)
[![node](https://img.shields.io/node/v/hallmark.svg)](https://www.npmjs.org/package/hallmark)
[![Travis build status](https://img.shields.io/travis/vweevers/hallmark.svg?label=travis)](http://travis-ci.org/vweevers/hallmark)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Greenkeeper badge](https://badges.greenkeeper.io/vweevers/hallmark.svg)](https://greenkeeper.io/)
![Markdown Style Guide](https://img.shields.io/badge/md_style-hallmark-brightgreen.svg)

## Table of Contents

<details><summary>Click to expand</summary>

- [Usage](#usage)
- [Opt-in Features](#opt-in-features)
- [Rules](#rules)
- [Reporters](#reporters)
- [Install](#install)
- [License](#license)

</details>

## Usage

Lint `*.md` files:

```
hallmark
```

Lint and fix:

```
hallmark --fix
```

Lint and fix custom files:

```
hallmark --fix CHANGELOG.md docs/*.md
```

## Opt-in Features

### Table of Contents

Add this heading to a markdown file:

```markdown
## Table of Contents
```

Running `hallmark --fix` will then create or update a table of contents.

### Contributors Table

Add this heading to an otherwise empty `CONTRIBUTORS.md`:

```markdown
# Contributors
```

Or this heading to a `README.md`:

```markdown
## Contributors
```

Running `hallmark --fix` will then render contributors from `git` history to a markdown table.

## Rules

- [Insert links to GitHub issues, PRs and usernames](https://www.npmjs.com/package/remark-github) (not linted)
- [Collapse a Table of Contents if it exists](https://www.npmjs.com/package/remark-collapse) (not linted)
- [Fenced code blocks](https://www.npmjs.com/package/remark-lint-code-block-style)
- [End file with newline](https://www.npmjs.com/package/remark-lint-final-newline)
- No dead links, references and definitions:
  - [No dead internal links](https://www.npmjs.com/package/remark-validate-links)
  - ~~[No dead external links](https://www.npmjs.com/package/remark-lint-no-dead-urls)~~ ([#17](https://github.com/vweevers/hallmark/issues/17))
  - [No references to undefined definitions](https://www.npmjs.com/package/remark-lint-no-undefined-references)
  - [No unused definitions](https://www.npmjs.com/package/remark-lint-no-unused-definitions)
  - [No duplicate definitions](https://www.npmjs.com/package/remark-lint-no-duplicate-definitions)
  - [Definition labels must be lowercase](https://www.npmjs.com/package/remark-lint-definition-case)
- No more spaces than needed:
  - [Indent list items with a single space (`-  item`)](https://www.npmjs.com/package/remark-lint-list-item-indent)
  - [Indent blockquote content with a single space](https://www.npmjs.com/package/remark-lint-blockquote-indentation)
  - [Checkboxes must be followed by a single space](https://www.npmjs.com/package/remark-lint-checkbox-content-indent)
  - [No indentation before list item bullets](https://www.npmjs.com/package/remark-lint-list-item-bullet-indent)
  - [No unneeded padding around heading content](https://www.npmjs.com/package/remark-lint-no-heading-content-indent)
  - [No more than two spaces to create a hard break](https://www.npmjs.com/package/remark-lint-hard-break-spaces)
  - [No inline padding between markers and content (`_ content _`)](https://www.npmjs.com/package/remark-lint-no-inline-padding)
- Parsable literal URLs:
  - [No literal URLs without angle-brackets](https://www.npmjs.com/package/remark-lint-no-literal-urls)
  - [No angle-bracketed links (`<url>`) without protocol](https://www.npmjs.com/package/remark-lint-no-auto-link-without-protocol)
- [No blank lines without markers (`>`) in a blockquote](https://www.npmjs.com/package/remark-lint-no-blockquote-without-marker)
- [Table cells must be padded](https://www.npmjs.com/package/remark-lint-table-cell-padding) ([#16](https://github.com/vweevers/hallmark/issues/16))
- [Table rows must be fenced with pipes](https://www.npmjs.com/package/remark-lint-table-pipes)
- [Checkboxes must use `x` as marker](https://www.npmjs.com/package/remark-lint-checkbox-character-style)

## Reporters

Various reporters are available:

- [`vfile-reporter`](https://npmjs.org/package/vfile-reporter) (default)
- [`vfile-reporter-json`](https://npmjs.org/package/vfile-reporter-json)
- [`vfile-reporter-pretty`](https://npmjs.org/package/vfile-reporter-pretty)

To use a custom reporter first install it with [npm](https://npmjs.org):

```
npm i vfile-reporter-json --save-dev
```

Then pass it to `hallmark` with or without options:

```
hallmark --report json
hallmark --report [ json --pretty ]
```

## Install

With [npm](https://npmjs.org) do:

```
npm install hallmark --save-dev
```

## License

[GPL-3.0](LICENSE) © 2018-present Vincent Weevers.

[remark]: https://www.npmjs.org/package/remark
