import { timestamp } from "drizzle-orm/pg-core";

// every time column stores a timezone. no more "last active is off by a few hours" bugs
export const timestamptz = () => timestamp({ withTimezone: true, mode: "date" });

// drop into any table that needs created/updated times
export const timestamps = {
  createdAt: timestamptz().notNull().defaultNow(),
  updatedAt: timestamptz()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};
