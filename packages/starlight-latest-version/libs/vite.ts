import type { ViteUserConfig } from "astro";
import { fileURLToPath } from "node:url";

import type { StarlightLatestVersionConfig } from "./config";

export function vitePluginStarlightLatestVersion(
  config: StarlightLatestVersionConfig
): VitePlugin {
  const modules = {
    "virtual:starlight-latest-version": getLatestVersionVirtualModule(),
    "virtual:starlight-latest-version/config": `export default ${JSON.stringify(config)};`,
  };

  const moduleResolutionMap = Object.fromEntries(
    (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
      resolveVirtualModuleId(key),
      key,
    ])
  );

  return {
    name: "vite-plugin-starlight-latest-version",
    load(id) {
      const moduleId = moduleResolutionMap[id];
      return moduleId ? modules[moduleId] : undefined;
    },
    resolveId(id) {
      return Object.hasOwn(modules, id)
        ? resolveVirtualModuleId(id)
        : undefined;
    },
  };
}

function getLatestVersionVirtualModule(): string {
  const moduleId = fileURLToPath(new URL("./release.ts", import.meta.url));

  return `export { getLatestVersion } from ${JSON.stringify(moduleId)};`;
}

function resolveVirtualModuleId<TModuleId extends string>(
  id: TModuleId
): `\0${TModuleId}` {
  return `\0${id}`;
}

type VitePlugin = NonNullable<ViteUserConfig["plugins"]>[number];
