const getConfiguration = require('./getConfiguration')
const directoryExists = require('directory-exists')
const getChildDirectories = require('./getChildDirectories')
const getEmeraldConfig = require('./getEmeraldConfig')
const { exists } = require('fs-extra')
const { join } = require('path')

const excludedDirectoryNames = ['.git', 'node_modules']

async function getTemplateFolders() {
  const { rootFolders, templateFolders } = getConfiguration()
  const outputFolders = {}
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
      const config = await getEmeraldConfig(fullPath)
      config.path = fullPath
      outputFolders[config.name] = config
    }
  }
  for (const templateFolder of templateFolders) {
    if (
      (await directoryExists(templateFolder)) &&
      !(await exists(join(templateFolder, '.noemerald')))
    ) {
      console.log('a', templateFolder)

      const config = await getEmeraldConfig(templateFolder)
      config.path = templateFolder
      outputFolders[config.pathName] = config
    }
  }
  return outputFolders
}

module.exports = getTemplateFolders
