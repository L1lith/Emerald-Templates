const minimist = require('minimist')

let args = null

function getArgs(fresh=false) {
  if (fresh !== true && args !== null) return args
  return args = minimist(process.argv.slice(2))
}

module.exports = getArgs
