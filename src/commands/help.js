const chalk = require('chalk')
const resolveCommandAlias = require('../functions/resolveCommandAlias')
const commands = ["generate", "configure", "list", 'add-root', 'add-template',"describe", "open", "get-directory", "version", "remove-root", "remove-template", "list-roots", "help"].sort()

const commandHelp = {
  generate: chalk.green("Function: ") + "Generates a new project from a template" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND <template name> <project name>"),
  describe: chalk.green("Function: ") + "Displays information about a template" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND <template name>"),
  "get-directory": chalk.green("Function: ") + "Prints out the path to a given template" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND <template name>"),
  "add-root": chalk.green("Function: ") + "Adds a new root folder given a relative or absolute path" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND <root path>"),
  "remove-root": chalk.green("Function: ") + "Removes an existing root folder given a relative or absolute path" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND <root path>"),
  "add-template": chalk.green("Function: ") + "Adds a new template folder given a relative or absolute path" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND <template path>"),
  "remove-template": chalk.green("Function: ") + "Removes an existing template folder given a relative or absolute path" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND <template path>"),
  configure: chalk.green("Function: ") + "Configures emerald templates, no args necessary" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND"),
  list: chalk.green("Function: ") + "Lists all the available templates, no args necessary" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND"),
  "list-roots": chalk.green("Function: ") + "Lists all the root template folders, no args necessary" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND"),
  version: chalk.green("Function: ") + "Displays the current version of Emerald Templates, no args necessary" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND"),
  open: chalk.green("Function: ") + "Opens a given template with your file browser" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND <template name>"),
  help: chalk.green("Function: ") + "Provides help about how to use emerald templates. Either provide no args for general information, or specify a command to learn more about it" + chalk.green("\nSyntax: ") + chalk.cyan("$COMMAND {command}")
}

function help(options) {
  let commandRequest = options.help
  if (Array.isArray(commandRequest)) commandRequest = commandRequest[0]
  if (typeof commandRequest == 'string') {
    const inputName = commandRequest.toLowerCase().trim()
    commandRequest = resolveCommandAlias(inputName)
    if (!commands.includes(commandRequest)) throw new Error("Invalid Command Name")
    if (commandHelp.hasOwnProperty(commandRequest)) {
      console.log(chalk.green(`- Command Help: ${chalk.bold(inputName)}\n`) + commandHelp[commandRequest].replace(/\$COMMAND/g, inputName))
    } else {
      console.warn(chalk.red("Sorry, there is currently no information on that command"))
    }
    return
  } else if (commandRequest !== true) {
    throw new Error("Invalid Help Value, please either leave it blank or specify a command you'd like to know more about")
  }
  console.log(`To get help about a specific command try this:\n  ${chalk.cyan("emt help <command>")}\n\nAvailable Commands: \n- ${commands.map(command => chalk.green(command)).join(', ')}\n\nFor more information, please refer to the Readme at\n- ${chalk.bold(chalk.green("https://github.com/L1lith/Emerald-Templates"))}`)
}

module.exports = help
