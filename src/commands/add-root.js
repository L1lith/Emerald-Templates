const {join} = require('path')
const getConfiguration = require('../functions/getConfiguration')
const saveConfig = require('../functions/saveConfig')
const resolvePath = require('../functions/resolvePath')
const directoryExists = require('directory-exists')
const askQuestion = require('../functions/askQuestion')
const chalk = require('chalk')

async function addRoot(options) {
  let rootPath = options['add-root'][0] || (await askQuestion("Please enter the path to your root templates storage folder\n> ")).trim()
  const rootFolder = resolvePath(rootPath, process.cwd())
  if (!(await directoryExists(rootFolder))) throw new Error(`The folder "${rootPath}" does not exist`)
  let config = getConfiguration()
  //config.rootFolders = config.rootFolders
  if (config.rootFolders.includes(rootFolder)) throw new Error("That folder has already been added")
  config.rootFolders = config.rootFolders.concat([rootFolder])
  saveConfig(config)
  console.log(chalk.green("Done!"))
}

module.exports = addRoot
