import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

// Airflow's UI exposes React and the JSX runtime as globals for plugins,
// so the bundle ships only Dagwick's own code.
// Single source of truth for the version: src/dagwick/__init__.py
const version = /__version__ = "([^"]+)"/.exec(
  readFileSync(resolve(__dirname, "../src/dagwick/__init__.py"), "utf8"),
)![1];

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    __DAGWICK_VERSION__: JSON.stringify(version),
  },
  build: {
    outDir: resolve(__dirname, "../src/dagwick/static"),
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/main.tsx"),
      name: "DagwickBundle",
      formats: ["iife"],
      fileName: () => "dagwick.js",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      output: { globals: { react: "React", "react/jsx-runtime": "ReactJSXRuntime" } },
    },
  },
});
