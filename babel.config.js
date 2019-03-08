module.exports = function(api) {

  api.cache(true)

  return {
    presets: [
      [
        "@babel/env",
        {
          modules: false,
          loose: true,
          targets: {
            browsers: ["last 1 version"]
          },
        }
      ],
      "@babel/react",
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-transform-react-jsx",
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      "@babel/plugin-proposal-function-sent",
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-proposal-numeric-separator",
      "@babel/plugin-proposal-throw-expressions",
    ],
  };
};
