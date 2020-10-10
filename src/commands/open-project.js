const chalk = require('chalk')
const findProjectFolder = require('../functions/findProjectFolder')
const openExplorer = require('../functions/openExplorerAsync')
const askQuestion = require('../functions/askQuestion')

async function openProject(options) {
  let targetProject = typeof options['open-project'] == 'string' ? options['open'] : options._[0]
  if (typeof targetProject != 'string' || targetProject.length < 1) targetProject = await askQuestion("Which project would you like to open?\n> ")
  if (typeof targetProject != 'string' || targetProject.length < 1) throw new Error("Must specify a valid project name")
  // TODO: Add the ability to specify "config" instead of a project to open the emerald-config.json file with the default application for editing
  const projectFolder = await findProjectFolder(targetProject)
  if (!projectFolder) throw new Error(chalk.bold(`Could not find the project ${chalk.red('"' + targetProject + '"')}`))
  await openExplorer(projectFolder)
}

module.exports = openProject
