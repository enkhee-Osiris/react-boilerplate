/** @format */

/* eslint-disable global-require */

module.exports = {
  ident: 'postcss',
  plugins: [
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
    require('postcss-normalize')(),
    require('node-css-mqpacker')(),
    require('postcss-combine-duplicated-selectors'),
  ],
};
