import assert from "node:assert/strict";
import test from "node:test";
import { syncFloorPlan } from "../api/_shared/sync-floor-plan.js";

function fixture(fields = {}) {
  return { sys: { id: "plan-1", version: 1 }, fields };
}
function fakeIndex() {
  const calls = [];
  return {
    calls,
    saveObject: async (...args) => calls.push(["save", ...args]),
    deleteObject: async (...args) => calls.push(["delete", ...args]),
    partialUpdateObject: async (...args) => calls.push(["partial", ...args]),
  };
}
const fields = {
  planNumber: { "en-US": "M049-25" },
  bedrooms: { "en-US": 6 },
  planPdf: { "en-US": [{ url: "https://example.com/plan.png" }] },
};

test("empty creation followed by autosave indexes only the completed entry", async () => {
  const index = fakeIndex();
  const result = await syncFloorPlan(index, fixture(), "create");
  assert.equal(result.skipped, true);
  assert.equal(index.calls.length, 0);
  await syncFloorPlan(index, fixture(fields), "auto_save");
  assert.equal(index.calls.length, 1);
  assert.equal(index.calls[0][1].planNumber, "M049-25");
  assert.equal(index.calls[0][1].image, "https://example.com/plan.png");
  assert.equal(index.calls[0][1].bedrooms, 6);
  assert.equal(index.calls[0][1].published, false);
});
for (const action of ["save", "auto_save", "publish", "unarchive"]) {
  test(`${action} indexes completed entry data`, async () => {
    const index = fakeIndex();
    await syncFloorPlan(index, fixture(fields), action);
    assert.equal(index.calls[0][0], "save");
    assert.equal(index.calls[0][1].published, action === "publish");
  });
}
test("malformed updates cannot replace a complete search record", async () => {
  const index = fakeIndex();
  await assert.rejects(
    syncFloorPlan(index, fixture(), "auto_save"),
    /no plan number/
  );
  await assert.rejects(
    syncFloorPlan(index, { sys: { id: "plan-1" } }, "save"),
    /fields are missing/
  );
  await assert.rejects(
    syncFloorPlan(index, fixture(fields), "unknown"),
    /Unsupported/
  );
  assert.deepEqual(index.calls, []);
});
test("unpublish preserves fields without creating blank records", async () => {
  const index = fakeIndex();
  await syncFloorPlan(index, fixture(), "unpublish");
  assert.equal(index.calls[0][1].published, false);
  assert.deepEqual(index.calls[0][2], { createIfNotExists: false });
});
for (const action of ["delete", "archive"]) {
  test(`${action} removes the record`, async () => {
    const index = fakeIndex();
    await syncFloorPlan(index, fixture(), action);
    assert.deepEqual(index.calls, [["delete", "plan-1"]]);
  });
}
