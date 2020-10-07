const getEmeraldConfig = require('../functions/getEmeraldConfig')
const findTemplateFolder = require('../functions/findTemplateFolder')
const {basename} = require('path')
const chalk = require('chalk')

async function describe(options) {
  let targetTemplate = (options['--targetFolder'] || options._[0] || "").trim()
  if (typeof targetTemplate != 'string' || targetTemplate.length < 1) throw new Error("Must specify a valid template name")
  const templateFolder = await findTemplateFolder(targetTemplate)
  if (!templateFolder) throw new Error(chalk.bold(`Could not find the template ${chalk.red('"' + targetTemplate + '"')}`))
  const config = await getEmeraldConfig(templateFolder)
  console.log(`Template Name: ${chalk.green(chalk.bold(config.name))}${typeof config.description == "string" ? "\nDescription: " + chalk.green(config.description) : ""}
Location: ${chalk.green('"' + templateFolder + '"')}`
  )
}

module.exports = describe
