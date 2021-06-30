const loadGlobalConfig = require('./loadGlobalConfig')
const onlyUnique = require('./onlyUnique')
const getSubdirectories = require('./getSubdirectories')
const { join, basename } = require('path')
const getEmeraldConfig = require('./getEmeraldConfig')
const findTemplateFolder = require('./findTemplateFolder')
const getTemplateFolders = require('./getTemplateFolders')
const { template } = require('handlebars')
const findGemFromDirectory = require('./findGemFromDirectory')
const getAvailableGems = require('./getAvailableGems')
const pathCase = require('./pathCase')

async function findGem(projectPath, gemName, options = {}) {
  let { doLogging = true, templateFolders = null, availableGems = null } = options
  //const globalConfig = loadGlobalConfig()
  if (availableGems === null) availableGems = await getAvailableGems(projectPath)
  gemName = pathCase(gemName)
  return availableGems[gemName] || null
}

module.exports = findGem
