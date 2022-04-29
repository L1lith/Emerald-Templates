const loadGlobalConfig = require('../functions/loadGlobalConfig')
const saveGlobalConfig = require('../functions/saveGlobalConfig')
const resolvePath = require('../functions/resolvePath')
const directoryExists = require('directory-exists')
const askQuestion = require('../functions/askQuestion')
const chalk = require('chalk')

async function removeProject(options) {
  let projectPath = options['remove-project'][0]
  if (typeof projectPath != 'string' || projectPath.length < 1) {
    projectPath = (
      await askQuestion('Please enter the path to your project folder you\'d like to remove\n> ')
    ).trim()
  }
  if (typeof projectPath != 'string' || projectPath.length < 1)
    throw new Error('Invalid Root Path supplied')
  const projectFolder = resolvePath(projectPath, process.cwd())
  if (!(await directoryExists(projectFolder)))
    throw new Error(`The folder "${projectPath}" does not exist`)
  let config = loadGlobalConfig()
  if (!Array.isArray(config.projectFolders) || !config.projectFolders.includes(projectFolder))
    throw new Error('That folder has not been added')
  let projectFolderIndex = 0
  while (projectFolderIndex >= 0) {
    projectFolderIndex = config.projectFolders.indexOf(projectFolder)
    if (projectFolderIndex >= 0) config.projectFolders.splice(projectFolderIndex, 1)
  }
  if (config.projectFolders.length < 1) {
    delete config.projectFolders
  } else {
    config.projectFolders = config.projectFolders
  }
  saveGlobalConfig(config)
  console.log(chalk.green('Done!'))
}

module.exports = {
  handler: removeProject,
  description: 'Removes a project from Emerald Templates without deleting it from the file system'
}
