const chalk = require('chalk')
const resolveCommandAlias = require('../functions/resolveCommandAlias')
const commands = require('../boilerplate/primaryCommands')
const displayList = require('../functions/displayList')

const commandHelp = {
  generate:
    chalk.green('Function: ') +
    'Generates a new project from a template' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <template name> <project name>'),
  describe:
    chalk.green('Function: ') +
    'Displays information about a template' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <template name>'),
  'get-directory':
    chalk.green('Function: ') +
    'Prints out the path to a given template' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <template name>'),
  'add-root':
    chalk.green('Function: ') +
    'Adds a new root folder given a relative or absolute path' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <root path>'),
  'remove-root':
    chalk.green('Function: ') +
    'Removes an existing root folder given a relative or absolute path' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <root path>'),
  'add-template':
    chalk.green('Function: ') +
    'Adds a new template folder given a relative or absolute path' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <template path>'),
  'remove-template':
    chalk.green('Function: ') +
    'Removes an existing template folder given a relative or absolute path' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <template path>'),
  configure:
    chalk.green('Function: ') +
    'Configures emerald templates, no args' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND'),
  'list-templates':
    chalk.green('Function: ') +
    'Lists all the available templates, no args' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND'),
  'list-roots':
    chalk.green('Function: ') +
    'Lists all the root template folders, no args necessary' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND'),
  version:
    chalk.green('Function: ') +
    'Displays the current version of Emerald Templates, no args necessary' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND'),
  'open-template':
    chalk.green('Function: ') +
    'Opens a given template with your file browser' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <template name>'),
  'open-project':
    chalk.green('Function: ') +
    'Opens a project with your file browser that has been generated with emerald templates or saved by using add-project' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <template name>'),
  help:
    chalk.green('Function: ') +
    'Provides help about how to use emerald templates. Either provide no args for general information, or specify a command to learn more about it' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND {command}'),
  'command-aliases':
    chalk.green('Function: ') +
    'Lists the aliases for the commands. Either provide no args for all the aliases, or specify a command to get the aliases for a specific one' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND {command}'),
  'reset-config':
    chalk.green('Function: ') +
    'Deletes your config for Emerald Templates, no args' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND'),
  'list-projects':
    chalk.green('Function: ') +
    'Lists all the project folders, no args necessary' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND'),
  'add-source':
    chalk.green('Function: ') +
    "Adds a template to the project's sources so that you can use it's gems" +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <source path>'),
  'remove-source':
    chalk.green('Function: ') +
    "Removes a template from the project's sources so that you can unlink it's gems" +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <source path>'),
  'generate-gem':
    chalk.green('Function: ') +
    'Generates a specified gem from any configured source. See add-source to add new templates to provide gems' +
    chalk.green('\nSyntax: ') +
    chalk.cyan('$COMMAND <gem name>')
}

function help(options) {
  let commandRequest = options.help
  if (Array.isArray(commandRequest)) commandRequest = commandRequest[0]
  if (typeof commandRequest == 'string') {
    const inputName = commandRequest.toLowerCase().trim()
    commandRequest = resolveCommandAlias(inputName)
    if (!commands.includes(commandRequest)) throw new Error('Invalid Command Name')
    if (commandHelp.hasOwnProperty(commandRequest)) {
      console.log(
        chalk.green(`- Command Help: ${chalk.bold(inputName)}`) +
          (inputName !== commandRequest ? chalk.green(' (aka ' + commandRequest + ')') : '') +
          '\n' +
          commandHelp[commandRequest].replace(/\$COMMAND/g, inputName)
      )
    } else {
      console.warn(chalk.red('Sorry, there is currently no information on that command'))
    }
    return
  } else if (commandRequest !== true) {
    throw new Error(
      "Invalid Help Value, please either leave it blank or specify a command you'd like to know more about"
    )
  }
  console.log(
    chalk.green(
      `~~~ ${chalk.bold(
        'General Help'
      )} ~~~\nTo get help about a specific command try this:\n  ${chalk.cyan(
        'emt help <command>'
      )}\n\n${displayList(
        commands.map(command => chalk.cyan(command)),
        chalk.bold('Available Commands'),
        { outputToConsole: false }
      )}\n\nFor more information, please refer to the Readme at\n- ${chalk.bold(
        'https://github.com/L1lith/Emerald-Templates'
      )}`
    )
  )
}

module.exports = help
