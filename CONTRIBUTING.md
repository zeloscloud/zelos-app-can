# Contributing

## Prerequisites

- [Zelos CLI](https://docs.zeloscloud.io/cli)
- Node.js 20.x (see `.nvmrc`)
- [just](https://github.com/casey/just)

## Commands

| Command                | Description                                 |
| ---------------------- | ------------------------------------------- |
| `just install`         | Install dependencies                        |
| `just dev`             | Start Vite development server               |
| `just test`            | Run tests                                   |
| `just test-watch`      | Run tests in watch mode                     |
| `just format`          | Format code with Prettier                   |
| `just check`           | Lint with ESLint and type-check             |
| `just build`           | Build for production                        |
| `just verify-dist`     | Rebuild and verify committed build output   |
| `just package`         | Build and package for Zelos marketplace     |
| `just release VERSION` | Bump version, check, build, commit, and tag |
| `just clean`           | Remove build artifacts                      |

## Development Modes

### Standalone

```bash
just dev
```

Starts Vite with the SDK's `MockBridge`. The SDK renders a Development Mode banner with theme toggles automatically.

The SDK provider applies Zelos light/dark theme classes and design tokens to the document, so the extension matches the host app out of the box.

For bridge troubleshooting, run the app with DevTools open and set:

```js
localStorage.setItem("ZELOS_BRIDGE_DEBUG", "1");
```

Then reload to enable `[zelos-bridge]` debug logs in the console.

### Integrated (desktop app)

```bash
zelos extensions install-local .
```

Freshly created projects already include a committed `dist/`, so `install-local` works immediately.
Once installed, the extension appears in the app rail. Click to open.

For iterative work, use `npx vite build --watch` in a separate terminal. The desktop app serves local installs from your source tree via `.dev_source`, so rebuilt assets are picked up on reload — no need to re-run `install-local`.

In embedded mode, the SDK performs the host handshake automatically when the iframe loads.
Use `useZelosBridge()` to observe `loading`, `ready`, and `error` states. Until the bridge
is ready, `useExtensionInfo()`, `useTheme()`, and `useWorkspace()` may return `null`.

Embedded extensions run under the `zelos-app://` Content Security Policy. In v1,
`connect-src` does not allow arbitrary external `http:`/`https:` requests, so network-heavy
features are easiest to prototype in standalone mode with `MockBridge`.

The desktop shell keeps only a bounded set of app iframes mounted at once. Background app
tabs can be evicted and remounted later, so do not assume a single long-lived React mount
across every tab switch.

### How `.dev_source` works

When you run `zelos extensions install-local .`, the CLI writes a `.dev_source` file pointing to your project directory. The desktop app reads this on every request (no caching for local extensions), so changes to `dist/` are picked up immediately after a page reload.

## Bridge

The SDK bridge connects the extension to the host app, providing theme and workspace state.
In the desktop app, the handshake is part of normal startup for embedded extensions. In
standalone development, the SDK uses `MockBridge` instead of the host iframe bridge.

Available hooks:

- `useZelosBridge()` — connection status (`loading`, `ready`, `error`)
- `useExtensionInfo()` — extension ID, name, version
- `useTheme()` — current theme preference and resolved dark/light mode
- `useWorkspace()` — current workspace info (can be `null`)

Theme CSS tokens (`--background`, `--foreground`, `--primary`, etc.) are injected into the document root automatically and match the host app's shadcn/ui token set.

## Testing

Tests use [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

```bash
just test        # Run once
just test-watch  # Watch mode
```

Test files live alongside source files as `*.test.tsx` or `*.test.ts`.

## Packaging

```bash
just package
```

Rebuilds `dist/` and creates `{name}-{version}.tar.gz` next to `extension.toml`.

To verify that the committed artifact matches source before you push or tag a release:

```bash
just verify-dist
```

## Release

```bash
just release 1.0.0
```

This bumps the version in `extension.toml` and `package.json`, formats, checks, builds, commits, and tags.

Push with `git push --follow-tags`, then upload the `.tar.gz` to the Zelos marketplace.

## Layout Constraints

- `vite.config.ts` uses `base: "./"` so assets resolve correctly from `zelos-app://.../{entry}`
- `extension.toml` points at `dist/index.html` — freshly created projects already include it, but you must rebuild after editing source
- Avoid root-absolute asset paths like `/assets/...`
