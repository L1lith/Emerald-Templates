const askQuestion = require('../functions/askQuestion')
const resolvePath = require('../functions/resolvePath')
const saveConfig = require('../functions/saveConfig')
const getConfiguration = require('../functions/getConfiguration')
const {join} = require('path')
const directoryExists = require('directory-exists')
const chalk = require('chalk')

const configPath = join(__dirname, '..', '..', 'emerald-config.json')
const templateEngines = ["ejs", "nunjucks", "handlebars", "mustache"]
const yesOrNo = ["yes", "no"]

async function configure(options) {
  let config = getConfiguration()
  console.log(chalk.cyan("To choose not to configure an option, simply enter nothing."))
  const rootFolder = (await askQuestion("Please enter the path to your root templates storage folder\n> ")).trim()
  if (rootFolder.length > 0) {
    const rootFolderPath = resolvePath(rootFolder, process.cwd())
    if (!(await directoryExists(rootFolderPath))) throw new Error(`The folder "${rootFolder}" does not exist`)
    if (config.rootFolders.includes(rootFolderPath)) throw new Error("Cannot add that root folder, it already is added")
    config.rootFolders = config.rootFolders.concat([rootFolderPath])
    console.log(chalk.green(`Added the following root template folder path: ${chalk.bold('"' + rootFolderPath + '"')}`))
  }
  const templateEngineResponse = (await askQuestion(`Which templating engine would you like to use? (defaults to ${(chalk.bold(chalk.green("ejs")))})\nOptions: ${(templateEngines.map(value => chalk.green(value)).join(", ") + "\n> ")}`)).trim().toLowerCase()
  if (templateEngineResponse.length > 0 && !templateEngines.includes(templateEngineResponse)) throw new Error("Invalid Template Engine Response Name")
  if (templateEngineResponse) {
    config.templateEngine = templateEngineResponse
    console.log(chalk.green(`Set templateEngine flag as ${chalk.bold('"' + config.templateEngine + '"')}`))
  }
  const automaticallyInstallDependencies = (await askQuestion(`Would you like to automatically install the dependencies (currently supports package.json)? (${chalk.bold(chalk.green("yes"))}/${chalk.green("no")})\n> `)).trim().toLowerCase()
  console.log(automaticallyInstallDependencies)
  if (automaticallyInstallDependencies.length > 0 && !yesOrNo.includes(automaticallyInstallDependencies)) throw new Error("You must respond with yes or no.")
  if (automaticallyInstallDependencies.length > 0) {
    config.automaticallyInstallDependencies = automaticallyInstallDependencies === "yes"
    console.log(chalk.green(`Set automaticallyInstallDependencies flag as ${chalk.bold(config.automaticallyInstallDependencies)}`))
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
