import type { StarlightLatestVersionConfig } from "./config";
import { fetchLatestReleaseTagName } from "./source";

export const SemverPattern =
  /^(?:v|[^0-9\s]*@)?v?(?<version>[0-9]+\.[0-9]+\.[0-9]+)(?:-(?<prerelease>[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)*))?(?![-.]|[^-\w.])$/;

const unavailableVersion = {
  versionAvailable: false,
} as const satisfies StarlightLatestVersionContext;

export async function fetchLatestVersion(
  config: Pick<StarlightLatestVersionConfig, "regexPattern" | "source">
): Promise<StarlightLatestVersionContext> {
  try {
    const tagName = await fetchLatestReleaseTagName(config.source);
    if (!tagName) return unavailableVersion;

    return parseVersion(tagName, config.regexPattern ?? SemverPattern);
  } catch (error) {
    console.error(error);
    return unavailableVersion;
  }
}

export function parseVersion(
  tagName: string,
  pattern: string | RegExp = SemverPattern
): StarlightLatestVersionContext {
  const match = tagName.match(pattern);
  if (!match) return unavailableVersion;

  const versionWithoutPrefix = match.groups?.["version"] || "";
  const [versionMajor = 0, versionMinor = 0, versionPatch = 0] =
    versionWithoutPrefix.split(".").map(Number);

  const prerelease = match.groups?.["prerelease"];
  const isPrereleaseVersion = !!prerelease;

  return {
    versionAvailable: true,
    version: isPrereleaseVersion
      ? `v${versionWithoutPrefix}-${prerelease}`
      : `v${versionWithoutPrefix}`,
    versionWithoutPrefix,
    versionPatch,
    versionMinor,
    versionMajor,
    prerelease,
    isPrereleaseVersion,
    prefix: tagName.match(/^(.*?)v?[0-9]/)?.[1],
    hasVPrefix: tagName.startsWith("v") || tagName.includes("@v"),
    isStableVersion: !isPrereleaseVersion,
  };
}

export function getVersionLabel(
  context: StarlightLatestVersionContext,
  unavailableLabel: string
): string {
  return context.versionAvailable ? context.version : unavailableLabel;
}

export type StarlightLatestVersionContext =
  | {
      versionAvailable: true;
      version: string;
      versionWithoutPrefix: string;
      versionMajor: number;
      versionMinor: number;
      versionPatch: number;
      prerelease?: string | undefined;
      isPrereleaseVersion: boolean;
      prefix?: string | undefined;
      hasVPrefix: boolean;
      isStableVersion: boolean;
    }
  | {
      versionAvailable: false;
    };
