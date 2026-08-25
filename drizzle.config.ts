import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is missing. Copy .env.example to .env.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: url.includes("?") ? `${url}&pgbouncer=true` : `${url}?pgbouncer=true`,
  },
});
