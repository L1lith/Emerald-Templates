const getConfiguration = require('../functions/getConfiguration')
const directoryExists = require('directory-exists')
const getChildDirectories = require('../functions/getChildDirectories')
const {exists} = require('fs-extra')
const {join} = require('path')

const excludedDirectoryNames = ['.git', 'node_modules']

async function getTemplateFolders() {
  const {templateFolders} = getConfiguration()
  const outputFolders = []
  for (let i = 0; i < templateFolders.length; i++) {
    const templateFolder = templateFolders[i]
    if (!(await directoryExists(templateFolder))) throw new Error(`The folder "${templateFolder}" configured to contain the templates does not exist`)
    let childDirectories = await getChildDirectories(templateFolder)
    childDirectories = childDirectories.filter(name => !excludedDirectoryNames.includes(name))
    for (let i = 0; i < childDirectories.length; i++) {
      const childDirectory = childDirectories[i]
      const fullPath = join(templateFolder, childDirectory)
      try {
        if (await exists(join(fullPath, '.noproject'))) continue // ignore because it has a .noproject file
      } catch(error) {}
      if (!outputFolders.includes(fullPath)) outputFolders.push(fullPath)
    }
  }
  return outputFolders
}

module.exports = getTemplateFolders
