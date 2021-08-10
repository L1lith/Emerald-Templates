const { join } = require('path')
const getConfiguration = require('../functions/getConfiguration')
const getEmeraldConfig = require('../functions/getEmeraldConfig')
const saveGlobalConfig = require('../functions/saveGlobalConfig')
const resolvePath = require('../functions/resolvePath')
const directoryExists = require('directory-exists')
const askQuestion = require('../functions/askQuestion')
const chalk = require('chalk')

async function addProject(project, options) {
  const projectFolder = resolvePath(project, process.cwd())
  if (!(await directoryExists(projectFolder)))
    throw new Error(`The folder "${projectPath}" does not exist`)
  let config = getConfiguration()
  const { projectFolders } = config
  if (Object.values(config.projectFolders).includes(projectFolder))
    throw new Error('That folder has already been added')
  const projectConfig = getEmeraldConfig(projectFolder)
  let { name } = projectConfig
  if (projectFolders.includes(projectFolder))
    throw new Error('That project folder has already been added')
  config.projectFolders = config.projectFolders.concat([projectFolder])
  saveGlobalConfig(config)
  console.log(chalk.green('Done!'))
}

module.exports = {
  handler: addProject,
  args: {
    project: {
      argsPosition: 0,
      format: String,
      prompt: 'Please enter the path to your project templates storage folder'
    }
  }
}
