import { integer, sqliteTable, text, primaryKey, index } from 'drizzle-orm/sqlite-core';
export const studySessions = sqliteTable('study_sessions', {
 id: text('id').primaryKey(), userId: text('user_id').notNull(), mode: text('mode').notNull(), topic: text('topic').notNull(), questions: text('questions').notNull(), createdAt: integer('created_at').notNull(), finishedAt: integer('finished_at'),
}, t => [index('idx_study_sessions_user_created').on(t.userId, t.createdAt)]);
export const studyAnswers = sqliteTable('study_answers', {
 id: text('id').primaryKey(), userId: text('user_id').notNull(), sessionId: text('session_id').notNull(), questionId: text('question_id').notNull(), answer: text('answer').notNull(), correct: integer('correct').notNull(), createdAt: integer('created_at').notNull(),
}, t => [index('idx_study_answers_session').on(t.sessionId, t.createdAt), index('idx_study_answers_user_question').on(t.userId, t.questionId)]);
export const studyReview = sqliteTable('study_review', {
 userId: text('user_id').notNull(), questionId: text('question_id').notNull(), wrongCount: integer('wrong_count').notNull().default(0), streak: integer('streak').notNull().default(0), seen: integer('seen').notNull().default(0), lastAnswer: text('last_answer').notNull(), lastWrong: text('last_wrong').notNull().default(''), lastAt: integer('last_at').notNull(), dueAt: integer('due_at').notNull(),
}, t => [primaryKey({columns:[t.userId,t.questionId]})]);
export const studyNotes = sqliteTable('study_notes', {
 userId: text('user_id').notNull(), key: text('key').notNull(), value: text('value').notNull(), updatedAt: integer('updated_at').notNull(),
}, t => [primaryKey({columns:[t.userId,t.key]})]);
