import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@firebase")) {
            return "firebase";
          }

          return undefined;
        }
      }
    }
  },
  plugins: [
    react({
      jsxRuntime: "automatic"
    })
  ]
});
