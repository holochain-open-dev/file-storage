import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    pool: "threads",
    maxWorkers: 1,
    minWorkers: 1,
    testTimeout: 60 * 1000 * 3, // 3  mins
    // Tryorama shutdown races: addAgentInfo can fire after a conductor's
    // K2 space is gone, producing harmless unhandled rejections.
    dangerouslyIgnoreUnhandledErrors: true,
  },
});
