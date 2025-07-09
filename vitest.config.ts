/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./client/test/setup.ts'],
    include: ['**/*.test.tsx', '**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'client/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@client': path.resolve(__dirname, './client'),
      '@server': path.resolve(__dirname, './server'),
      '@database': path.resolve(__dirname, './database'),
      '@utils': path.resolve(__dirname, './utils'),
    },
  },
});