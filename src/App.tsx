import { useZelosBridge } from "@zeloscloud/app-extension-sdk/react";

/**
 * The full converter lives at https://app.can.zeloscloud.io (built
 * from `web/can` in the zeloscloud/src monorepo, deployed to a
 * Cloudflare Pages project named `zelos-can`). This extension is a
 * thin iframe wrapper so the same bundle ships to:
 *
 *   - standalone browser users at app.can.zeloscloud.io
 *   - Zelos Desktop users via this APP-tab extension
 *
 * with zero code duplication. Updates to the hosted webapp are picked
 * up the next time a user opens the tab; no extension re-release is
 * required for converter-side changes.
 *
 * Iframe constraints worth knowing:
 *  - The embedded webapp uses File API + duckdb-wasm + Pyodide. All
 *    three work inside a standard iframe; only the download anchor
 *    needs the iframe's `sandbox` to include `allow-downloads` (it's
 *    the default on iframes WITHOUT a `sandbox` attribute, which is
 *    what we use here).
 *  - The hosted page sets COOP `same-origin` + COEP `credentialless`;
 *    `crossOriginIsolated` becomes `true` inside the iframe regardless
 *    of the host extension's CSP, because COI is determined by the
 *    document's own response headers.
 *  - We don't pass theme/workspace state across the iframe boundary
 *    in v1. The embedded webapp uses its own (system) theme. A future
 *    iteration could postMessage `theme.changed` from
 *    `useZelosBridge`'s snapshot, if the converter's UX warrants it.
 */
const APP_URL = "https://app.can.zeloscloud.io/";

export function App() {
  const bridge = useZelosBridge();

  // Surface the bridge handshake state until it succeeds — the actual
  // converter doesn't need the bridge to function, but showing the
  // status lets the user (and us during development) tell whether the
  // extension is wired correctly before the iframe takes over the
  // viewport.
  if (bridge.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Connecting to Zelos…</p>
      </div>
    );
  }

  if (bridge.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-destructive">{bridge.error?.message ?? "Failed to connect"}</p>
      </div>
    );
  }

  return (
    <iframe
      src={APP_URL}
      title="Zelos CAN Converter"
      // No `sandbox` attribute on purpose. With sandbox set we'd need
      // to explicitly enable `allow-scripts allow-same-origin
      // allow-downloads`, and a misconfigured set silently breaks
      // SharedArrayBuffer / OPFS. Default-permissive iframes inherit
      // the parent extension's CSP already.
      style={{ display: "block", border: "none", width: "100%", height: "100vh" }}
    />
  );
}
