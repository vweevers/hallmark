# Changelog

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

[1.2.0]: https://github.com/vweevers/hallmark/compare/v1.1.1...v1.2.0

[1.1.1]: https://github.com/vweevers/hallmark/compare/v1.1.0...v1.1.1

[1.1.0]: https://github.com/vweevers/hallmark/compare/v1.0.0...v1.1.0

[1.0.0]: https://github.com/vweevers/hallmark/compare/v0.1.0...v1.0.0

[0.1.0]: https://github.com/vweevers/hallmark/compare/v0.0.2...v0.1.0

[0.0.2]: https://github.com/vweevers/hallmark/compare/v0.0.1...v0.0.2
