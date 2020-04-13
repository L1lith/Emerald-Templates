const {join, basename} = require('path')
const getConfiguration = require('../functions/getConfiguration')
const directoryExists = require('directory-exists')
const resolvePath = require('../functions/resolvePath')
const {copy, readdir, rmdir, readFile, unlink} = require('fs-extra')
const processOutputFolder = require('../functions/processOutputFolder')
const copyTemplate = require('../functions/copyTemplate')
const {promisify} = require('util')
const rimraf = require('delete').promise
const exec = promisify(require('child_process').exec)
const findTemplateFolder = require('../functions/findTemplateFolder')
const askQuestion = require('../functions/askQuestion')

const validPrexistingOptions = ['overwrite', 'erase', 'stop', 'available']

async function generate(options) {
  const config = process.env.EMERALD_CONFIG = getConfiguration()

  // const rootTemplateFolder = config.templateFolder
  // if (!(await directoryExists(rootTemplateFolder))) throw new Error("The folder configured to contain the templates does not exist")
  let templateFolder = (options['--template'] || options._[0] || "").trim()
  if (!templateFolder) throw new Error("Please specify which template folder you would like to use")
  templateFolder = await findTemplateFolder(templateFolder)
  if (templateFolder === null || !(await directoryExists(templateFolder))) throw new Error(`Could not find the template folder "${templateFolder}"`)
  process.env.TEMPLATE_FOLDER = templateFolder

  let outputFolder = (options['--outputFolder'] || options._[1] || "").trim()
  if (!outputFolder) throw new Error("You must specify the output folder")
  outputFolder = resolvePath(outputFolder, process.cwd())
  if (!(await directoryExists(join(outputFolder, '..')))) throw new Error(`The output folder's parent directory does not exist`)
  const exists = await directoryExists(outputFolder)
  let overwriteMode = null
  if (exists) {
    //throw new Error(`The output folder "${outputFolder}" already exists and is not empty.`)
    while (!validPrexistingOptions.includes(overwriteMode)) overwriteMode = (await askQuestion("That folder already exists, how would you like to proceed?\nOptions: \n- "+ validPrexistingOptions.join(', ')  + "\n> ")).toLowerCase().trim()
    if (overwriteMode === "erase") {
      await rimraf(outputFolder)
    } else if (overwriteMode === "available") {
      // Do Nothing
    } else if (overwriteMode === "stop") {
      throw new Error("Stop requested")
    }
  }
  process.env.OUTPUT_FOLDER = outputFolder
  console.log("Copying The Template")
  console.log('a')
  await copyTemplate(templateFolder, outputFolder, overwriteMode === "overwrite")
  console.log('b')
  console.log("Handling any scripts, links, etc")
  await processOutputFolder(outputFolder, templateFolder)
  let packageJSON = null
  try {
    packageJSON = require(join(outputFolder, "package.json"))
  } catch(error) {console.log("Could not find or access the package.json")}
  if (config.automaticallyInstallNodeModules !== false && packageJSON) {
    console.log("Installing Dependencies")
    await exec("npm install", {cwd: outputFolder})
  }

  console.log("Project Generated Successfully!")
}

module.exports = generate
