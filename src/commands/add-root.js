const { join } = require('path')
const getConfiguration = require('../functions/getConfiguration')
const saveGlobalConfig = require('../functions/saveGlobalConfig')
const resolvePath = require('../functions/resolvePath')
const directoryExists = require('directory-exists')
const askQuestion = require('../functions/askQuestion')
const chalk = require('chalk')

async function addRoot(root, options) {
  // if (!root)
  //   root = (
  //     await askQuestion('Please enter the path to your root templates storage folder\n> ')
  //   ).trim()
  const rootFolder = resolvePath(root, process.cwd())
  if (!(await directoryExists(rootFolder)))
    throw new Error(`The folder "${rootPath}" does not exist`)
  let config = getConfiguration()
  //config.rootFolders = config.rootFolders
  if (config.rootFolders.includes(rootFolder)) throw new Error('That folder has already been added')
  config.rootFolders = config.rootFolders.concat([rootFolder])
  saveGlobalConfig(config)
  console.log(chalk.green('Done!'))
}

module.exports = {
  handler: addRoot,
  args: {
    root: {
      argsPosition: 0,
      format: String,
      prompt: 'Please enter the path to the root you would like to add',
      required: true
    }
  }
}
