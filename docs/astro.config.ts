import netlify from "@astrojs/netlify";
import starlight from "@astrojs/starlight";
import starlightPluginsDocsComponents from "@trueberryless-org/starlight-plugins-docs-components";
import { defineConfig } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";
import starlightLatestVersion from "starlight-latest-version";

export default defineConfig({
  integrations: [
    starlight({
      title: "Starlight Latest Version",
      logo: {
        light: "./src/assets/logo-light.png",
        dark: "./src/assets/logo-dark.png",
        replacesTitle: true,
      },
      editLink: {
        baseUrl:
          "https://github.com/trueberryless-org/starlight-latest-version/edit/main/docs/",
      },
      plugins: [
        starlightLinksValidator(),
        starlightLatestVersion({
          source: {
            type: "npm",
            slug: "starlight-latest-version",
          },
          showInSiteTitle: "deferred",
        }),
        starlightPluginsDocsComponents({
          pluginName: "starlight-latest-version",
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
          href: "https://github.com/trueberryless-org/starlight-latest-version",
        },
      ],
    }),
  ],
  output: "server",
  adapter: netlify(),
});
