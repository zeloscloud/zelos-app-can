import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@zeloscloud/app-extension-sdk/react", () => ({
  useZelosBridge: () => ({ status: "ready" }),
}));

import { App } from "./App";

describe("App", () => {
  it("renders the converter iframe pointing at the production webapp", () => {
    render(<App />);
    const iframe = screen.getByTitle("Zelos CAN Converter") as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toBe("https://app.can.zeloscloud.io/");
  });

  it("shows a connecting state while the bridge handshake is in flight", async () => {
    vi.resetModules();
    vi.doMock("@zeloscloud/app-extension-sdk/react", () => ({
      useZelosBridge: () => ({ status: "loading" }),
    }));
    const { App: LoadingApp } = await import("./App");
    render(<LoadingApp />);
    expect(screen.getByText("Connecting to Zelos…")).toBeInTheDocument();
  });

  it("shows the bridge error when the handshake fails", async () => {
    vi.resetModules();
    vi.doMock("@zeloscloud/app-extension-sdk/react", () => ({
      useZelosBridge: () => ({ status: "error", error: new Error("nope") }),
    }));
    const { App: ErrorApp } = await import("./App");
    render(<ErrorApp />);
    expect(screen.getByText("nope")).toBeInTheDocument();
  });
});
