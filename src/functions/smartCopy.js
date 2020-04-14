const copyTemplate = require('./copyTemplate')
const {copy, lstat} = require('fs-extra')
const rimraf = require('delete').promise

async function smartCopy(source, destination, options={}) {
  const {move=false, templateOptions} = options
  let output
  const sourceStats = await lstat(source)
  if (sourceStats.isDirectory()) {
    output = await copyTemplate(source, destination, templateOptions)
  } else if (sourceStats.isFile()) {
    output = await copy(source, destination)
  }
  if (move === true) {
    await rimraf(source)
  }
  return true
}

module.exports = smartCopy
