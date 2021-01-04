const { basename } = require('path')
const getTemplateFolders = require('./getTemplateFolders')
const chalk = require('chalk')

const whitespaceRegex = /\s+/g

async function findTemplateFolder(name, templateFolders = null) {
  if (typeof name != 'string' || name.length < 1)
    throw new Error('Template name is not a non-empty string')
  name = name.toLowerCase().replace(whitespaceRegex, '-')
  if (templateFolders === null) templateFolders = await getTemplateFolders()
  if (templateFolders.length < 1)
    console.warn(chalk.red('Warning: Found no template folders, try setting some up first'))
  for (const templateFolder of templateFolders) {
    const templateName = basename(templateFolder).toLowerCase().replace(whitespaceRegex, '-')
    if (templateName === name) return templateFolder
  }
  return null
}

module.exports = findTemplateFolder
