import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const pastes = sqliteTable('pastes', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  editPassword: text('edit_password').default(''),
  expire: integer('expire').default(0).notNull(),
  language: text('language').default('text').notNull(),
  createTime: integer('create_time').notNull(),
  metadata: text('metadata').notNull(),
});

export const files = sqliteTable('files', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  expire: integer('expire').default(0).notNull(),
  language: text('language').default('text').notNull(),
  createTime: integer('create_time').notNull(),
  metadata: text('metadata').notNull(),
});

export type Paste = typeof pastes.$inferSelect;
export type NewPaste = typeof pastes.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
