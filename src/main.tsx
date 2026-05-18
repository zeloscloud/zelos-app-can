import { ZelosBridgeProvider } from "@zeloscloud/app-extension-sdk/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing #root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ZelosBridgeProvider>
      <App />
    </ZelosBridgeProvider>
  </React.StrictMode>,
);
