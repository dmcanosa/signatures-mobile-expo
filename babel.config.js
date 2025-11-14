module.exports = function (api) {
  api.cache(true); // Caches the config function's result for performance

  return {
    presets: ['babel-preset-expo'], // Ensures Expo's default preset is used
    plugins: [
      // Add any custom Babel plugins here
      // Example: for module aliases
      // ['module-resolver', {
      //   root: ['./src'],
      //   alias: {
      //     '@components': './src/components',
      //   },
      // }],
    ],
  };
};