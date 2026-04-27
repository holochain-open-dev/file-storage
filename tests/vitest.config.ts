import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    pool: "threads",
    maxWorkers: 1,
    minWorkers: 1,
    testTimeout: 60 * 1000 * 3, // 3  mins
  },
});
