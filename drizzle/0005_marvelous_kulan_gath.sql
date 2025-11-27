PRAGMA foreign_keys=OFF;

-- Recreate apps table with timestamp created_at, JSON default for screenshots, and new indexes
CREATE TABLE `apps_new` (
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
    `screenshots` text NOT NULL DEFAULT '[]',
    `rating` real NOT NULL,
    `reviews_count` integer NOT NULL DEFAULT 0,
    `created_at` integer NOT NULL DEFAULT (unixepoch() * 1000),
    UNIQUE (`slug`)
);

INSERT INTO `apps_new` (
    `id`, `name`, `slug`, `description`, `short_description`, `developer`, `icon_url`,
    `download_url`, `platform`, `category`, `screenshots`, `rating`, `reviews_count`, `created_at`
)
SELECT
    `id`,
    `name`,
    `slug`,
    `description`,
    `short_description`,
    `developer`,
    `icon_url`,
    `download_url`,
    `platform`,
    `category`,
    COALESCE(`screenshots`, '[]'),
    `rating`,
    `reviews_count`,
    CAST(strftime('%s', `created_at`) AS integer) * 1000
FROM `apps`;

DROP TABLE `apps`;
ALTER TABLE `apps_new` RENAME TO `apps`;

CREATE INDEX `apps_category_idx` ON `apps` (`category`);
CREATE INDEX `apps_platform_idx` ON `apps` (`platform`);

-- Recreate bookmarks table with timestamp created_at and composite uniqueness
CREATE TABLE `bookmarks_new` (
    `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `user_id` text NOT NULL,
    `app_id` integer NOT NULL,
    `created_at` integer NOT NULL DEFAULT (unixepoch() * 1000),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON UPDATE no action ON DELETE cascade,
    UNIQUE (`user_id`, `app_id`)
);

INSERT INTO `bookmarks_new` (`id`, `user_id`, `app_id`, `created_at`)
SELECT `id`, `user_id`, `app_id`, CAST(strftime('%s', `created_at`) AS integer) * 1000
FROM `bookmarks`;

DROP TABLE `bookmarks`;
ALTER TABLE `bookmarks_new` RENAME TO `bookmarks`;

PRAGMA foreign_keys=ON;
