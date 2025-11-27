CREATE TABLE `apps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`short_description` text NOT NULL,
	`developer` text NOT NULL,
	`icon_url` text NOT NULL,
	`download_url` text NOT NULL,
	`platform` text NOT NULL,
	`category` text NOT NULL,
	`screenshots` text,
	`rating` real NOT NULL,
	`reviews_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `apps_slug_unique` ON `apps` (`slug`);--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`app_id` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON UPDATE no action ON DELETE no action
);
