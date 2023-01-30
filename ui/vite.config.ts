import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./demo",
  plugins: [
    checker({
      typescript: true,
    }),
  ],
});
