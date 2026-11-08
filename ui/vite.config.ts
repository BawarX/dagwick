import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

// Airflow's UI exposes React and the JSX runtime as globals for plugins,
// so the bundle ships only Dagwick's own code.
export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
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
