declare module "virtual:starlight-latest-version" {
  /**
   * Fetch the latest version of the configured source.
   *
   * Returns the same context object used internally by the plugin's
   * components, so you can read `version`, `versionWithoutPrefix`,
   * `versionMajor` and friends programmatically.
   */
  export function getLatestVersion(): Promise<
    import("./libs/version").StarlightLatestVersionContext
  >;
}

declare module "virtual:starlight-latest-version/config" {
  const StarlightLatestVersionConfig: import("./libs/config").StarlightLatestVersionConfig;

  export default StarlightLatestVersionConfig;
}
