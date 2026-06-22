// One-time backfill: seed the unified `plans` Algolia index from Contentful.
//
// Publish state is derived authoritatively: an entry is published iff the
// Contentful Delivery API returns it (Delivery only serves published content).
// All entries (published + draft) come from the Preview API. Backfill collapses
// "changed" into "published" — the webhook refines it to "changed" on the next
// save, since distinguishing it here would require a Management API token.
//
// Usage:
//   ALGOLIA_ADMIN_API_KEY=xxx node scripts/backfill-algolia.js
//
// Reads Contentful credentials + Algolia app id from .env.local (the VITE_*
// vars already used by the app). The Algolia *admin* key must be supplied via
// the environment — it is intentionally not stored in .env.local.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import algoliasearch from "algoliasearch";
import { createClient } from "contentful";
import { STATUS, toAlgoliaRecord } from "../api/_shared/floor-plan-record.js";

const CONTENT_TYPE = "floorPlan";
const INDEX_NAME = process.env.ALGOLIA_INDEX || "plans";
const PAGE_SIZE = 1000;

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // .env.local optional if vars are already exported
  }
}

async function fetchAllEntries(client) {
  const all = [];
  let skip = 0;
  let total = Number.POSITIVE_INFINITY;
  while (skip < total) {
    const res = await client.getEntries({
      content_type: CONTENT_TYPE,
      limit: PAGE_SIZE,
      skip,
    });
    all.push(...res.items);
    total = res.total;
    skip += res.items.length;
    if (res.items.length === 0) {
      break;
    }
  }
  return all;
}

async function main() {
  loadEnvLocal();

  const appId = process.env.ALGOLIA_APP_ID || process.env.VITE_ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
  const space = process.env.VITE_CONTENTFUL_SPACE_ID;
  const deliveryToken = process.env.VITE_CONTENTFUL_ACCESS_TOKEN;
  const previewToken = process.env.VITE_CONTENTFUL_PREVIEW_TOKEN;

  if (!(appId && adminKey && space && deliveryToken && previewToken)) {
    throw new Error(
      "Missing required env. Need ALGOLIA_ADMIN_API_KEY (env) plus VITE_ALGOLIA_APP_ID, VITE_CONTENTFUL_SPACE_ID, VITE_CONTENTFUL_ACCESS_TOKEN, VITE_CONTENTFUL_PREVIEW_TOKEN (.env.local)."
    );
  }

  const deliveryClient = createClient({ space, accessToken: deliveryToken });
  const previewClient = createClient({
    space,
    accessToken: previewToken,
    host: "preview.contentful.com",
  });

  console.log("Fetching published entries (Delivery API)…");
  const published = await fetchAllEntries(deliveryClient);
  const publishedIds = new Set(published.map((e) => e.sys.id));
  console.log(`  ${publishedIds.size} published`);

  console.log("Fetching all entries (Preview API)…");
  const all = await fetchAllEntries(previewClient);
  console.log(
    `  ${all.length} total (${all.length - publishedIds.size} draft)`
  );

  const records = all.map((entry) =>
    toAlgoliaRecord(entry, {
      status: publishedIds.has(entry.sys.id) ? STATUS.PUBLISHED : STATUS.DRAFT,
    })
  );

  const index = algoliasearch(appId, adminKey).initIndex(INDEX_NAME);

  console.log(`Configuring index "${INDEX_NAME}"…`);
  await index.setSettings({
    searchableAttributes: ["planNumber", "planType", "primarySuite"],
    attributesForFaceting: [
      "filterOnly(published)",
      "filterOnly(status)",
      "planType",
      "numberOfLevels",
      "primarySuite",
      "garageOrientation",
      "basement",
      "walkupAttic",
      "bedrooms",
      "vehicleSpaces",
      "sqft",
      "planWidth",
      "planDepth",
    ],
  });

  console.log(`Uploading ${records.length} records…`);
  await index.saveObjects(records).wait();
  console.log("Backfill complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
