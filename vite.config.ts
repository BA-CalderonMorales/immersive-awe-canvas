import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
/// <reference types="vitest" />

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
  },
}));