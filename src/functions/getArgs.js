const minimist = require('minimist')
const argsAliases = require('../boilerplate/argsAliases')
const primaryOptionNames = require('../boilerplate/primaryCommands')
const resolveCommandAlias = require('./resolveCommandAlias')

let storedArgs = null
//const removeLeadingDashes = /^[\-]*/

function getArgs(fresh = false) {
  if (fresh !== true && storedArgs !== null) return storedArgs

  const args = minimist(process.argv.slice(2))

  Object.keys(argsAliases).forEach(alias => {
    if (alias in args) {
      const oldValue = args[alias]
      delete args[alias]
      const newName = argsAliases[alias]
      if (newName in args) throw new Error('Cannot supply the same option twice')
      args[newName] = oldValue
    }
  })

  if (!('_' in args)) args._ = []

  //let providedOptions = Object.entries(args)

  let primaryOptions = Object.keys(args).filter(name => {
    return primaryOptionNames.includes(name)
  })

  if (primaryOptions.length < 1) {
    if (args._.length > 0) {
      let primaryOption = resolveCommandAlias(args._[0])
      const newArgs = args._.slice(1)
      if (primaryOptionNames.includes(primaryOption)) {
        primaryOptions.push(primaryOption)
        if (primaryOption in args) throw new Error('Unexpected State')
        if (args._.length > 1) {
          args[primaryOption] = newArgs
        } else {
          args[primaryOption] = true
        }
        args._ = newArgs
      } else {
        primaryOptions.push('create-project')
        if ('create-project' in args) throw new Error('Unexpected State')
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
