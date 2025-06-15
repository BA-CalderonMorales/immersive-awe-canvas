import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// The `componentTagger` has been removed due to an incompatibility.
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  let base = '/';
  // For builds, we check if the target is GitHub Pages.
  // Otherwise, the base remains '/' for dev and other deployments.
  if (command === 'build' && process.env.VITE_DEPLOY_TARGET === 'github') {
    base = '/immersive-awe-canvas/';
  }

  return {
    base,
    server: {
      host: "::",
      port: 8080,
      watch: {
        ignored: ["**/node_modules/**", "**/.git/**"],
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
  };
});
