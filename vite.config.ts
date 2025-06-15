
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// The `componentTagger` has been removed due to an incompatibility.
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // Set base path based on VITE_DEPLOY_TARGET env var to support different deployment targets.
  base: process.env.VITE_DEPLOY_TARGET === 'github' ? '/immersive-awe-canvas/' : '/',
  server: {
    host: "::",
    port: 8080,
    // Explicitly ignore node_modules and .git to prevent "too many open files" errors.
    watch: {
      ignored: [
        "**/.git/**",
        "**/node_modules/**",
      ],
    },
  },
  plugins: [
    react(),
    // mode === 'development' && componentTagger(), // Temporarily disabled
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
}));
