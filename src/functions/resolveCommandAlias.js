const argsAliases = require('../boilerplate/argsAliases')

function resolveCommandAlias(string) {
  if (typeof string != 'string' || string.length < 1)
    throw new Error('Must supply a non-empty string as the command name')
  while (string in argsAliases) {
    string = argsAliases[string]
  }
  return string
}

module.exports = resolveCommandAlias
