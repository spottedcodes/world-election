import fs from "node:fs";
import path from "node:path";
import {
  FranceDepartmentGeoSchema,
  FranceDepartmentResultsSchema,
  FranceHubDataSchema,
  FrancePreviewSchema,
  SiteConfigSchema,
  WatchlistArraySchema,
  type FranceDepartmentGeo,
  type FranceDepartmentResults,
  type FranceHubData,
  type FrancePreview,
  type SiteConfig,
  type WatchlistElection,
} from "./schemas";

const DATA_ROOT = path.join(process.cwd(), "data");

function readJsonFile(relativePath: string): unknown {
  const fullPath = path.join(DATA_ROOT, relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw);
}

export function getSiteConfig(): SiteConfig {
  return SiteConfigSchema.parse(readJsonFile("site.json"));
}

export function get2027Watchlist(): WatchlistElection[] {
  return WatchlistArraySchema.parse(
    readJsonFile(path.join("elections", "2027-watchlist.json"))
  );
}

export function getFrance2027Preview(): FrancePreview {
  return FrancePreviewSchema.parse(
    readJsonFile(path.join("elections", "france-2027-preview.json"))
  );
}

export function getFranceHubData(): FranceHubData {
  return FranceHubDataSchema.parse(
    readJsonFile(path.join("countries", "france.json"))
  );
}

export function getFranceDepartmentGeo(): FranceDepartmentGeo {
  return FranceDepartmentGeoSchema.parse(
    readJsonFile(path.join("geo", "france-departments.json"))
  );
}

export function getFranceDepartmentResults(): FranceDepartmentResults {
  return FranceDepartmentResultsSchema.parse(
    readJsonFile(path.join("countries", "france-department-results.json"))
  );
}
