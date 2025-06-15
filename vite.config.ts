
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// The `componentTagger` has been removed due to an incompatibility.
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // Check if the deployment target is GitHub Pages via environment variable
  const isGithubPages = process.env.VITE_DEPLOY_TARGET === 'github';
  
  return {
    // Set base path for GitHub Pages build, otherwise default to root
    base: command === 'build' && isGithubPages ? '/immersive-awe-canvas/' : '/',
    server: {
      host: "::",
      port: 8080,
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
