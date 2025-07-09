import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig({
  plugins: [
    pluginReact({
      fastRefresh: false,
    }),
    pluginTypeCheck({
      enable: true,
    }),
  ],
  html: {
    template: './index.html',
  },
  source: {
    entry: {
      index: './client/main.tsx',
    },
    define: {
      'import.meta.env.VITE_GIT_COMMIT_HASH': JSON.stringify(process.env.VITE_GIT_COMMIT_HASH || 'dev'),
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
    assetPrefix: process.env.VITE_DEPLOY_TARGET === 'github' ? '/immersive-awe-canvas/' : '/',
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
      // Ensure React Fast Refresh is properly configured
      if (config.mode === 'development') {
        config.optimization = config.optimization || {};
        config.optimization.providedExports = false;
        config.optimization.usedExports = false;
      }
      return config;
    },
  },
});