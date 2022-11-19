// const fs = require("fs");
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// const evalSourceMapMiddleware = require("react-dev-utils/evalSourceMapMiddleware");
// const noopServiceWorkerMiddleware = require("react-dev-utils/noopServiceWorkerMiddleware");
// const redirectServedPath = require("react-dev-utils/redirectServedPathMiddleware");

// module.exports = {
//   webpack: {
//     plugins: {
//       add: [
//         new NodePolyfillPlugin({
//           excludeAliases: ["console"],
//         }),
//       ] /* An array of plugins */,
//     },
//   },
//   devServer: (devServerConfig, { env, paths }) => {
//     devServerConfig = {
//       onBeforeSetupMiddleware: undefined,
//       onAfterSetupMiddleware: undefined,
//       setupMiddlewares: (middlewares, devServer) => {
//         if (!devServer) {
//           throw new Error("webpack-dev-server is not defined");
//         }

//         if (fs.existsSync(paths.proxySetup)) {
//           require(paths.proxySetup)(devServer.app);
//         }

//         middlewares.push(
//           evalSourceMapMiddleware(devServer),
//           redirectServedPath(paths.publicUrlOrPath),
//           noopServiceWorkerMiddleware(paths.publicUrlOrPath)
//         );

//         return middlewares;
//       },
//     };
//     return devServerConfig;
//   },
// };
