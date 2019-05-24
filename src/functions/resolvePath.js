const isAbsolute = require('./isAbsolute')
const {join} = require('path')

function resolvePath(path, workingDirectory) {
  if (isAbsolute(path)) {
    return path
  } else {
    return join(workingDirectory, path)
  }
}

module.exports = resolvePath
