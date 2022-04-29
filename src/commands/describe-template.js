const getEmeraldConfig = require('../functions/getEmeraldConfig')
const findTemplateFolder = require('../functions/findTemplateFolder')
const chalk = require('chalk')

async function describeTemplate(template) {
  const templateFolder = await findTemplateFolder(template)
  if (!templateFolder)
    throw new Error(chalk.bold(`Could not find the template ${chalk.red('"' + template + '"')}`))
  const config = await getEmeraldConfig(templateFolder)
  console.log(`Template Name: ${chalk.green(chalk.bold(config.name))}${
    typeof config.description == 'string' ? '\nDescription: ' + chalk.green(config.description) : ''
  }
Location: ${chalk.green('"' + templateFolder + '"')}`)
}

module.exports = {
  handler: describeTemplate,
  description: 'Get info about a template',
  aliases: ['describe'],
  args: {
    template: {
      argsPosition: 0,
      format: { _: String, trimmed: true },
      required: true,
      prompt: 'Which template would you like more info about?'
    }
  }
}
