export interface FloorPlanHit {
  basement?: boolean;
  bedrooms: number;
  createdAt?: string;
  description: string;
  garageOrientation?: string;
  image?: string;
  numberOfLevels?: number;
  objectID: string;
  planDepth?: number;
  planNumber: string;
  planPdf?: Array<{ url: string }>;
  planType?: string;
  planWidth?: number;
  primarySuite?: string;
  published?: boolean;
  sqft?: number;
  squareFeet: number;
  status?: "draft" | "published" | "changed" | "archived";
  vehicleSpaces?: number;
  walkupAttic?: boolean;
}

export interface SortItem {
  label: string;
  value: string;
}
