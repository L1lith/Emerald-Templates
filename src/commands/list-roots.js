const chalk = require('chalk')
const getConfiguration = require('../functions/getConfiguration')

function listRoots() {
  const {rootFolders} = getConfiguration()
  if (rootFolders.length < 1) {
    throw new Error("There are no root folders")
  }
  console.log(` Configured for the following root folders:\n${rootFolders.map(value => '- ' + chalk.green('"' + value + '"')).join('\n')}`)
}

module.exports = listRoots
