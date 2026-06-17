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
import {
  CONTENT_TYPE_ID,
  deriveStatus,
  STATUS,
  toAlgoliaRecord,
} from "./_shared/floor-plan-record.js";

const indexName = process.env.ALGOLIA_INDEX || "plans";

function getIndex() {
  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
  );
  return client.initIndex(indexName);
}

// Contentful posts with Content-Type `application/vnd.contentful.management.v1+json`,
// which Vercel does not auto-parse — so `req.body` may arrive as a string or
// Buffer. Normalize to an object.
function parseBody(body) {
  if (body == null) {
    return null;
  }
  if (Buffer.isBuffer(body)) {
    return JSON.parse(body.toString("utf8"));
  }
  if (typeof body === "string") {
    return JSON.parse(body);
  }
  return body;
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
    entry = parseBody(req.body);
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
    const index = getIndex();

    // delete/archive remove the record entirely.
    if (action === "delete" || action === "archive") {
      await index.deleteObject(sys.id);
      res.status(200).json({ ok: true, action, id: sys.id, removed: true });
      return;
    }

    // unpublish sends a `DeletedEntry` payload with NO fields — the entry still
    // exists as a draft in Contentful. Flip status/published via a partial
    // update so the record keeps all its existing field data.
    if (action === "unpublish") {
      await index.partialUpdateObject({
        objectID: sys.id,
        status: STATUS.DRAFT,
        published: false,
        publishedAt: null,
      });
      res
        .status(200)
        .json({ ok: true, action, id: sys.id, status: STATUS.DRAFT });
      return;
    }

    // create/save/auto_save/publish/unarchive carry the full entry with fields.
    const status = action === "publish" ? STATUS.PUBLISHED : deriveStatus(sys);
    if (status === STATUS.ARCHIVED) {
      await index.deleteObject(sys.id);
      res.status(200).json({ ok: true, action, id: sys.id, removed: true });
      return;
    }
    await index.saveObject(toAlgoliaRecord(entry, { status, localized: true }));
    res.status(200).json({ ok: true, action, id: sys.id, status });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Sync failed" });
  }
}
