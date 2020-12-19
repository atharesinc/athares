const createExpoWebpackConfigAsync = require("@expo/webpack-config");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Passing true will enable the default Workbox + Expo SW configuration.
      offline: env.mode === "production",
      removeUnusedImportExports: true,
    },
    argv
  );

  config.resolve.alias = {
    ...config.resolve.alias,
    // Use Preact aliases
    react$: "preact/compat",
    "react-dom$": "preact/compat",
    // Fix the responder system which react-native-web depends on
    "react-dom/unstable-native-dependencies$": "preact-responder-event-plugin",
  };

  // if (env.mode === "production") {
  //   config.plugins.push(
  //     new BundleAnalyzerPlugin({
  //       path: "web-report",
  //     })
  //   );
  // }
  // Customize the config before returning it.
  return config;
};
