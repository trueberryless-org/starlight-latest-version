import type { StarlightUserConfig } from "@astrojs/starlight/types";
import type { AstroIntegrationLogger } from "astro";

export function overrideComponent(
  components: NonNullable<StarlightUserConfig["components"]>,
  logger: AstroIntegrationLogger,
  component: keyof NonNullable<StarlightUserConfig["components"]>
) {
  const override = components[component];
  if (override) {
    logger.warn(
      `It looks like you already have a \`${component}\` component override in your Starlight configuration.`
    );
    logger.warn(
      "To use `starlight-latest-version`, either remove your override or update it to render the content from `starlight-latest-version/components/DynamicVersionBadge.astro`."
    );
    logger.warn(
      "Notice that the `DynamicVersionBadge` component must be rendered AFTER the original Starlight `SiteTitle` component in the DOM. This ensures proper layout and behavior within the application."
    );
    return;
  }

  components[component] =
    `starlight-latest-version/overrides/${component}.astro`;
}
