CREATE TABLE `accounts_matches` (
	`id` text PRIMARY KEY NOT NULL,
	`match_id` text NOT NULL,
	`account_id` text NOT NULL,
	FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`battle_tag` text,
	`selected` integer DEFAULT false,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `heroes_matches` (
	`id` text PRIMARY KEY NOT NULL,
	`match_id` text NOT NULL,
	`hero` text NOT NULL,
	FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`map` text NOT NULL,
	`season` text NOT NULL,
	`modality` text NOT NULL,
	`result` text NOT NULL,
	`time` integer NOT NULL,
	`average_tier` text,
	`average_division` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rank_updates` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`match_id` text,
	`seasonal_update` text,
	`season` text NOT NULL,
	`modality` text NOT NULL,
	`role` text,
	`time` integer NOT NULL,
	`tier` text NOT NULL,
	`division` integer NOT NULL,
	`percentage` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `accMtchMatchIdIdx` ON `accounts_matches` (`match_id`);--> statement-breakpoint
CREATE INDEX `heroMtchMatchIdIdx` ON `heroes_matches` (`match_id`);--> statement-breakpoint
CREATE INDEX `accountIdIdx` ON `matches` (`account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `emailIdx` ON `users` (`email`);