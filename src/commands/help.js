const chalk = require('chalk')
const commands = ["generate", "list", "configure", "describe", "open", "getDirectory"]

function help() {
  console.log(` Available Commands: \n- ${commands.map(command => chalk.green(command)).join(', ')}\n\nFor more information, please refer to the Readme at\n- ${chalk.bold(chalk.green("https://github.com/L1lith/Emerald-Templates"))}`)
}

module.exports = help
