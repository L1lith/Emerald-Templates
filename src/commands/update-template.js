const findTemplateFolder = require('../functions/findTemplateFolder')
const gitPull = require('../functions/gitPull')

async function updateTemplate(templateFolder) {
  const template = await findTemplateFolder(templateFolder)
  await gitPull(template.path)
  console.log(`Template "${template.name}" updated!`)
}

module.exports = {
  handler: updateTemplate,
  args: {
    templateFolder: {
      argsPosition: 0,
      format: String,
      prompt: 'Which template would you like to update?',
      required: true
    }
  },
  aliases: ['update']
}
