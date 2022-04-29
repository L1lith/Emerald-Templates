const getConfiguration = require('../functions/getConfiguration')
const getEmeraldConfig = require('../functions/getEmeraldConfig')
const saveGlobalConfig = require('../functions/saveGlobalConfig')
const resolvePath = require('../functions/resolvePath')
const directoryExists = require('directory-exists')
const chalk = require('chalk')

async function addProject(project) {
  const dir = process.cwd()
  if (typeof project == 'string') {
    project = resolvePath(project, dir)
  } else {
    project = dir
  }
  if (!(await directoryExists(project))) throw new Error(`The folder "${project}" does not exist`)
  let config = getConfiguration()
  const { projectFolders } = config
  if (Object.values(config.projectFolders).includes(project))
    throw new Error('That folder has already been added')
  getEmeraldConfig(project)
  if (projectFolders.includes(project))
    throw new Error('That project folder has already been added')
  config.projectFolders = config.projectFolders.concat([project])
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
