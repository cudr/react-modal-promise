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
      "@babel/proposal-class-properties",
      "@babel/proposal-optional-chaining"
    ],
  };
};
