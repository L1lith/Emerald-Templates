const chalk = require('chalk')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const findProjectFolder = require('../functions/findProjectFolder')
const openExplorer = require('../functions/openExplorerAsync')
const askQuestion = require('../functions/askQuestion')
const getConfiguration = require('../functions/getConfiguration')

async function openProject(options) {
  let targetProject = options['open-project']
  if (Array.isArray(targetProject)) targetProject = targetProject.join(' ')
  if (typeof targetProject != 'string' || targetProject.length < 1)
    targetProject = await askQuestion(chalk.green('Which project would you like to open?') + '\n> ')
  if (typeof targetProject != 'string' || targetProject.length < 1)
    throw new Error('Must specify a valid project name')
  // TODO: Add the ability to specify "config" instead of a project to open the emerald-config.json file with the default application for editing
  const projectFolder = await findProjectFolder(targetProject)
  if (!projectFolder)
    throw new Error(
      chalk.bold(`Could not find the project ${chalk.red('"' + targetProject + '"')}`)
    )
  const { launchCommand } = getConfiguration()
  if (typeof launchCommand == 'string' && launchCommand.length > 0) {
    await exec(launchCommand, { cwd: projectFolder })
  } else {
    await openExplorer(projectFolder)
  }
  console.log(chalk.green('Done!'))
}

module.exports = openProject
