const isAbsolute = require('./isAbsolute')
const {join, normalize} = require('path')

function resolvePath(path, workingDirectory) {
  let output
  if (isAbsolute(path)) {
    output = path
  } else {
    output = join(workingDirectory, path)
  }
  output = normalize(output)
  return output
}

module.exports = resolvePath
