import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const db = new Database(
  path.join(process.cwd(), "airline.db")
);

db.pragma("foreign_keys = ON");

const schema = fs.readFileSync(
  path.join(process.cwd(), "scripts/schema.sql"),
  "utf-8"
);

const seed = fs.readFileSync(
  path.join(process.cwd(), "scripts/values.sql"),
  "utf-8"
);

db.exec(schema);

const count = db
  .prepare("SELECT COUNT(*) AS count FROM Airlines")
  .get();

if (count.count === 0) {
  db.exec(seed);
}

export function queryRaw(sql) {
  return db.prepare(sql).all();
}

export function executeSql(sql) {
  const start = performance.now();
  const trimmed = sql.trim().replace(/;+$/, "");
  const stmt = db.prepare(trimmed);
  if (stmt.reader) {
    const rows = stmt.all();
    const duration = (performance.now() - start).toFixed(2);
    const columns = rows.length > 0 ? Object.keys(rows[0]) : (stmt.columns ? stmt.columns().map(c => c.name) : []);
    return { type: "select", rows, columns, count: rows.length, duration };
  } else {
    const info = stmt.run();
    const duration = (performance.now() - start).toFixed(2);
    return { type: "mutation", changes: info.changes, lastInsertRowid: info.lastInsertRowid, duration };
  }
}

export default db;