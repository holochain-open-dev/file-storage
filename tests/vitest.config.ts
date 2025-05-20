import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    testTimeout: 60 * 1000 * 3, // 3  mins
  },
});
