<!-- @format -->

# React Boilerplate

enkhee-Osiris's react boilerplate.

## Prerequisites

```sh
$ npm install -S react react-dom core-js
$ npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugin eslint-webpack-plugin webpack-manifest-plugin clean-webpack-plugin mini-css-extract-plugin terser-webpack-plugin css-minimizer-webpack-plugin html-minimizer-webpack-plugin url-loader babel-loader style-loader postcss-loader css-loader file-loader sass-loader resolve-url-loader
$ npm install -D babel-eslint eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier
$ npm install -D stylelint stylelint-config-standard stylelint-config-prettier
$ npm install -D @babel/core @babel/plugin-proposal-class-properties @babel/plugin-proposal-numeric-separator @babel/plugin-transform-runtime babel-plugin-transform-react-remove-prop-types babel-plugin-transform-remove-console @babel/preset-env @babel/preset-react
$ npm install -D clean-css postcss postcss-flexbugs-fixes postcss-preset-env postcss-normalize node-css-mqpacker postcss-combine-duplicated-selectors
```

## Npm scripts

```json
{
  "start": "NODE_ENV=development webpack serve --config=./config/webpack.config.js",
  "build:prod": "NODE_ENV=production webpack --config=./config/webpack.config.js",
  "build:dev": "NODE_ENV=development webpack --watch --color --config=./config/webpack.config.js",
  "css:lint": "stylelint '**/*.scss' --config ./.stylelintrc.js",
  "js:lint": "eslint '**/*.js' -c ./.eslintrc.js",
  "lint": "npm run css:lint && npm run js:lint"
}
```
