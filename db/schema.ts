import { pgTable, text, integer, bigint, jsonb, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type { Notice } from "../shared/notices.ts";

export const notices = pgTable("notices", {
  id: text().primaryKey(),
  // Full notice payload (everything except the live registration counter)
  data: jsonb().$type<Omit<Notice, "registeredCount">>().notNull(),
  registeredCount: integer("registered_count").notNull().default(0),
  // Board order: newest pinned notices first, seed notices in their original order
  sortKey: bigint("sort_key", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const registrations = pgTable(
  "registrations",
  {
    ticketId: text("ticket_id").primaryKey(),
    noticeId: text("notice_id").notNull().references(() => notices.id),
    name: text().notNull(),
    studentId: text("student_id").notNull(),
    email: text().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("registrations_notice_email_idx").on(t.noticeId, t.email)]
);
