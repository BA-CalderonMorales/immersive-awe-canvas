import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
/// <reference types="vitest" />

export default defineConfig(({ command }) => ({
  base: process.env.VITE_DEPLOY_TARGET === 'github' ? '/immersive-awe-canvas/' : '/',
  server: {
    host: "::",
    port: 8080,
    watch: {
      ignored: [
        "**/.git/**",
        "**/node_modules/**",
      ],
    },
  },
  plugins: [react()].filter(Boolean),
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