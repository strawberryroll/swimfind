CREATE TYPE "free_swimming_status" AS ENUM('OPERATED', 'NOT_OPERATED', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "pool_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "pools" (
	"id" serial PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"address" varchar(255) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"phone" varchar(30),
	"homepage_url" text,
	"status" "pool_status" DEFAULT 'ACTIVE'::"pool_status" NOT NULL,
	"free_swimming_status" "free_swimming_status" DEFAULT 'UNKNOWN'::"free_swimming_status" NOT NULL,
	"free_swimming_verified_at" timestamp with time zone,
	"free_swimming_note" text,
	"info_verified_at" timestamp with time zone
);
