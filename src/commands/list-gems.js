const chalk = require('chalk')
const getAvailableGems = require('../functions/getAvailableGems')
const displayList = require('../functions/displayList')
const resolvePath = require('../functions/resolvePath')

async function listGems(options) {
  const dir = process.cwd()
  let directory = (options['list-gems'] || options._ || [])[0] || dir
  if (typeof directory !== 'string')
    throw new Error('Must supply a valid directory name string, got: ' + inspect(directory))
  directory = directory.trim()
  if (directory.length < 1) throw new Error('The directory name string must not be empty')
  directory = resolvePath(directory, dir)
  //if (!exists(directory)) throw new Error("")
  const availableGems = Object.keys(await getAvailableGems(directory))
  if (availableGems.length > 0) {
    displayList(availableGems, 'Available Gems')
  } else {
    console.log(chalk.green('Available Gems ') + chalk.cyan('(none)'))
  }
}

module.exports = listGems
