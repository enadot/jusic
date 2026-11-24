CREATE TABLE "webhooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"secret" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"last_status" integer,
	"last_error" text,
	"last_attempt_at" timestamp with time zone,
	"created_by" text
);
