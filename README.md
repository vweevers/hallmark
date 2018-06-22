# hallmark

> **Markdown Style Guide, with linter and automatic fixer.** :sparkles:  
> Powered by [`remark`][remark].

[![npm status](http://img.shields.io/npm/v/hallmark.svg)](https://www.npmjs.org/package/hallmark)
[![node](https://img.shields.io/node/v/hallmark.svg)](https://www.npmjs.org/package/hallmark)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![Markdown Style Guide](https://img.shields.io/badge/md_style-hallmark-brightgreen.svg)

## Table of Contents

<details><summary>Click to expand</summary>

- [Usage](#usage)
- [Features](#features)
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

## Features

- [Validate links to headings and files](https://www.npmjs.com/package/remark-validate-links)
- ~~[Validate external links](https://www.npmjs.com/package/remark-lint-no-dead-urls)~~
- [Insert links to GitHub issues, PRs and usernames](https://www.npmjs.com/package/remark-github)
- [Collapse a Table of Contents if it exists](https://www.npmjs.com/package/remark-collapse)

## Opt-in Features

### Table of Contents

Add this heading to a markdown file:

```markdown
## Table of Contents
```

Running `hallmark` will then create or update a table of contents.

### Contributors Table

Add this heading to an otherwise empty `CONTRIBUTORS.md`:

```markdown
# Contributors
```

Or this heading to a `README.md`:

```markdown
## Contributors
```

Running `hallmark` will then render contributors from `git` history to a markdown table.

## Rules

- Fenced code blocks
- No extra list indentation
- No duplicate definitions
- No table padding
- No undefined references
- No unused definitions

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
