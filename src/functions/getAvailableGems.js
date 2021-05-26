const { exists } = require('fs-extra')
const { join } = require('path')
const findTemplateFolder = require('./findTemplateFolder')
const getTemplateFolders = require('./getTemplateFolders')
const getEmeraldName = require('./getEmeraldName')
const getEmeraldConfig = require('./getEmeraldConfig')
const loadGlobalConfig = require('./loadGlobalConfig')
const onlyUnique = require('./onlyUnique')

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
      const path = join(await findTemplateFolder(source, templateDirectories), 'gems')
      if (!(await exists(path))) return
      sources[await getEmeraldName(path)] = path
    })
  )

  const projectGemsPath = join(projectPath, 'gems')
  if (await exists(projectGemsPath)) {
    const projectName = projectConfig.name
    if (sources.hasOwnProperty(projectName))
      throw new Error('Found a source with a name conflicting with the current project')
    sources[projectName] = projectPath
  }
  return sources
}

module.exports = getAvailableGems