import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";
import { initializeApp } from "./app/initializeApp";

const bootstrap = async () => {
  await initializeApp();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

bootstrap().catch((err) => {
  console.error("Application initialization error:", err);
});
