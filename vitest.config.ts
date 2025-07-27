import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      PAPERLESS_URL: process.env.PAPERLESS_URL || 'http://192.168.0.107:8000',
      PAPERLESS_TOKEN: process.env.PAPERLESS_TOKEN || '9ec8975a4e14f1bd14eec7a1b65dd3b1e4e24099',
    },
    include: ['**/*.spec.ts', '**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    // Set timeout for integration tests
    testTimeout: 10000,
  },
});
