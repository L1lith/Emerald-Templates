const copyTemplate = require('./copyTemplate')
const { copy, lstat, exists } = require('fs-extra')
const rimraf = require('delete').promise

async function smartCopy(source, destination, options = {}) {
  const { move = false, templateOptions } = options
  const sourceStats = await lstat(source)
  if (sourceStats.isDirectory()) {
    //console.log('copying directory', source, destination)
    await copyTemplate(source, destination, templateOptions)
  } else if (sourceStats.isFile()) {
    if (await exists(destination)) return // Don't overwrite files
    await copy(source, destination)
  }
  if (move === true) {
    await rimraf(source)
  }
  return true
}

module.exports = smartCopy
