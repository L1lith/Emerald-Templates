const getConfiguration = require('../functions/getConfiguration')
const directoryExists = require('directory-exists')
const getTemplateFolders = require('../functions/getTemplateFolders')

const excludedDirectoryNames = ['.git']

async function list() {
  const templateFolders = getTemplateFolders()
  let childDirectories = await getChildDirectories(templateFolder)
  childDirectories = childDirectories.filter(name => !excludedDirectoryNames.includes(name))
  console.log(" Available Templates:\n- " + childDirectories.join(', '))
}

module.exports = list
