# Contributing

## Prerequisites

- [Zelos](https://zeloscloud.io) 26.0.10 or later
- [Zelos CLI](https://docs.zeloscloud.io/reference/cli/) 0.1.11 or later
- [just](https://github.com/casey/just)

## Layout

`extension.toml` describes everything the extension contributes:

| Part | Files | Manifest |
| ---- | ----- | -------- |
| Tab (external) | none | `[app] tab` |

The tab is external: Zelos opens `https://app.can.zeloscloud.io/` in the tab, so this project
has no web project, no agent runtime and no build step. The archive holds the manifest,
`README.md` and the icon in `assets/`.

## Commands

| Command                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `just package`         | Build and package for the Zelos marketplace        |
| `just release VERSION` | Bump version, check, test, build, commit, tag      |
| `just clean`           | Remove build output, caches and packages           |

Install [pre-commit](https://pre-commit.com) yourself and run `pre-commit install` to run the
hooks in `.pre-commit-config.yaml` on every commit.

## Run it in Zelos

```bash
zelos extensions install-local .
```

A local install runs from your project directory. After a change to `extension.toml`, run
`zelos extensions install-local .` again.

## Packaging

```bash
just package
```

The archive lands next to `extension.toml` as `<name>-<version>.tar.gz`, where `<name>` is the
manifest name in lowercase with every other run of characters turned into one hyphen. It holds
`extension.toml` and the paths listed in `[package] paths`: `README.md` and `assets/`.

## Release

```bash
just release 1.0.0
git push --follow-tags
```

The release workflow checks, tests, builds and packages the extension, then attaches the
archive to a GitHub release.
