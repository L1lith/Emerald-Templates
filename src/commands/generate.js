const {join} = require('path')
const getConfiguration = require('../functions/getConfiguration')
const directoryExists = require('directory-exists')

async function generate(options) {
  const rootTemplateFolder = getConfiguration().templateFolder
  if (!(await directoryExists(rootTemplateFolder))) throw new Error("The folder configured to contain the templates does not exist")
  let templateFolder = options['--template'] || options._[0]
  if (!templateFolder) throw new Error("Please specify which template folder you would like to use")
  templateFolder = join(rootTemplateFolder, templateFolder)
  if (!(await directoryExists(templateFolder))) throw new Error(`Could not find the template folder "${templateFolder}"`)
  console.log(templateFolder)
}

module.exports = generate
