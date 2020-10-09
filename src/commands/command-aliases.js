const chalk = require('chalk')
const argsAliases = require('../boilerplate/argsAliases')
const resolveCommandAlias = require('../functions/resolveCommandAlias')
const commands = require('../boilerplate/primaryCommands')

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
    if (!commands.includes(commandRequest)) throw new Error("Invalid command requested")
    const aliases = aliasMap.hasOwnProperty(commandRequest) ? aliasMap[commandRequest] : []
    console.log(
      `${chalk.green(`-+- Command Aliases for ${chalk.bold(commandRequest)} -+-`)}
  ${aliases.length < 1 ? '(no aliases)' : chalk.green("Aliases: ") + chalk.cyan(aliases.sort().join(', '))}`)
    return
  }

  console.log(
    `${chalk.bold(chalk.green("-+- Command Aliases -+-"))}
${aliasEntries.length < 1 ? '(no aliases)' : aliasEntries.map(([command, aliasList], index) => chalk.green((index + 1) + '. ' + command + " - ") + chalk.cyan(aliasList.sort().join(', '))).join('\n')}`)
}

module.exports = commandAliases
