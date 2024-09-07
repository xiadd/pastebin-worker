DROP TABLE IF EXISTS pastes;
DROP TABLE IF EXISTS files;
CREATE TABLE IF NOT EXISTS pastes (
  id text PRIMARY KEY,
  content text NOT NULL,
  edit_password text DEFAULT "",
  expire integer DEFAULT 0 NOT NULL,
  language text DEFAULT "text" NOT NULL,
  create_time integer NOT NULL,
  metadata text NOT NULL
);
CREATE TABLE IF NOT EXISTS files (
  id text PRIMARY KEY,
  content text NOT NULL,
  expire integer DEFAULT 0 NOT NULL,
  language text DEFAULT "text" NOT NULL,
  create_time integer NOT NULL,
  metadata text NOT NULL
);