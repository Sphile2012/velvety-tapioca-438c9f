import { Handler } from "@netlify/functions";

// This function forwards analytics payloads to a real backend when configured.
// Set ANALYTICS_URL environment variable to your backend endpoint.
export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  // Prefer Supabase if configured in Netlify environment variables
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      // Expecting a table named `analytics` with columns: event, userId, payload, created_at
      const payload = event.body ? JSON.parse(event.body) : {};
      const row = {
        event: payload.event || null,
        userId: payload.userId || null,
        payload: { ...payload },
        created_at: new Date().toISOString(),
      };

      const resp = await fetch(`${SUPABASE_URL}/rest/v1/analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(row),
      });

      if (!resp.ok) {
        console.warn("Supabase insert failed", resp.status);
        return { statusCode: 502, body: JSON.stringify({ ok: false, status: resp.status }) };
      }

      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } catch (err: any) {
      console.error("Supabase analytics error", err);
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err) }) };
    }
  }

  // Fallback: forward to an external backend if configured
  const backend = process.env.ANALYTICS_URL || "http://localhost:4000/analytics";

  try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (process.env.ANALYTICS_FORWARD_KEY) {
        headers["x-api-key"] = process.env.ANALYTICS_FORWARD_KEY;
      }

      const resp = await fetch(backend, {
      method: "POST",
      headers,
      body: event.body,
    });

    if (!resp.ok) {
      console.warn("Analytics backend returned non-OK", resp.status);
      return { statusCode: 502, body: JSON.stringify({ ok: false, status: resp.status }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err: any) {
    console.error("Analytics handler forward error", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err) }) };
  }
};
