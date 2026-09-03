import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// The review suite exercises the real store database, so load DATABASE_URL.
process.loadEnvFile();

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
      // Next's guard throws when imported outside a server component; the
      // reviewed modules are server-only by design, so tests mock it away.
      "server-only": fileURLToPath(
        new URL("./tests/mocks/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 30_000,
  },
});