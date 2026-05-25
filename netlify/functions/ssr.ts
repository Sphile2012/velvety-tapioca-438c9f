import type { Handler } from "@netlify/functions";
import server from "../../dist/server/server.js";

export const handler: Handler = async (event) => {
  // Convert Netlify event to Fetch API Request
  const url = new URL(event.rawUrl);
  const request = new Request(url, {
    method: event.httpMethod,
    headers: new Headers(event.headers),
    body: event.body ? event.body : undefined,
  });

  try {
    // Call the SSR server's fetch method
    const response = await server.fetch(request, {}, {});

    // Convert Response to Netlify response format
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const body = await response.text();

    return {
      statusCode: response.status,
      headers,
      body,
    };
  } catch (error) {
    console.error("SSR Error:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
