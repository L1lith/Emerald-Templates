const chalk = require('chalk')
const findTemplateFolder = require('../functions/findTemplateFolder')
const openExplorer = require('../functions/openExplorerAsync')

async function describe(options) {
  let targetTemplate = (options['--targetFolder'] || options._[0] || "").trim()
  if (typeof targetTemplate != 'string' || targetTemplate.length < 1) throw new Error("Must specify a valid template name")
  const templateFolder = await findTemplateFolder(targetTemplate)
  if (!templateFolder) throw new Error(chalk.bold(`Could not find the template ${chalk.red('"' + targetTemplate + '"')}`))
  await openExplorer(templateFolder)
}

module.exports = describe
