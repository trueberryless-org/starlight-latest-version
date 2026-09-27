/// <reference path="./locals.d.ts" />
import type { StarlightPlugin } from "@astrojs/starlight/types";

import {
  type StarlightLatestVersionConfig,
  type StarlightLatestVersionUserConfig,
  validateConfig,
} from "./libs/config";
import { overrideComponent } from "./libs/starlight";
import type { StarlightLatestVersionContext } from "./libs/version";
import { vitePluginStarlightLatestVersion } from "./libs/vite";
import { Translations } from "./translations";

export type {
  StarlightLatestVersionConfig,
  StarlightLatestVersionContext,
  StarlightLatestVersionUserConfig,
};

export default function starlightLatestVersion(
  userConfig?: StarlightLatestVersionUserConfig
): StarlightPlugin {
  const config = validateConfig(userConfig);

  return {
    name: "starlight-latest-version",
    hooks: {
      "i18n:setup"({ injectTranslations }) {
        injectTranslations(Translations);
      },
      "config:setup"({
        addIntegration,
        config: starlightConfig,
        logger,
        updateConfig: updateStarlightConfig,
      }) {
        if (config.showInSiteTitle !== "false") {
          const components = { ...starlightConfig.components };
          overrideComponent(components, logger, "SiteTitle");
          updateStarlightConfig({ components });
        }

        addIntegration({
          name: "starlight-latest-version-integration",
          hooks: {
            "astro:config:setup": ({ updateConfig }) => {
              updateConfig({
                vite: { plugins: [vitePluginStarlightLatestVersion(config)] },
              });
            },
            "astro:config:done": ({ injectTypes }) => {
              injectTypes({
                filename: "types.d.ts",
                content: `/// <reference types="starlight-latest-version/virtual.d.ts" />`,
              });
            },
          },
        });
      },
    },
  };
}
