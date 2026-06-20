-- migrations/0001_advisor.sql
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  raw_question TEXT NOT NULL,
  normalized_question TEXT NOT NULL,
  parsed_intent TEXT,            -- JSON
  ip_hash TEXT,
  country TEXT,
  answer_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_questions_hash ON questions(answer_hash);
CREATE INDEX IF NOT EXISTS idx_questions_norm ON questions(normalized_question);

CREATE TABLE IF NOT EXISTS answer_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  group_label TEXT,
  asin TEXT,
  title TEXT,
  price TEXT,
  currency TEXT,
  image_url TEXT,
  rating REAL,
  position INTEGER,
  internal_match TEXT,          -- review/category slug or NULL (gap)
  affiliate_url TEXT,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);
CREATE INDEX IF NOT EXISTS idx_cards_asin ON answer_cards(asin);
CREATE INDEX IF NOT EXISTS idx_cards_gap ON answer_cards(internal_match);

CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  asin TEXT,
  question_id INTEGER
);

CREATE TABLE IF NOT EXISTS search_cache (
  cache_key TEXT PRIMARY KEY,
  payload TEXT NOT NULL,         -- JSON: RawProduct[]
  expires_at INTEGER NOT NULL    -- epoch ms
);

CREATE TABLE IF NOT EXISTS answer_cache (
  answer_hash TEXT PRIMARY KEY,
  payload TEXT NOT NULL,         -- JSON: Answer
  created_at INTEGER NOT NULL    -- epoch ms
);

CREATE TABLE IF NOT EXISTS rate_limit (
  ip_hash TEXT NOT NULL,
  window_start INTEGER NOT NULL, -- epoch ms, truncated to window
  count INTEGER NOT NULL,
  PRIMARY KEY (ip_hash, window_start)
);
