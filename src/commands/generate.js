const {join} = require('path')
const getConfiguration = require('../functions/getConfiguration')
const directoryExists = require('directory-exists')
const resolvePath = require('../functions/resolvePath')
const {promisify} = require('util')
const {copy} = require('fs-extra')
const populateEmerald = require('../functions/populateEmerald')
const findFilesByExtension = require('../functions/findFilesByExtension')

async function generate(options) {
  const rootTemplateFolder = getConfiguration().templateFolder
  if (!(await directoryExists(rootTemplateFolder))) throw new Error("The folder configured to contain the templates does not exist")
  let templateFolder = (options['--template'] || options._[0] || "").trim()
  if (!templateFolder) throw new Error("Please specify which template folder you would like to use")
  templateFolder = join(rootTemplateFolder, templateFolder)
  if (!(await directoryExists(templateFolder))) throw new Error(`Could not find the template folder "${templateFolder}"`)

  let outputFolder = (options['--outputFolder'] || options._[1] || "").trim()
  if (!outputFolder) throw new Error("You must specify the output folder")
  outputFolder = resolvePath(outputFolder, process.cwd())
  if (!(await directoryExists(join(outputFolder, '..')))) throw new Error(`The output folder's parent directory does not exist`)
  if (await directoryExists(outputFolder)) throw new Error(`The output folder "${outputFolder}" already exists.`)
  console.log("Copying The Template")
  await copy(templateFolder, outputFolder)
  console.log("Populating the .emerald files")
  const emeralds = await findFilesByExtension(outputFolder, '.emerald')
  for (let i = 0; i < emeralds.length; i++) {
    await populateEmerald(emeralds[i], config.templateEngine)
  }
  console.log("Project Generated!")

}

module.exports = generate
