const {basename} = require('path')
const getTemplateFolders = require('./getTemplateFolders')

const whitespaceRegex = /\s+/g

async function findTemplateFolder(name, templateFolders=null) {
  if (typeof name != 'string' || name.length < 1) throw new Error("Template name is not a non-empty string")
  name = name.toLowerCase().replace(whitespaceRegex, '-')
  if (templateFolders === null) templateFolders = await getTemplateFolders()
  for (let i = 0; i < templateFolders.length; i++) {
    const templateFolder = templateFolders[i]
    const templateName = basename(templateFolder).toLowerCase().replace(whitespaceRegex, '-')
    if (templateName === name) return templateFolder
  }
  return null
}

module.exports = findTemplateFolder
