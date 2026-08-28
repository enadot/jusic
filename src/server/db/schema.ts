import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
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

/**
 * Who may open the dashboard, beyond the ADMIN_EMAILS env allowlist.
 *
 * ADMIN_EMAILS stays the root list: it needs no database, it cannot be edited
 * from the browser, and it is what gets the first person in — and back in if
 * this table is ever emptied or unreachable. Rows here are the teammates added
 * afterwards from /admin/team, which is the whole point: a new colleague is a
 * click, not an environment variable and a redeploy.
 *
 * `email` is stored already lowercased (the action does it) and carries a
 * unique index, so "A@x.com" cannot be added twice under different casing.
 */
export const adminAllowlist = pgTable(
  "admin_allowlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    email: text("email").notNull(),
    /** Free-text label — a name or a role, so a stale row can be recognised. */
    note: text("note"),
    /** Email of the admin who added this row. */
    addedBy: text("added_by"),
  },
  (table) => [uniqueIndex("admin_allowlist_email_idx").on(table.email)],
);

export type AdminAllowlistRow = typeof adminAllowlist.$inferSelect;

/**
 * Extra destinations every new submission is POSTed to, managed from
 * /admin/webhooks.
 *
 * MAKE_WEBHOOK_URL keeps working exactly as before and is not a row here — it
 * is the env-configured destination that predates this table, and the same
 * argument as the admin allowlist applies: an integration that must survive an
 * empty or unreachable table belongs in the environment. Rows are everything
 * added since, without a redeploy.
 *
 * The last attempt is recorded on the row itself rather than in a delivery log:
 * the question the dashboard actually has to answer is "is this endpoint
 * working right now", and one row per destination answers it without a table
 * that grows with every submission.
 */
export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  url: text("url").notNull(),
  /** What this endpoint is, so a stale row can be recognised. */
  description: text("description"),
  /**
   * Optional HMAC-SHA256 key. When set, the POST carries the body signature in
   * x-jusic-signature, exactly as the Make integration does.
   */
  secret: text("secret"),
  enabled: boolean("enabled").notNull().default(true),

  /** HTTP status of the last attempt, or null if it never got a response. */
  lastStatus: integer("last_status"),
  lastError: text("last_error"),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),

  createdBy: text("created_by"),
});

export type Webhook = typeof webhooks.$inferSelect;
