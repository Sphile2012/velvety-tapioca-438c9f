import { Handler } from "@netlify/functions";

// This function forwards analytics payloads to a real backend when configured.
// Set ANALYTICS_URL environment variable to your backend endpoint.
export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const backend = process.env.ANALYTICS_URL || "http://localhost:4000/analytics";

  try {
    // Forward the payload to the configured backend (best-effort)
    const resp = await fetch(backend, {
      method: "POST",
      headers: { "content-type": "application/json" },
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
