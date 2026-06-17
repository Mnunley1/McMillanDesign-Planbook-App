// Returns a short-lived Algolia *secured* API key locked to `published:true`.
//
// The public front-end fetches this key and uses it for all searches, so
// unpublished/draft plans can never be retrieved publicly even by tampering —
// the filter is baked into the signed key, server-side.
//
// Required env vars (server-side):
//   ALGOLIA_APP_ID            - Algolia application id
//   ALGOLIA_SEARCH_API_KEY    - the *search-only* parent key the secured key derives from
//   ALGOLIA_INDEX             - index the key is restricted to (default "plans")

import algoliasearch from "algoliasearch";

const VALIDITY_SECONDS = 60 * 60; // 1 hour

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_SEARCH_API_KEY
    );
    const validUntil = Math.floor(Date.now() / 1000) + VALIDITY_SECONDS;
    const key = client.generateSecuredApiKey(
      process.env.ALGOLIA_SEARCH_API_KEY,
      {
        filters: "published:true",
        restrictIndices: [process.env.ALGOLIA_INDEX || "plans"],
        validUntil,
      }
    );
    // Allow CDN/browser caching until shortly before expiry.
    res.setHeader("Cache-Control", "public, max-age=3000");
    res.status(200).json({ key, validUntil });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Key generation failed" });
  }
}
