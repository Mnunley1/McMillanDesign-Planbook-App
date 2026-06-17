// Shared Contentful -> Algolia transform, used by both the webhook
// (api/contentful-algolia.js) and the one-time backfill (scripts/backfill-algolia.js).
//
// Contentful exposes plan data on the `floorPlan` content type. The Delivery /
// Preview SDK returns fields already resolved to a single locale (flat), while
// Contentful *webhook* payloads use the Management format where every field is
// keyed by locale, e.g. `{ planNumber: { "en-US": "M263-25" } }`. Callers pass
// `localized: true` for the webhook payloads so we unwrap the locale layer.

export const CONTENT_TYPE_ID = "floorPlan";
export const DEFAULT_LOCALE = "en-US";

/** Plan publish states. `archived` entries are removed from the index, not stored. */
export const STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  CHANGED: "changed", // published, with newer unpublished edits
  ARCHIVED: "archived",
};

/**
 * Derive publish status from a Contentful `sys` object. Works for any event
 * whose payload carries the version metadata (save/auto_save/publish).
 */
export function deriveStatus(sys) {
  if (sys.archivedVersion) {
    return STATUS.ARCHIVED;
  }
  if (!sys.publishedVersion) {
    return STATUS.DRAFT;
  }
  // A freshly published entry has version === publishedVersion + 1; anything
  // beyond that means there are draft edits on top of the published version.
  if (
    typeof sys.version === "number" &&
    sys.version > sys.publishedVersion + 1
  ) {
    return STATUS.CHANGED;
  }
  return STATUS.PUBLISHED;
}

/** Whether a status corresponds to publicly-visible (live) content. */
export function isPublic(status) {
  return status === STATUS.PUBLISHED || status === STATUS.CHANGED;
}

function readField(fields, key, localized) {
  const value = fields?.[key];
  if (value == null) {
    return;
  }
  if (!localized) {
    return value;
  }
  // Locale-keyed wrapper: prefer the default locale, else first available.
  if (Object.hasOwn(value, DEFAULT_LOCALE)) {
    return value[DEFAULT_LOCALE];
  }
  return Object.values(value)[0];
}

/**
 * Build the flat Algolia record for a Contentful floorPlan entry.
 *
 * @param {{ sys: object, fields: object }} entry - Contentful entry (Delivery or Management shape)
 * @param {{ status: string, localized?: boolean }} opts
 */
export function toAlgoliaRecord(entry, { status, localized = false }) {
  const { sys, fields } = entry;
  const get = (key) => readField(fields, key, localized);

  const planPdf = get("planPdf");
  const image = Array.isArray(planPdf) ? planPdf[0]?.url : undefined;
  const publiclyVisible = isPublic(status);

  return {
    objectID: sys.id,
    entityId: sys.id,
    planNumber: get("planNumber"),
    sqft: get("sqft"),
    planWidth: get("overallWidth"),
    planDepth: get("overallDepth"),
    bedrooms: get("bedrooms"),
    planType: get("planType"),
    garageOrientation: get("garageOrientation"),
    vehicleSpaces: get("vehicleSpaces"),
    numberOfLevels: get("numberOfLevels"),
    primarySuite: get("primarySuite"),
    basement: get("basement") ?? false,
    walkupAttic: get("walkupAttic") ?? false,
    image,
    createdAt: sys.createdAt,
    updatedAt: sys.updatedAt,
    publishedAt: publiclyVisible
      ? (sys.publishedAt ?? sys.updatedAt ?? null)
      : null,
    status,
    // Convenience boolean: public surfaces filter `published:true`, the admin
    // "Unpublished" tab filters `published:false` (i.e. drafts).
    published: publiclyVisible,
  };
}
