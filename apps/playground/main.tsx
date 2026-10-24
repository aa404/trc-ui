import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "trc-ui/styles.css";
import "./playground.css";
import { App } from "./app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
