const depthcharge = require('depthcharge')

function areRelatedPaths(path1, path2) {
  if (typeof path1 != 'string') throw new Error("Must supply a path as the first argument")
  if (typeof path2 != 'string') throw new Error("Must supply a path as the second argument")
  const path1Depth = depthcharge(path1, path2)
  if (path1Depth > 0) return true
  const path2Depth = depthcharge(path2, path1)
  if (path2Depth > 0) return true
  return false
}

module.exports = areRelatedPaths
