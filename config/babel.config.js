/** @format */

/* eslint-disable global-require, func-names */

const path = require('path');

const sourcePlugins = [
  ['@babel/plugin-proposal-class-properties', {loose: true}],
  '@babel/plugin-proposal-numeric-separator',
  [
    '@babel/plugin-transform-runtime',
    {
      absoluteRuntime: false,
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: false,
      version: require('@babel/runtime/package.json').version,
    },
  ],
];
const sourceProductionPlugins = [
  [
    'transform-react-remove-prop-types',
    {
      removeImport: true,
    },
  ],
  ['transform-remove-console', {exclude: ['error', 'warn']}],
];

module.exports = function(isProduction) {
  return {
    source: {
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'entry',
            corejs: 3,
            exclude: ['transform-typeof-symbol'],
          },
        ],
        [
          '@babel/preset-react',
          {
            development: !isProduction,
            useBuiltIns: true,
            runtime: 'automatic',
          },
        ],
      ],
      plugins: isProduction ? [...sourcePlugins, ...sourceProductionPlugins] : sourcePlugins,
    },
    dependency: {
      sourceType: 'unambiguous',
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'entry',
            corejs: 3,
            exclude: ['transform-typeof-symbol'],
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json')),
            corejs: false,
            helpers: true,
            regenerator: true,
            useESModules: true,
            version: require('@babel/runtime/package.json').version,
          },
        ],
      ],
    },
  };
};
