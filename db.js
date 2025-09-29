import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname, 'db');
mkdirSync(dbDir, { recursive: true });

const db = new Database(join(dbDir, 'data.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS upload_rows (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    col_a TEXT,
    col_b TEXT,
    col_c TEXT
  );
`);

const insert = db.prepare('INSERT INTO upload_rows (col_a, col_b, col_c) VALUES (?, ?, ?)');

export function bulkInsert(rows) {
  const runMany = db.transaction((data) => {
    for (const r of data) insert.run(r.col_a, r.col_b, r.col_c);
  });
  runMany(rows);
}

export { db };