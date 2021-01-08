const loadGlobalConfig = require('./loadGlobalConfig')
const onlyUnique = require('./onlyUnique')
const getSubdirectories = require('./getSubdirectories')
const { join, basename } = require('path')
const getEmeraldConfig = require('./getEmeraldConfig')

async function findGemPath(projectPath, gemName, options = {}) {
  const { doLogging = true } = options
  const globalConfig = loadGlobalConfig()
  const projectConfig = await getEmeraldConfig(projectPath)
  //   if (!Array.isArray(projectConfig.sources) || projectConfig.sources.length < 1)
  //     throw new Error(
  //       'Your config is missing a sources array of strings of absolute paths to template directories'
  //     )
  const sources = (Array.isArray(projectConfig.sources) ? projectConfig.sources : [])
    .concat(Array.isArray(globalConfig.sources) ? globalConfig.sources : [])
    .filter(onlyUnique)
  if (sources.length < 1) throw new Error('Could not find any template sources to find gems in')
  if (doLogging) {
    console.log('Found ' + sources.length + ' source(s), locating matching gem...')
  }
  for (let i = 0; i < sources.length; i++) {
    const output = await findGemPathFromTemplate(sources[i], gemName)
    if (output !== null) return output
  }
  return null
}

const nonEssentialCharacters = /[\s\-]+/g

async function findGemPathFromTemplate(templateFolder, originalGemName) {
  const gemName = originalGemName.toLowerCase().replace(nonEssentialCharacters, '')
  if (gemName.length < 1) throw new Error('Invalid Gem Name')
  let potentialGems
  try {
    potentialGems = await getSubdirectories(join(templateFolder, 'gems'))
  } catch (error) {
    //console.error(error)
    return null
  }
  for (let i = 0; i < potentialGems.length; i++) {
    const directoryName = basename(potentialGems[i])
      .toLowerCase()
      .replace(nonEssentialCharacters, '')
    if (directoryName.length < 1) {
      console.warn('Template had an invalid gem name')
      continue
    }
    if (directoryName === gemName) return join(templateFolder, 'gems', potentialGems[i])
  }
  return null
}

module.exports = findGemPath
