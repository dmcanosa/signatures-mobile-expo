/*module.exports = function (api) {
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
};*/

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    }],
  ],
};