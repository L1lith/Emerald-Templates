const findTemplateFolder = require('../functions/findTemplateFolder')
const askQuestion = require('../functions/askQuestion')

async function getDirectory(options) {
  let targetTemplate = (
    options['get-directory'] ||
    options._[0] ||
    (await askQuestion('Which template would you like to get the directory for?\n> '))
  ).trim()
  if (typeof targetTemplate != 'string' || targetTemplate.length < 1)
    throw new Error('Must specify a valid template name')
  const templateFolder = await findTemplateFolder(targetTemplate)
  if (!templateFolder) throw new Error('Could not find the specified template')
  process.stdout.write(templateFolder)
}

module.exports = getDirectory
