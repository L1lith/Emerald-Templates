const { exists } = require('fs-extra')
const { join } = require('path')
const findTemplateFolder = require('./findTemplateFolder')
const getTemplateFolders = require('./getTemplateFolders')
const getEmeraldConfig = require('./getEmeraldConfig')
const loadGlobalConfig = require('./loadGlobalConfig')
const onlyUnique = require('./onlyUnique')
const findFilesByExtension = require('./findFilesByExtension')

async function getAvailableGems(projectPath, options = {}) {
  const projectConfig = await getEmeraldConfig(projectPath)
  const globalConfig = await loadGlobalConfig()
  let { templateDirectories = null } = options
  let templateSources = (Array.isArray(projectConfig.sources) ? projectConfig.sources : [])
    .concat(Array.isArray(globalConfig.sources) ? globalConfig.sources : [])
    .filter(onlyUnique)
  if (templateDirectories === null) templateDirectories = await getTemplateFolders()
  const sources = {}
  await Promise.all(
    templateSources.map(async source => {
      const templatePath = await findTemplateFolder(source, templateDirectories)
      const gems = await findFilesByExtension(templatePath, '.gem', {
        matchFolders: true,
        matchFiles: false
      })
      await Promise.all(
        gems.map(async gem => {
          const gemPath = join(templatePath, gem)
          const config = await getEmeraldConfig(gemPath)
          config.path = gemPath
          sources[config.pathName] = config
        })
      )
    })
  )

  const projectGems = await findFilesByExtension(projectPath, '.gem', {
    matchFolders: true,
    matchFiles: false
  })
  await Promise.all(
    projectGems.map(async gem => {
      const gemPath = join(projectPath, gem)
      const config = await getEmeraldConfig(gemPath)
      if (sources.hasOwnProperty(config.pathName))
        throw new Error(`Found duplicate gems: "${config.name}"`)
      config.path = gemPath
      sources[config.pathName] = config
    })
  )
  return sources
}

module.exports = getAvailableGems
