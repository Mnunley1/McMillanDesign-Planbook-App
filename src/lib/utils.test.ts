// Simple test file for date utility functions
// This can be run manually to verify functionality

import { getDaysSince, getTimeAgo, isRecentlyAdded } from "./utils";

// Test data
const testDates = {
  today: new Date().toISOString(),
  yesterday: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  weekAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  monthAgo: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  invalid: "invalid-date-string",
};

// Test function
function testDateUtils() {
  console.log("Testing Date Utility Functions...\n");

  // Test isRecentlyAdded
  console.log("isRecentlyAdded tests:");
  console.log(`Today: ${isRecentlyAdded(testDates.today)}`); // Should be true
  console.log(`Yesterday: ${isRecentlyAdded(testDates.yesterday)}`); // Should be true
  console.log(`Week ago: ${isRecentlyAdded(testDates.weekAgo)}`); // Should be true
  console.log(`Month ago: ${isRecentlyAdded(testDates.monthAgo)}`); // Should be false
  console.log(`Invalid: ${isRecentlyAdded(testDates.invalid)}`); // Should be false

  console.log("\ngetTimeAgo tests:");
  console.log(`Today: ${getTimeAgo(testDates.today)}`);
  console.log(`Yesterday: ${getTimeAgo(testDates.yesterday)}`);
  console.log(`Week ago: ${getTimeAgo(testDates.weekAgo)}`);
  console.log(`Month ago: ${getTimeAgo(testDates.monthAgo)}`);
  console.log(`Invalid: ${getTimeAgo(testDates.invalid)}`);

  console.log("\ngetDaysSince tests:");
  console.log(`Today: ${getDaysSince(testDates.today)}`);
  console.log(`Yesterday: ${getDaysSince(testDates.yesterday)}`);
  console.log(`Week ago: ${getDaysSince(testDates.weekAgo)}`);
  console.log(`Month ago: ${getDaysSince(testDates.monthAgo)}`);
  console.log(`Invalid: ${getDaysSince(testDates.invalid)}`);
}

// Export for manual testing
export { testDateUtils };

// Uncomment the line below to run tests when this file is imported
// testDateUtils();
