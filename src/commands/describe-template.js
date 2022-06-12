const getEmeraldConfig = require('../functions/getEmeraldConfig')
const findTemplateFolder = require('../functions/findTemplateFolder')
const chalk = require('chalk')

async function describeTemplate(templateName) {
  const template = await findTemplateFolder(templateName)
  if (!template)
    throw new Error(chalk.bold(`Could not find the template ${chalk.red('"' + template + '"')}`))
  const config = await getEmeraldConfig(template.path)
  console.log(`Template Name: ${chalk.green(chalk.bold(config.name))}${
    typeof config.description == 'string' ? '\nDescription: ' + chalk.green(config.description) : ''
  }
Location: ${chalk.green('"' + template.path + '"')}`)
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
