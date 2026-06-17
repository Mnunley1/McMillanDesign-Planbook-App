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

  const entry = req.body;
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

  // publish/unpublish are authoritative; for saves we derive from sys so that
  // saving a draft edit to an already-published entry becomes "changed"
  // (still public) rather than hiding it.
  let status;
  if (action === "publish") {
    status = STATUS.PUBLISHED;
  } else if (action === "unpublish") {
    status = STATUS.DRAFT;
  } else {
    status = deriveStatus(sys);
  }

  try {
    const index = getIndex();
    // Archived or deleted entries are removed from the index entirely.
    if (action === "delete" || status === STATUS.ARCHIVED) {
      await index.deleteObject(sys.id);
    } else {
      await index.saveObject(
        toAlgoliaRecord(entry, { status, localized: true })
      );
    }
    res.status(200).json({ ok: true, action, id: sys.id, status });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Sync failed" });
  }
}
