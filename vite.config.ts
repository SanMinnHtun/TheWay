import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  server: {
    proxy: {
      "/quiz": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/api/v1": {
        target: "http://127.0.0.1:8001",
        changeOrigin: true
      }
    }
  },
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
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
