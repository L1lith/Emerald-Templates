const chalk = require('chalk')
const getConfiguration = require('../functions/getConfiguration')
const displayList = require('../functions/displayList')

function listRoots() {
  const { rootFolders } = getConfiguration()
  if (rootFolders.length < 1) {
    throw new Error('There are no root folders')
  }
  displayList(
    rootFolders.map(value => chalk.cyan('"' + value + '"')),
    'Root Folders'
  )
  //console.log(` Configured for the following root folders:\n${).join('\n')}`)
}

module.exports = listRoots
