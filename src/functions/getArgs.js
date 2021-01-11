const minimist = require('minimist')
const argsAliases = require('../boilerplate/argsAliases')
const primaryOptionNames = require('../boilerplate/primaryCommands')
const resolveCommandAlias = require('./resolveCommandAlias')

let storedArgs = null
const removeLeadingDashes = /^[\-]*/

function getArgs(fresh = false) {
  if (fresh !== true && storedArgs !== null) return storedArgs

  const args = minimist(process.argv.slice(2))

  Object.keys(argsAliases).forEach(alias => {
    if (args.hasOwnProperty(alias)) {
      const oldValue = args[alias]
      delete args[alias]
      const newName = argsAliases[alias]
      if (args.hasOwnProperty(newName)) throw new Error('Cannot supply the same option twice')
      args[newName] = oldValue
    }
  })

  if (!args.hasOwnProperty('_')) args._ = []

  let providedOptions = Object.entries(args)

  let primaryOptions = Object.keys(args).filter(name => {
    return primaryOptionNames.includes(name)
  })

  if (primaryOptions.length < 1) {
    if (args._.length > 0) {
      let primaryOption = resolveCommandAlias(args._[0])
      if (primaryOptionNames.includes(primaryOption)) {
        primaryOptions.push(primaryOption)
        if (args.hasOwnProperty(primaryOption)) throw new Error('Unexpected State')
        if (args._.length > 1) {
          args[primaryOption] = args._.slice(1)
        } else {
          args[primaryOption] = true
        }
        args._ = []
      } else {
        primaryOptions.push('create-project')
        if (args.hasOwnProperty('create-project')) throw new Error('Unexpected State')
      }
    } else {
      primaryOptions.push('help')
      args.help = true
    }
  }
  if (typeof primaryOptions[0] != 'string' || primaryOptions[0].length < 1)
    throw new Error('Must supply a valid primary option')
  if (primaryOptions.length > 1) throw new Error('Too Many Primary Options')
  args.primaryOption = primaryOptions[0]
  return (storedArgs = args)
}

module.exports = getArgs
