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

export default db;