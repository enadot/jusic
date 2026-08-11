import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Neon Auth owns the neon_auth schema. Keep drizzle-kit out of it so a
  // generate/push never tries to drop or alter the managed auth tables.
  schemaFilter: ["public"],
  verbose: true,
  strict: true,
});
