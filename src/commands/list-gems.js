const chalk = require('chalk')
const getAvailableGems = require('../functions/getAvailableGems')
const displayList = require('../functions/displayList')
const resolvePath = require('../functions/resolvePath')

async function listGems(directory, options) {
  const { mode } = options
  directory = resolvePath(directory, process.cwd())
  //if (!exists(directory)) throw new Error("")
  const availableGems = Object.keys(await getAvailableGems(directory))
  if (mode === 'cli') {
    if (availableGems.length > 0) {
      displayList(availableGems, 'Available Gems')
    } else {
      console.log(chalk.green('Available Gems ') + chalk.cyan('(none)'))
    }
  } else {
    return availableGems
  }
}

module.exports = {
  description: 'Lists all the available gems on a per-project basis',
  args: {
    directory: {
      argsPosition: 0,
      format: { _: String, trimmed: true },
      default: '.',
      required: true
    }
  },
  handler: listGems,
  aliases: ['gems']
}
