const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    '@ce': path.resolve(__dirname, 'src'),
    '@ee': path.resolve(__dirname, 'ee/src'),
  }),
  (config) => {
    // Ensure Webpack resolves .ts and .tsx files
    config.resolve.extensions.push('.ts', '.tsx');

    // Add a loader for TypeScript files
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      ],
      exclude: /node_modules/,
    });

    return config;
  }
);
// testing git command