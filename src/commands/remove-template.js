const loadGlobalConfig = require('../functions/loadGlobalConfig')
const saveGlobalConfig = require('../functions/saveGlobalConfig')
const chalk = require('chalk')
const findTemplateFolder = require('../functions/findTemplateFolder')

async function removeTemplate(templateFolder) {
  const { path, name } = await findTemplateFolder(templateFolder)
  let config = loadGlobalConfig()
  console.log(path)
  if (!Array.isArray(config.templateFolders) || !config.templateFolders.includes(path))
    throw new Error('That template could not be found')
  const templateFolders = config.templateFolders
  let templatePathIndex = templateFolders.indexOf(path)
  while (templatePathIndex >= 0) {
    templateFolders.splice(templatePathIndex, 1)
    templatePathIndex = templateFolders.indexOf(path)
  }
  if (config.templateFolders.length < 1) delete config.templateFolders
  saveGlobalConfig(config)
  console.log(chalk.green(`The template "${name}" has been unregisted!`))
}

module.exports = {
  handler: removeTemplate,
  args: {
    templateFolder: {
      argsPosition: 0,
      format: String,
      prompt: 'Which template would you like to remove?',
      required: true
    }
  },
  aliases: ['remove']
}
