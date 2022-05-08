const getTemplateFolders = require('./getTemplateFolders')
const chalk = require('chalk')
const { pathExists } = require('fs-extra')
const getPathName = require('./getPathName')
const getEmeraldConfig = require('./getEmeraldConfig')

async function findTemplateFolder(name, templateFolders = null) {
  if (await pathExists(name)) {
    const output = getEmeraldConfig(name)
    return output
  }
  if (typeof name != 'string' || name.length < 1)
    throw new Error('Template name is not a non-empty string')
  if (templateFolders === null) templateFolders = await getTemplateFolders()
  if (templateFolders.length < 1)
    console.warn(chalk.red('Warning: Found no template folders, try setting some up first'))
  return templateFolders[getPathName(name)] || null
}

module.exports = findTemplateFolder
