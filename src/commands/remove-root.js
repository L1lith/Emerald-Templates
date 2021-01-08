const { join } = require('path')
const loadGlobalConfig = require('../functions/loadGlobalConfig')
const saveGlobalConfig = require('../functions/saveGlobalConfig')
const resolvePath = require('../functions/resolvePath')
const directoryExists = require('directory-exists')
const askQuestion = require('../functions/askQuestion')
const chalk = require('chalk')

async function removeRoot(options) {
  let rootPath = options['remove-root'][0]
  if (typeof rootPath != 'string' || rootPath.length < 1) {
    rootPath = (
      await askQuestion(
        "Please enter the path to your root templates storage folder you'd like to remove\n> "
      )
    ).trim()
  }
  if (typeof rootPath != 'string' || rootPath.length < 1)
    throw new Error('Invalid Root Path supplied')
  const rootFolder = resolvePath(rootPath, process.cwd())
  if (!(await directoryExists(rootFolder)))
    throw new Error(`The folder "${rootPath}" does not exist`)
  let config = loadGlobalConfig()
  if (!Array.isArray(config.rootFolders) || !config.rootFolders.includes(rootFolder))
    throw new Error('That folder has not been added')
  let rootFolderIndex = 0
  while (rootFolderIndex >= 0) {
    rootFolderIndex = config.rootFolders.indexOf(rootFolder)
    if (rootFolderIndex >= 0) config.rootFolders.splice(rootFolderIndex, 1)
  }
  if (config.rootFolders.length < 1) {
    delete config.rootFolders
  } else {
    config.rootFolders = config.rootFolders
  }
  saveGlobalConfig(config)
  console.log(chalk.green('Done!'))
}

module.exports = removeRoot
