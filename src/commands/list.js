const getConfiguration = require('../functions/getConfiguration')
const getTemplateFolders = require('../functions/getTemplateFolders')
const {basename} = require('path')
const chalk = require('chalk')

const excludedDirectoryNames = ['.git']

async function list() {
  const templateFolders = await getTemplateFolders()
  console.log(chalk.bold(" Available Templates:\n- ") + templateFolders.map(path => basename(path)).sort().map(value => chalk.green(value)).join(', '))
}

module.exports = list
