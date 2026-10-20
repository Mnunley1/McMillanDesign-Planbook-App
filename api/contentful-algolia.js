// Contentful -> Algolia sync webhook (Vercel serverless function).
//
// Replaces the official Contentful Algolia app. Maintains a single `plans`
// index where every floorPlan entry carries a `status` (draft/published/
// changed) and a `published` boolean, so the app can render published,
// unpublished, or all plans with full faceting from one index.
//
// Configure a Contentful webhook to POST here on Entry events
// (publish, unpublish, save, auto_save, archive, unarchive, delete) for the
// `floorPlan` content type, with a secret header `x-webhook-secret`.
//
// Required env vars (server-side, NOT prefixed with VITE_):
//   ALGOLIA_APP_ID            - Algolia application id
//   ALGOLIA_ADMIN_API_KEY     - Algolia *admin* key (write access)
//   ALGOLIA_INDEX             - target index name (default "plans")
//   CONTENTFUL_WEBHOOK_SECRET - shared secret matching the webhook header

import algoliasearch from "algoliasearch";
import { CONTENT_TYPE_ID } from "./_shared/floor-plan-record.js";
import { syncFloorPlan } from "./_shared/sync-floor-plan.js";

const indexName = process.env.ALGOLIA_INDEX || "plans";

function getIndex() {
  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
  );
  return client.initIndex(indexName);
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

// Contentful posts with Content-Type `application/vnd.contentful.management.v1+json`,
// which Vercel does not auto-parse. Depending on the runtime, `req.body` may be
// an already-parsed object, a string/Buffer, or empty (body left on the stream).
// Handle all cases.
async function getEntry(req) {
  const body = req.body;
  if (body && typeof body === "object" && !Buffer.isBuffer(body)) {
    return body;
  }
  let raw;
  if (Buffer.isBuffer(body)) {
    raw = body.toString("utf8");
  } else if (typeof body === "string" && body.length > 0) {
    raw = body;
  } else {
    raw = await readRawBody(req);
  }
  return raw ? JSON.parse(raw) : null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secret = process.env.CONTENTFUL_WEBHOOK_SECRET;
  if (!secret || req.headers["x-webhook-secret"] !== secret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  let entry;
  try {
    entry = await getEntry(req);
  } catch {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const sys = entry?.sys;
  if (!sys?.id) {
    res.status(400).json({ error: "Missing entry sys.id" });
    return;
  }

  // Ignore anything that isn't a floorPlan entry.
  const contentTypeId = sys.contentType?.sys?.id;
  if (contentTypeId && contentTypeId !== CONTENT_TYPE_ID) {
    res.status(204).end();
    return;
  }

  // Topic looks like "ContentManagement.Entry.publish".
  const action = String(req.headers["x-contentful-topic"] || "")
    .split(".")
    .pop();

  try {
    const result = await syncFloorPlan(getIndex(), entry, action);
    res.status(200).json({ ok: true, action, id: sys.id, ...result });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Sync failed" });
  }
}
