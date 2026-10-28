import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/manrope/wght.css";
import "./styles.css";
import "./journal.css";
import "./premium.css";
import "./taste.css";
import App from "./App";
import { StoreProvider } from "./store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
);
