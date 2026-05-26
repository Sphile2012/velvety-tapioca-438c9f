import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const DB_PATH = path.join(process.cwd(), "analytics.db");

async function initDb() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });
  await db.exec(
    `CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event TEXT,
      userId TEXT,
      payload TEXT,
      createdAt TEXT
    )`
  );
  return db;
}

async function start() {
  const app = express();
  app.use(express.json());

  const db = await initDb();

  app.post("/analytics", async (req, res) => {
    try {
      const { event, userId, ...rest } = req.body || {};
      await db.run(
        "INSERT INTO analytics (event, userId, payload, createdAt) VALUES (?, ?, ?, ?)",
        event || "unknown",
        userId || null,
        JSON.stringify(rest || {}),
        new Date().toISOString()
      );
      res.json({ ok: true });
    } catch (err) {
      console.error("Failed to save analytics", err);
      res.status(500).json({ ok: false, error: String(err) });
    }
  });

  app.get("/analytics", async (_req, res) => {
    try {
      const rows = await db.all("SELECT id,event,userId,payload,createdAt FROM analytics ORDER BY id DESC LIMIT 100");
      res.json({ ok: true, data: rows });
    } catch (err) {
      res.status(500).json({ ok: false, error: String(err) });
    }
  });

  const port = process.env.ANALYTICS_PORT || 4000;
  app.listen(port, () => console.log(`Analytics server listening on http://localhost:${port}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
