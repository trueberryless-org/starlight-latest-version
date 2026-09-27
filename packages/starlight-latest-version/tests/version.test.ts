import { describe, expect, test } from "vitest";

import { isCacheEntryFresh } from "../libs/cache";
import { getReleasePageUrl } from "../libs/source";
import { getVersionLabel, parseVersion } from "../libs/version";

describe("parseVersion", () => {
  test.each([
    ["1.2.3", "1.2.3", undefined],
    ["10.20.30", "10.20.30", undefined],
    ["0.0.1", "0.0.1", undefined],
    ["v1.2.3", "1.2.3", undefined],
    ["release@1.2.3", "1.2.3", undefined],
    ["name@v1.2.3", "1.2.3", undefined],
    ["package-name@1.2.3", "1.2.3", undefined],
    ["feature/branch@1.2.3", "1.2.3", undefined],
    ["1.2.3-rc.1", "1.2.3", "rc.1"],
    ["name@1.2.3-beta.2", "1.2.3", "beta.2"],
    ["v1.2.3-alpha.34", "1.2.3", "alpha.34"],
    ["package-name@1.2.3-rc.1", "1.2.3", "rc.1"],
    ["1.2.3-alpha", "1.2.3", "alpha"],
    ["1.2.3-beta", "1.2.3", "beta"],
    ["1.2.3-rc", "1.2.3", "rc"],
    ["1.2.3-feature.test", "1.2.3", "feature.test"],
    ["1.2.3-long.complex.prerelease.tag", "1.2.3", "long.complex.prerelease.tag"],
  ])(
    "extracts the version from %s",
    (tagName, versionWithoutPrefix, prerelease) => {
      expect(parseVersion(tagName)).toMatchObject({
        versionAvailable: true,
        versionWithoutPrefix,
        prerelease,
        isPrereleaseVersion: prerelease !== undefined,
        isStableVersion: prerelease === undefined,
      });
    }
  );

  test.each([
    "1.2",
    "v1.2",
    "1.2.",
    "v1.2.",
    "1.2.3.4",
    "1.2.3.",
    "v1.2.3.4",
    "1.2.3-",
    "1.2.3-.rc",
    "1.2.3-rc.",
    "1.2.3--rc",
    "random-text",
    "",
    "123",
    "v1.2.3-special!char",
    "1.2.3-pre release",
  ])("does not extract a version from %j", (tagName) => {
    expect(parseVersion(tagName)).toEqual({ versionAvailable: false });
  });

  test("returns the full version context", () => {
    expect(parseVersion("starlight-@v1.12.3-beta.4")).toEqual({
      versionAvailable: true,
      version: "v1.12.3-beta.4",
      versionWithoutPrefix: "1.12.3",
      versionMajor: 1,
      versionMinor: 12,
      versionPatch: 3,
      prerelease: "beta.4",
      isPrereleaseVersion: true,
      prefix: "starlight-@",
      hasVPrefix: true,
      isStableVersion: false,
    });
  });

  test("uses a custom pattern", () => {
    expect(
      parseVersion("release-2024.1.0", "release-(?<version>[0-9.]+)")
    ).toMatchObject({ versionAvailable: true, version: "v2024.1.0" });
  });
});

describe("getVersionLabel", () => {
  test("returns the version", () => {
    expect(getVersionLabel(parseVersion("v1.2.3"), "N/A")).toBe("v1.2.3");
  });

  test("returns a placeholder when no version is available", () => {
    expect(getVersionLabel({ versionAvailable: false }, "N/A")).toBe("N/A");
  });
});

describe("getReleasePageUrl", () => {
  test.each([
    ["github", "owner/repo", "https://github.com/owner/repo/releases"],
    ["gitlab", "owner/repo", "https://gitlab.com/owner/repo/-/releases"],
    [
      "npm",
      "package",
      "https://www.npmjs.com/package/package?activeTab=versions",
    ],
  ] as const)("returns the %s release page URL", (type, slug, url) => {
    expect(getReleasePageUrl({ type, slug })).toBe(url);
  });
});

describe("isCacheEntryFresh", () => {
  const context = { versionAvailable: false } as const;

  test("considers entries younger than an hour fresh", () => {
    expect(
      isCacheEntryFresh({ timestamp: 0, context }, 60 * 60 * 1000 - 1)
    ).toBe(true);
  });

  test("considers entries older than an hour stale", () => {
    expect(isCacheEntryFresh({ timestamp: 0, context }, 60 * 60 * 1000)).toBe(
      false
    );
  });
});
