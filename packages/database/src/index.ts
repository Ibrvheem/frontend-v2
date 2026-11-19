import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// the one and only db client. everything that talks to the database imports this

const globalForDb = globalThis as unknown as { pool?: Pool };

// reuse the pool across hot reloads in dev, otherwise we leak connections
const pool =
  globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle({ client: pool, schema, casing: "snake_case" });

export type Db = typeof db;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export * as schema from "./schema";
export * from "drizzle-orm";
