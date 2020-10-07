const chalk = require('chalk')
const commands = ["generate", "configure", "list", 'add-root', 'add-template',"describe", "open", "get-directory", "version", "remove-root", "remove-template", "list-roots"].sort()

function help() {
  console.log(` Available Commands: \n- ${commands.map(command => chalk.green(command)).join(', ')}\n\nFor more information, please refer to the Readme at\n- ${chalk.bold(chalk.green("https://github.com/L1lith/Emerald-Templates"))}`)
}

module.exports = help
