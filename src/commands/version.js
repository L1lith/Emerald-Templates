const chalk = require('chalk')
const {version} = require('../../package.json')

function printVersion() {
  console.log(chalk.green("Emerald Templates " + chalk.bold("v" + version) + " by L1lith"))
}

module.exports = printVersion
