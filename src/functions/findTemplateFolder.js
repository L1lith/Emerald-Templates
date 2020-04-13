const {basename} = require('path')
const getTemplateFolders = require('./getTemplateFolders')

const whitespaceRegex = /\s+/g

async function findTemplateFolder(name, templateFolders=null) {
  if (typeof name != 'string' || name.length < 1) throw new Error("Template name is not a non-empty string")
  name = name.toLowerCase().replace(whitespaceRegex, '-')
  if (templateFolders === null) templateFolders = await getTemplateFolders()
  for (const templateFolder of templateFolders) {
    const templateName = basename(templateFolder).toLowerCase().replace(whitespaceRegex, '-')
    if (templateName === name) return templateFolder
  }
  return null
}

module.exports = findTemplateFolder
