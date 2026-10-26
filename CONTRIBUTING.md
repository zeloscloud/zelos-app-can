# Contributing

## Prerequisites

- [Zelos](https://zeloscloud.io) 26.0.10 or later
- [Zelos CLI](https://docs.zeloscloud.io/getting-started/install-cli/) 0.1.12 or later
- [just](https://github.com/casey/just)

## Layout

`extension.toml` describes everything the extension contributes:

| Part | Files | Manifest |
| ---- | ----- | -------- |
| Tab (external) | none | `[app] tab` |

The tab is external: Zelos opens `https://app.can.zeloscloud.io/` in the tab, so this project
has no web project, no agent runtime and no build step.

## Commands

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `just package`         | Build and package for the Zelos marketplace   |
| `just release VERSION` | Bump version, check, test, build, commit, tag |
| `just clean`           | Remove build output, caches and packages      |

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
`extension.toml`, the README, the icon and the paths listed in `[package] paths`.

## Release

```bash
just release 1.0.0
git push --follow-tags
```

The release workflow checks, tests, builds and packages the extension, then attaches the
archive to a GitHub release. CI runs the same check, test and package steps on every push and
pull request.

To list the extension in the Zelos marketplace, once: push the project to a GitHub repository,
submit it at [marketplace.zeloscloud.io](https://marketplace.zeloscloud.io/), and install the
Zelos GitHub App on the repository when asked. After approval, every release you publish reaches
the marketplace. See
[Publish to the Marketplace](https://docs.zeloscloud.io/sdk/how-to/package-extensions/#publish-to-the-marketplace).
