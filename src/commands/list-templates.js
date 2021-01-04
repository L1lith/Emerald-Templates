const getConfiguration = require('../functions/getConfiguration')
const getTemplateFolders = require('../functions/getTemplateFolders')
const { basename } = require('path')
const chalk = require('chalk')
const displayList = require('../functions/displayList')

const excludedDirectoryNames = ['.git']

async function list() {
  getConfiguration()
  let templateFolders = await getTemplateFolders()
  if (templateFolders.length < 1)
    throw new Error(
      `${chalk.red('No available templates!')}\nTry running ${chalk.green(
        '"emt help"'
      )} to get started.`
    )
  displayList(
    templateFolders
      .map(path => basename(path))
      .sort()
      .map(value => chalk.cyan(value)),
    'Available Templates'
  )
  //console.log(chalk.bold(" Available Templates:\n- ") + templateFolders.map(path => basename(path)).sort().map(value => chalk.green(value)).join(', '))
}

module.exports = list
