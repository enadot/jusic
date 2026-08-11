CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text NOT NULL,
	"payload" jsonb,
	"utm" jsonb,
	"placement" text,
	"page_path" text,
	"user_agent" text,
	"ip_hash" text,
	"admin_notes" text,
	"handled_by" text,
	"handled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "submissions_created_at_idx" ON "submissions" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "submissions_type_status_idx" ON "submissions" USING btree ("type","status");--> statement-breakpoint
CREATE INDEX "submissions_ip_hash_idx" ON "submissions" USING btree ("ip_hash","created_at");