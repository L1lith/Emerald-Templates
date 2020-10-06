const askQuestion = require('../functions/askQuestion')
const resolvePath = require('../functions/resolvePath')
const {writeFileSync} = require('fs')
const {join} = require('path')
const directoryExists = require('directory-exists')
const chalk = require('chalk')

const configPath = join(__dirname, '..', '..', 'emerald-config.json')
const templateEngines = ["ejs", "nunjucks", "handlebars", "mustache"]
const yesOrNo = ["yes", "no"]

async function configure(options) {
  let config = {}
  try {
    config = require(configPath)
  } catch(error) {}
  console.log(chalk.cyan("To choose not to configure an option, simply enter nothing."))
  const templateFolderResponse = (await askQuestion("Please enter the path to your templates storage folder\n> ")).trim()
  if (templateFolderResponse.length > 0) {
    const templateFolder = resolvePath(templateFolderResponse, process.cwd())
    if (!(await directoryExists(templateFolder))) throw new Error(`The folder "${templateFolder}" does not exist`)
    console.log(`Setting the templates folder path as "${templateFolder}"`)
    config.templateFolders = config.templateFolders || []
    if (!config.templateFolders.includes(templateFolder)) config.templateFolders.push(templateFolder)
  }
  const templateEngineResponse = await askQuestion(`Which templating engine would you like to use? (defaults to ${(chalk.bold(chalk.green("ejs")))})\nOptions: ${(templateEngines.map(value => chalk.green(value)).join(", ") + "\n> ").trim().toLowerCase()}`)
  if (templateEngineResponse.length > 0 && !templateEngines.includes(templateEngineResponse)) throw new Error("Invalid Template Engine Response Name")
  if (templateEngineResponse) config.templateEngine = templateEngineResponse
  const automaticallyInstallNodeModules = (await askQuestion(`Would you like to automatically install the node modules if there is a package.json with dependencies but no node_modules folder? (${chalk.bold(chalk.green("yes"))}/${chalk.green("no")})\n> `.trim().toLowerCase()))
  console.log(automaticallyInstallNodeModules)
  if (automaticallyInstallNodeModules.length > 0 && !yesOrNo.includes(automaticallyInstallNodeModules)) throw new Error("You must respond with yes or no.")
  if (automaticallyInstallNodeModules.length > 0) config.automaticallyInstallNodeModules = automaticallyInstallNodeModules === "yes"
  const automaticallyInitializeGitRepo = (await askQuestion(`Would you like to automatically initialize an empty git repo in newly generated projects? (${chalk.bold(chalk.green("yes"))}/${chalk.green("no")})\n> `)).trim().toLowerCase()
  if (automaticallyInitializeGitRepo.length > 0 && !yesOrNo.includes(automaticallyInitializeGitRepo)) throw new Error("You must respond with yes or no.")
  if (automaticallyInitializeGitRepo.length > 0) config.automaticallyInitializeGitRepo = automaticallyInitializeGitRepo === "yes"
  writeFileSync(configPath, JSON.stringify(config))
  console.log(chalk.bold(chalk.green("Emerald Templates Configured.")))
}

module.exports = configure
