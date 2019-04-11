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
      "@babel/plugin-proposal-class-properties"
    ],
  };
};
