# Contentful search sync

Production receives Contentful entry events at `/api/contentful-algolia`.

## Required webhook settings

In the Contentful space, open Settings → Webhooks and inspect the webhook
pointing to the production endpoint. Preserve its existing URL and secret header.

Subscribe to all of these explicit topics:

- `Entry.create`
- `Entry.save`
- `Entry.auto_save`
- `Entry.publish`
- `Entry.unpublish`
- `Entry.archive`
- `Entry.unarchive`
- `Entry.delete`

Filter by `sys.contentType.sys.id` equal to `floorPlan` and the production
Contentful environment. Do not filter to published entries: master search must
receive draft changes. Use the default full entry payload, including localized
`fields` and `sys` metadata.

`Entry.save` does not cover edits made by the Contentful web application's
automatic saving. `Entry.auto_save` is required for those edits.
See https://www.contentful.com/developers/docs/extensibility/webhooks/overview/
and https://www.contentful.com/developers/docs/extensibility/webhooks/configure-webhook/.

## Validate the production configuration

1. Deploy the webhook code through the normal dev → main release process.
2. Create a draft floorPlan, then enter its plan number, attributes, and brochure.
3. Confirm a successful `ContentManagement.Entry.auto_save` delivery in the
   webhook activity log after the fields have been entered.
4. Inspect the matching object ID in `plans` and `plans_dateAdded_desc`: both
   must contain the plan number, image URL, attributes, and `published:false`.
5. Edit the draft again and verify both search records update. Test publication
   and unpublication with a designated test entry when appropriate.

The handler skips empty creation events and rejects malformed updates before
replacing an existing search record. Unpublishing cannot create a blank record.
These safeguards do not replace the required event subscriptions.

## October 2026 incident

M049-25 and M269-26 had search records reflecting their initial empty creation
on October 12. Contentful Preview contained their complete data. Both records
were repaired from Preview, with draft visibility confirmed against Delivery,
and verified in the primary and Newest indexes.

Inspection confirmed that the active `Algolia plans sync` webhook subscribed to
Create and Save but not Autosave. Its endpoint was reachable, its filters matched
`master` / `floorPlan`, and it used the default payload. The separate legacy
webhook successfully updated `allPlans`, while the deployed app read `plans`.
The owner enabled Autosave and confirmed that edits now update `plans`.
The missing Autosave subscription was the confirmed cause of the stale records.

Run regression checks with `node --test tests/contentful-sync.test.js`.
