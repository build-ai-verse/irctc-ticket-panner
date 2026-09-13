import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mirror the tsconfig "@/*" -> "./*" path alias for tests.
    alias: [{ find: /^@\//, replacement: `${resolve(process.cwd())}/` }],
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["{lib,components,app}/**/*.test.{ts,tsx}"],
  },
});
