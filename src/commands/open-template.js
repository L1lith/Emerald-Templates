const chalk = require('chalk')
const findTemplateFolder = require('../functions/findTemplateFolder')
const openExplorer = require('../functions/openExplorerAsync')
const askQuestion = require('../functions/askQuestion')
const getConfiguration = require('../functions/getConfiguration')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

async function openTemplate(options) {
  let targetTemplate = options['open-template'] || options._[0]
  if (Array.isArray(targetTemplate)) targetTemplate = targetTemplate[0]
  if (typeof targetTemplate != 'string' || targetTemplate.length < 1)
    targetTemplate = await askQuestion('Which template would you like to open?\n> ')
  if (typeof targetTemplate != 'string' || targetTemplate.length < 1)
    throw new Error('Must specify a valid template name')
  // TODO: Add the ability to specify "config" instead of a template to open the emerald-config.json file with the default application for editing
  const templateFolder = await findTemplateFolder(targetTemplate)
  if (!templateFolder)
    throw new Error(
      chalk.bold(`Could not find the template ${chalk.red('"' + targetTemplate + '"')}`)
    )
  const { launchCommand } = getConfiguration()
  if (typeof launchCommand == 'string' && launchCommand.length > 0) {
    await exec(launchCommand, { cwd: templateFolder })
  } else {
    await openExplorer(projectFolder)
  }
}

module.exports = openTemplate
