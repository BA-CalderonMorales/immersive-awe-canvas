import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginTypeCheck({
      enable: true,
      forkTsChecker: {
        typescript: {
          configFile: './tsconfig.json',
        },
      },
    }),
  ],
  html: {
    template: './index.html',
  },
  source: {
    entry: {
      index: './client/main.tsx',
    },
  },
  resolve: {
    alias: {
      '@': './client',
      '@client': './client',
      '@server': './server',
      '@utils': './utils',
      '@database': './database',
    },
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
  },
  output: {
    distPath: {
      root: 'dist',
    },
  },
  dev: {
    hmr: true,
    liveReload: true,
  },
  performance: {
    bundleAnalyze: process.env.BUNDLE_ANALYZE ? {} : undefined,
  },
  tools: {
    rspack: (config) => {
      // Add any custom rspack configuration here
      return config;
    },
  },
});