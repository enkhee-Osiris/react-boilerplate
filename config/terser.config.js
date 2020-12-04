/** @format */

/* eslint-disable func-names */

module.exports = function(isProduction) {
  return {
    terserOptions: {
      parse: {
        ecma: 8,
      },
      ecma: 8,
      compress: {
        ecma: 5,
        warnings: false,
        comparisons: false,
        inline: 2,
      },
      mangle: {
        safari10: true,
      },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true,
      },
      sourceMap: !isProduction,
    },
    parallel: true,
  };
};
