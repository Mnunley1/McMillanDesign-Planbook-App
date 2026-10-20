import { deriveStatus, STATUS, toAlgoliaRecord } from "./floor-plan-record.js";

// Keep empty create events and malformed payloads out of search. A later
// save/auto_save carries the completed entry and should create the record.
export async function syncFloorPlan(index, entry, action) {
  const { sys } = entry;
  if (action === "delete" || action === "archive") {
    await index.deleteObject(sys.id);
    return { removed: true };
  }
  if (action === "unpublish") {
    // Do not create an empty record when unpublishing an unindexed entry.
    await index.partialUpdateObject(
      {
        objectID: sys.id,
        status: STATUS.DRAFT,
        published: false,
        publishedAt: null,
      },
      { createIfNotExists: false }
    );
    return { status: STATUS.DRAFT };
  }
  if (
    !["create", "save", "auto_save", "publish", "unarchive"].includes(action)
  ) {
    throw new Error(`Unsupported entry action: ${action}`);
  }
  if (!entry.fields || typeof entry.fields !== "object") {
    throw new Error(
      "Entry fields are missing; existing search record was preserved"
    );
  }
  const status = action === "publish" ? STATUS.PUBLISHED : deriveStatus(sys);
  if (status === STATUS.ARCHIVED) {
    await index.deleteObject(sys.id);
    return { removed: true };
  }
  const record = toAlgoliaRecord(entry, { status, localized: true });
  if (typeof record.planNumber !== "string" || !record.planNumber.trim()) {
    if (action === "create") {
      return { skipped: true, reason: "Entry has no plan number yet" };
    }
    throw new Error(
      "Entry has no plan number; existing search record was preserved"
    );
  }
  await index.saveObject(record);
  return { status };
}
