const chalk = require('chalk')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const findProjectFolder = require('../functions/findProjectFolder')
const openExplorer = require('../functions/openExplorerAsync')
const getConfiguration = require('../functions/getConfiguration')
const resolvePath = require('../functions/resolvePath')

async function openProject(project, options) {
  const projectFolder = await findProjectFolder(resolvePath(project, process.cwd()))
  const { launchCommand } = getConfiguration()
  if (typeof launchCommand == 'string' && launchCommand.length > 0) {
    await exec(launchCommand, { cwd: projectFolder })
  } else {
    await openExplorer(projectFolder)
  }
  console.log(chalk.green('Done!'))
}

module.exports = {
  args: {
    project: {
      argsPosition: 0,
      format: String,
      required: true,
      prompt: 'Which project would you like to open?'
    }
  },
  handler: openProject,
  aliases: ['open'],
  description: 'Opens a project'
}
