/** @format */

const path = require('path');
const fs = require('fs');
const process = require('process');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const getPublicUrlOrPath = () => {
  const {homepage} = resolveApp('package.json');

  if (process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL;
  }

  if (process.env.NODE_ENV !== 'development' && homepage) {
    return homepage;
  }

  return '/';
};

module.exports = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appConfig: resolveApp('config'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrlOrPath(),
};
