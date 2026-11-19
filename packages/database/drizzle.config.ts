import { defineConfig } from "drizzle-kit";

// one .env for the whole repo, it lives with the webapp
try {
  process.loadEnvFile("../../apps/webapp/.env");
} catch {
  // fine in CI, DATABASE_URL comes from the environment there
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  // TS fields are camelCase, columns are snake_case, no need to name each column
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
