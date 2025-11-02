import netlify from "@astrojs/netlify";
import starlight from "@astrojs/starlight";
import starlightPluginsDocsComponents from "@trueberryless-org/starlight-plugins-docs-components";
import { defineConfig } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";
import starlightPluginShowLatestVersion from "starlight-plugin-show-latest-version";

export default defineConfig({
  integrations: [
    starlight({
      title: "Starlight Plugin Show Latest Version",
      logo: {
        light: "./src/assets/logo-light.png",
        dark: "./src/assets/logo-dark.png",
        replacesTitle: true,
      },
      editLink: {
        baseUrl:
          "https://github.com/trueberryless-org/starlight-plugin-show-latest-version/edit/main/docs/",
      },
      plugins: [
        starlightLinksValidator(),
        starlightPluginShowLatestVersion({
          source: {
            type: "npm",
            slug: "starlight-plugin-show-latest-version",
          },
          showInSiteTitle: "deferred",
        }),
        starlightPluginsDocsComponents({
          pluginName: "starlight-plugin-show-latest-version",
          showcaseProps: {
            entries: [],
          },
        }),
      ],
      sidebar: [
        {
          label: "Start Here",
          items: [
            { slug: "getting-started" },
            { slug: "configuration" },
            { slug: "components" },
            { slug: "version-extraction-algorithm" },
          ],
        },
        {
          label: "Demo",
          link: "/demo",
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/trueberryless-org/starlight-plugin-show-latest-version",
        },
      ],
    }),
  ],
  output: "server",
  adapter: netlify(),
});
