import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if a date is within the last 45 days
 * @param dateString - ISO date string (e.g., "2025-04-28T19:21:57.900Z")
 * @returns boolean indicating if the date is within the last 45 days
 */
export function isRecentlyAdded(dateString: string): boolean {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    const now = new Date();
    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);

    return date >= fortyFiveDaysAgo;
  } catch (error) {
    console.error("Error parsing date:", error);
    return false;
  }
}

/**
 * Gets the number of days since a date
 * @param dateString - ISO date string (e.g., "2025-04-28T19:21:57.900Z")
 * @returns number of days since the date, or null if invalid
 */
export function getDaysSince(dateString: string): number | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
}

/**
 * Gets a human-readable string for how long ago a date was
 * @param dateString - ISO date string (e.g., "2025-04-28T19:21:57.900Z")
 * @returns human-readable string like "2 days ago", "1 week ago", etc.
 */
export function getTimeAgo(dateString: string): string | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 45) {
      const weeks = Math.ceil(diffDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }

    return `${diffDays} days ago`;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
}
