import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@compre-facil/contracts': resolve(__dirname, 'packages/contracts/src'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts', '**/test/**/*.test.ts'],
  },
});
