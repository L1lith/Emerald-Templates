const { promisify } = require('util')
const findTemplateFolder = require('../functions/findTemplateFolder')
const exec = promisify(require('child_process').exec)

async function updateTemplate(templateFolder) {
  const template = await findTemplateFolder(templateFolder)
  await exec('git pull', { cwd: template.path })
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
