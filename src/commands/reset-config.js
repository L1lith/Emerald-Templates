const chalk = require('chalk')
const { remove } = require('fs-extra')
const { join } = require('path')
const askYesOrNo = require('../functions/askYesOrNo')

const configPath = join(__dirname, '..', '..', 'emerald-global-config.json')

async function resetConfig(options) {
  if (
    options.force !== true &&
    !(await askYesOrNo(
      chalk.green("Are you sure you'd like to reset your Emerald Templates config? (yes/no)\n") +
        '> '
    ))
  ) {
    console.log(chalk.green('Exiting...'))
    process.exit(0)
  }
  await remove(configPath)
  console.log(chalk.green('Config reset'))
}

module.exports = resetConfig
