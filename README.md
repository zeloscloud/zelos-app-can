# CAN Converter — Zelos App Extension

> Convert `.blf` / `.asc` / `.log` / `.csv` / `.trc` CAN logs to `.trz` in the browser.

A [Zelos](https://zeloscloud.io) app extension that wraps the standalone web converter at **<https://app.can.zeloscloud.io>** in an iframe. Users drop a DBC + CAN log, click Convert, and get a `.trz` downloaded — same flow as the standalone webapp, served inside a Zelos APP tab.

## Why an iframe wrapper

The converter is a self-contained webapp (~3 MB JS + jsDelivr-hosted duckdb-wasm + Pyodide) maintained in [`zeloscloud/src` → `web/can`](https://github.com/zeloscloud/src/tree/main/web/can). Bundling the same bundle inside this extension would mean two deploy paths to keep in sync. The iframe wrapper:

- ships one HTML file (~1 KB)
- picks up every converter improvement the next time a Zelos user opens the tab
- avoids the marketplace's per-asset size limits

## Links

- [Standalone webapp](https://app.can.zeloscloud.io)
- [Converter source](https://github.com/zeloscloud/src/tree/main/web/can)
- [Repository](https://github.com/zeloscloud/zelos-app-can)
- [Issues](https://github.com/zeloscloud/zelos-app-can/issues)
- [Zelos documentation](https://docs.zeloscloud.io)

## Development

```bash
npm install
npm run dev       # vite dev server at http://localhost:5173
npm run check     # lint + tsc
npm test          # vitest unit tests
npm run build     # produces dist/ — what gets shipped in the .zextn archive
npm run package   # zelos extensions package . — builds + archives
```

Running `npm run dev` against this extension uses the SDK's `MockBridge`, so you can iterate without the Zelos desktop app open. The iframe still loads the live `app.can.zeloscloud.io`, so converter behavior in dev mirrors production.

## Installing locally

```bash
npm run build
zelos extensions install-local .
```

Then reopen the APP tab in Zelos Desktop.

## Release process

1. Bump `version` in `extension.toml` and `package.json`.
2. Tag with `vX.Y.Z` and push.
3. CI / manual: `npm run package` produces a `.zextn` archive ready to upload to the marketplace.

See `CONTRIBUTING.md` for the full extension-development guide.
