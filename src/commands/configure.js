const {join} = require('path')
const directoryExists = require('directory-exists')
const chalk = require('chalk')
const {inspect} = require('util')
const askQuestion = require('../functions/askQuestion')
const resolvePath = require('../functions/resolvePath')
const saveConfig = require('../functions/saveConfig')
const askYesOrNo = require('../functions/askYesOrNo')
const getConfiguration = require('../functions/getConfiguration')
const onDeath = require('ondeath')

const configPath = join(__dirname, '..', '..', 'emerald-config.json')
const templateEngines = ["ejs", "nunjucks", "handlebars", "mustache"]
const yesOrNo = ["yes", "no"]

async function configure(options) {
  let config = getConfiguration()
  const configKeys = Object.keys(config).sort()
  if (configKeys.length > 0) {
    console.log(chalk.green("+---- Current Config Changes ----+\n" + configKeys.map(key => chalk.green(`|=- ${key}: ${chalk.cyan(inspect(config[key]))}`)).join('\n') + "\n+----\n"))
  }
  console.log(chalk.cyan('To choose not to configure an option, simply enter nothing. To reset an option, enter "delete"'))
  onDeath(() => {
    saveConfig(config)
  })
  const rootFolder = (await askQuestion("Please enter the path to your root templates storage folder\n> ")).trim()
  if (rootFolder.length > 0) {
    if (rootFolder !== "delete") {
      const rootFolderPath = resolvePath(rootFolder, process.cwd())
      if (!(await directoryExists(rootFolderPath))) throw new Error(`The folder "${rootFolder}" does not exist`)
      if (config.rootFolders.includes(rootFolderPath)) throw new Error("Cannot add that root folder, it already is added")
      config.rootFolders = config.rootFolders.concat([rootFolderPath])
      console.log(chalk.green(`Added the following root template folder path: ${chalk.bold('"' + rootFolderPath + '"')}`))
    } else {
      console.log("Resetting the root folder paths")
      delete config.rootFolders
    }
  }
  const templateEngineResponse = (await askQuestion(`Which templating engine would you like to use? (defaults to ${(chalk.bold(chalk.green("ejs")))})\nOptions: ${(templateEngines.map(value => chalk.green(value)).join(", ") + "\n> ")}`)).trim().toLowerCase()
  if (templateEngineResponse.length > 0 && !templateEngines.includes(templateEngineResponse)) throw new Error("Invalid Template Engine Response Name")
  if (templateEngineResponse) {
    if (templateEngineReponse !== "delete") {
      config.templateEngine = templateEngineResponse
      console.log(chalk.green(`Set templateEngine flag as ${chalk.bold('"' + config.templateEngine + '"')}`))
    } else {
      console.log("Resetting the template engine option")
      delete config.templateEngine
    }
  }
  try {
    const dependencyResponse = await askQuestion(`Would you like to automatically install the dependencies (currently supports package.json)? (${chalk.bold(chalk.green("yes"))}/${chalk.green("no")})\n> `, {validAnswers: ["yes", "no", "delete"]})
    if (reponse !== "delete") {
      config.automaticallyInstallDependencies = dependencyResponse === "yes"
      console.log(chalk.green(`Set automaticallyInstallDependencies flag as ${chalk.bold(config.automaticallyInstallDependencies)}`))
    } else {
      delete config.automaticallyInstallDependencies
      console.log("Resetting the automatic dependency installation option")
    }
  } catch(error) {
    // Do Nothing
  }
  try {
    const gitResponse = await askQuestion(`Would you like to automatically initialize an empty git repo in newly generated projects? (${chalk.bold(chalk.green("yes"))}/${chalk.green("no")})\n> `, {validAnswers: ["yes", "no", "delete"]})
    if (reponse !== "delete") {
      config.automaticallyInitializeGitRepo = gitResponse === "yes"
      console.log(chalk.green(`Set automaticallyInitializeGitRepo flag as ${chalk.bold(config.automaticallyInitializeGitRepo)}`))
    } else {
      delete config.automaticallyInitializeGitRepo
      console.log("Resetting the automatic git initiation option")
    }

  } catch(error) {
    // Do Nothing
  }
  try {
    config.automaticallySaveProjects = await askYesOrNo(`Would you like to automatically save newly generated projects in Emerald Templates? (${chalk.bold(chalk.green("yes"))}/${chalk.green("no")})\n> `)
    console.log(chalk.green(`Set automaticallySaveProjects flag as ${chalk.bold(config.automaticallySaveProjects)}`))
  } catch(error) {
    // Do Nothing
  }
  const launchCommandReponse = (await askQuestion(`What launch command would you like to run after generating a new project? (To open atom for example, try "atom .")\n> `)).trim()
  if (launchCommandReponse.length > 0) {
    config.launchCommand = launchCommandReponse
    console.log(chalk.cyan(`Set the project launch command as ${chalk.green(chalk.bold('"' + config.launchCommand + '"'))}`))
  }
  saveConfig(config)
  console.log(chalk.bold(chalk.green("Emerald Templates Configured.")))
}

module.exports = configure
