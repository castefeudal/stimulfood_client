CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  format TEXT,
  district TEXT,
  message TEXT,
  source TEXT,
  consent INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS leads_contact_created ON leads(contact, created_at);
