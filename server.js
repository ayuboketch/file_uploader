import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import { bulkInsert } from './db.js';

const app  = express();
const port = process.env.PORT || 4002;

app.use(express.static('public'));
const upload = multer({ dest: 'uploads/' });

/* health check */
app.get('/', (_req, res) => res.send('UPLOAD-TEST API OK'));

/* upload endpoint */
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const book = xlsx.readFile(req.file.path);
    const sheet = book.Sheets[book.SheetNames[0]];
    const json = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    // map whatever columns exist; fallback to blank
    const rows = json.map(r => ({
      col_a: r.A ?? r.col_a ?? '',
      col_b: r.B ?? r.col_b ?? '',
      col_c: r.C ?? r.col_c ?? ''
    }));

    bulkInsert(rows);
    res.json({ inserted: rows.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* list inserted rows (optional) */
app.get('/api/rows', async (_req, res) => {
  const { db } = await import('./db.js');
  const rows = db.prepare('SELECT * FROM upload_rows').all();
  res.json(rows);
});

app.listen(port, () => console.log(`serving on port http://localhost:${port}`));