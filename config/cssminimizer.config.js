/** @format */

/* eslint-disable global-require, func-names */

module.exports = function(isProduction) {
  return {
    sourceMap: !isProduction,
    parallel: true,
    minify: async (data, inputMap) => {
      const CleanCSS = require('clean-css');

      const [[filename, input]] = Object.entries(data);
      const minifiedCss = await new CleanCSS({
        sourceMap: true,
      }).minify({
        [filename]: {
          styles: input,
          sourceMap: inputMap,
        },
      });

      return {
        css: minifiedCss.styles,
        map: minifiedCss.sourceMap.toJSON(),
        warnings: minifiedCss.warnings,
      };
    },
  };
};
