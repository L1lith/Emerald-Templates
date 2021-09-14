// const loadGlobalConfig = require('../functions/loadGlobalConfig')
// const onlyUnique = require('../functions/onlyUnique')
// const getSubdirectories = require('../functions/getSubdirectories')
// const { join, basename } = require('path')
// const getEmeraldConfig = require('../functions/getEmeraldConfig')
// const findTemplateFolder = require('../functions/findTemplateFolder')
// const getTemplateFolders = require('../functions/getTemplateFolders')
// const { template } = require('handlebars')
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
