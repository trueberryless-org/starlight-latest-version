import { z } from "astro/zod";

import { throwPluginError } from "./error";

export const sourceTypes = ["github", "gitlab", "npm"] as const;

const configSchema = z.object({
  source: z.object({
    type: z.enum(sourceTypes).default("npm"),
    slug: z.string().min(1, "Slug cannot be empty"),
  }),
  badge: z
    .object({
      variant: z
        .enum(["default", "note", "danger", "success", "caution", "tip"])
        .default("default"),
      size: z.enum(["small", "medium", "large"]).default("medium"),
    })
    .prefault({}),
  showInSiteTitle: z.enum(["false", "true", "deferred"]).default("false"),
  regexPattern: z.string().optional(),
});

export function validateConfig(
  userConfig: unknown
): StarlightLatestVersionConfig {
  const config = configSchema.safeParse(userConfig);

  if (!config.success) {
    throwPluginError(`Invalid starlight-latest-version configuration:

${z.prettifyError(config.error)}
`);
  }

  return config.data;
}

export type SourceType = (typeof sourceTypes)[number];
export type Source = StarlightLatestVersionConfig["source"];

export type StarlightLatestVersionUserConfig = z.input<typeof configSchema>;
export type StarlightLatestVersionConfig = z.output<typeof configSchema>;
