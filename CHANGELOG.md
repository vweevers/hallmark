# Changelog

## [3.1.0] - 2020-11-14

### Added

- Add `bump` command to add a new version to changelog ([`9e2b53b`](https://github.com/vweevers/hallmark/commit/9e2b53b))
  - As an example, `hallmark bump minor` added this 3.1.0 entry, prepopulated with git commits :sparkles:
  - We now also support `hallmark lint` and `hallmark fix` as commands, which going forward are preferred over `hallmark` and `hallmark --fix` respectively
- Export programmatic API ([`3dc1c87`](https://github.com/vweevers/hallmark/commit/3dc1c87), [`6867517`](https://github.com/vweevers/hallmark/commit/6867517), [`d67f191`](https://github.com/vweevers/hallmark/commit/d67f191))
  - Used by [`hallmark-lint-action`](https://github.com/vweevers/hallmark-lint-action) :sparkles:
- Add [`remark-autolink-references`](https://github.com/vweevers/remark-autolink-references) ([`6e36fda`](https://github.com/vweevers/hallmark/commit/6e36fda))
  - Transform references like `JIRA-123` into links :sparkles:
- Fallback to git remote to get repository url ([`dbbe165`](https://github.com/vweevers/hallmark/commit/dbbe165))
- Support `.hallmarkrc` as alternative to `package.json` ([`6469e03`](https://github.com/vweevers/hallmark/commit/6469e03), [`fe50723`](https://github.com/vweevers/hallmark/commit/fe50723))
  - Hallmark can now be used on non-node projects :sparkles:

## [3.0.0] - 2020-08-22

### Changed

- **Breaking:** drop node &lt; 10 and upgrade dependencies ([`02e7c00`](https://github.com/vweevers/hallmark/commit/02e7c00)). Now silently exits on node &lt; 10. Two dozen remark modules have been upgraded, many with breaking changes though most don't apply here. One thing I've noticed is that text like `module@1.0.0` will be converted to a `mailto` link. Wrap such text in backticks.
- **Breaking:** remove depth limit on table of contents ([`031a6ae`](https://github.com/vweevers/hallmark/commit/031a6ae))
- Bump `remark-changelog` ([`4868875`](https://github.com/vweevers/hallmark/commit/4868875)). Adds experimental git submodule support.

### Added

- Support passing options to `remark-changelog` ([`6a3923e`](https://github.com/vweevers/hallmark/commit/6a3923e)).

## [2.1.0] - 2020-05-06

### Added

- Add options to specify extra plugins ([`e43475c`](https://github.com/vweevers/hallmark/commit/e43475c))

### Fixed

- Skip testing `airtap` ([#45](https://github.com/vweevers/hallmark/issues/45)) ([`f6c44f9`](https://github.com/vweevers/hallmark/commit/f6c44f9))

## [2.0.0] - 2019-09-06

### Changed

- Skip running on node &lt; 8 ([`e804671`](https://github.com/vweevers/hallmark/commit/e804671))
- Upgrade `standard` devDependency from `^13.0.1` to `^14.0.0` ([#35](https://github.com/vweevers/hallmark/issues/35))
- Upgrade `rimraf` devDependency from `^2.6.3` to `^3.0.0` ([#34](https://github.com/vweevers/hallmark/issues/34))

### Added

- **Breaking:** add `remark-changelog` ([#37](https://github.com/vweevers/hallmark/issues/37), [#44](https://github.com/vweevers/hallmark/issues/44), [`6a793f6`](https://github.com/vweevers/hallmark/commit/6a793f6), [`057fddb`](https://github.com/vweevers/hallmark/commit/057fddb))
- Allow disabling automatic table of contents ([`cee5001`](https://github.com/vweevers/hallmark/commit/cee5001))
- Allow disabling table padding ([`3210a96`](https://github.com/vweevers/hallmark/commit/3210a96))
- Add node 12 to CI ([`b31750e`](https://github.com/vweevers/hallmark/commit/b31750e))

## [1.2.0] - 2019-08-11

### Changed

- Skip `remark-git-contributors` in lint mode ([#33](https://github.com/vweevers/hallmark/issues/33))

### Removed

- Remove `remark-lint-no-dead-urls` (was already disabled) ([`242ff83`](https://github.com/vweevers/hallmark/commit/242ff83))

### Fixed

- Pass repository into `remark-github` (skip reading `package.json` twice) ([`80131b3`](https://github.com/vweevers/hallmark/commit/80131b3))

## [1.1.1] - 2019-08-09

### Fixed

- Restore previous repo behavior of `remark-validate-links` ([#32](https://github.com/vweevers/hallmark/issues/32)) ([`48c7abc`](https://github.com/vweevers/hallmark/commit/48c7abc))

## [1.1.0] - 2019-08-09

### Changed

- Upgrade `remark` from `~10.0.1` to `~11.0.0` ([#27](https://github.com/vweevers/hallmark/issues/27))
- Upgrade `remark-toc` from `~5.1.1` to `~6.0.0` ([#25](https://github.com/vweevers/hallmark/issues/25))
- Upgrade `remark-github` from `~7.0.3` to `~8.0.0` ([#26](https://github.com/vweevers/hallmark/issues/26)
- Upgrade `remark-validate-links` from `~8.0.2` to `~9.0.1` ([#31](https://github.com/vweevers/hallmark/issues/31))
- Upgrade `deglob` from `~3.1.0` to `^4.0.0` ([#28](https://github.com/vweevers/hallmark/issues/28))

### Added

- Add `--ignore/-i` option (in addition to package config) ([`b6011c2`](https://github.com/vweevers/hallmark/commit/b6011c2))
- Smoke test dependents ([#29](https://github.com/vweevers/hallmark/issues/29), [`06a2e34`](https://github.com/vweevers/hallmark/commit/06a2e34))

## [1.0.0] - 2019-07-12

### Changed

- Upgrade `remark-git-contributors` from `~0.3.0` to `~2.0.0` ([#20](https://github.com/vweevers/hallmark/issues/20), [#22](https://github.com/vweevers/hallmark/issues/22))
- Upgrade `remark-lint-no-undefined-references` from `~1.0.2` to `~1.1.0` ([#20](https://github.com/vweevers/hallmark/issues/20))
- Upgrade `remark-validate-links` from `~7.1.2` to `~8.0.2` ([#20](https://github.com/vweevers/hallmark/issues/20))
- Upgrade `supports-color` from `~5.5.0` to `~6.1.0` ([#20](https://github.com/vweevers/hallmark/issues/20))
- Upgrade `unified-engine` from `~6.0.1` to `~7.0.0` ([#20](https://github.com/vweevers/hallmark/issues/20))
- Upgrade `tape` devDependency from `~4.9.1` to `^4.10.2` ([#20](https://github.com/vweevers/hallmark/issues/20))
- Upgrade `vfile-reporter-json` devDependency from `~1.0.2` to `^2.0.0` ([#20](https://github.com/vweevers/hallmark/issues/20))
- Upgrade `standard` devDependency from `~12.0.1` to `^13.0.1` ([#20](https://github.com/vweevers/hallmark/issues/20), [#23](https://github.com/vweevers/hallmark/issues/23))

### Added

- Document requirements ([`99d9884`](https://github.com/vweevers/hallmark/commit/99d9884))
- Document `community` option and alias it as `contributors` ([`1fff6f3`](https://github.com/vweevers/hallmark/commit/1fff6f3))

## [0.1.0] - 2018-11-24

### Changed

- Temporarily allow skipping link validation ([`e41c46e`](https://github.com/vweevers/hallmark/commit/e41c46e))
- Upgrade dependencies ([`f70056a`](https://github.com/vweevers/hallmark/commit/f70056a))

## [0.0.2] - 2018-06-24

### Changed

- Upgrade `remark-git-contributors` from `0.2.2` to `0.2.3` ([`f941461`](https://github.com/vweevers/hallmark/commit/f941461))

## 0.0.1 - 2018-06-23

:seedling: Initial release.

[3.1.0]: https://github.com/vweevers/hallmark/compare/v3.0.0...v3.1.0

[3.0.0]: https://github.com/vweevers/hallmark/compare/v2.1.0...v3.0.0

[2.1.0]: https://github.com/vweevers/hallmark/compare/v2.0.0...v2.1.0

[2.0.0]: https://github.com/vweevers/hallmark/compare/v1.2.0...v2.0.0

[1.2.0]: https://github.com/vweevers/hallmark/compare/v1.1.1...v1.2.0

[1.1.1]: https://github.com/vweevers/hallmark/compare/v1.1.0...v1.1.1

[1.1.0]: https://github.com/vweevers/hallmark/compare/v1.0.0...v1.1.0

[1.0.0]: https://github.com/vweevers/hallmark/compare/v0.1.0...v1.0.0

[0.1.0]: https://github.com/vweevers/hallmark/compare/v0.0.2...v0.1.0

[0.0.2]: https://github.com/vweevers/hallmark/compare/v0.0.1...v0.0.2
