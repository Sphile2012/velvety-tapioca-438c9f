import { Handler } from "@netlify/functions";
import fs from "fs";
import path from "path";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = event.body ? JSON.parse(event.body) : {};

    const storePath = path.join(process.cwd(), "analytics-store.json");

    let store: any[] = [];
    try {
      if (fs.existsSync(storePath)) {
        const raw = fs.readFileSync(storePath, "utf8");
        store = raw ? JSON.parse(raw) : [];
      }
    } catch (e) {
      console.warn("Failed to read analytics store", e);
      store = [];
    }

    store.push({ ...payload, receivedAt: new Date().toISOString() });
    try {
      fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
    } catch (e) {
      console.warn("Failed to write analytics store", e);
    }

    console.log("Analytics recorded:", payload);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err: any) {
    console.error("Analytics handler error", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err) }) };
  }
};
