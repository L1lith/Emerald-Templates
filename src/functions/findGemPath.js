const loadGlobalConfig = require('./loadGlobalConfig')
const onlyUnique = require('./onlyUnique')
const getSubdirectories = require('./getSubdirectories')
const { join, basename } = require('path')
const getEmeraldConfig = require('./getEmeraldConfig')
const findTemplateFolder = require('./findTemplateFolder')
const getTemplateFolders = require('./getTemplateFolders')
const { template } = require('handlebars')

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
  const templateFolders = await getTemplateFolders()
  for (let i = 0; i < sources.length; i++) {
    const output = await findGemPathFromTemplate(sources[i], gemName, templateFolders)
    if (output !== null) return output
  }
  return null
}

const nonEssentialCharacters = /[\s\-]+/g

async function findGemPathFromTemplate(templateName, originalGemName, templateFolders) {
  const gemName = originalGemName.toLowerCase().replace(nonEssentialCharacters, '')
  if (gemName.length < 1) throw new Error('Invalid Gem Name')
  let potentialGems
  const templateFolder = await findTemplateFolder(templateName, templateFolders)
  if (templateFolder === null) throw new Error('That was weird, an unexpected error occured')
  try {
    potentialGems = await getSubdirectories(join(templateFolder, 'gems'))
  } catch (error) {
    console.error(error)
    return null
  }
  for (let i = 0; i < potentialGems.length; i++) {
    const directoryName = potentialGems[i].toLowerCase().replace(nonEssentialCharacters, '')
    if (directoryName.length < 1) {
      console.warn('Template had an invalid gem name')
      continue
    }
    if (directoryName === gemName) return join(templateFolder, 'gems', potentialGems[i])
  }
  return null
}

module.exports = findGemPath
