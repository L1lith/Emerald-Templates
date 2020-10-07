const {join} = require('path')
const loadConfig = require('../functions/loadConfig')
const saveConfig = require('../functions/saveConfig')
const resolvePath = require('../functions/resolvePath')
const askQuestion = require('../functions/askQuestion')
const chalk = require('chalk')
const directoryExists = require('directory-exists')

async function addTemplate(options) {
  let config = loadConfig()
  let templateFolder = options['--add-template'][0]
  if (typeof templateFolder != 'string' || templateFolder.length < 0) {
    templateFolder = (await askQuestion("Please enter the path to your template folder (relative or absolute)\n> ")).trim()
    if (templateFolder.length < 1) {
      throw new Error("Must supply a template folder")
    }
  }
  const templateFolderPath = resolvePath(templateFolder, process.cwd())
  if (!(await directoryExists(templateFolderPath))) throw new Error(`The folder "${templateFolder}" does not exist`)
  console.log(chalk.green(`Setting the templates folder path as ${'"' + templateFolderPath + '"'}`))
  config.templateFolders = config.templateFolders || []
  if (config.templateFolders.includes(templateFolderPath)) throw new Error("That template has already been added")
  config.templateFolders.push(templateFolderPath)
  saveConfig(config)
  console.log(chalk.green("Done!"))
}

module.exports = addTemplate
