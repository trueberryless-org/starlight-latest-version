import type { Source, SourceType } from "./config";

const releasePageUrls: Record<SourceType, (slug: string) => string> = {
  github: (slug) => `https://github.com/${slug}/releases`,
  gitlab: (slug) => `https://gitlab.com/${slug}/-/releases`,
  npm: (slug) => `https://www.npmjs.com/package/${slug}?activeTab=versions`,
};

const latestReleaseApiUrls: Record<SourceType, (slug: string) => string> = {
  github: (slug) => `https://api.github.com/repos/${slug}/releases/latest`,
  gitlab: (slug) =>
    `https://gitlab.com/api/v4/projects/${encodeURIComponent(slug)}/releases`,
  npm: (slug) => `https://registry.npmjs.org/${slug}/latest`,
};

const latestReleaseTagNames: Record<
  SourceType,
  (data: any) => string | undefined
> = {
  github: (data) => data?.tag_name || undefined,
  gitlab: (data) => data?.[0]?.tag_name || undefined,
  npm: (data) => data?.version || undefined,
};

export function getReleasePageUrl(source: Source): string {
  return releasePageUrls[source.type](source.slug);
}

export async function fetchLatestReleaseTagName(
  source: Source
): Promise<string | undefined> {
  const response = await fetch(latestReleaseApiUrls[source.type](source.slug), {
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

  return latestReleaseTagNames[source.type](await response.json());
}
