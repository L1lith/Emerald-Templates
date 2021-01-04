const subdir = require('subdir')

function areRelatedPaths(path1, path2) {
  if (typeof path1 != 'string') throw new Error('Must supply a path as the first argument')
  if (typeof path2 != 'string') throw new Error('Must supply a path as the second argument')
  if (subdir(path1, path2) || subdir(path2, path1)) return true
  return false
}

module.exports = areRelatedPaths
