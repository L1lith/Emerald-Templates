const { relative, resolve } = require('path')
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
      const templateConfig = await findTemplateFolder(source, templateDirectories)
      if (!templateConfig) {
        throw new Error('Could not find the template: ' + source)
      }

      const gems = await findFilesByExtension(templateConfig.path, '.gem', {
        matchFolders: true,
        matchFiles: false
      })
      await Promise.all(
        gems.map(async gemPath => {
          const config = await getEmeraldConfig(gemPath, { type: 'gem' })
          config.destination = relative(templateConfig.path, resolve(gemPath, '..'))
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
    projectGems.map(async gemPath => {
      const config = await getEmeraldConfig(gemPath, { type: 'gem' })
      if (config.pathName in sources) throw new Error(`Found duplicate gems: "${config.name}"`)
      config.path = gemPath
      config.project = projectPath
      config.destination = relative(projectPath, resolve(gemPath, '..'))
      sources[config.pathName] = config
    })
  )
  return sources
}

module.exports = getAvailableGems
