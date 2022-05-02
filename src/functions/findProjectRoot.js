const { lstat } = require('fs/promises')
const { dirname, join } = require('path')

async function findProjectRoot(
  workingDirectory,
  targetConfigs = ['emerald-config.json', 'emerald-config.js']
) {
  //if (workingDirectory === sep || workingDirectory.length < 1) return null // We reached the bottom of the search tree
  const stats = await lstat(workingDirectory)
  if (stats.isFile()) {
    return checkParent(workingDirectory, targetConfigs)
  } else if (stats.isDirectory) {
    const projectConfigs = targetConfigs.map(config => join(workingDirectory, config))
    for (let i = 0, l = projectConfigs.length; i < l; i++) {
      try {
        const stats = await lstat(projectConfigs[i])
        if (stats.isFile()) return workingDirectory
      } catch (err) {
        if (err?.code !== 'ENOENT') throw err
      }
    }
    return checkParent(workingDirectory, targetConfigs)
  } else {
    throw new Error('Unexpected file type: ' + workingDirectory)
  }
}

function checkParent(childDirectory, targetConfigs) {
  const parent = dirname(childDirectory)
  if (parent === childDirectory) return null
  return findProjectRoot(parent, targetConfigs)
}

module.exports = findProjectRoot
