CREATE TABLE "notices" (
	"id" text PRIMARY KEY,
	"data" jsonb NOT NULL,
	"registered_count" integer DEFAULT 0 NOT NULL,
	"sort_key" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"ticket_id" text PRIMARY KEY,
	"notice_id" text NOT NULL,
	"name" text NOT NULL,
	"student_id" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "registrations_notice_email_idx" ON "registrations" ("notice_id","email");--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_notice_id_notices_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "notices"("id");