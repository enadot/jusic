CREATE TABLE "admin_allowlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"note" text,
	"added_by" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_allowlist_email_idx" ON "admin_allowlist" USING btree ("email");