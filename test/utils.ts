import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../server/database/schema';

export function createTestDB() {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });
  
  const migrationScript = `
    CREATE TABLE \`files\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`content\` text NOT NULL,
      \`expire\` integer DEFAULT 0 NOT NULL,
      \`language\` text DEFAULT 'text' NOT NULL,
      \`create_time\` integer NOT NULL,
      \`metadata\` text NOT NULL
    );
    --> statement-breakpoint
    CREATE TABLE \`pastes\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`content\` text NOT NULL,
      \`edit_password\` text DEFAULT '',
      \`expire\` integer DEFAULT 0 NOT NULL,
      \`language\` text DEFAULT 'text' NOT NULL,
      \`create_time\` integer NOT NULL,
      \`metadata\` text NOT NULL
    );
  `;
  
  sqlite.exec(migrationScript.replace(/--> statement-breakpoint/g, ''));
  
  return db;
}
