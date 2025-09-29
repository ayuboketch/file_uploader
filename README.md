# Documentation for File Uploader Project

<img width="589" height="603" alt="Screenshot 2025-09-29 at 17 08 03" src="https://github.com/user-attachments/assets/86c3146a-eca5-4547-bc6d-3687025371cf" />

```markdown
# 📤 Excel Upload Tech-Test – Question 2

A **stand-alone** Node service that exposes an `/api/upload` endpoint:  
accept an `.xlsx` file → parse → bulk-insert rows into **SQLite** → return row count.

---

## 1. Quick Start

```bash
git clone https://github.com/yourname/upload-tech-test.git
cd upload-tech-test
npm install
npm start          # http://localhost:4002
```

Visit [localhost:4002/upload.html](http://localhost:4002/upload.html) and upload `data.xlsx`.

---

## 2. Stack

| Layer        | Tech                     |
|--------------|--------------------------|
| Runtime      | Node 20+ (ES modules)    |
| Web server   | Express 4                |
| DB           | SQLite (better-sqlite3)  |
| Parser       | SheetJS (xlsx)           |
| Upload       | Multer (disk)            |

---

## 3. API Contract

### `POST /api/upload`
**Content-Type**: `multipart/form-data`  
**Field**: `file` (`.xlsx`)

**Success 200**
```json
{ "inserted": 42 }
```

**Error 500**
```json
{ "error": "Detailed message" }
```

---

## 4. DB Schema

| Column | Type   | Note               |
|--------|--------|--------------------|
| id     | INT    | PK, auto-inc       |
| col_a  | TEXT   | 1st spreadsheet col|
| col_b  | TEXT   | 2nd spreadsheet col|
| col_c  | TEXT   | 3rd spreadsheet col|

---

## 5. Performance Notes

- **Transaction bulk-insert** (`BEGIN ... COMMIT`) → single disk flush.  
- **Disk upload** (not memory) → handles large files without blowing the heap.  
- **Index** on `id` only; no extra indexes keep inserts O(1).

---

## 6. Local Dev

```bash
npm run dev       
```

---

## 7. Deploy (example: Render)

| Setting         | Value               |
|-----------------|---------------------|
| Build Command   | `npm install`       |
| Start Command   | `npm start`         |
| Environment     | `PORT=4002`         |

---

## 8. Repo Contents

```
├─ server.js        # Express server
├─ db.js            # SQLite + bulk helper
├─ public/
│  ├─ index.html    # Landing page
│  └─ upload.html   # Professional upload form (dark theme)
├─ data.xlsx        # Sample file for testers
├─ package.json
└─ README.md        
```


