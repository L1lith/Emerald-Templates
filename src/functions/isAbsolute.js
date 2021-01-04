const { normalize, resolve } = require('path')

function isAbsolute(path) {
  return normalize(path + '/') === normalize(resolve(path) + '/')
}

module.exports = isAbsolute
