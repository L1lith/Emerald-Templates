const chalk = require('chalk')
const argsAliases = require('../boilerplate/argsAliases')
const resolveCommandAlias = require('../functions/resolveCommandAlias')
const commands = require('../boilerplate/primaryCommands')
const displayList = require('../functions/displayList')

const aliasMap = {}
Object.keys(argsAliases).forEach(alias => {
  const command = argsAliases[alias]
  if (!aliasMap.hasOwnProperty(command)) aliasMap[command] = []
  const aliasSet = aliasMap[command]
  if (!aliasSet.includes(alias)) aliasSet.push(alias)
})
const aliasEntries = Object.entries(aliasMap).sort((set1, set2) => set1[0].localeCompare(set2[0])) // Sort by property names

function commandAliases(options) {
  let inputCommand = options['command-aliases']
  if (Array.isArray(inputCommand)) inputCommand = inputCommand[0]
  if (typeof inputCommand == 'string') {
    const commandRequest = resolveCommandAlias(inputCommand)
    if (!commands.includes(commandRequest)) throw new Error('Invalid command requested')
    let aliases = aliasMap.hasOwnProperty(commandRequest) ? aliasMap[commandRequest] : []
    aliases = aliases.map(value => chalk.cyan(value))
    displayList(aliases, 'Command Aliases for ' + chalk.bold(commandRequest))
    return
  }

  displayList(
    aliasEntries.map(
      ([command, aliasList]) =>
        chalk.green(command + ' - ') + chalk.cyan(aliasList.sort().join(chalk.green(', ')))
    ),
    'Command Aliases'
  )
}

module.exports = commandAliases
