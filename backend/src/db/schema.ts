import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const decisions = sqliteTable('decisions', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  context: text('context'),
  status: text('status').default('pending'), // pending, resolved
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const scenarios = sqliteTable('scenarios', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  decisionId: text('decision_id').references(() => decisions.id).notNull(),
  type: text('type').notNull(), // best_case, worst_case
  description: text('description').notNull(),
  probability: text('probability'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const timelineEvents = sqliteTable('timeline_events', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  decisionId: text('decision_id').references(() => decisions.id).notNull(),
  title: text('title').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});
