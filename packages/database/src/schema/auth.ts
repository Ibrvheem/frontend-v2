import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps, timestamptz } from "./columns";

// tables Better Auth needs. column names are snake_case thanks to `casing`

export const users = pgTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  ...timestamps,
});

export const sessions = pgTable(
  "sessions",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text().notNull().unique(),
    expiresAt: timestamptz().notNull(),
    ipAddress: text(),
    userAgent: text(),
    ...timestamps,
  },
  (t) => [index().on(t.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text().notNull(),
    providerId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamptz(),
    refreshTokenExpiresAt: timestamptz(),
    scope: text(),
    password: text(),
    ...timestamps,
  },
  (t) => [index().on(t.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamptz().notNull(),
    ...timestamps,
  },
  (t) => [index().on(t.identifier)],
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));
