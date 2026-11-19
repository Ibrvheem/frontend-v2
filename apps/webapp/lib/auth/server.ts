import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { db, schema } from "@qoollege/database";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    // our tables are plural (users, sessions...), Better Auth expects singular names
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: { enabled: true },
  // lets server actions set the session cookie
  plugins: [nextCookies()],
});

export type SessionUser = typeof auth.$Infer.Session.user;

// the signed-in user, or null
export async function getUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
