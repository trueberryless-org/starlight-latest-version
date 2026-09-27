import type { AstroSession } from "astro";
import config from "virtual:starlight-latest-version/config";

import { getCachedVersion } from "./cache";
import { getReleasePageUrl } from "./source";
import {
  type StarlightLatestVersionContext,
  fetchLatestVersion,
} from "./version";

export function getLatestVersion(): Promise<StarlightLatestVersionContext> {
  return fetchLatestVersion(config);
}

export function getCachedLatestVersion(
  session: AstroSession | undefined
): Promise<StarlightLatestVersionContext> {
  return getCachedVersion(session, config.source, getLatestVersion);
}

export function getLatestReleasePageUrl(): string {
  return getReleasePageUrl(config.source);
}
