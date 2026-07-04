import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
