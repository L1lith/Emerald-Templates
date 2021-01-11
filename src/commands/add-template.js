const { join } = require('path')
const getConfiguration = require('../functions/getConfiguration')
const saveGlobalConfig = require('../functions/saveGlobalConfig')
const resolvePath = require('../functions/resolvePath')
const askQuestion = require('../functions/askQuestion')
const chalk = require('chalk')
const directoryExists = require('directory-exists')

async function addTemplate(options) {
  let templateFolder = options['add-template'][0]
  if (typeof templateFolder != 'string' || templateFolder.length < 0) {
    templateFolder = (
      await askQuestion('Please enter the path to your template folder (relative or absolute)\n> ')
    ).trim()
    if (templateFolder.length < 1) {
      throw new Error('Must supply a template folder')
    }
  }
  const templateFolderPath = resolvePath(templateFolder, process.cwd())
  console.log(templateFolderPath)
  if (!(await directoryExists(templateFolderPath)))
    throw new Error(`The folder "${templateFolder}" does not exist`)
  let config = getConfiguration(templateFolderPath, { generateDefaultConfig: true })
  if (config.templateFolders.includes(templateFolderPath))
    throw new Error('That template has already been added')
  config.templateFolders = config.templateFolders.concat([templateFolderPath])
  console.log(chalk.green(`Adding the templates folder path: ${'"' + templateFolderPath + '"'}`))
  saveGlobalConfig(config)
  console.log(chalk.green('Done!'))
}

module.exports = addTemplate
