const getConfiguration = require('../functions/getConfiguration')
const directoryExists = require('directory-exists')
const getChildDirectories = require('../functions/getChildDirectories')
const { exists } = require('fs-extra')
const { join } = require('path')

const excludedDirectoryNames = ['.git', 'node_modules']

async function getTemplateFolders() {
  const { rootFolders, templateFolders } = getConfiguration()
  const outputFolders = []
  for (const rootFolder of rootFolders) {
    if (!(await directoryExists(rootFolder)))
      throw new Error(
        `The root folder "${rootFolder}" configured to contain the templates does not exist`
      )
    let childDirectories = await getChildDirectories(rootFolder)
    childDirectories = childDirectories.filter(name => !excludedDirectoryNames.includes(name))
    for (const childDirectory of childDirectories) {
      const fullPath = join(rootFolder, childDirectory)
      if (await exists(join(fullPath, '.noemerald'))) continue // ignore because it has a .noemerald file
      if (!outputFolders.includes(fullPath)) outputFolders.push(fullPath)
    }
  }
  for (const templateFolder of templateFolders) {
    if (
      (await directoryExists(templateFolder)) &&
      !(await exists(join(templateFolder, '.noemerald')))
    ) {
      if (!outputFolders.includes(templateFolder)) outputFolders.push(templateFolder)
    }
  }
  return outputFolders
}

module.exports = getTemplateFolders
