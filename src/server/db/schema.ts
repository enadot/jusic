import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Every contact form on the site lands in this one table. The four footer
 * topics and the artist application differ only in `type` and in what sits in
 * `payload`, so the dashboard can show them as a single stream and still filter.
 *
 * `type` and `status` are plain text rather than pg enums on purpose: adding a
 * topic later is a content change, and an enum would make it a migration.
 */
export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    /** bug | idea | artist | copyright */
    type: text("type").notNull(),
    /** new | in_progress | done | spam | archived */
    status: text("status").notNull().default("new"),

    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message").notNull(),

    /** Artist-only extras: stageName, genre, links, catalogSize, isDistributed. */
    payload: jsonb("payload").$type<Record<string, unknown>>(),
    /** The five utm_* keys captured once per session by UtmCapture. */
    utm: jsonb("utm").$type<Record<string, string>>(),

    /** Which CTA opened the form, and the page it was opened from. */
    placement: text("placement"),
    pagePath: text("page_path"),

    userAgent: text("user_agent"),
    /** sha256(ip + IP_HASH_SALT). The raw IP is never stored. */
    ipHash: text("ip_hash"),

    adminNotes: text("admin_notes"),
    /** Email of the dashboard user who last changed the status. */
    handledBy: text("handled_by"),
    handledAt: timestamp("handled_at", { withTimezone: true }),
  },
  (table) => [
    index("submissions_created_at_idx").on(table.createdAt.desc()),
    index("submissions_type_status_idx").on(table.type, table.status),
    index("submissions_ip_hash_idx").on(table.ipHash, table.createdAt),
  ],
);

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

export const SUBMISSION_TYPES = [
  "bug",
  "idea",
  "artist",
  "copyright",
] as const;
export type SubmissionType = (typeof SUBMISSION_TYPES)[number];

export const SUBMISSION_STATUSES = [
  "new",
  "in_progress",
  "done",
  "spam",
  "archived",
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];
