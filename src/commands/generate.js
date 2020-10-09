const {join, basename} = require('path')
const getConfiguration = require('../functions/getConfiguration')
const directoryExists = require('directory-exists')
const resolvePath = require('../functions/resolvePath')
const {copy, readdir, rmdir, readFile, unlink, pathExists} = require('fs-extra')
const processOutputFolder = require('../functions/processOutputFolder')
const copyTemplate = require('../functions/copyTemplate')
const {promisify} = require('util')
const rimraf = require('delete').promise
const exec = promisify(require('child_process').exec)
const findTemplateFolder = require('../functions/findTemplateFolder')
const askQuestion = require('../functions/askQuestion')
const sanitize = require("sanitize-filename")
const chalk = require('chalk')

const validPrexistingOptions = ['overwrite', 'erase', 'stop', 'available']

async function generate(options) {
  const config = process.env.EMERALD_CONFIG = getConfiguration(true)

  // const rootTemplateFolder = config.templateFolder
  // if (!(await directoryExists(rootTemplateFolder))) throw new Error("The folder configured to contain the templates does not exist")
  let templateFolder = (options['generate'][0] || "").trim() || await askQuestion("Which template would you like to use?\n> ")
  if (!templateFolder) throw new Error("Please specify which template folder you would like to use")
  const templateFolderPath = await findTemplateFolder(templateFolder)
  if (templateFolderPath === null || !(await directoryExists(templateFolderPath))) throw new Error(chalk.bold(`Could not find the template ${chalk.red('"' + templateFolder + '"')}`))
  process.env.TEMPLATE_FOLDER = templateFolderPath

  let outputFolder = (options['generate'][1] || "").trim() || await askQuestion("What would you like to name the project?\n> ")
  if (!outputFolder) throw new Error("You must specify the output folder")
  const outputFolderPath = resolvePath(sanitize(outputFolder.replace(/\s+/g,'-')), process.cwd())
  if (!(await directoryExists(join(outputFolderPath, '..')))) throw new Error(`The output folder's parent directory does not exist`)

  console.log(chalk.green("Creating a new project at ") + chalk.cyan('"' + outputFolderPath + '"'))

  process.env.OUTPUT_FOLDER = outputFolderPath
  const exists = await directoryExists(outputFolderPath)
  let overwriteMode = null
  if (exists) {
    //throw new Error(`The output folder "${outputFolderPath}" already exists and is not empty.`)
    while (!validPrexistingOptions.includes(overwriteMode)) overwriteMode = (await askQuestion("That folder already exists, how would you like to proceed?\nOptions: \n- "+ validPrexistingOptions.join(', ')  + "\n> ")).toLowerCase().trim()
    if (overwriteMode === "erase") {
      await rimraf(outputFolderPath)
    } else if (overwriteMode === "available") {
      // Do Nothing
    } else if (overwriteMode === "stop") {
      throw new Error("Stop requested")
    }
  }
  console.log("Copying The Template")
  await copyTemplate(templateFolderPath, outputFolderPath, {overwrite: overwriteMode === "overwrite"})
  console.log("Handling any scripts, links, etc")
  await processOutputFolder(outputFolderPath, templateFolderPath)
  let packageJSON = null
  try {
    packageJSON = require(join(outputFolderPath, "package.json"))
  } catch(error) {console.log("Could not find or access the package.json")}
  if (config.automaticallyInstallDependencies !== false && packageJSON) {
    console.log("Installing Dependencies")
    await exec("npm install", {cwd: outputFolderPath})
  }
  if (config.automaticallyInitializeGitRepo === true) {
    console.log("Initializing Git Repository")
    if (!(await pathExists(join(outputFolderPath, '.git')))) await exec("git init .", {cwd: outputFolderPath})
  }

  console.log(chalk.green("Project Generated Successfully!"))
}

module.exports = generate
