const { join } = require('path')
const loadGlobalConfig = require('../functions/loadGlobalConfig')
const saveGlobalConfig = require('../functions/saveGlobalConfig')
const resolvePath = require('../functions/resolvePath')
const directoryExists = require('directory-exists')
const askQuestion = require('../functions/askQuestion')
const chalk = require('chalk')

async function removeTemplate(options) {
  let templateFolder = options['remove-template'][0]
  if (typeof templateFolder != 'string' || templateFolder.length < 1) {
    templateFolder = (
      await askQuestion(
        "Please enter the path to your template templates storage folder you'd like to remove\n> "
      )
    ).trim()
    if (typeof templateFolder != 'string' || templateFolder.length < 1)
      throw new Error('Invalid Template Path supplied')
  }
  const templatePath = resolvePath(templateFolder, process.cwd())
  if (!(await directoryExists(templatePath)))
    throw new Error(`The folder "${templatePath}" does not exist`)
  let config = loadGlobalConfig()
  if (!Array.isArray(config.templatePaths) || !config.templatePaths.includes(templatePath))
    throw new Error('That folder has not been added')
  let templatePathIndex = 0
  while (templatePathIndex >= 0) {
    templatePathIndex = templatePaths.indexOf(templatePath)
    templatePaths.splice(templatePathIndex, 1)
  }
  if (config.templatePaths.length < 1) delete config.templatePaths
  saveGlobalConfig(config)
  console.log(chalk.green('Done!'))
}

module.exports = removeTemplate
