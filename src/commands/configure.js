const askQuestion = require('../functions/askQuestion')
const resolvePath = require('../functions/resolvePath')
const saveConfig = require('../functions/saveConfig')
const loadConfig = require('../functions/loadConfig')
const {join} = require('path')
const directoryExists = require('directory-exists')
const chalk = require('chalk')

const configPath = join(__dirname, '..', '..', 'emerald-config.json')
const templateEngines = ["ejs", "nunjucks", "handlebars", "mustache"]
const yesOrNo = ["yes", "no"]

async function configure(options) {
  let config = loadConfig()
  console.log(chalk.cyan("To choose not to configure an option, simply enter nothing."))
  const rootFolder = (await askQuestion("Please enter the path to your root templates storage folder\n> ")).trim()
  if (rootFolder.length > 0) {
    const rootFolderPath = resolvePath(rootFolder, process.cwd())
    if (!(await directoryExists(templateFolderPath))) throw new Error(`The folder "${rootFolder}" does not exist`)
    config.rootFolders = config.rootFolders || []
    if (!config.rootFolders.includes(templateFolderPath)) config.rootFolders.push(templateFolderPath)
    console.log(`Added the following root template folder path: "${templateFolderPath}"`)
  }
  const templateEngineResponse = (await askQuestion(`Which templating engine would you like to use? (defaults to ${(chalk.bold(chalk.green("ejs")))})\nOptions: ${(templateEngines.map(value => chalk.green(value)).join(", ") + "\n> ")}`)).trim().toLowerCase()
  if (templateEngineResponse.length > 0 && !templateEngines.includes(templateEngineResponse)) throw new Error("Invalid Template Engine Response Name")
  if (templateEngineResponse) {
    config.templateEngine = templateEngineResponse
    console.log(chalk.green(`Set templateEngine flag as ${chalk.bold('"' + config.templateEngine + '"')}`))
  }
  const automaticallyInstallNodeModules = (await askQuestion(`Would you like to automatically install the node modules if there is a package.json with dependencies but no node_modules folder? (${chalk.bold(chalk.green("yes"))}/${chalk.green("no")})\n> `)).trim().toLowerCase()
  console.log(automaticallyInstallNodeModules)
  if (automaticallyInstallNodeModules.length > 0 && !yesOrNo.includes(automaticallyInstallNodeModules)) throw new Error("You must respond with yes or no.")
  if (automaticallyInstallNodeModules.length > 0) {
    config.automaticallyInstallNodeModules = automaticallyInstallNodeModules === "yes"
    console.log(chalk.green(`Set automaticallyInstallNodeModules flag as ${chalk.bold(config.automaticallyInstallNodeModules)}`))
  }
  const automaticallyInitializeGitRepo = (await askQuestion(`Would you like to automatically initialize an empty git repo in newly generated projects? (${chalk.bold(chalk.green("yes"))}/${chalk.green("no")})\n> `)).trim().toLowerCase()
  if (automaticallyInitializeGitRepo.length > 0 && !yesOrNo.includes(automaticallyInitializeGitRepo)) throw new Error("You must respond with yes or no.")
  if (automaticallyInitializeGitRepo.length > 0) {
    config.automaticallyInitializeGitRepo = automaticallyInitializeGitRepo === "yes"
    console.log(chalk.green(`Set automaticallyInitializeGitRepo flag as ${chalk.bold(config.automaticallyInitializeGitRepo)}`))
  }
  saveConfig(config)
  console.log(chalk.bold(chalk.green("Emerald Templates Configured.")))
}

module.exports = configure
