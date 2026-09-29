import netlify from "@astrojs/netlify";
import starlight from "@astrojs/starlight";
import starlightPluginsDocsComponents from "@trueberryless-org/starlight-plugins-docs-components";
import { defineConfig } from "astro/config";
import starlightLatestVersion from "starlight-latest-version";
import starlightLinksValidator from "starlight-links-validator";

const site =
  (process.env.CONTEXT === "deploy-preview" ||
  process.env.CONTEXT === "branch-deploy"
    ? process.env.DEPLOY_PRIME_URL
    : process.env.URL) ?? "https://starlight-latest-version.netlify.app";

export default defineConfig({
  site,
  integrations: [
    starlight({
      credits: true,
      components: {
        Footer: "./src/components/Footer.astro",
      },
      title: "Starlight Latest Version",
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: new URL("og.png", site).href,
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:alt",
            content: "Show your package's latest version.",
          },
        },
      ],
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
            { slug: "programmatic-usage" },
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
          icon: "blueSky",
          label: "BlueSky",
          href: "https://bsky.app/profile/felixs.dev",
        },
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
