const loadGlobalConfig = require('./loadGlobalConfig')
const onlyUnique = require('./onlyUnique')
const getSubdirectories = require('./getSubdirectories')
const { join, basename } = require('path')
const getEmeraldConfig = require('./getEmeraldConfig')
const findTemplateFolder = require('./findTemplateFolder')
const getTemplateFolders = require('./getTemplateFolders')
const { template } = require('handlebars')
const findGemFromDirectory = require('./findGemFromDirectory')

async function findGemPath(projectPath, gemName, options = {}) {
  let { doLogging = true, templateFolders = null } = options
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
  if (!Array.isArray(templateFolders)) templateFolders = await getTemplateFolders()
  const workingDirectoryGem = await findGemPathFromDirectory(projectPath, gemName)
  if (workingDirectoryGem !== null) return workingDirectoryGem
  for (let i = 0; i < sources.length; i++) {
    const templateFolder = await findTemplateFolder(sources[i], templateFolders)
    const output = await findGemFromDirectory(templateFolder, gemName)
    if (output !== null) return output
  }
  return null
}

module.exports = findGemPath
