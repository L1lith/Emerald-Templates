const { join, isAbsolute } = require('path')
const normalize = require('normalize-path')

function resolvePath(path, workingDirectory) {
  if (typeof path !== 'string') throw new Error('Path is not a string')
  if (typeof workingDirectory !== 'string') throw new Error('workingDirectory is not a string')
  path = path.trim()
  if (path.length < 1) throw new Error('Path is empty')
  workingDirectory = workingDirectory.trim()
  if (workingDirectory.length < 1) throw new Error('Working Directory is empty')
  let output
  path = normalize(path)
  if (isAbsolute(path)) {
    output = path
  } else {
    output = join(normalize(workingDirectory), path)
  }
  return output
}

module.exports = resolvePath
