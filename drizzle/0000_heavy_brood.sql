CREATE TABLE `study_answers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`session_id` text NOT NULL,
	`question_id` text NOT NULL,
	`answer` text NOT NULL,
	`correct` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_study_answers_session` ON `study_answers` (`session_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_study_answers_user_question` ON `study_answers` (`user_id`,`question_id`);--> statement-breakpoint
CREATE TABLE `study_notes` (
	`user_id` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `key`)
);
--> statement-breakpoint
CREATE TABLE `study_review` (
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`wrong_count` integer DEFAULT 0 NOT NULL,
	`streak` integer DEFAULT 0 NOT NULL,
	`seen` integer DEFAULT 0 NOT NULL,
	`last_answer` text NOT NULL,
	`last_wrong` text DEFAULT '' NOT NULL,
	`last_at` integer NOT NULL,
	`due_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `question_id`)
);
--> statement-breakpoint
CREATE TABLE `study_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`mode` text NOT NULL,
	`topic` text NOT NULL,
	`questions` text NOT NULL,
	`created_at` integer NOT NULL,
	`finished_at` integer
);
--> statement-breakpoint
CREATE INDEX `idx_study_sessions_user_created` ON `study_sessions` (`user_id`,`created_at`);