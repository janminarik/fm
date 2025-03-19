import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "development" || mode === "test") {
    const rootEnv = loadEnv(mode, path.resolve(__dirname, "../../"), "VITE_");

    return {
      plugins: [react()],
      define: {
        ...Object.fromEntries(
          Object.entries(rootEnv).map(([key, value]) => [
            `import.meta.env.${key}`,
            JSON.stringify(value),
          ]),
        ),
      },
    };
  } else {
    return {
      plugins: [react()],
    };
  }
});
