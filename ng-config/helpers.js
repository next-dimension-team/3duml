/**
 * @author: @AngularClass
 */
var path = require('path');
const fs = require('fs');

const EVENT = process.env.npm_lifecycle_event || '';

// Helper functions
var ROOT = path.resolve(__dirname, '..');

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function hasNpmFlag(flag) {
  return EVENT.includes(flag);
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}

function detectHotReloading(file, force = false) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }

  if (process.argv.includes('--hot') || force) {
    let dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.writeFileSync(file, 'hot reloading enabled');

    return true;
  }

  return false;
}

var root = path.join.bind(path, ROOT);

exports.hasProcessFlag = hasProcessFlag;
exports.hasNpmFlag = hasNpmFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
exports.detectHotReloading = detectHotReloading;
